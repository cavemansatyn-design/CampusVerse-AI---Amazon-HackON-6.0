from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.groq_service import groq_service
from app.database import get_db
from app.models import Friendship, Goal, Mentorship, Student, Task

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/{student_id}/friends")
async def get_friends(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Friendship).where(Friendship.student_id == student_id).limit(20))
    friendships = result.scalars().all()
    friends = []
    for f in friendships:
        fr = await db.execute(select(Student).where(Student.id == f.friend_id))
        friend = fr.scalar_one_or_none()
        if friend:
            friends.append({"id": str(friend.id), "name": friend.name, "department": friend.department, "strength": f.strength})
    return friends


@router.get("/{student_id}/mentorships")
async def get_mentorships(student_id: UUID, db: AsyncSession = Depends(get_db)):
    as_mentee = await db.execute(select(Mentorship).where(Mentorship.mentee_id == student_id))
    as_mentor = await db.execute(select(Mentorship).where(Mentorship.mentor_id == student_id))
    out = {"as_mentee": [], "as_mentor": []}
    for m in as_mentee.scalars().all():
        mr = await db.execute(select(Student).where(Student.id == m.mentor_id))
        mentor = mr.scalar_one_or_none()
        if mentor:
            out["as_mentee"].append({"mentor": mentor.name, "focus": m.focus_area})
    for m in as_mentor.scalars().all():
        mr = await db.execute(select(Student).where(Student.id == m.mentee_id))
        mentee = mr.scalar_one_or_none()
        if mentee:
            out["as_mentor"].append({"mentee": mentee.name, "focus": m.focus_area})
    return out


@router.get("/{student_id}/study-buddies")
async def match_study_buddies(student_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(404, "Student not found")

    matches_r = await db.execute(
        select(Student)
        .where(Student.department == student.department, Student.id != student_id)
        .limit(10)
    )
    matches = []
    for m in matches_r.scalars().all():
        shared_goals = set(student.goals_text) & set(m.goals_text)
        shared_interests = set(student.interests) & set(m.interests)
        score = len(shared_goals) * 0.4 + len(shared_interests) * 0.3 + (0.3 if m.year == student.year else 0.1)
        if score > 0.2:
            matches.append({
                "id": str(m.id), "name": m.name, "year": m.year,
                "match_score": round(score, 2),
                "shared_goals": list(shared_goals),
                "shared_interests": list(shared_interests),
            })
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches[:5]
