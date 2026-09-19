import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler to ensure all error responses have consistent structure
    and never leak internal system tracebacks or database queries to client.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Standardize DRF validation/permission error structure
        error_data = {
            'success': False,
            'status_code': response.status_code,
            'errors': response.data
        }
        response.data = error_data
        return response

    # Unhandled 500 exceptions
    view = context.get('view', None)
    view_name = view.__class__.__name__ if view else 'Unknown'
    logger.error(f"Unhandled exception in {view_name}: {str(exc)}", exc_info=True)

    return Response({
        'success': False,
        'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
        'errors': {
            'detail': 'An unexpected internal server error occurred. Please try again later.'
        }
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
