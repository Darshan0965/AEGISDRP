from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.app.routers.system import router as system_router
from apps.api.app.routers.security import router as security_router
from apps.api.app.routers.response import router as response_router


# ============================================================
# AEGISDRP API APPLICATION
# ============================================================

app = FastAPI(
    title="AEGISDRP API",
    version="0.1.0",
    description=(
        "Autonomous Digital Risk Protection Platform API"
    ),
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
async def root():
    return {
        "message": "AEGISDRP API is running",
        "version": "0.1.0",
        "service": "aegisdrp-api",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "aegisdrp-api",
    }


# ============================================================
# SYSTEM STATUS
# ============================================================

@app.get("/status")
async def status():
    return {
        "status": "online",
        "service": "aegisdrp-api",
        "platform": "AEGISDRP",
    }


# ============================================================
# SYSTEMS API
# ============================================================

app.include_router(
    system_router
)


# ============================================================
# SECURITY EVENTS API
# ============================================================

app.include_router(
    security_router
)


# ============================================================
# AUTOMATED RESPONSE API
# ============================================================

app.include_router(
    response_router
)