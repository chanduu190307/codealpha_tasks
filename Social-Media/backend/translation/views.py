from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from translation.service import TranslationService
from core.ai_writing import AIWritingAssistantService
from core.link_preview import LinkPreviewService, SSRFProtectionError

class TranslateContentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        text = request.data.get('text', '').strip()
        target_lang = request.data.get('target_language', 'en').strip()

        if not text:
            return Response({"detail": "Text is required for translation."}, status=status.HTTP_400_BAD_REQUEST)

        result = TranslationService.translate_text(text, target_lang=target_lang)
        return Response(result, status=status.HTTP_200_OK)


class AIWritingAssistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text', '').strip()
        action = request.data.get('action', 'improve_grammar')
        tone = request.data.get('tone', 'engaging')

        if not text:
            return Response({"detail": "Text is required for AI writing assistance."}, status=status.HTTP_400_BAD_REQUEST)

        result = AIWritingAssistantService.enhance_content(text, action=action, tone=tone)
        return Response(result, status=status.HTTP_200_OK)


class LinkPreviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        url = request.data.get('url', '').strip()
        if not url:
            return Response({"detail": "URL is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            preview = LinkPreviewService.fetch_preview(url)
            return Response(preview, status=status.HTTP_200_OK)
        except SSRFProtectionError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Unable to fetch link preview."}, status=status.HTTP_400_BAD_REQUEST)
