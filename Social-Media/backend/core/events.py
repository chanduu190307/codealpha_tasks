import logging
from typing import Callable, Dict, List

logger = logging.getLogger(__name__)

class EventBus:
    """
    Decoupled Synchronous/Asynchronous Event Dispatcher for social domain events.
    Supports events like:
    - user_registered
    - post_created
    - post_liked
    - comment_created
    - community_joined
    - verification_approved
    """

    _listeners: Dict[str, List[Callable]] = {}

    @classmethod
    def subscribe(cls, event_type: str, handler: Callable):
        if event_type not in cls._listeners:
            cls._listeners[event_type] = []
        cls._listeners[event_type].append(handler)

    @classmethod
    def publish(cls, event_type: str, **payload):
        handlers = cls._listeners.get(event_type, [])
        for handler in handlers:
            try:
                handler(**payload)
            except Exception as e:
                logger.error("Error executing handler %s for event %s: %s", handler.__name__, event_type, str(e))

def publish_event(event_type: str, **payload):
    EventBus.publish(event_type, **payload)
