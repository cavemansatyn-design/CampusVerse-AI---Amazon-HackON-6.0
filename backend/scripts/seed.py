"""Seed database from generated JSON data."""

import asyncio
import json
import random
import uuid
from datetime import datetime
from pathlib import Path

from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import Base, async_session, engine
from app.models import (
    Announcement, CatalogItem, Club, ClubMembership, Companion, Department,
    Event, Friendship, Goal, Mentorship, Milestone, Opportunity, Recommendation, Student,
)
from app.services.recommender import CatalogEntry, StudentContext, generate_recommendations

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CREATURE_MAP = {
    "Learn DSA": "DSA Dragon", "Get Internship": "Career Dragon", "Build Portfolio": "WebDev Dragon",
    "Gym Transformation": "Fitness Dragon", "Crack GATE": "Academic Dragon", "Learn React": "WebDev Dragon",
    "Build Startup": "Startup Dragon", "Improve CGPA": "Academic Dragon", "Learn ML": "Research Dragon",
    "Hackathon Prep": "Hackathon Dragon",
}
EVOLUTION = ["Egg", "Baby", "Explorer", "Master", "Legend"]
MILESTONES = ["Getting Started", "Building Momentum", "Almost There"]


def load_json(name: str):
    path = DATA_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Run generate_campus.py first: {path} missing")
    with open(path) as f:
        return json.load(f)


async def count_rows(session: AsyncSession, model) -> int:
    result = await session.execute(select(func.count()).select_from(model))
    return result.scalar() or 0


async def seed(session: AsyncSession) -> None:
    print("Loading departments & clubs...")
    for d in load_json("departments.json"):
        session.add(Department(name=d["name"], student_count=d["student_count"]))
    for c in load_json("clubs.json"):
        session.add(Club(name=c["name"], category=c.get("category"), description=f"{c['name']} at CampusVerse"))
    await session.flush()

    dept_map = {d.name: d.id for d in (await session.execute(select(Department))).scalars()}
    club_map = {c.name: c.id for c in (await session.execute(select(Club))).scalars()}

    catalog = load_json("catalog.json")
    print(f"Loading catalog ({len(catalog)} products with photos)...")
    for item in catalog:
        session.add(CatalogItem(**item))
    await session.flush()

    students_data = load_json("students.json")
    print(f"Loading {len(students_data)} students...")
    student_clubs: dict[uuid.UUID, list[str]] = {}
    for s in students_data:
        sid = uuid.UUID(s["id"])
        student_clubs[sid] = s.get("clubs", [])
        session.add(Student(
            id=sid,
            name=s["name"],
            email=s["email"],
            age=s["age"],
            gender=s["gender"],
            department_id=dept_map[s["department"]],
            department=s["department"],
            year=s["year"],
            semester=s["semester"],
            hostel_status=s["hostel_status"],
            interests=s["interests"],
            skills=s["skills"],
            goals_text=s["goals_text"],
            budget=s["budget"],
            personality_type=s.get("personality_type"),
            is_demo=s.get("is_demo", False),
            demo_scenario=s.get("demo_scenario"),
        ))
        for club_name in s.get("clubs", []):
            if club_name in club_map:
                session.add(ClubMembership(student_id=sid, club_id=club_map[club_name]))
    await session.flush()

    print("Loading goals, companions, milestones...")
    demo_student_ids: list[uuid.UUID] = []
    demo_student_meta: dict[uuid.UUID, dict] = {}
    for s in students_data:
        sid = uuid.UUID(s["id"])
        if s.get("is_demo"):
            demo_student_ids.append(sid)
            demo_student_meta[sid] = s
        for goal_title in s["goals_text"]:
            goal_id = uuid.uuid4()
            progress = round(random.uniform(10, 60), 1)
            stage_idx = min(int(progress / 25), 4)
            session.add(Goal(
                id=goal_id,
                student_id=sid,
                title=goal_title,
                category=goal_title.split()[0] if goal_title else "General",
                progress=progress,
                roadmap={"phases": ["Foundation", "Practice", "Master"]},
            ))
            creature = CREATURE_MAP.get(goal_title, "Explorer Dragon")
            session.add(Companion(
                student_id=sid,
                goal_id=goal_id,
                name=creature,
                creature_type=creature,
                happiness=round(random.uniform(60, 95), 1),
                level=max(1, stage_idx + 1),
                xp=int(progress * 10),
                streak=random.randint(0, 30),
                evolution_stage=EVOLUTION[stage_idx],
            ))
            for i, ms in enumerate(MILESTONES):
                session.add(Milestone(goal_id=goal_id, title=ms, order=i, completed=i < stage_idx))
    await session.flush()

    print("Loading campus graph...")
    graph = load_json("campus_graph.json")
    for f in graph.get("friendships", [])[:3000]:
        session.add(Friendship(
            student_id=uuid.UUID(f["student_id"]),
            friend_id=uuid.UUID(f["friend_id"]),
            strength=f.get("strength", 0.5),
        ))
    for m in graph.get("mentorships", []):
        session.add(Mentorship(
            mentor_id=uuid.UUID(m["mentor_id"]),
            mentee_id=uuid.UUID(m["mentee_id"]),
            focus_area=m["focus_area"],
        ))

    print("Loading intelligence hub...")
    hub = load_json("intelligence_hub.json")
    for a in hub.get("announcements", []):
        session.add(Announcement(
            title=a["title"], content=a["content"], source=a["source"], category=a["category"],
            priority=a.get("priority", "medium"), tags=a.get("tags", []),
            deadline=datetime.fromisoformat(a["deadline"]) if a.get("deadline") else None,
        ))
    for e in hub.get("events", []):
        session.add(Event(
            title=e["title"], event_type=e["event_type"],
            start_time=datetime.fromisoformat(e["start_time"]),
            location=e.get("location"), tags=e.get("tags", []),
        ))
    for o in hub.get("opportunities", []):
        session.add(Opportunity(
            title=o["title"], description=o["description"], opportunity_type=o["opportunity_type"],
            company=o.get("company"), skills_required=o.get("skills_required", []),
            relevance_tags=o.get("relevance_tags", []),
        ))
    await session.flush()

    print("Generating recommendations for demo students...")
    catalog_entries = [
        CatalogEntry(
            id=c.id, name=c.name, category=c.category, price=c.price,
            sustainability_score=c.sustainability_score, borrowable=c.borrowable,
            rentable=c.rentable, shared=c.shared, new_cost=c.new_cost,
            used_cost=c.used_cost, refurbished_cost=c.refurbished_cost, tags=c.tags or [],
        )
        for c in (await session.execute(select(CatalogItem))).scalars()
    ]

    for sid in demo_student_ids[:5]:
        meta = demo_student_meta[sid]
        ctx = StudentContext(
            id=str(sid), name=meta["name"], department=meta["department"], year=meta["year"],
            hostel_status=meta["hostel_status"], interests=meta["interests"], skills=meta["skills"],
            goals=meta["goals_text"], budget=meta["budget"],
            clubs=meta.get("clubs", []),
        )
        for r in generate_recommendations(ctx, catalog_entries, ["Hackathon 48"], limit=15):
            session.add(Recommendation(
                student_id=sid, catalog_item_id=r.catalog_item_id,
                acquisition_type=r.acquisition_type, score=r.score,
                reason=r.reason, context=r.context, priority=r.priority,
            ))

    await session.commit()
    print(f"Done! Seeded {len(students_data)} students, {len(catalog)} catalog items.")


async def main(force: bool = False) -> None:
    print("Creating tables if needed...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(text(
            "ALTER TABLE catalog_items ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"
        ))

    async with async_session() as session:
        student_count = await count_rows(session, Student)
        if student_count > 0 and not force:
            print(f"Database already seeded ({student_count} students). Use --force to re-seed.")
            return
        if force and student_count > 0:
            print("Force mode: clearing existing data...")
            tables = [
                "recommendations", "milestones", "goal_progress", "goals", "companions",
                "club_memberships", "friendships", "mentorships", "study_group_members",
                "study_groups", "collaborations", "borrow_records", "rental_records",
                "resource_items", "shared_assets", "expense_splits", "tasks",
                "calendar_events", "routines", "focus_sessions", "announcements",
                "events", "opportunities", "students", "catalog_items", "clubs", "departments",
            ]
            for table in tables:
                await session.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE"))
            await session.commit()

        await seed(session)


if __name__ == "__main__":
    import sys
    asyncio.run(main(force="--force" in sys.argv))
