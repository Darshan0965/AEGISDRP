import asyncio
from sqlalchemy import text
from apps.api.app.core.database import engine


async def test_database():
    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            print("DATABASE CONNECTION SUCCESS:", result.scalar())

    except Exception as e:
        print("DATABASE CONNECTION FAILED:")
        print(type(e).__name__)
        print(e)

    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(test_database())