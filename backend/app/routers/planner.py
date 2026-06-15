from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.groq_service import groq_service
from app.database import get_db
from app.models import CalendarEvent, Goal, Student, Task

router = APIRouter(prefix="/planner", tags=["planner"])


@router.get("/{student_id}/tasks")
async def get_tasks(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.student_id == student_id).order_by(Task.due_date))
    tasks = result.scalars().all()
    return [{"id": str(t.id), "title": t.title, "priority": t.priority, "status": t.status, "due_date": t.due_date.isoformat() if t.due_date else None} for t in tasks]


@router.get("/{student_id}/calendar")
async def get_calendar(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CalendarEvent).where(CalendarEvent.student_id == student_id))
    events = result.scalars().all()
    return [{"id": str(e.id), "title": e.title, "type": e.event_type, "start": e.start_time.isoformat(), "end": e.end_time.isoformat()} for e in events]


@router.post("/demo/optimize")
async def demo_optimize():
    plan = await groq_service.optimize_plan(
        ["DSA Practice", "Project Work", "Review Notes"],
        ["Classes", "Club Meeting", "Hackathon Prep"],
        ["Learn DSA", "Get Internship"],
    )
    return plan


@router.post("/{student_id}/optimize")
async def optimize_plan(student_id: UUID, db: AsyncSession = Depends(get_db)):
    tasks_r = await db.execute(select(Task).where(Task.student_id == student_id, Task.status == "pending"))
    goals_r = await db.execute(select(Goal).where(Goal.student_id == student_id))
    cal_r = await db.execute(select(CalendarEvent).where(CalendarEvent.student_id == student_id))

    tasks = [t.title for t in tasks_r.scalars().all()]
    goals = [g.title for g in goals_r.scalars().all()]
    events = [e.title for e in cal_r.scalars().all()]

    if not tasks:
        tasks = ["DSA Practice", "Project Work", "Review Notes"]
    if not goals:
        goals = ["Improve CGPA"]
    if not events:
        events = ["Classes", "Club Meeting"]

    plan = await groq_service.optimize_plan(tasks, events, goals)
    return plan
