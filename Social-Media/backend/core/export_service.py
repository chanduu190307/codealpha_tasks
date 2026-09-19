from django.contrib.auth.models import User

class DataExportService:
    """
    GDPR & Data Privacy Export Service.
    Compiles full user profile, posts, comments, likes, follows, and bookmarks into clean structured JSON.
    """

    @classmethod
    def compile_user_archive(cls, user: User) -> dict:
        profile = getattr(user, 'profile', None)

        from django.db.models import Count
        posts_qs = user.posts.annotate(
            annotated_likes_count=Count('likes', distinct=True),
            annotated_comments_count=Count('comments', distinct=True)
        )
        posts_data = []
        for post in posts_qs:
            posts_data.append({
                "id": post.id,
                "content": post.content,
                "image_url": post.image.url if post.image else None,
                "likes_count": post.annotated_likes_count,
                "comments_count": post.annotated_comments_count,
                "created_at": post.created_at.isoformat(),
            })

        comments_data = []
        for comment in user.comments.all():
            comments_data.append({
                "id": comment.id,
                "post_id": comment.post_id,
                "content": comment.content,
                "created_at": comment.created_at.isoformat(),
            })

        likes_data = list(user.likes.values('post_id', 'created_at'))
        bookmarks_data = list(user.bookmarks.values('post_id', 'created_at'))

        following = list(user.following_sent.values_list('following__username', flat=True))
        followers = list(user.followers_received.values_list('follower__username', flat=True))

        return {
            "account": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "date_joined": user.date_joined.isoformat(),
                "display_name": profile.display_name if profile else "",
                "bio": profile.bio if profile else "",
            },
            "posts": posts_data,
            "comments": comments_data,
            "likes": likes_data,
            "bookmarks": bookmarks_data,
            "social_graph": {
                "following": following,
                "followers": followers
            }
        }
