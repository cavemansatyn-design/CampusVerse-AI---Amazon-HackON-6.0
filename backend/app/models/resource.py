import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ResourceItem(Base):
    __tablename__ = "resource_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    condition: Mapped[str] = mapped_column(String(20), default="good")
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    borrowable: Mapped[bool] = mapped_column(Boolean, default=True)
    rentable: Mapped[bool] = mapped_column(Boolean, default=False)
    shareable: Mapped[bool] = mapped_column(Boolean, default=False)
    daily_rent: Mapped[float | None] = mapped_column(Float)
    deposit: Mapped[float | None] = mapped_column(Float)
    location: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resource_items.id"), nullable=False)
    borrower_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    lender_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    borrowed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    return_by: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    returned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(20), default="active")


class RentalRecord(Base):
    __tablename__ = "rental_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resource_items.id"), nullable=False)
    renter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    total_cost: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")


class SharedAsset(Base):
    __tablename__ = "shared_assets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    owner_ids: Mapped[list] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    total_owners: Mapped[int] = mapped_column(Integer, default=2)
    usage_schedule: Mapped[str | None] = mapped_column(Text)
    monthly_cost: Mapped[float | None] = mapped_column(Float)


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    payer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("students.id"), nullable=False)
    participant_ids: Mapped[list] = mapped_column(ARRAY(UUID(as_uuid=True)), default=list)
    amounts: Mapped[dict | None] = mapped_column(JSONB, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
