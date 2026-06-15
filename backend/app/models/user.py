import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    student_count: Mapped[int] = mapped_column(Integer, default=0)

    students: Mapped[list["Student"]] = relationship(back_populates="department_rel")


class Club(Base):
    __tablename__ = "clubs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str | None] = mapped_column(String(50))

    memberships: Mapped[list["ClubMembership"]] = relationship(back_populates="club")


class Student(Base):
    __tablename__ = "students"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clerk_id: Mapped[str | None] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[str] = mapped_column(String(20), nullable=False)
    semester: Mapped[int] = mapped_column(Integer, default=1)
    hostel_status: Mapped[str] = mapped_column(String(20), nullable=False)
    interests: Mapped[list] = mapped_column(ARRAY(String), default=list)
    skills: Mapped[list] = mapped_column(ARRAY(String), default=list)
    goals_text: Mapped[list] = mapped_column(ARRAY(String), default=list)
    budget: Mapped[float] = mapped_column(Float, default=5000.0)
    personality_type: Mapped[str | None] = mapped_column(String(10))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    demo_scenario: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    department_rel: Mapped["Department"] = relationship(back_populates="students")
    club_memberships: Mapped[list["ClubMembership"]] = relationship(back_populates="student")
    goals: Mapped[list["Goal"]] = relationship(back_populates="student")
    companion: Mapped["Companion | None"] = relationship(back_populates="student", uselist=False)
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="student")


class ClubMembership(Base):
    __tablename__ = "club_memberships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    club_id: Mapped[int] = mapped_column(ForeignKey("clubs.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="member")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="club_memberships")
    club: Mapped["Club"] = relationship(back_populates="memberships")


from app.models.goal import Goal  # noqa: E402
from app.models.companion import Companion  # noqa: E402
from app.models.recommendation import Recommendation  # noqa: E402
