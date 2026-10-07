from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.core.database import get_db
from apps.api.app.models.security import SecurityEvent


router = APIRouter(
    prefix="/security",
    tags=["Security"],
)


# ============================================================
# SCHEMAS
# ============================================================

class SecurityCreate(BaseModel):
    system_id: int
    event_type: str
    severity: str = "LOW"
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    description: Optional[str] = None
    status: str = "OPEN"


class SecurityUpdate(BaseModel):
    event_type: Optional[str] = None
    severity: Optional[str] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


# ============================================================
# GET ALL SECURITY EVENTS
# ============================================================

@router.get("/")
async def get_security_events(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).order_by(SecurityEvent.id.desc())
    )

    events = result.scalars().all()

    return [
        {
            "id": event.id,
            "system_id": event.system_id,
            "event_type": event.event_type,
            "severity": event.severity,
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "description": event.description,
            "status": event.status,
            "detected_at": event.detected_at,
            "created_at": event.created_at,
        }
        for event in events
    ]


# ============================================================
# CREATE SECURITY EVENT
# ============================================================

@router.post("/")
async def create_security_event(
    data: SecurityCreate,
    db: AsyncSession = Depends(get_db),
):
    event = SecurityEvent(
        system_id=data.system_id,
        event_type=data.event_type,
        severity=data.severity,
        source_ip=data.source_ip,
        destination_ip=data.destination_ip,
        description=data.description,
        status=data.status,
    )

    db.add(event)

    await db.commit()
    await db.refresh(event)

    return {
        "message": "Security event created successfully",
        "event": {
            "id": event.id,
            "system_id": event.system_id,
            "event_type": event.event_type,
            "severity": event.severity,
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "description": event.description,
            "status": event.status,
            "detected_at": event.detected_at,
            "created_at": event.created_at,
        },
    }


# ============================================================
# GET SINGLE SECURITY EVENT
# ============================================================

@router.get("/{event_id}")
async def get_security_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(SecurityEvent.id == event_id)
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    return {
        "id": event.id,
        "system_id": event.system_id,
        "event_type": event.event_type,
        "severity": event.severity,
        "source_ip": event.source_ip,
        "destination_ip": event.destination_ip,
        "description": event.description,
        "status": event.status,
        "detected_at": event.detected_at,
        "created_at": event.created_at,
    }


# ============================================================
# UPDATE SECURITY EVENT
# ============================================================

@router.put("/{event_id}")
async def update_security_event(
    event_id: int,
    data: SecurityUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(SecurityEvent.id == event_id)
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(event, field, value)

    await db.commit()
    await db.refresh(event)

    return {
        "message": "Security event updated successfully",
        "event": {
            "id": event.id,
            "system_id": event.system_id,
            "event_type": event.event_type,
            "severity": event.severity,
            "source_ip": event.source_ip,
            "destination_ip": event.destination_ip,
            "description": event.description,
            "status": event.status,
            "detected_at": event.detected_at,
            "created_at": event.created_at,
        },
    }


# ============================================================
# DELETE SECURITY EVENT
# ============================================================

@router.delete("/{event_id}")
async def delete_security_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(SecurityEvent.id == event_id)
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    await db.delete(event)
    await db.commit()

    return {
        "message": "Security event deleted successfully",
        "event_id": event_id,
    }