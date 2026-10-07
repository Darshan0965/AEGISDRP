from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.core.database import get_db
from apps.api.app.models.system import SystemRecord


router = APIRouter(
    prefix="/systems",
    tags=["Systems"],
)


# ============================================================
# REQUEST MODELS
# ============================================================


class SystemCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    status: str = Field(
        default="active",
        max_length=50,
    )

    cpu_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    memory_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    disk_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    network_in: float = Field(
        default=0.0,
        ge=0,
    )

    network_out: float = Field(
        default=0.0,
        ge=0,
    )

    uptime_seconds: int = Field(
        default=0,
        ge=0,
    )


class SystemUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    status: str | None = Field(
        default=None,
        max_length=50,
    )

    cpu_usage: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    memory_usage: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    disk_usage: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )

    network_in: float | None = Field(
        default=None,
        ge=0,
    )

    network_out: float | None = Field(
        default=None,
        ge=0,
    )

    uptime_seconds: int | None = Field(
        default=None,
        ge=0,
    )


class SystemHeartbeat(BaseModel):
    cpu_usage: float = Field(
        ...,
        ge=0,
        le=100,
    )

    memory_usage: float = Field(
        ...,
        ge=0,
        le=100,
    )

    disk_usage: float = Field(
        ...,
        ge=0,
        le=100,
    )

    network_in: float = Field(
        default=0.0,
        ge=0,
    )

    network_out: float = Field(
        default=0.0,
        ge=0,
    )

    uptime_seconds: int = Field(
        default=0,
        ge=0,
    )


# ============================================================
# RESPONSE HELPER
# ============================================================


def system_response(system: SystemRecord):
    return {
        "id": system.id,
        "name": system.name,
        "status": system.status,

        "cpu_usage": system.cpu_usage,
        "memory_usage": system.memory_usage,
        "disk_usage": system.disk_usage,

        "network_in": system.network_in,
        "network_out": system.network_out,

        "uptime_seconds": system.uptime_seconds,

        "last_heartbeat": system.last_heartbeat,
        "created_at": system.created_at,
        "updated_at": system.updated_at,
    }


# ============================================================
# CREATE SYSTEM
# ============================================================


@router.post("/")
async def create_system(
    system: SystemCreate,
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    new_system = SystemRecord(
        name=system.name,
        status=system.status,

        cpu_usage=system.cpu_usage,
        memory_usage=system.memory_usage,
        disk_usage=system.disk_usage,

        network_in=system.network_in,
        network_out=system.network_out,

        uptime_seconds=system.uptime_seconds,

        last_heartbeat=now,
        created_at=now,
        updated_at=now,
    )

    db.add(new_system)

    await db.commit()
    await db.refresh(new_system)

    return {
        "message": "System created successfully",
        "system": system_response(new_system),
    }


# ============================================================
# GET ALL SYSTEMS
# ============================================================


@router.get("/")
async def get_systems(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord)
        .order_by(SystemRecord.id)
    )

    systems = result.scalars().all()

    return [
        system_response(system)
        for system in systems
    ]


# ============================================================
# GET SYSTEM BY ID
# ============================================================


@router.get("/{system_id}")
async def get_system(
    system_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord)
        .where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    return system_response(system)


# ============================================================
# UPDATE SYSTEM
# ============================================================


@router.put("/{system_id}")
async def update_system(
    system_id: int,
    system_data: SystemUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord)
        .where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    update_data = system_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            system,
            field,
            value,
        )

    system.updated_at = datetime.now(
        timezone.utc
    )

    await db.commit()
    await db.refresh(system)

    return {
        "message": "System updated successfully",
        "system": system_response(system),
    }


# ============================================================
# SYSTEM HEARTBEAT / MONITORING UPDATE
# ============================================================


@router.post("/{system_id}/heartbeat")
async def system_heartbeat(
    system_id: int,
    heartbeat: SystemHeartbeat,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord)
        .where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    now = datetime.now(timezone.utc)

    system.cpu_usage = heartbeat.cpu_usage
    system.memory_usage = heartbeat.memory_usage
    system.disk_usage = heartbeat.disk_usage

    system.network_in = heartbeat.network_in
    system.network_out = heartbeat.network_out

    system.uptime_seconds = (
        heartbeat.uptime_seconds
    )

    system.last_heartbeat = now
    system.updated_at = now

    # Automatically mark system as active
    system.status = "active"

    await db.commit()
    await db.refresh(system)

    return {
        "message": "System heartbeat updated successfully",
        "system": system_response(system),
    }


# ============================================================
# DELETE SYSTEM
# ============================================================


@router.delete("/{system_id}")
async def delete_system(
    system_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SystemRecord)
        .where(
            SystemRecord.id == system_id
        )
    )

    system = result.scalar_one_or_none()

    if system is None:
        raise HTTPException(
            status_code=404,
            detail="System not found",
        )

    await db.delete(system)

    await db.commit()

    return {
        "message": "System deleted successfully",
        "system_id": system_id,
    }