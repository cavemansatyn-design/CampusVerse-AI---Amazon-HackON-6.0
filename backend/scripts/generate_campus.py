"""Synthetic campus data generator — 50 students, ~300 catalog products with matched photos."""

from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys

from faker import Faker

sys.path.insert(0, str(Path(__file__).resolve().parent))
from product_images import product_image_url

fake = Faker("en_IN")

STUDENT_COUNT = 50
CATALOG_COUNT = 300

# Scaled for 50 students (5 demo + 45 generated)
DEPARTMENTS = {
    "Computer Science": 8,
    "Electronics": 6,
    "Mechanical": 7,
    "Civil": 5,
    "Electrical": 6,
    "Chemical": 4,
    "Biotech": 6,
    "MBA": 8,
}

CLUBS = [
    "Coding Club", "Robotics Club", "Photography Club", "Dance Club", "Music Club",
    "Literary Club", "Entrepreneurship Club", "Finance Club", "AI Club", "Hackathon Club",
    "Fitness Club", "Sports Club", "Debate Club", "Open Source Club", "Research Club", "Design Club",
]

INTERESTS_POOL = [
    "AI", "ML", "Web Development", "DSA", "Competitive Programming", "Cybersecurity",
    "Fitness", "Photography", "Music", "Dance", "Finance", "Startups", "Research",
    "Public Speaking", "UI/UX", "Content Creation", "Gaming",
]

GOALS_POOL = [
    "Learn DSA", "Get Internship", "Build Portfolio", "Gym Transformation",
    "Crack GATE", "Learn React", "Build Startup", "Improve CGPA", "Learn ML", "Hackathon Prep",
]

SKILLS_POOL = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "SQL", "Git",
    "Machine Learning", "Data Structures", "Public Speaking", "Photography", "Excel",
]

PERSONALITY_TYPES = ["INTJ", "ENFP", "ISTP", "ESFJ", "ENTP", "INFJ", "ESTJ", "INFP"]
YEARS = ["First Year", "Second Year", "Third Year", "Fourth Year"]
GENDERS = ["Male", "Female", "Non-binary"]

DEMO_STUDENTS = {
    "first_year": {"name": "Aarav Sharma", "year": "First Year", "department": "Computer Science", "hostel_status": "hostel", "goals": ["Learn DSA", "Improve CGPA"], "interests": ["DSA", "Web Development", "Gaming"], "clubs": ["Coding Club", "Hackathon Club"]},
    "placement": {"name": "Priya Patel", "year": "Fourth Year", "department": "Computer Science", "hostel_status": "day_scholar", "goals": ["Get Internship", "Build Portfolio"], "interests": ["ML", "Web Development", "Startups"], "clubs": ["AI Club", "Entrepreneurship Club"]},
    "hackathon": {"name": "Rohan Mehta", "year": "Third Year", "department": "Electronics", "hostel_status": "hostel", "goals": ["Hackathon Prep", "Learn React"], "interests": ["Competitive Programming", "Web Development", "Gaming"], "clubs": ["Hackathon Club", "Coding Club", "Robotics Club"]},
    "hostel_fresher": {"name": "Sneha Reddy", "year": "First Year", "department": "Biotech", "hostel_status": "hostel", "goals": ["Improve CGPA", "Gym Transformation"], "interests": ["Fitness", "Research", "Music"], "clubs": ["Fitness Club", "Music Club"]},
    "research": {"name": "Arjun Iyer", "year": "Third Year", "department": "Computer Science", "hostel_status": "day_scholar", "goals": ["Learn ML", "Build Portfolio"], "interests": ["ML", "Research", "AI"], "clubs": ["Research Club", "AI Club", "Open Source Club"]},
}


def _pick_image(category: str, item_id: str, name: str) -> str:
    return product_image_url(name, category, item_id)


CATALOG_CATEGORIES = {
    "Electronics": ["USB Hub", "Power Bank", "Wireless Mouse", "Mechanical Keyboard", "Webcam", "Headphones", "Portable Monitor", "Laptop Stand", "Extension Board", "Arduino Uno", "Raspberry Pi", "Multimeter", "Breadboard", "Servo Motor", "Jumper Wire Kit", "HDMI Cable", "Webcam Cover"],
    "Academic": ["Engineering Mathematics", "Physics Textbook", "GATE Guide", "Notebook Set", "Scientific Calculator", "Graph Paper Pad", "Lab Manual", "Reference Book"],
    "Hostel": ["Bucket", "Mug", "Bedsheet", "Pillow", "Laundry Bag", "Hanger Set", "Storage Box", "Room Lock"],
    "Dorm Essentials": ["Study Lamp", "Door Mat", "Wall Hooks", "Mini Fan", "Clip Light", "Power Strip"],
    "Fitness": ["Protein Shaker", "Resistance Bands", "Gym Gloves", "Yoga Mat", "Jump Rope", "Dumbbells Set"],
    "Health": ["First Aid Kit", "Hand Sanitizer", "Face Mask Pack"],
    "Programming": ["DSA Book", "Clean Code", "Design Patterns", "Algorithm Guide", "Coding Interview Book"],
    "Hackathon": ["Energy Snacks", "Sticky Notes", "Whiteboard Markers", "Portable Charger", "Laptop Cooling Pad", "Energy Drink Pack"],
    "Robotics": ["Sensor Kit", "Motor Driver", "LiPo Battery", "Chassis Kit", "IR Sensor", "Ultrasonic Sensor"],
    "Research": ["Lab Notebook", "Kindle", "Reference Papers Bundle", "Digital Pen"],
    "Stationery": ["Pen Set", "Highlighter Pack", "Binder Clips", "Stapler", "File Folders"],
    "Travel": ["Backpack", "Umbrella", "Travel Adapter", "Water Bottle"],
    "Lifestyle": ["Desk Organizer", "Plant Pot", "Cushion"],
    "Content Creation": ["Ring Light", "Microphone", "Tripod", "Green Screen"],
    "Design": ["Drawing Tablet", "Sketchbook", "Color Pencils"],
    "Finance": ["Financial Planning Book", "Investment Guide"],
    "Career": ["Resume Template Pack", "LinkedIn Premium", "Career Coaching Session"],
    "Interview Prep": ["Mock Interview Session", "Aptitude Book", "System Design Book"],
    "Books": ["Atomic Habits", "Deep Work", "The Pragmatic Programmer"],
    "Subscriptions": ["Notion Pro", "GitHub Copilot", "ChatGPT Plus", "Spotify Student"],
    "AI Tools": ["Cursor Pro", "Claude Pro", "Perplexity Pro", "Midjourney"],
    "Productivity": ["Pomodoro Timer", "Task Planner", "Whiteboard"],
    "Gaming": ["Gaming Mouse", "Mechanical Keyboard", "Headset", "Mouse Pad XL"],
    "Kitchen Essentials": ["Electric Kettle", "Utensil Set", "Tiffin Box"],
    "Medical Essentials": ["Thermometer", "Bandages", "Electrolyte Pack"],
    "Sports": ["Cricket Bat", "Badminton Racket", "Running Shoes"],
    "Musical Instruments": ["Guitar", "Ukulele"],
    "Photography": ["Camera Bag", "SD Card", "Lens Cleaning Kit"],
    "Furniture": ["Study Table", "Office Chair", "Wooden Desk", "Bookshelf", "Dining Table", "Coffee Table"],
    "Fashion & Apparel": [
        "Red Dress", "Blue Dress", "Black Formal Dress", "White Shirt", "Denim Jeans",
        "Leather Jacket", "Formal Blazer", "Cotton T-Shirt", "Hoodie", "Track Pants",
        "Saree", "Kurti", "Sneakers", "Sandals", "Winter Coat", "Handbag", "Sunglasses",
        "Watch", "Gold Necklace", "Lipstick Set",
    ],
}


def generate_catalog(count_target: int = CATALOG_COUNT) -> list[dict]:
    items: list[dict] = []
    idx = 0
    variants = ["Basic", "Pro", "Premium", "Student", "Compact", "Wireless", "Portable", "Eco"]

    while len(items) < count_target:
        for category, names in CATALOG_CATEGORIES.items():
            for base_name in names:
                if len(items) >= count_target:
                    break
                variant = random.choice(variants)
                name = f"{variant} {base_name}" if random.random() > 0.35 else base_name
                item_id = f"cat-{idx:04d}"
                new_cost = round(random.uniform(99, 12000), 2)
                used = round(new_cost * random.uniform(0.35, 0.6), 2)
                refurbed = round(new_cost * random.uniform(0.55, 0.78), 2)
                borrowable = random.random() > 0.25
                rentable = random.random() > 0.35
                shared = category in ("Kitchen Essentials", "Dorm Essentials", "Hostel") and random.random() > 0.45

                tags = [category.lower(), base_name.lower().replace(" ", "-")]
                if category in ("Programming", "AI Tools", "Hackathon", "Electronics"):
                    tags.extend(["coding", "tech", "tools"])
                if category in ("Fitness", "Health", "Sports"):
                    tags.append("wellness")

                items.append({
                    "id": item_id,
                    "name": name,
                    "category": category,
                    "price": round(new_cost * 0.08, 2) if rentable else 0,
                    "sustainability_score": round(random.uniform(0.45, 0.96), 2),
                    "availability": random.choice(["available", "available", "limited"]),
                    "borrowable": borrowable,
                    "rentable": rentable,
                    "shared": shared,
                    "new_cost": new_cost,
                    "used_cost": used,
                    "refurbished_cost": refurbed,
                    "tags": tags,
                    "description": f"{name} — campus essential for {category.lower()}.",
                    "image_url": _pick_image(category, item_id, name),
                })
                idx += 1

    return items[:count_target]


def _make_student(dept_name: str, year: str, demo_key: str | None = None) -> dict:
    sid = str(uuid.uuid4())
    if demo_key and demo_key in DEMO_STUDENTS:
        d = DEMO_STUDENTS[demo_key]
        return {
            "id": sid,
            "name": d["name"],
            "email": f"{d['name'].lower().replace(' ', '.')}@campus.edu",
            "age": random.randint(18, 22) if d["year"] == "First Year" else random.randint(19, 24),
            "gender": random.choice(GENDERS),
            "department": d["department"],
            "year": d["year"],
            "semester": {"First Year": 1, "Second Year": 3, "Third Year": 5, "Fourth Year": 7}[d["year"]],
            "hostel_status": d["hostel_status"],
            "interests": d["interests"],
            "skills": random.sample(SKILLS_POOL, k=random.randint(3, 5)),
            "goals_text": d["goals"],
            "budget": round(random.uniform(2000, 15000), 2),
            "personality_type": random.choice(PERSONALITY_TYPES),
            "is_demo": True,
            "demo_scenario": demo_key,
            "clubs": d["clubs"],
        }

    hostel = "hostel" if random.random() < 0.6 else "day_scholar"
    return {
        "id": sid,
        "name": fake.name(),
        "email": fake.unique.email(),
        "age": random.randint(18, 24),
        "gender": random.choices(GENDERS, weights=[0.52, 0.45, 0.03])[0],
        "department": dept_name,
        "year": year,
        "semester": random.randint(1, 8),
        "hostel_status": hostel,
        "interests": random.sample(INTERESTS_POOL, k=random.randint(2, 4)),
        "skills": random.sample(SKILLS_POOL, k=random.randint(2, 5)),
        "goals_text": random.sample(GOALS_POOL, k=random.randint(2, 4)),
        "budget": round(random.uniform(1000, 15000), 2),
        "personality_type": random.choice(PERSONALITY_TYPES),
        "is_demo": False,
        "demo_scenario": None,
        "clubs": random.sample(CLUBS, k=random.randint(1, 3)),
    }


def generate_students(count: int = STUDENT_COUNT) -> list[dict]:
    students: list[dict] = []
    for key in DEMO_STUDENTS:
        d = DEMO_STUDENTS[key]
        students.append(_make_student(d["department"], d["year"], demo_key=key))

    remaining = count - len(students)
    dept_list: list[str] = []
    for dept, n in DEPARTMENTS.items():
        dept_list.extend([dept] * n)
    random.shuffle(dept_list)

    for dept in dept_list[:remaining]:
        students.append(_make_student(dept, random.choice(YEARS)))

    return students[:count]


def generate_campus_graph(students: list[dict]) -> dict:
    friendships = []
    mentorships = []
    id_list = [s["id"] for s in students]

    for s in students:
        pool = [i for i in id_list if i != s["id"]]
        if not pool:
            continue
        friends = random.sample(pool, k=min(random.randint(2, 5), len(pool)))
        for fid in friends:
            pair = tuple(sorted([s["id"], fid]))
            if not any(f["student_id"] == pair[0] and f["friend_id"] == pair[1] for f in friendships):
                friendships.append({"student_id": pair[0], "friend_id": pair[1], "strength": round(random.uniform(0.3, 1.0), 2)})

        if s["year"] in ("Third Year", "Fourth Year"):
            juniors = [j for j in students if j["department"] == s["department"] and j["year"] in ("First Year", "Second Year")]
            if juniors:
                mentee = random.choice(juniors)
                mentorships.append({"mentor_id": s["id"], "mentee_id": mentee["id"], "focus_area": random.choice(s.get("goals_text") or ["Career"])})

    return {"friendships": friendships[:150], "mentorships": mentorships[:25]}


def generate_intelligence_hub() -> dict:
    now = datetime.now(timezone.utc)
    announcements = [
        {"title": "Amazon ML Challenge 2026", "content": "Amazon ML Challenge registrations close tomorrow. Top teams win internships!", "source": "email", "category": "competition", "priority": "high", "deadline": (now + timedelta(days=1)).isoformat(), "tags": ["ML", "Amazon", "Hackathon"]},
        {"title": "Placement Drive - Google", "content": "Google campus placement drive on Friday. CGPA cutoff 7.5. Register by Wednesday.", "source": "notice", "category": "placement", "priority": "high", "deadline": (now + timedelta(days=3)).isoformat(), "tags": ["Placement", "Google", "Career"]},
        {"title": "Robotics Club Workshop", "content": "Arduino and sensor workshop this Saturday. Free kits for first 30 members.", "source": "club", "category": "workshop", "priority": "medium", "tags": ["Robotics", "Arduino"]},
        {"title": "Hostel Block B Water Shutdown", "content": "Water supply will be off Tuesday 9 AM - 2 PM for maintenance.", "source": "whatsapp", "category": "notice", "priority": "low", "tags": ["Hostel"]},
        {"title": "Hackathon 48 - Registrations Open", "content": "48-hour hackathon next weekend. Themes: AI, Sustainability, FinTech.", "source": "email", "category": "hackathon", "priority": "high", "deadline": (now + timedelta(days=5)).isoformat(), "tags": ["Hackathon", "AI"]},
    ]
    events = [
        {"title": "DSA Contest", "event_type": "competition", "start_time": (now + timedelta(days=2)).isoformat(), "location": "CS Lab 3", "tags": ["DSA", "Programming"]},
        {"title": "Startup Pitch Night", "event_type": "workshop", "start_time": (now + timedelta(days=4)).isoformat(), "location": "Auditorium", "tags": ["Startup", "Entrepreneurship"]},
        {"title": "Yoga Session", "event_type": "wellness", "start_time": (now + timedelta(days=1)).isoformat(), "location": "Sports Complex", "tags": ["Fitness", "Wellness"]},
    ]
    opportunities = [
        {"title": "Summer Internship - Microsoft", "description": "SWE intern roles open for CS/ECE students.", "opportunity_type": "internship", "company": "Microsoft", "skills_required": ["Python", "DSA"], "relevance_tags": ["Career", "Tech"]},
        {"title": "Research Fellowship", "description": "Paid research fellowship in AI/ML lab.", "opportunity_type": "research", "company": "Campus Lab", "skills_required": ["ML", "Python"], "relevance_tags": ["Research", "AI"]},
    ]
    return {"announcements": announcements, "events": events, "opportunities": opportunities}


def generate_all(output_dir: str | Path | None = None) -> None:
    if output_dir is None:
        output_dir = Path(__file__).resolve().parent.parent / "data"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Generating catalog ({CATALOG_COUNT} products with photos)...")
    catalog = generate_catalog(CATALOG_COUNT)
    with open(output_dir / "catalog.json", "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"Generating {STUDENT_COUNT} students...")
    students = generate_students(STUDENT_COUNT)
    with open(output_dir / "students.json", "w", encoding="utf-8") as f:
        json.dump(students, f, indent=2)

    print("Generating campus graph...")
    graph = generate_campus_graph(students)
    with open(output_dir / "campus_graph.json", "w", encoding="utf-8") as f:
        json.dump(graph, f, indent=2)

    print("Generating intelligence hub...")
    hub = generate_intelligence_hub()
    with open(output_dir / "intelligence_hub.json", "w", encoding="utf-8") as f:
        json.dump(hub, f, indent=2)

    depts = [{"name": k, "student_count": v} for k, v in DEPARTMENTS.items()]
    clubs = [{"name": c, "category": c.split()[0]} for c in CLUBS]
    with open(output_dir / "departments.json", "w", encoding="utf-8") as f:
        json.dump(depts, f, indent=2)
    with open(output_dir / "clubs.json", "w", encoding="utf-8") as f:
        json.dump(clubs, f, indent=2)

    print(f"Done! Generated {len(catalog)} products, {len(students)} students.")


if __name__ == "__main__":
    generate_all()
