from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404

from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Profile, UserPrivacySettings, UserBlock, UserMute, UserRestriction
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    UserSummarySerializer,
    UserPrivacySettingsSerializer,
    UserBlockSerializer
)
from core.pagination import StandardResultsSetPagination
from core.export_service import DataExportService
from core.health import SystemHealthService


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = get_token(request)
        return Response({
            'success': True,
            'csrfToken': token,
            'detail': 'CSRF cookie set successfully'
        }, status=status.HTTP_200_OK)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create default privacy settings
        UserPrivacySettings.objects.get_or_create(user=user)

        # Log the user into session immediately
        login(request, user)

        profile_serializer = ProfileSerializer(user.profile, context={'request': request})
        return Response({
            'success': True,
            'detail': 'User registered and authenticated successfully.',
            'user': profile_serializer.data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username_or_email or not password:
            return Response({
                'success': False,
                'errors': {'detail': 'Both username/email and password are required.'}
            }, status=status.HTTP_400_BAD_REQUEST)

        # Allow login via username or email
        user_obj = None
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                username = user_obj.username
            except User.DoesNotExist:
                username = username_or_email
        else:
            username = username_or_email

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if not user.is_active:
                return Response({
                    'success': False,
                    'errors': {'detail': 'This account is inactive.'}
                }, status=status.HTTP_403_FORBIDDEN)

            login(request, user)
            profile_serializer = ProfileSerializer(user.profile, context={'request': request})
            return Response({
                'success': True,
                'detail': 'Logged in successfully.',
                'user': profile_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'errors': {'detail': 'Invalid credentials.'}
        }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
            'success': True,
            'detail': 'Successfully logged out.'
        }, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user.profile, context={'request': request})
        return Response({
            'authenticated': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)


class ProfileDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User.objects.select_related('profile'), username__iexact=username)
        serializer = ProfileSerializer(user.profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        full_profile = ProfileSerializer(instance, context={'request': request})
        return Response(full_profile.data, status=status.HTTP_200_OK)


class UserSearchView(generics.ListAPIView):
    serializer_class = UserSummarySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()
        if not query:
            return User.objects.none()

        user = self.request.user
        excluded_ids = set()
        if user.is_authenticated:
            blocked_ids = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
            blocked_by_ids = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
            excluded_ids = set(blocked_ids).union(set(blocked_by_ids))

        return User.objects.filter(
            Q(username__icontains=query) | Q(profile__display_name__icontains=query)
        ).exclude(id__in=excluded_ids).select_related('profile').order_by('username')


class PrivacySettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPrivacySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        settings, _ = UserPrivacySettings.objects.get_or_create(user=self.request.user)
        return settings


class BlockUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return Response({"detail": "Cannot block yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove existing follow relationships
        from interactions.models import Follow
        Follow.objects.filter(
            Q(follower=request.user, following=target) |
            Q(follower=target, following=request.user)
        ).delete()

        UserBlock.objects.get_or_create(blocker=request.user, blocked=target)
        return Response({"status": "blocked", "user": target.username}, status=status.HTTP_200_OK)


class UnblockUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        UserBlock.objects.filter(blocker=request.user, blocked=target).delete()
        return Response({"status": "unblocked", "user": target.username}, status=status.HTTP_200_OK)


class BlockedUsersListView(generics.ListAPIView):
    serializer_class = UserBlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserBlock.objects.filter(blocker=self.request.user).select_related('blocked', 'blocked__profile')


class MuteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return Response({"detail": "Cannot mute yourself."}, status=status.HTTP_400_BAD_REQUEST)
        UserMute.objects.get_or_create(muter=request.user, muted=target)
        return Response({"status": "muted", "user": target.username}, status=status.HTTP_200_OK)


class UnmuteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        UserMute.objects.filter(muter=request.user, muted=target).delete()
        return Response({"status": "unmuted", "user": target.username}, status=status.HTTP_200_OK)


class RestrictUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return Response({"detail": "Cannot restrict yourself."}, status=status.HTTP_400_BAD_REQUEST)
        UserRestriction.objects.get_or_create(restrictor=request.user, restricted=target)
        return Response({"status": "restricted", "user": target.username}, status=status.HTTP_200_OK)


class UnrestrictUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        UserRestriction.objects.filter(restrictor=request.user, restricted=target).delete()
        return Response({"status": "unrestricted", "user": target.username}, status=status.HTTP_200_OK)


class DataExportView(APIView):
    """
    GDPR User Data Export Endpoint.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = DataExportService.compile_user_archive(request.user)
        return Response(data, status=status.HTTP_200_OK)


class AccountDeleteView(APIView):
    """
    Secure Account Deletion Endpoint with password confirmation.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'auth'

    def post(self, request):
        password = request.data.get('password', '')
        if not password or not request.user.check_password(password):
            return Response({"detail": "Invalid password confirmation."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        logout(request)
        with transaction.atomic():
            user.delete()

        return Response({"status": "account_deleted"}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    Secure password change endpoint enforcing verification of current password,
    strong password validation, session auth hash rotation, and rate limiting.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'auth'

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')
        new_password_confirm = request.data.get('new_password_confirm') or request.data.get('confirm_password', '')

        if not current_password or not new_password or not new_password_confirm:
            return Response(
                {"detail": "Current password, new password, and confirmation are required.", "error": "Current password, new password, and confirmation are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect.", "error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != new_password_confirm:
            return Response(
                {"detail": "New passwords do not match.", "error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError
        try:
            validate_password(new_password, request.user)
        except ValidationError as e:
            return Response({"detail": e.messages[0]}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        from django.contrib.auth import update_session_auth_hash
        update_session_auth_hash(request, request.user)

        return Response(
            {"success": True, "detail": "Password changed successfully."},
            status=status.HTTP_200_OK
        )


class SystemHealthView(APIView):
    """
    System Health & Diagnostic Check.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        health = SystemHealthService.check_health()
        status_code = status.HTTP_200_OK if health["status"] == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(health, status=status_code)
