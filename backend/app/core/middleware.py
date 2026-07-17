import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from backend.app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs every incoming request with:
    - HTTP method
    - URL path
    - Status code
    - Client IP
    - Processing time
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = round((time.time() - start_time) * 1000, 2)

        client_ip = (
            request.client.host
            if request.client
            else "Unknown"
        )

        logger.info(
            f"{request.method} "
            f"{request.url.path} | "
            f"Status: {response.status_code} | "
            f"IP: {client_ip} | "
            f"{process_time} ms"
        )

        return response