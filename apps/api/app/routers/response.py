from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.core.database import get_db
from apps.api.app.models.security import SecurityEvent
from apps.api.app.models.system import SystemRecord


router = APIRouter(
    prefix="/response",
    tags=["Automated Response"],
)


def event_response(event: SecurityEvent):
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


# ==========================================================
# RESPONSE CENTER HEALTH
# ==========================================================

@router.get("/health")
async def response_health():
    return {
        "status": "ready",
        "service": "automated-response",
    }


# ==========================================================
# ACKNOWLEDGE EVENT
# ==========================================================

@router.post("/events/{event_id}/acknowledge")
async def acknowledge_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(
            SecurityEvent.id == event_id
        )
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    event.status = "ACKNOWLEDGED"

    await db.commit()
    await db.refresh(event)

    return {
        "message": "Security event acknowledged successfully",
        "action": "ACKNOWLEDGE",
        "event": event_response(event),
    }


# ==========================================================
# RESOLVE EVENT
# ==========================================================

@router.post("/events/{event_id}/resolve")
async def resolve_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(
            SecurityEvent.id == event_id
        )
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    event.status = "RESOLVED"

    await db.commit()
    await db.refresh(event)

    return {
        "message": "Security event resolved successfully",
        "action": "RESOLVE",
        "event": event_response(event),
    }


# ==========================================================
# CLOSE EVENT
# ==========================================================

@router.post("/events/{event_id}/close")
async def close_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityEvent).where(
            SecurityEvent.id == event_id
        )
    )

    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Security event not found",
        )

    event.status = "CLOSED"

    await db.commit()
    await db.refresh(event)

    return {
        "message": "Security event closed successfully",
        "action": "CLOSE",
        "event": event_response(event),
    }


# ==========================================================
# ISOLATE SYSTEM
# ==========================================================

@router.post("/systems/{system_id}/isolate")
async def isolate_system(
    system_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord).where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    system.status = "isolated"

    await db.commit()
    await db.refresh(system)

    return {
        "message": "System isolated successfully",
        "action": "ISOLATE_SYSTEM",
        "system": {
            "id": system.id,
            "name": system.name,
            "status": system.status,
            "updated_at": getattr(
                system,
                "updated_at",
                datetime.now(timezone.utc),
            ),
        },
    }


# ==========================================================
# RESTORE SYSTEM
# ==========================================================

@router.post("/systems/{system_id}/restore")
async def restore_system(
    system_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord).where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    system.status = "active"

    await db.commit()
    await db.refresh(system)

    return {
        "message": "System restored successfully",
        "action": "RESTORE_SYSTEM",
        "system": {
            "id": system.id,
            "name": system.name,
            "status": system.status,
            "updated_at": getattr(
                system,
                "updated_at",
                datetime.now(timezone.utc),
            ),
        },
    }


# ==========================================================
# RESPONSE SUMMARY
# ==========================================================

@router.get("/summary")
async def response_summary(
    db: AsyncSession = Depends(get_db),
):
    events_result = await db.execute(
        select(SecurityEvent)
    )

    events = events_result.scalars().all()

    systems_result = await db.execute(
        select(SystemRecord)
    )

    systems = systems_result.scalars().all()

    return {
        "open_events": sum(
            1
            for event in events
            if event.status.upper() == "OPEN"
        ),
        "acknowledged_events": sum(
            1
            for event in events
            if event.status.upper() == "ACKNOWLEDGED"
        ),
        "resolved_events": sum(
            1
            for event in events
            if event.status.upper() == "RESOLVED"
        ),
        "closed_events": sum(
            1
            for event in events
            if event.status.upper() == "CLOSED"
        ),
        "isolated_systems": sum(
            1
            for system in systems
            if system.status.lower() == "isolated"
        ),
        "active_systems": sum(
            1
            for system in systems
            if system.status.lower() == "active"
        ),
    }