"""SQLAlchemy models for CampusVerse AI."""

from app.models.user import Student, Department, Club, ClubMembership
from app.models.goal import Goal, Milestone, GoalProgress
from app.models.companion import Companion
from app.models.intelligence import Announcement, Event, Opportunity
from app.models.planner import CalendarEvent, Task, Routine, FocusSession
from app.models.network import Friendship, Mentorship, StudyGroup, StudyGroupMember, Collaboration
from app.models.resource import ResourceItem, BorrowRecord, RentalRecord, SharedAsset, ExpenseSplit
from app.models.recommendation import CatalogItem, Recommendation

__all__ = [
    "Student",
    "Department",
    "Club",
    "ClubMembership",
    "Goal",
    "Milestone",
    "GoalProgress",
    "Companion",
    "Announcement",
    "Event",
    "Opportunity",
    "CalendarEvent",
    "Task",
    "Routine",
    "FocusSession",
    "Friendship",
    "Mentorship",
    "StudyGroup",
    "StudyGroupMember",
    "Collaboration",
    "ResourceItem",
    "BorrowRecord",
    "RentalRecord",
    "SharedAsset",
    "ExpenseSplit",
    "CatalogItem",
    "Recommendation",
]
