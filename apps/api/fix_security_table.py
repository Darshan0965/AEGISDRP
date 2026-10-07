import asyncio

from sqlalchemy import text

from apps.api.app.core.database import engine


async def fix_security_table():
    async with engine.begin() as conn:

        # Add status
        await conn.execute(
            text(
                """
                ALTER TABLE security_events
                ADD COLUMN IF NOT EXISTS status VARCHAR(20)
                NOT NULL
                DEFAULT 'OPEN';
                """
            )
        )

        # Add detected_at
        await conn.execute(
            text(
                """
                ALTER TABLE security_events
                ADD COLUMN IF NOT EXISTS detected_at
                TIMESTAMP WITH TIME ZONE
                NOT NULL
                DEFAULT CURRENT_TIMESTAMP;
                """
            )
        )

        # Add created_at
        await conn.execute(
            text(
                """
                ALTER TABLE security_events
                ADD COLUMN IF NOT EXISTS created_at
                TIMESTAMP WITH TIME ZONE
                NOT NULL
                DEFAULT CURRENT_TIMESTAMP;
                """
            )
        )

    print("SECURITY EVENTS TABLE SCHEMA FIXED SUCCESSFULLY")


async def main():
    try:
        await fix_security_table()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())