# Entity-Relationship Diagram

```mermaid
erDiagram
    DEPARTMENT ||--o{ STUDENT : has
    STUDENT ||--o{ CLUB_MEMBERSHIP : joins
    CLUB ||--o{ CLUB_MEMBERSHIP : has
    STUDENT ||--o{ GOAL : sets
    GOAL ||--o{ MILESTONE : contains
    GOAL ||--o| COMPANION : spawns
    STUDENT ||--o{ COMPANION : owns
    STUDENT ||--o{ RECOMMENDATION : receives
    CATALOG_ITEM ||--o{ RECOMMENDATION : referenced_by
    STUDENT ||--o{ FRIENDSHIP : connects
    STUDENT ||--o{ MENTORSHIP : mentors
    STUDENT ||--o{ TASK : has
    STUDENT ||--o{ CALENDAR_EVENT : schedules
    STUDENT ||--o{ RESOURCE_ITEM : owns
    RESOURCE_ITEM ||--o{ BORROW_RECORD : borrowed
    ANNOUNCEMENT ||--o{ OPPORTUNITY : generates

    STUDENT {
        uuid id PK
        string name
        string department
        string year
        string hostel_status
        array interests
        array skills
        array goals_text
        float budget
    }

    GOAL {
        uuid id PK
        uuid student_id FK
        string title
        float progress
        jsonb roadmap
    }

    COMPANION {
        uuid id PK
        string creature_type
        int level
        int xp
        string evolution_stage
        float happiness
    }

    CATALOG_ITEM {
        string id PK
        string name
        string category
        float new_cost
        bool borrowable
        float sustainability_score
    }

    RECOMMENDATION {
        uuid id PK
        uuid student_id FK
        string catalog_item_id FK
        string acquisition_type
        float score
        string reason
    }
```

## Key Relationships

- Every **Goal** spawns a **Companion** creature (DSA Dragon, Fitness Dragon, etc.)
- **Recommendations** link students to **Catalog Items** with acquisition type
- **Campus Graph** connects students via friendships and mentorships
- **Intelligence Hub** feeds opportunities into the recommendation engine
