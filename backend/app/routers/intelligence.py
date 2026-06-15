from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.groq_service import groq_service
from app.database import get_db
from app.models import Announcement, CatalogItem, Event, Opportunity
from app.schemas import AnnouncementOut

router = APIRouter(prefix="/intelligence", tags=["intelligence"])


@router.get("/announcements", response_model=list[AnnouncementOut])
async def list_announcements(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Announcement).order_by(Announcement.created_at.desc()).limit(limit))
    return result.scalars().all()


@router.post("/announcements/analyze")
async def analyze_announcement(content: str):
    analysis = await groq_service.summarize_announcement(content)
    return analysis


@router.get("/events")
async def list_events(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).limit(limit))
    events = result.scalars().all()
    return [{"id": str(e.id), "title": e.title, "event_type": e.event_type, "start_time": e.start_time.isoformat(), "location": e.location, "tags": e.tags} for e in events]


@router.get("/opportunities")
async def list_opportunities(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Opportunity).limit(limit))
    opps = result.scalars().all()
    return [{"id": str(o.id), "title": o.title, "description": o.description, "type": o.opportunity_type, "company": o.company, "skills": o.skills_required} for o in opps]


@router.get("/catalog")
async def list_catalog(category: str | None = None, limit: int = 50, db: AsyncSession = Depends(get_db)):
    q = select(CatalogItem).limit(limit)
    if category:
        q = q.where(CatalogItem.category == category)
    result = await db.execute(q)
    items = result.scalars().all()
    return [{"id": i.id, "name": i.name, "category": i.category, "new_cost": i.new_cost, "borrowable": i.borrowable, "sustainability_score": i.sustainability_score, "image_url": i.image_url} for i in items]
