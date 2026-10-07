from apps.api.app.routers.system import router as system_router
from apps.api.app.routers.security import router as security_router

__all__ = [
    "system_router",
    "security_router",
]