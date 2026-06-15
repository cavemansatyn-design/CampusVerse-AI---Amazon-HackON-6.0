"""Check whether Neon/database seeding completed."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings
from app.models import CatalogItem, Companion, Goal, Recommendation, Student


async def main() -> None:
    connect_args = {"ssl": "require"} if settings.use_database_ssl else {}
    engine = create_async_engine(settings.async_database_url, connect_args=connect_args)

    async with engine.connect() as conn:
        tables = ["departments", "students", "catalog_items", "goals", "companions", "recommendations"]
        print("=== CampusVerse seed status ===")
        for table in tables:
            try:
                r = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = r.scalar()
                status = "OK" if count and count > 0 else "EMPTY"
                print(f"  {table:20} {count:>6}  [{status}]")
            except Exception as e:
                print(f"  {table:20}   ERROR  [{e}]")

    async with engine.begin() as conn:
        from sqlalchemy.ext.asyncio import AsyncSession
        from sqlalchemy.orm import sessionmaker

        async_session = sessionmaker(conn, class_=AsyncSession, expire_on_commit=False)
        async with async_session() as session:
            demo = await session.execute(select(Student).where(Student.is_demo == True))
            demo_list = demo.scalars().all()
            print(f"\nDemo students in DB: {len(demo_list)}")
            for s in demo_list:
                print(f"  - {s.name} ({s.demo_scenario})")

            rec_count = await session.execute(select(func.count()).select_from(Recommendation))
            print(f"\nRecommendations total: {rec_count.scalar() or 0}")

            if len(demo_list) >= 5:
                print("\n[OK] Seeding looks COMPLETE")
            elif len(demo_list) == 0:
                print("\n[FAIL] Seeding NOT done — run: python -m scripts.seed")
            else:
                print("\n[WARN] Seeding PARTIAL — consider: python -m scripts.seed --force")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
