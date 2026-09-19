from rest_framework import permissions
from communities.models import CommunityMember

class IsCommunityOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        community = getattr(obj, 'community', obj)
        return CommunityMember.objects.filter(community=community, user=request.user, role='owner').exists()

class IsCommunityAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        community = getattr(obj, 'community', obj)
        return CommunityMember.objects.filter(
            community=community, user=request.user, role__in=['owner', 'admin']
        ).exists()

class IsCommunityModerator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        community = getattr(obj, 'community', obj)
        return CommunityMember.objects.filter(
            community=community, user=request.user, role__in=['owner', 'admin', 'moderator']
        ).exists()
