from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from apps.api.app.core.database import Base


class SystemRecord(Base):
    __tablename__ = "system_records"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
    )

    cpu_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    memory_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    disk_usage: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    network_in: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    network_out: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    uptime_seconds: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    last_heartbeat: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )