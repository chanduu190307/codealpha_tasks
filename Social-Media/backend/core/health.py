from django.db import connection
from django.core.cache import cache
import time

class SystemHealthService:
    """
    Centralized Infrastructure & Dependency Health Diagnostics.
    """

    @classmethod
    def check_health(cls) -> dict:
        results = {
            "status": "healthy",
            "timestamp": time.time(),
            "checks": {}
        }

        # 1. Database Check
        try:
            start = time.time()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            results["checks"]["database"] = {
                "status": "healthy",
                "latency_ms": round((time.time() - start) * 1000, 2)
            }
        except Exception as e:
            results["status"] = "degraded"
            results["checks"]["database"] = {"status": "unhealthy", "error": str(e)}

        # 2. Cache / Redis Check
        try:
            start = time.time()
            cache.set("health:ping", "pong", timeout=10)
            val = cache.get("health:ping")
            if val == "pong":
                results["checks"]["cache"] = {
                    "status": "healthy",
                    "latency_ms": round((time.time() - start) * 1000, 2)
                }
            else:
                results["status"] = "degraded"
                results["checks"]["cache"] = {"status": "unhealthy", "error": "value mismatch"}
        except Exception as e:
            results["status"] = "degraded"
            results["checks"]["cache"] = {"status": "unhealthy", "error": str(e)}

        return results
