from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth.models import User
from communities.models import Community, CommunityMember, CommunityJoinRequest, CommunityBan, CommunityModerationLog
from communities.serializers import (
    CommunitySerializer, CommunityMemberSerializer,
    CommunityJoinRequestSerializer, CommunityModerationLogSerializer
)
from communities.permissions import IsCommunityAdminOrOwner, IsCommunityModerator, IsCommunityOwner
from core.events import publish_event
from posts.serializers import PostSerializer
from posts.models import Post

class CommunityListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        queryset = Community.objects.all()
        # If user is not authenticated, exclude private communities
        if not user.is_authenticated:
            queryset = queryset.filter(type__in=['public', 'restricted'])
        return queryset

    def perform_create(self, serializer):
        with transaction.atomic():
            community = serializer.save(created_by=self.request.user)
            # Creator is automatically Owner
            CommunityMember.objects.create(community=community, user=self.request.user, role='owner')
            publish_event('community_created', community_id=community.id, user_id=self.request.user.id)


class CommunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommunitySerializer
    lookup_field = 'slug'
    queryset = Community.objects.all()

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsCommunityAdminOrOwner()]
        return [permissions.AllowAny()]


class CommunityJoinLeaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        community = get_object_or_404(Community, slug=slug)
        user = request.user

        # Check if banned
        if CommunityBan.objects.filter(community=community, user=user).exists():
            return Response({"detail": "You are banned from this community."}, status=status.HTTP_403_FORBIDDEN)

        # Check existing membership
        existing_member = CommunityMember.objects.filter(community=community, user=user).first()
        if existing_member:
            if existing_member.role == 'owner':
                return Response({"detail": "Owner cannot leave their community."}, status=status.HTTP_400_BAD_REQUEST)
            existing_member.delete()
            return Response({"status": "left", "community": community.slug}, status=status.HTTP_200_OK)

        # If private, create a join request
        if community.type == 'private':
            req, created = CommunityJoinRequest.objects.get_or_create(community=community, user=user, status='pending')
            return Response({"status": "request_submitted", "community": community.slug}, status=status.HTTP_200_OK)

        # Join public or restricted community
        CommunityMember.objects.create(community=community, user=user, role='member')
        publish_event('community_joined', community_id=community.id, user_id=user.id)
        return Response({"status": "joined", "community": community.slug}, status=status.HTTP_200_OK)


class CommunityPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        slug = self.kwargs['slug']
        community = get_object_or_404(Community, slug=slug)
        user = self.request.user

        if community.type == 'private':
            if not user.is_authenticated:
                return Post.objects.none()
            is_member = CommunityMember.objects.filter(community=community, user=user).exists()
            if not is_member and not user.is_staff:
                return Post.objects.none()

        return Post.objects.filter(community=community).select_related('author', 'author__profile').order_by('-created_at')


class CommunityMembersListView(generics.ListAPIView):
    serializer_class = CommunityMemberSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        slug = self.kwargs['slug']
        community = get_object_or_404(Community, slug=slug)
        user = self.request.user

        if community.type == 'private':
            if not user.is_authenticated:
                return CommunityMember.objects.none()
            is_member = CommunityMember.objects.filter(community=community, user=user).exists()
            if not is_member and not user.is_staff:
                return CommunityMember.objects.none()

        return CommunityMember.objects.filter(community=community).select_related('user', 'user__profile')


class CommunityJoinRequestListView(generics.ListAPIView):
    serializer_class = CommunityJoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommunityAdminOrOwner]

    def get_queryset(self):
        slug = self.kwargs['slug']
        community = get_object_or_404(Community, slug=slug)
        self.check_object_permissions(self.request, community)
        return CommunityJoinRequest.objects.filter(community=community, status='pending').select_related('user', 'user__profile')


class CommunityJoinRequestRespondView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug, request_id):
        community = get_object_or_404(Community, slug=slug)
        if not CommunityMember.objects.filter(community=community, user=request.user, role__in=['owner', 'admin']).exists():
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        join_req = get_object_or_404(CommunityJoinRequest, id=request_id, community=community)
        decision = request.data.get('decision', 'approved') # approved or rejected

        if decision == 'approved':
            join_req.status = 'approved'
            join_req.save(update_fields=['status'])
            CommunityMember.objects.get_or_create(community=community, user=join_req.user, defaults={'role': 'member'})
            publish_event('community_joined', community_id=community.id, user_id=join_req.user.id)
        else:
            join_req.status = 'rejected'
            join_req.save(update_fields=['status'])

        return Response({"status": decision, "request_id": join_req.id}, status=status.HTTP_200_OK)


class CommunityBanUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug, user_id):
        community = get_object_or_404(Community, slug=slug)
        if not CommunityMember.objects.filter(community=community, user=request.user, role__in=['owner', 'admin', 'moderator']).exists():
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        target_user = get_object_or_404(User, id=user_id)
        reason = request.data.get('reason', 'Violation of community rules.')

        # Remove member and add ban
        CommunityMember.objects.filter(community=community, user=target_user).delete()
        CommunityBan.objects.get_or_create(community=community, user=target_user, defaults={'reason': reason, 'banned_by': request.user})

        CommunityModerationLog.objects.create(
            community=community,
            moderator=request.user,
            action='ban_user',
            target_summary=f"User @{target_user.username}",
            reason=reason
        )

        return Response({"status": "banned", "user": target_user.username}, status=status.HTTP_200_OK)
