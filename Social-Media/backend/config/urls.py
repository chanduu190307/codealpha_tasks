from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API endpoints
    path('api/', include('accounts.urls')),
    path('api/', include('posts.urls')),
    path('api/', include('comments.urls')),
    path('api/', include('interactions.urls')),
    path('api/', include('stories.urls')),
    path('api/', include('chat.urls')),
    path('api/', include('notifications.urls')),
    path('api/', include('moderation.urls')),
    path('api/', include('discovery.urls')),
    path('api/', include('analytics.urls')),
    path('api/', include('creator.urls')),
    path('api/', include('communities.urls')),
    path('api/', include('verification.urls')),
    path('api/', include('trust.urls')),
    path('api/', include('translation.urls')),

    # Frontend Single Page / Direct Template views
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('login/', TemplateView.as_view(template_name='login.html'), name='login_page'),
    path('register/', TemplateView.as_view(template_name='register.html'), name='register_page'),
    path('feed/', TemplateView.as_view(template_name='feed.html'), name='feed_page'),
    path('profile/', TemplateView.as_view(template_name='profile.html'), name='profile_page'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
