import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

ACQUISITION_TYPES = ["borrow", "rent", "share", "used", "refurbished", "new"]


class CatalogItem(Base):
    __tablename__ = "catalog_items"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    sustainability_score: Mapped[float] = mapped_column(Float, default=0.5)
    availability: Mapped[str] = mapped_column(String(20), default="available")
    borrowable: Mapped[bool] = mapped_column(Boolean, default=True)
    rentable: Mapped[bool] = mapped_column(Boolean, default=True)
    shared: Mapped[bool] = mapped_column(Boolean, default=False)
    new_cost: Mapped[float] = mapped_column(Float, default=0.0)
    used_cost: Mapped[float | None] = mapped_column(Float)
    refurbished_cost: Mapped[float | None] = mapped_column(Float)
    tags: Mapped[list] = mapped_column(ARRAY(String), default=list)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    catalog_item_id: Mapped[str] = mapped_column(ForeignKey("catalog_items.id"), nullable=False)
    acquisition_type: Mapped[str] = mapped_column(String(20), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    context: Mapped[str | None] = mapped_column(String(100))
    priority: Mapped[int] = mapped_column(Integer, default=1)
    is_dismissed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["Student"] = relationship(back_populates="recommendations")
    catalog_item: Mapped["CatalogItem"] = relationship()


from app.models.user import Student  # noqa: E402
