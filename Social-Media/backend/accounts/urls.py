from django.urls import path
from .views import (
    CSRFTokenView,
    RegisterView,
    LoginView,
    LogoutView,
    CurrentUserView,
    ProfileDetailView,
    ProfileUpdateView,
    UserSearchView,
    PrivacySettingsView,
    BlockUserView,
    UnblockUserView,
    BlockedUsersListView,
    MuteUserView,
    UnmuteUserView,
    RestrictUserView,
    UnrestrictUserView,
    DataExportView,
    AccountDeleteView,
    SystemHealthView,
    ChangePasswordView
)

urlpatterns = [
    path('auth/csrf/', CSRFTokenView.as_view(), name='csrf_token'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),

    path('profiles/me/', ProfileUpdateView.as_view(), name='profile_update'),
    path('profiles/<str:username>/', ProfileDetailView.as_view(), name='profile_detail'),

    path('users/search/', UserSearchView.as_view(), name='user_search'),

    # Privacy & Safety Controls
    path('privacy/settings/', PrivacySettingsView.as_view(), name='privacy_settings'),
    path('users/blocked/', BlockedUsersListView.as_view(), name='blocked_users_list'),
    path('users/<str:username>/block/', BlockUserView.as_view(), name='user_block'),
    path('users/<str:username>/unblock/', UnblockUserView.as_view(), name='user_unblock'),
    path('users/<str:username>/mute/', MuteUserView.as_view(), name='user_mute'),
    path('users/<str:username>/unmute/', UnmuteUserView.as_view(), name='user_unmute'),
    path('users/<str:username>/restrict/', RestrictUserView.as_view(), name='user_restrict'),
    path('users/<str:username>/unrestrict/', UnrestrictUserView.as_view(), name='user_unrestrict'),

    # GDPR Data Export & Account Deletion
    path('users/export-data/', DataExportView.as_view(), name='user_data_export'),
    path('users/delete-account/', AccountDeleteView.as_view(), name='user_account_delete'),

    # System Health
    path('health/', SystemHealthView.as_view(), name='system_health'),
]
