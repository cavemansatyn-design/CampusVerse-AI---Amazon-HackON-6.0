import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Friendship(Base):
    __tablename__ = "friendships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    friend_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    strength: Mapped[float] = mapped_column(Float, default=0.5)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Mentorship(Base):
    __tablename__ = "mentorships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mentor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    mentee_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    focus_area: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    subject: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    max_members: Mapped[int] = mapped_column(Integer, default=6)
    meeting_schedule: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StudyGroupMember(Base):
    __tablename__ = "study_group_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    group_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("study_groups.id"), nullable=False)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="member")


class Collaboration(Base):
    __tablename__ = "collaborations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    project_type: Mapped[str] = mapped_column(String(50), nullable=False)
    leader_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    member_ids: Mapped[list] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    skills_needed: Mapped[list] = mapped_column(ARRAY(String), default=list)
    status: Mapped[str] = mapped_column(String(20), default="recruiting")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
