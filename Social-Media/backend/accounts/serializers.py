import re
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Profile, UserPrivacySettings, UserBlock, UserMute, UserRestriction
from core.fields import NormalizedImageField

RESERVED_USERNAMES = {'admin', 'administrator', 'root', 'system', 'me', 'api', 'login', 'logout', 'register', 'search', 'feed', 'null', 'undefined'}

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm']

    def validate_username(self, value):
        username = value.strip().lower()
        if len(username) < 3 or len(username) > 30:
            raise serializers.ValidationError("Username must be between 3 and 30 characters long.")

        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            raise serializers.ValidationError("Username can only contain alphanumeric characters and underscores.")

        if username in RESERVED_USERNAMES:
            raise serializers.ValidationError("This username is reserved and cannot be used.")

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("A user with this username already exists.")

        return username

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})

        temp_user = User(username=attrs.get('username'), email=attrs.get('email'))
        try:
            validate_password(attrs['password'], user=temp_user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserSummarySerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='profile.display_name', read_only=True)
    avatar = NormalizedImageField(source='profile.avatar', read_only=True)
    is_verified = serializers.BooleanField(source='profile.is_verified', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar', 'is_verified']


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='profile.display_name', read_only=True)
    avatar = NormalizedImageField(source='profile.avatar', read_only=True)
    is_verified = serializers.BooleanField(source='profile.is_verified', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar', 'is_verified']


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = NormalizedImageField(read_only=True)
    email = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    posts_count = serializers.IntegerField(read_only=True)
    is_following = serializers.SerializerMethodField()
    is_self = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
    is_muted = serializers.SerializerMethodField()
    is_restricted = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'email', 'display_name', 'bio', 'avatar', 'is_verified',
            'followers_count', 'following_count', 'posts_count',
            'date_joined', 'is_following', 'is_self', 'is_blocked',
            'is_muted', 'is_restricted', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']

    def get_email(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj.user or request.user.is_staff:
                return obj.user.email
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj.user:
                return False
            return obj.user.followers_received.filter(follower=request.user).exists()
        return False

    def get_is_self(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user == obj.user
        return False

    def get_is_blocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserBlock.objects.filter(blocker=request.user, blocked=obj.user).exists()
        return False

    def get_is_muted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserMute.objects.filter(muter=request.user, muted=obj.user).exists()
        return False

    def get_is_restricted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserRestriction.objects.filter(restrictor=request.user, restricted=obj.user).exists()
        return False


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['display_name', 'bio', 'avatar']

    def validate_display_name(self, value):
        if len(value) > 50:
            raise serializers.ValidationError("Display name must be 50 characters or less.")
        return value

    def validate_bio(self, value):
        if len(value) > 500:
            raise serializers.ValidationError("Bio must be 500 characters or less.")
        return value


class UserPrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacySettings
        fields = ['is_private', 'who_can_message', 'who_can_mention', 'who_can_tag', 'show_online_status', 'show_last_seen']


class UserBlockSerializer(serializers.ModelSerializer):
    blocked = UserSummarySerializer(read_only=True)

    class Meta:
        model = UserBlock
        fields = ['id', 'blocked', 'created_at']
