from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging
from notifications.models import Notification, NotificationPreference
from notifications.serializers import NotificationSerializer, NotificationPreferenceSerializer

logger = logging.getLogger(__name__)

def dispatch_realtime_notification(recipient, actor, verb, target_id=None, target_type=''):
    """
    Creates notification in database and broadcasts event to user's real-time WebSocket channel.
    Respects recipient notification preferences and suppresses self-notifications.
    """
    if recipient == actor:
        return None

    # Check recipient preferences
    prefs, _ = NotificationPreference.objects.get_or_create(user=recipient)
    if verb == 'like' and not prefs.likes_enabled:
        return None
    if verb in ('comment', 'reply') and not prefs.comments_enabled:
        return None
    if verb == 'follow' and not prefs.follows_enabled:
        return None
    if verb == 'mention' and not prefs.mentions_enabled:
        return None
    if verb == 'message' and not prefs.messages_enabled:
        return None
    if verb == 'story_reaction' and not prefs.stories_enabled:
        return None

    notification = Notification.objects.create(
        recipient=recipient,
        actor=actor,
        verb=verb,
        target_id=target_id,
        target_type=target_type
    )

    # Push to WebSocket if channel layer is active
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"user_notifications_{recipient.id}",
                {
                    "type": "notification_alert",
                    "notification": {
                        "id": notification.id,
                        "actor": {
                            "id": actor.id,
                            "username": actor.username,
                            "avatar": actor.profile.avatar.url if hasattr(actor, 'profile') and actor.profile.avatar else None
                        },
                        "verb": notification.verb,
                        "target_id": notification.target_id,
                        "target_type": notification.target_type,
                        "created_at": notification.created_at.isoformat()
                    }
                }
            )
    except Exception as e:
        logger.debug("Could not push real-time notification via channels: %s", str(e))

    return notification


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).select_related(
            'actor', 'actor__profile'
        )[:50]
        unread_count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        serializer = NotificationSerializer(notifications, many=True, context={'request': request})
        return Response({
            "unread_count": unread_count,
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({"status": "marked_read"}, status=status.HTTP_200_OK)


class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"status": "all_marked_read"}, status=status.HTTP_200_OK)


class NotificationPreferencesView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        pref, _ = NotificationPreference.objects.get_or_create(user=self.request.user)
        return pref
