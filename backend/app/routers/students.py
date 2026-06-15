from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import CatalogItem, Companion, Goal, Recommendation, Student
from app.schemas import CompanionOut, GoalOut, RecommendationOut, StudentOut
from app.services.recommender import CatalogEntry, StudentContext, compute_analytics, generate_recommendations

router = APIRouter(prefix="/students", tags=["students"])


@router.get("", response_model=list[StudentOut])
async def list_students(limit: int = 50, demo_only: bool = False, db: AsyncSession = Depends(get_db)):
    q = select(Student).limit(limit)
    if demo_only:
        q = q.where(Student.is_demo == True)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{student_id}", response_model=StudentOut)
async def get_student(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(404, "Student not found")
    return student


@router.get("/{student_id}/recommendations", response_model=list[RecommendationOut])
async def get_recommendations(student_id: UUID, limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Recommendation)
        .where(Recommendation.student_id == student_id, Recommendation.is_dismissed == False)
        .order_by(Recommendation.score.desc())
        .limit(limit)
        .options(selectinload(Recommendation.catalog_item))
    )
    recs = result.scalars().all()
    out = []
    for r in recs:
        item = r.catalog_item
        cost = 0 if r.acquisition_type == "borrow" else (item.used_cost or item.new_cost)
        out.append(RecommendationOut(
            id=r.id, catalog_item_id=r.catalog_item_id, acquisition_type=r.acquisition_type,
            score=r.score, reason=r.reason, context=r.context, priority=r.priority,
            item_name=item.name if item else None, item_category=item.category if item else None,
            item_image_url=item.image_url if item else None, cost=cost,
        ))
    return out


@router.post("/{student_id}/recommendations/refresh", response_model=list[RecommendationOut])
async def refresh_recommendations(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Student).where(Student.id == student_id).options(selectinload(Student.club_memberships).selectinload(__import__("app.models.user", fromlist=["ClubMembership"]).ClubMembership.club))
    )
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(404, "Student not found")

    catalog_result = await db.execute(select(CatalogItem))
    catalog = [
        CatalogEntry(
            id=c.id, name=c.name, category=c.category, price=c.price,
            sustainability_score=c.sustainability_score, borrowable=c.borrowable,
            rentable=c.rentable, shared=c.shared, new_cost=c.new_cost,
            used_cost=c.used_cost, refurbished_cost=c.refurbished_cost, tags=c.tags or [],
        )
        for c in catalog_result.scalars().all()
    ]

    clubs = []
    for cm in student.club_memberships:
        club_r = await db.execute(select(__import__("app.models.user", fromlist=["Club"]).Club).where(__import__("app.models.user", fromlist=["Club"]).Club.id == cm.club_id))
        club = club_r.scalar_one_or_none()
        if club:
            clubs.append(club.name)

    ctx = StudentContext(
        id=str(student.id), name=student.name, department=student.department,
        year=student.year, hostel_status=student.hostel_status, interests=student.interests,
        skills=student.skills, goals=student.goals_text, budget=student.budget, clubs=clubs,
    )
    recs = generate_recommendations(ctx, catalog, ["Hackathon 48"], limit=15)

    await db.execute(
        __import__("sqlalchemy", fromlist=["update"]).update(Recommendation)
        .where(Recommendation.student_id == student_id)
        .values(is_dismissed=True)
    )

    new_recs = []
    for r in recs:
        rec = Recommendation(
            student_id=student_id, catalog_item_id=r.catalog_item_id,
            acquisition_type=r.acquisition_type, score=r.score,
            reason=r.reason, context=r.context, priority=r.priority,
        )
        db.add(rec)
        new_recs.append(rec)
    await db.flush()

    out = []
    for r in new_recs:
        item_r = await db.execute(select(CatalogItem).where(CatalogItem.id == r.catalog_item_id))
        item = item_r.scalar_one()
        out.append(RecommendationOut(
            id=r.id, catalog_item_id=r.catalog_item_id, acquisition_type=r.acquisition_type,
            score=r.score, reason=r.reason, context=r.context, priority=r.priority,
            item_name=item.name, item_category=item.category,
            item_image_url=item.image_url,
            cost=0 if r.acquisition_type == "borrow" else (item.used_cost or item.new_cost),
        ))
    return out
