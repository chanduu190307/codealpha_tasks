from django.urls import path
from translation.views import TranslateContentView, AIWritingAssistView, LinkPreviewView

urlpatterns = [
    path('translation/translate/', TranslateContentView.as_view(), name='translate_content'),
    path('ai/writing-assist/', AIWritingAssistView.as_view(), name='ai_writing_assist'),
    path('media/link-preview/', LinkPreviewView.as_view(), name='media_link_preview'),
]
