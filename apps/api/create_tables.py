import asyncio

from apps.api.app.core.database import Base, engine

# Import all models so SQLAlchemy registers their tables
from apps.api.app.models.system import SystemRecord
from apps.api.app.models.security import SecurityEvent


async def create_tables():
    """Create all database tables."""

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("DATABASE TABLES CREATED SUCCESSFULLY")


async def main():
    try:
        await create_tables()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())