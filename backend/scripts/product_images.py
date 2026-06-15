"""Product image URLs — keyword-matched LoremFlickr + placehold.co fallback."""

from __future__ import annotations

import hashlib
import re

_VARIANT_PREFIXES = (
    "basic", "pro", "premium", "student", "compact", "wireless", "portable", "eco",
)

_KEYWORD_TAGS: list[tuple[str, str]] = [
    ("scientific calculator", "calculator,math"),
    ("calculator", "calculator,math"),
    ("study lamp", "lamp,desk"),
    ("clip light", "lamp,desk"),
    ("ring light", "lamp,studio"),
    ("power bank", "battery,charger"),
    ("portable charger", "battery,charger"),
    ("lipo battery", "battery,charger"),
    ("usb hub", "usb,technology"),
    ("extension board", "cable,electronics"),
    ("power strip", "cable,electronics"),
    ("hdmi cable", "cable,electronics"),
    ("jumper wire", "electronics,circuit"),
    ("breadboard", "electronics,circuit"),
    ("arduino", "arduino,electronics"),
    ("raspberry pi", "raspberry,electronics"),
    ("multimeter", "electronics,tools"),
    ("sensor", "sensor,robotics"),
    ("servo motor", "motor,robotics"),
    ("motor driver", "motor,robotics"),
    ("webcam", "webcam,camera"),
    ("webcam cover", "webcam,camera"),
    ("headphone", "headphones,audio"),
    ("headset", "headphones,audio"),
    ("microphone", "microphone,audio"),
    ("mechanical keyboard", "keyboard,mechanical"),
    ("keyboard", "keyboard,computer"),
    ("wireless mouse", "mouse,computer"),
    ("gaming mouse", "mouse,gaming"),
    ("mouse pad", "mousepad,gaming"),
    ("laptop stand", "laptop,desk"),
    ("laptop cooling", "laptop,cooler"),
    ("portable monitor", "monitor,screen"),
    ("drawing tablet", "tablet,digital"),
    ("notebook set", "notebook,stationery"),
    ("notebook", "notebook,stationery"),
    ("lab notebook", "notebook,laboratory"),
    ("graph paper", "paper,stationery"),
    ("whiteboard marker", "marker,stationery"),
    ("sticky notes", "notes,stationery"),
    ("highlighter", "marker,stationery"),
    ("pen set", "pen,stationery"),
    ("stapler", "office,stationery"),
    ("binder clip", "office,stationery"),
    ("file folder", "folder,office"),
    ("backpack", "backpack,bag"),
    ("handbag", "handbag,bag"),
    ("camera bag", "camera,bag"),
    ("water bottle", "bottle,water"),
    ("protein shaker", "shaker,fitness"),
    ("resistance band", "fitness,exercise"),
    ("gym glove", "gym,fitness"),
    ("yoga mat", "yoga,fitness"),
    ("jump rope", "fitness,exercise"),
    ("dumbbell", "dumbbell,gym"),
    ("running shoe", "shoes,running"),
    ("sneaker", "shoes,sneakers"),
    ("formal blazer", "blazer,suit"),
    ("blazer", "blazer,suit"),
    ("hoodie", "hoodie,clothing"),
    ("track pant", "pants,clothing"),
    ("denim jeans", "jeans,clothing"),
    ("dress", "dress,fashion"),
    ("saree", "saree,fashion"),
    ("watch", "watch,accessory"),
    ("sunglasses", "sunglasses,accessory"),
    ("first aid", "medicine,health"),
    ("hand sanitizer", "sanitizer,health"),
    ("face mask", "mask,health"),
    ("thermometer", "medicine,health"),
    ("bedsheet", "bedding,bedroom"),
    ("pillow", "pillow,bedroom"),
    ("bucket", "bucket,cleaning"),
    ("mug", "mug,coffee"),
    ("tiffin", "lunchbox,food"),
    ("electric kettle", "kettle,kitchen"),
    ("energy snack", "snacks,food"),
    ("energy drink", "drink,energy"),
    ("kindle", "ebook,reading"),
    ("book", "book,reading"),
    ("textbook", "book,education"),
    ("guide", "book,education"),
    ("pomodoro timer", "clock,time"),
    ("timer", "clock,time"),
    ("tripod", "tripod,camera"),
    ("green screen", "studio,film"),
    ("guitar", "guitar,music"),
    ("ukulele", "ukulele,music"),
    ("cricket bat", "cricket,sports"),
    ("badminton", "badminton,sports"),
    ("umbrella", "umbrella,rain"),
    ("plant pot", "plant,pot"),
    ("office chair", "chair,office"),
    ("study table", "desk,office"),
    ("wooden desk", "desk,office"),
    ("bookshelf", "bookshelf,furniture"),
    ("coffee table", "table,furniture"),
    ("dining table", "table,furniture"),
    ("mock interview", "interview,business"),
    ("career coaching", "coaching,business"),
    ("sleep mask", "sleep,mask"),
    ("digital pen", "pen,digital"),
    ("bundle", "shopping,products"),
    ("hub", "usb,technology"),
    ("lamp", "lamp,light"),
    ("charger", "charger,battery"),
    ("mouse", "mouse,computer"),
    ("monitor", "monitor,screen"),
    ("tablet", "tablet,device"),
    ("phone", "smartphone,mobile"),
    ("fan", "fan,cooling"),
    ("lock", "lock,security"),
    ("storage", "box,storage"),
    ("laundry", "laundry,basket"),
    ("hanger", "hanger,clothes"),
    ("cushion", "cushion,home"),
    ("mat", "mat,home"),
    ("board", "board,office"),
    ("cable", "cable,electronics"),
    ("battery", "battery,power"),
]

_CATEGORY_TAGS: dict[str, str] = {
    "electronics": "electronics,gadget",
    "academic": "book,education",
    "hostel": "hostel,room",
    "dorm essentials": "dorm,room",
    "fitness": "fitness,gym",
    "health": "medicine,health",
    "programming": "book,coding",
    "hackathon": "laptop,coding",
    "robotics": "robotics,electronics",
    "research": "research,laboratory",
    "stationery": "stationery,office",
    "travel": "travel,bag",
    "lifestyle": "home,lifestyle",
    "furniture": "furniture,home",
    "content creation": "camera,studio",
    "design": "design,art",
    "finance": "finance,money",
    "career": "career,business",
    "interview prep": "interview,business",
    "books": "book,reading",
    "subscriptions": "app,software",
    "ai tools": "computer,ai",
    "productivity": "office,productivity",
    "gaming": "gaming,computer",
    "kitchen essentials": "kitchen,cooking",
    "medical essentials": "medicine,health",
    "sports": "sports,equipment",
    "musical instruments": "music,instrument",
    "photography": "camera,photography",
    "fashion & apparel": "fashion,clothing",
}


def _strip_variants(name: str) -> str:
    lower = name.lower().strip()
    for prefix in _VARIANT_PREFIXES:
        if lower.startswith(prefix + " "):
            return name[len(prefix) + 1 :].strip().lower()
    return lower


def _hash_lock(text: str) -> int:
    h = int(hashlib.md5(text.encode()).hexdigest()[:8], 16)
    return (h % 900000) + 1000


def _resolve_tags(name: str, category: str) -> str:
    base = _strip_variants(name)
    for keyword, tags in _KEYWORD_TAGS:
        if keyword in base:
            return tags
    cat = category.lower()
    if cat in _CATEGORY_TAGS:
        return _CATEGORY_TAGS[cat]
    words = [w for w in re.sub(r"[^a-z0-9\s]", " ", base).split() if len(w) > 2]
    if len(words) >= 2:
        return f"{words[0]},{words[1]}"
    if len(words) == 1:
        return f"{words[0]},product"
    return "product,shopping"


def product_image_url(name: str, category: str, item_id: str) -> str:
    """Return a guaranteed-loadable product photo URL."""
    tags = _resolve_tags(name, category)
    lock = _hash_lock(f"{item_id}-{name}-{category}")
    return f"https://loremflickr.com/400/300/{tags}?lock={lock}"


def placeholder_image_url(name: str) -> str:
    label = name[:18].replace(" ", "+")
    return f"https://placehold.co/400x300/fff9e6/1a1c1b?text={label}"
