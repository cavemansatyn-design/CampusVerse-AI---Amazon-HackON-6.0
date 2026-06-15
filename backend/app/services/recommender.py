"""Hybrid recommendation engine for CampusVerse AI."""

from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import datetime, timezone

ACQUISITION_PRIORITY = ["borrow", "rent", "share", "used", "refurbished", "new"]

GOAL_ITEM_MAP = {
    "Learn DSA": ["Books", "Programming", "Productivity"],
    "Get Internship": ["Career", "Interview Prep", "Programming"],
    "Build Portfolio": ["Programming", "Design", "AI Tools"],
    "Gym Transformation": ["Fitness", "Health", "Sports"],
    "Crack GATE": ["Academic", "Books", "Stationery"],
    "Learn React": ["Programming", "Design", "AI Tools"],
    "Build Startup": ["Career", "Finance", "Productivity"],
    "Improve CGPA": ["Academic", "Books", "Stationery"],
    "Learn ML": ["Programming", "AI Tools", "Research"],
    "Hackathon Prep": ["Hackathon", "Electronics", "Programming"],
}

CLUB_ITEM_MAP = {
    "Robotics Club": ["Robotics", "Electronics", "Programming"],
    "Coding Club": ["Programming", "AI Tools", "Hackathon"],
    "Photography Club": ["Photography", "Content Creation", "Electronics"],
    "Fitness Club": ["Fitness", "Health", "Sports"],
    "AI Club": ["AI Tools", "Programming", "Research"],
    "Hackathon Club": ["Hackathon", "Electronics", "Programming"],
    "Entrepreneurship Club": ["Career", "Finance", "Productivity"],
}

HOSTEL_ESSENTIALS = ["Dorm Essentials", "Kitchen Essentials", "Hostel", "Medical Essentials"]


@dataclass
class StudentContext:
    id: str
    name: str
    department: str
    year: str
    hostel_status: str
    interests: list[str]
    skills: list[str]
    goals: list[str]
    budget: float
    clubs: list[str]
    semester: int = 1


@dataclass
class CatalogEntry:
    id: str
    name: str
    category: str
    price: float
    sustainability_score: float
    borrowable: bool
    rentable: bool
    shared: bool
    new_cost: float
    used_cost: float | None
    refurbished_cost: float | None
    tags: list[str]


@dataclass
class ScoredRecommendation:
    catalog_item_id: str
    acquisition_type: str
    score: float
    reason: str
    context: str
    priority: int


def _best_acquisition(item: CatalogEntry, budget: float) -> tuple[str, float]:
    for acq in ACQUISITION_PRIORITY:
        if acq == "borrow" and item.borrowable:
            return "borrow", 0.0
        if acq == "rent" and item.rentable:
            return "rent", item.price * 0.1
        if acq == "share" and item.shared:
            return "share", item.price * 0.05
        if acq == "used" and item.used_cost is not None and item.used_cost <= budget:
            return "used", item.used_cost
        if acq == "refurbished" and item.refurbished_cost is not None and item.refurbished_cost <= budget:
            return "refurbished", item.refurbished_cost
        if acq == "new" and item.new_cost <= budget:
            return "new", item.new_cost
    return "borrow" if item.borrowable else "new", item.new_cost


def _goal_score(item: CatalogEntry, goals: list[str]) -> float:
    score = 0.0
    for goal in goals:
        cats = GOAL_ITEM_MAP.get(goal, [])
        if item.category in cats:
            score += 0.4
        for tag in item.tags:
            if any(g.lower() in tag.lower() or tag.lower() in goal.lower() for g in [goal]):
                score += 0.2
    return min(score, 1.0)


def _club_score(item: CatalogEntry, clubs: list[str]) -> float:
    score = 0.0
    for club in clubs:
        cats = CLUB_ITEM_MAP.get(club, [])
        if item.category in cats:
            score += 0.35
    return min(score, 1.0)


def _interest_score(item: CatalogEntry, interests: list[str]) -> float:
    matches = sum(1 for i in interests if any(i.lower() in t.lower() or t.lower() in i.lower() for t in item.tags))
    return min(matches * 0.15, 0.6)


def _hostel_score(item: CatalogEntry, hostel_status: str, year: str) -> float:
    if hostel_status == "hostel" and year == "First Year":
        if item.category in HOSTEL_ESSENTIALS:
            return 0.8
    if hostel_status == "hostel" and item.category in ["Hostel", "Dorm Essentials"]:
        return 0.3
    return 0.0


def _sustainability_bonus(item: CatalogEntry, acq: str) -> float:
    if acq in ("borrow", "rent", "share", "used", "refurbished"):
        return item.sustainability_score * 0.2
    return 0.0


def _budget_penalty(cost: float, budget: float) -> float:
    if cost <= 0:
        return 0.0
    if cost > budget:
        return -0.5
    return 0.1 * (1 - cost / max(budget, 1))


def generate_recommendations(
    student: StudentContext,
    catalog: list[CatalogEntry],
    upcoming_events: list[str] | None = None,
    limit: int = 20,
) -> list[ScoredRecommendation]:
    upcoming_events = upcoming_events or []
    results: list[ScoredRecommendation] = []

    for item in catalog:
        acq, cost = _best_acquisition(item, student.budget)
        base = (
            _goal_score(item, student.goals) * 0.35
            + _club_score(item, student.clubs) * 0.25
            + _interest_score(item, student.interests) * 0.2
            + _hostel_score(item, student.hostel_status, student.year) * 0.15
            + _budget_penalty(cost, student.budget)
            + _sustainability_bonus(item, acq)
        )

        if "hackathon" in " ".join(upcoming_events).lower() and item.category in ("Hackathon", "Electronics", "Programming"):
            base += 0.3

        if "placement" in " ".join(upcoming_events).lower() and item.category in ("Career", "Interview Prep"):
            base += 0.25

        if base < 0.15:
            continue

        context = _infer_context(item, student, upcoming_events)
        reason = _build_reason(item, student, acq, context)

        results.append(
            ScoredRecommendation(
                catalog_item_id=item.id,
                acquisition_type=acq,
                score=round(base, 3),
                reason=reason,
                context=context,
                priority=ACQUISITION_PRIORITY.index(acq) + 1,
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]


def _infer_context(item: CatalogEntry, student: StudentContext, events: list[str]) -> str:
    if student.hostel_status == "hostel" and student.year == "First Year" and item.category in HOSTEL_ESSENTIALS:
        return "hostel_fresher"
    if any("hackathon" in e.lower() for e in events) or "Hackathon" in student.goals:
        return "hackathon_prep"
    if any(g in ("Get Internship", "Build Startup") for g in student.goals):
        return "placement_season"
    if any(c in ("Robotics Club", "AI Club") for c in student.clubs):
        return "club_activity"
    if any(g in ("Gym Transformation",) for g in student.goals):
        return "fitness_goal"
    if any(g in ("Learn ML",) for g in student.goals) or "Research" in student.interests:
        return "research_goal"
    return "general"


def _build_reason(item: CatalogEntry, student: StudentContext, acq: str, context: str) -> str:
    templates = {
        "hostel_fresher": f"Essential for new hostel students — {item.name} fits your dorm setup.",
        "hackathon_prep": f"Hackathon approaching — {item.name} will boost your build session.",
        "placement_season": f"Placement season — {item.name} strengthens your career prep.",
        "club_activity": f"Matches your club interests — {item.name} supports your projects.",
        "fitness_goal": f"Active fitness goal — {item.name} helps your transformation.",
        "research_goal": f"Research focus — {item.name} supports your academic work.",
        "general": f"Based on your goals and interests — {item.name} is a smart {acq} choice.",
    }
    return templates.get(context, templates["general"])


def compute_analytics(student: StudentContext, companions: list[dict], goals: list[dict]) -> dict:
    now = datetime.now(timezone.utc)
    goal_completion = sum(g.get("progress", 0) for g in goals) / max(len(goals), 1)
    companion_growth = sum(c.get("level", 1) * 10 + c.get("xp", 0) * 0.1 for c in companions) / max(len(companions), 1)
    engagement = min(len(student.clubs) * 15 + len(student.interests) * 5, 100)
    productivity = min(goal_completion * 0.6 + companion_growth * 0.4, 100)
    sustainability = 72.0
    success = (goal_completion * 0.3 + engagement * 0.2 + productivity * 0.3 + companion_growth * 0.2)

    return {
        "student_success_score": round(success, 1),
        "goal_completion_score": round(goal_completion, 1),
        "campus_engagement_score": round(engagement, 1),
        "productivity_score": round(productivity, 1),
        "resource_sustainability_score": round(sustainability, 1),
        "companion_growth_score": round(companion_growth, 1),
        "computed_at": now.isoformat(),
    }
