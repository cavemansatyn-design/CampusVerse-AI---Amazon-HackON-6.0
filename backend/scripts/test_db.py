import asyncio

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings

async def main() -> None:
    connect_args = {"ssl": "require"} if settings.use_database_ssl else {}
    engine = create_async_engine(settings.async_database_url, connect_args=connect_args)
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        print("DB connection OK:", result.scalar())
        print("URL prefix:", settings.async_database_url[:70] + "...")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
