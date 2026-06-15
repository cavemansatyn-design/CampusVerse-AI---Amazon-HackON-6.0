import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")
    progress: Mapped[float] = mapped_column(Float, default=0.0)
    roadmap: Mapped[dict | None] = mapped_column(JSONB)
    target_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="goals")
    milestones: Mapped[list["Milestone"]] = relationship(back_populates="goal", cascade="all, delete-orphan")
    companion: Mapped["Companion | None"] = relationship(back_populates="goal", uselist=False)


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("goals.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(default=False)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    goal: Mapped["Goal"] = relationship(back_populates="milestones")


class GoalProgress(Base):
    __tablename__ = "goal_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    goal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("goals.id"), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    progress_delta: Mapped[float] = mapped_column(Float, default=0.0)
    notes: Mapped[str | None] = mapped_column(Text)


from app.models.user import Student  # noqa: E402
from app.models.companion import Companion  # noqa: E402
