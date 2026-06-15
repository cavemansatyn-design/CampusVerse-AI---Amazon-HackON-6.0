# CampusVerse AI — System Architecture

## Vision

CampusVerse AI is a unified intelligence layer that connects every aspect of student life — not a dashboard, but an **operating system** that understands goals, schedules, relationships, and proactively helps students succeed.

## Service Architecture

### Core Services

```
┌─────────────────────────────────────────────────────────────────┐
│                     RECOMMENDATION SERVICE                       │
│              (Central Intelligence Layer — Hybrid)             │
│  Inputs: goals, habits, schedule, events, network, resources     │
│  Output: ranked recommendations with acquisition type            │
└────────────▲────────────────────────────────────────────────────┘
             │ feeds from all services
┌────────────┴────────────────────────────────────────────────────┐
│  User Service    │  Goal Service     │  Companion Service       │
│  - 1000 students │  - roadmaps       │  - tamagotchi dragons    │
│  - 8 departments │  - milestones     │  - evolution stages      │
│  - clubs         │  - progress       │  - wellness tracking     │
├──────────────────┼───────────────────┼──────────────────────────┤
│  Intelligence    │  Planner Service  │  Network Service         │
│  Hub Service     │  - calendar       │  - friendships           │
│  - announcements │  - tasks          │  - mentorships           │
│  - events        │  - focus sessions │  - study groups          │
│  - opportunities │  - routines       │  - collaborations        │
├──────────────────┴───────────────────┴──────────────────────────┤
│  Resource Service                                                  │
│  - borrow / rent / share / expense splitting                       │
└────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Student profile** + **goals** + **club activity** feed the recommendation engine
2. **Intelligence Hub** ingests announcements → AI extracts deadlines/opportunities → creates recommendations
3. **Companion** tracks consistency → wellness engine adjusts planner
4. **Network graph** enables peer matching → resource sharing recommendations
5. **Groq AI** powers roadmaps, summaries, chat, and need prediction

## Recommendation Engine

Hybrid scoring formula:

```
score = goal_match × 0.35
      + club_match × 0.25
      + interest_match × 0.20
      + hostel_context × 0.15
      + budget_factor
      + sustainability_bonus
      + event_boost (hackathon/placement)
```

Acquisition priority: **Borrow → Rent → Share → Used → Refurbished → New**

## Synthetic Campus

| Department | Students |
|-----------|----------|
| Computer Science | 150 |
| Electronics | 120 |
| Mechanical | 140 |
| Civil | 100 |
| Electrical | 120 |
| Chemical | 90 |
| Biotech | 120 |
| MBA | 160 |

- 60% hostel / 40% day scholars
- 16 clubs, 2-5 goals per student
- Full campus graph with friendships + mentorships

## Deployment

```yaml
# docker-compose.yml
services:
  postgres:5432
  redis:6379
  backend:8000
  frontend:3000
```

## Scalability Path

- **Phase 1 (MVP)**: Monolithic FastAPI + PostgreSQL + Groq
- **Phase 2**: Service extraction, Redis caching, ChromaDB vector search
- **Phase 3**: Real-time events (Kafka), Clerk auth, mobile app
- **Phase 4**: Multi-campus federation, marketplace transactions
