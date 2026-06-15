import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

EVOLUTION_STAGES = ["Egg", "Baby", "Explorer", "Master", "Legend"]


class Companion(Base):
    __tablename__ = "companions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    goal_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("goals.id"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    creature_type: Mapped[str] = mapped_column(String(50), nullable=False)
    happiness: Mapped[float] = mapped_column(Float, default=75.0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    streak: Mapped[int] = mapped_column(Integer, default=0)
    evolution_stage: Mapped[str] = mapped_column(String(20), default="Egg")
    consistency_score: Mapped[float] = mapped_column(Float, default=0.0)
    last_interaction: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="companion")
    goal: Mapped["Goal | None"] = relationship(back_populates="companion")


from app.models.user import Student  # noqa: E402
from app.models.goal import Goal  # noqa: E402
