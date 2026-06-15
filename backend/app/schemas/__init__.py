from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: str
    age: int
    gender: str
    department: str
    year: str
    semester: int
    hostel_status: str
    interests: list[str]
    skills: list[str]
    goals_text: list[str]
    budget: float
    personality_type: str | None
    is_demo: bool
    demo_scenario: str | None


class GoalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    category: str
    status: str
    progress: float
    roadmap: dict | None


class CompanionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    creature_type: str
    happiness: float
    level: int
    xp: int
    streak: int
    evolution_stage: str
    consistency_score: float


class RecommendationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    catalog_item_id: str
    acquisition_type: str
    score: float
    reason: str
    context: str | None
    priority: int
    item_name: str | None = None
    item_category: str | None = None
    item_image_url: str | None = None
    cost: float | None = None


class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    content: str
    source: str
    category: str
    priority: str
    summary: str | None
    tags: list[str]
    deadline: datetime | None


class DashboardOut(BaseModel):
    greeting: str
    student: StudentOut
    companions: list[CompanionOut]
    goals: list[GoalOut]
    recommendations: list[RecommendationOut]
    announcements: list[AnnouncementOut]
    opportunities_count: int
    analytics: dict
    insights: list[str]


class GoalCreateRequest(BaseModel):
    text: str
    voice_transcript: str | None = None


class AIChatRequest(BaseModel):
    message: str


class DemoScenarioOut(BaseModel):
    id: str
    name: str
    description: str
    student_name: str
    highlight: str
