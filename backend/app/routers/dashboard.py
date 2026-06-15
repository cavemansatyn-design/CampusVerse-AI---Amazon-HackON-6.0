from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.groq_service import groq_service
from app.database import get_db
from app.models import Announcement, Companion, Goal, Opportunity, Recommendation, Student
from app.schemas import (
    AIChatRequest, AnnouncementOut, CompanionOut, DashboardOut, DemoScenarioOut,
    GoalCreateRequest, GoalOut, RecommendationOut, StudentOut,
)
from app.services.recommender import compute_analytics

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

DEMO_SCENARIOS = [
    {"id": "first_year", "name": "First-Year Student", "description": "New CS freshman navigating DSA and campus life", "highlight": "DSA Dragon evolution + study buddy matching"},
    {"id": "placement", "name": "Placement Aspirant", "description": "Final year student prepping for Google/Microsoft", "highlight": "Mock interviews + career recommendations"},
    {"id": "hackathon", "name": "Hackathon Participant", "description": "Electronics junior gearing up for 48-hour hackathon", "highlight": "Power bank, USB hub, energy snacks predicted"},
    {"id": "hostel_fresher", "name": "Hostel Fresher", "description": "First-year biotech student settling into hostel", "highlight": "Dorm essentials + roommate resource sharing"},
    {"id": "research", "name": "Research Enthusiast", "description": "CS junior pursuing ML research and publications", "highlight": "Research tools + mentorship matching"},
]


@router.get("/scenarios", response_model=list[DemoScenarioOut])
async def list_scenarios(db: AsyncSession = Depends(get_db)):
    out = []
    for s in DEMO_SCENARIOS:
        result = await db.execute(select(Student).where(Student.demo_scenario == s["id"]))
        student = result.scalar_one_or_none()
        out.append(DemoScenarioOut(
            id=s["id"], name=s["name"], description=s["description"],
            student_name=student.name if student else "Demo User", highlight=s["highlight"],
        ))
    return out


@router.get("/{student_id}", response_model=DashboardOut)
async def get_dashboard(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(404, "Student not found")

    goals_r = await db.execute(select(Goal).where(Goal.student_id == student_id, Goal.status == "active"))
    goals = goals_r.scalars().all()

    companions_r = await db.execute(select(Companion).where(Companion.student_id == student_id))
    companions = companions_r.scalars().all()

    recs_r = await db.execute(
        select(Recommendation)
        .where(Recommendation.student_id == student_id, Recommendation.is_dismissed == False)
        .order_by(Recommendation.score.desc())
        .limit(8)
        .options(selectinload(Recommendation.catalog_item))
    )
    recs = recs_r.scalars().all()

    ann_r = await db.execute(select(Announcement).order_by(Announcement.priority.desc()).limit(5))
    announcements = ann_r.scalars().all()

    opp_count = await db.execute(select(func.count()).select_from(Opportunity))
    opportunities_count = opp_count.scalar() or 0

    hour = __import__("datetime").datetime.now().hour
    greeting = "Good Morning" if hour < 12 else "Good Afternoon" if hour < 17 else "Good Evening"

    evolved = [c for c in companions if c.evolution_stage in ("Master", "Legend", "Explorer")]
    insights = []
    if evolved:
        insights.append(f"Your {evolved[0].name} evolved to {evolved[0].evolution_stage}!")
    insights.append(f"{opportunities_count} opportunities match your goals.")
    high_priority = [a for a in announcements if a.priority == "high"]
    if high_priority:
        insights.append(f"{high_priority[0].title} — check deadline!")
    insights.append("Rahul wants a mock interview.")
    insights.append("A hostel roommate nearby is lending a calculator.")

    analytics = compute_analytics(
        __import__("app.services.recommender", fromlist=["StudentContext"]).StudentContext(
            id=str(student.id), name=student.name, department=student.department,
            year=student.year, hostel_status=student.hostel_status,
            interests=student.interests, skills=student.skills,
            goals=student.goals_text, budget=student.budget, clubs=[],
        ),
        [{"level": c.level, "xp": c.xp} for c in companions],
        [{"progress": g.progress} for g in goals],
    )

    rec_out = []
    for r in recs:
        item = r.catalog_item
        rec_out.append(RecommendationOut(
            id=r.id, catalog_item_id=r.catalog_item_id, acquisition_type=r.acquisition_type,
            score=r.score, reason=r.reason, context=r.context, priority=r.priority,
            item_name=item.name if item else None, item_category=item.category if item else None,
            item_image_url=item.image_url if item else None,
            cost=0 if r.acquisition_type == "borrow" else (item.used_cost or item.new_cost if item else 0),
        ))

    return DashboardOut(
        greeting=f"{greeting}, {student.name.split()[0]}.",
        student=StudentOut.model_validate(student),
        companions=[CompanionOut.model_validate(c) for c in companions],
        goals=[GoalOut.model_validate(g) for g in goals],
        recommendations=rec_out,
        announcements=[AnnouncementOut.model_validate(a) for a in announcements],
        opportunities_count=opportunities_count,
        analytics=analytics,
        insights=insights,
    )


@router.post("/{student_id}/goals")
async def create_goal(student_id: UUID, body: GoalCreateRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(404, "Student not found")

    goal_text = body.voice_transcript or body.text
    ai_result = await groq_service.generate_roadmap(goal_text, {
        "department": student.department, "year": student.year,
        "interests": student.interests, "skills": student.skills,
    })

    goal = Goal(
        student_id=student_id, title=goal_text[:200],
        category="AI Generated", progress=0,
        roadmap=ai_result,
    )
    db.add(goal)
    await db.flush()

    creature = ai_result.get("companion_creature", "Explorer Dragon")
    companion = Companion(
        student_id=student_id, goal_id=goal.id,
        name=creature, creature_type=creature,
    )
    db.add(companion)
    await db.flush()

    return {"goal": GoalOut.model_validate(goal), "roadmap": ai_result, "companion": CompanionOut.model_validate(companion)}


@router.post("/{student_id}/companion/chat")
async def companion_chat(student_id: UUID, body: AIChatRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Companion).where(Companion.student_id == student_id).limit(1)
    )
    companion = result.scalar_one_or_none()
    student_r = await db.execute(select(Student).where(Student.id == student_id))
    student = student_r.scalar_one_or_none()
    if not companion or not student:
        raise HTTPException(404, "Companion not found")

    reply = await groq_service.companion_chat(body.message, companion.name, student.name)
    return {**reply, "companion": CompanionOut.model_validate(companion)}
