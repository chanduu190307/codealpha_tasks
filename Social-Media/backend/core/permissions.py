from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to allow authors/owners, authorized staff, or
    parent resource owners (e.g. post author moderating comments) to edit or delete objects.
    Protects against IDOR/BOLA attacks while ensuring proper staff and moderation controls.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        # Staff users have full moderation authority
        if request.user.is_staff:
            return True

        # For comments, post author has delete/moderation privileges
        if request.method == 'DELETE' and hasattr(obj, 'post') and hasattr(obj.post, 'author'):
            if obj.post.author == request.user:
                return True

        # Direct author / user ownership
        if hasattr(obj, 'author'):
            return obj.author == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user

        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission for user profile and content management.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_staff:
            return True

        if hasattr(obj, 'author'):
            return obj.author == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
