/**
 * Guaranteed product images — keyword-matched LoremFlickr + placehold.co fallback.
 * Unsplash IDs were removed/404; this resolver always returns a loadable URL.
 */

const VARIANT_PREFIXES = ["basic", "pro", "premium", "student", "compact", "wireless", "portable", "eco"];

/** keyword in name → loremflickr tags (comma-separated) */
const KEYWORD_TAGS: [string, string][] = [
  ["scientific calculator", "calculator,math"],
  ["calculator", "calculator,math"],
  ["study lamp", "lamp,desk"],
  ["clip light", "lamp,desk"],
  ["ring light", "lamp,studio"],
  ["power bank", "battery,charger"],
  ["portable charger", "battery,charger"],
  ["lipo battery", "battery,charger"],
  ["usb hub", "usb,technology"],
  ["extension board", "cable,electronics"],
  ["power strip", "cable,electronics"],
  ["hdmi cable", "cable,electronics"],
  ["jumper wire", "electronics,circuit"],
  ["breadboard", "electronics,circuit"],
  ["arduino", "arduino,electronics"],
  ["raspberry pi", "raspberry,electronics"],
  ["multimeter", "electronics,tools"],
  ["sensor", "sensor,robotics"],
  ["servo motor", "motor,robotics"],
  ["motor driver", "motor,robotics"],
  ["webcam", "webcam,camera"],
  ["webcam cover", "webcam,camera"],
  ["headphone", "headphones,audio"],
  ["headset", "headphones,audio"],
  ["microphone", "microphone,audio"],
  ["mechanical keyboard", "keyboard,mechanical"],
  ["keyboard", "keyboard,computer"],
  ["wireless mouse", "mouse,computer"],
  ["gaming mouse", "mouse,gaming"],
  ["mouse pad", "mousepad,gaming"],
  ["laptop stand", "laptop,desk"],
  ["laptop cooling", "laptop,cooler"],
  ["portable monitor", "monitor,screen"],
  ["drawing tablet", "tablet,digital"],
  ["notebook set", "notebook,stationery"],
  ["notebook", "notebook,stationery"],
  ["lab notebook", "notebook,laboratory"],
  ["graph paper", "paper,stationery"],
  ["whiteboard marker", "marker,stationery"],
  ["sticky notes", "notes,stationery"],
  ["highlighter", "marker,stationery"],
  ["pen set", "pen,stationery"],
  ["stapler", "office,stationery"],
  ["binder clip", "office,stationery"],
  ["file folder", "folder,office"],
  ["backpack", "backpack,bag"],
  ["handbag", "handbag,bag"],
  ["camera bag", "camera,bag"],
  ["water bottle", "bottle,water"],
  ["protein shaker", "shaker,fitness"],
  ["resistance band", "fitness,exercise"],
  ["gym glove", "gym,fitness"],
  ["yoga mat", "yoga,fitness"],
  ["jump rope", "fitness,exercise"],
  ["dumbbell", "dumbbell,gym"],
  ["running shoe", "shoes,running"],
  ["sneaker", "shoes,sneakers"],
  ["formal blazer", "blazer,suit"],
  ["blazer", "blazer,suit"],
  ["hoodie", "hoodie,clothing"],
  ["track pant", "pants,clothing"],
  ["denim jeans", "jeans,clothing"],
  ["dress", "dress,fashion"],
  ["saree", "saree,fashion"],
  ["watch", "watch,accessory"],
  ["sunglasses", "sunglasses,accessory"],
  ["first aid", "medicine,health"],
  ["hand sanitizer", "sanitizer,health"],
  ["face mask", "mask,health"],
  ["thermometer", "medicine,health"],
  ["bedsheet", "bedding,bedroom"],
  ["pillow", "pillow,bedroom"],
  ["bucket", "bucket,cleaning"],
  ["mug", "mug,coffee"],
  ["tiffin", "lunchbox,food"],
  ["electric kettle", "kettle,kitchen"],
  ["energy snack", "snacks,food"],
  ["energy drink", "drink,energy"],
  ["kindle", "ebook,reading"],
  ["book", "book,reading"],
  ["textbook", "book,education"],
  ["guide", "book,education"],
  ["pomodoro timer", "clock,time"],
  ["timer", "clock,time"],
  ["tripod", "tripod,camera"],
  ["green screen", "studio,film"],
  ["guitar", "guitar,music"],
  ["ukulele", "ukulele,music"],
  ["cricket bat", "cricket,sports"],
  ["badminton", "badminton,sports"],
  ["umbrella", "umbrella,rain"],
  ["plant pot", "plant,pot"],
  ["office chair", "chair,office"],
  ["study table", "desk,office"],
  ["wooden desk", "desk,office"],
  ["bookshelf", "bookshelf,furniture"],
  ["coffee table", "table,furniture"],
  ["dining table", "table,furniture"],
  ["mock interview", "interview,business"],
  ["career coaching", "coaching,business"],
  ["sleep mask", "sleep,mask"],
  ["digital pen", "pen,digital"],
  ["bundle", "shopping,products"],
  ["hub", "usb,technology"],
  ["lamp", "lamp,light"],
  ["charger", "charger,battery"],
  ["mouse", "mouse,computer"],
  ["monitor", "monitor,screen"],
  ["tablet", "tablet,device"],
  ["phone", "smartphone,mobile"],
  ["fan", "fan,cooling"],
  ["lock", "lock,security"],
  ["storage", "box,storage"],
  ["laundry", "laundry,basket"],
  ["hanger", "hanger,clothes"],
  ["cushion", "cushion,home"],
  ["mat", "mat,home"],
  ["board", "board,office"],
  ["cable", "cable,electronics"],
  ["battery", "battery,power"],
];

const CATEGORY_TAGS: Record<string, string> = {
  electronics: "electronics,gadget",
  academic: "book,education",
  hostel: "hostel,room",
  "dorm essentials": "dorm,room",
  fitness: "fitness,gym",
  health: "medicine,health",
  programming: "book,coding",
  hackathon: "laptop,coding",
  robotics: "robotics,electronics",
  research: "research,laboratory",
  stationery: "stationery,office",
  travel: "travel,bag",
  lifestyle: "home,lifestyle",
  furniture: "furniture,home",
  "content creation": "camera,studio",
  design: "design,art",
  finance: "finance,money",
  career: "career,business",
  "interview prep": "interview,business",
  books: "book,reading",
  subscriptions: "app,software",
  "ai tools": "computer,ai",
  productivity: "office,productivity",
  gaming: "gaming,computer",
  "kitchen essentials": "kitchen,cooking",
  "medical essentials": "medicine,health",
  sports: "sports,equipment",
  "musical instruments": "music,instrument",
  photography: "camera,photography",
  "fashion & apparel": "fashion,clothing",
};

function hashLock(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return (h % 900000) + 1000;
}

function stripVariants(name: string): string {
  let lower = name.toLowerCase().trim();
  for (const prefix of VARIANT_PREFIXES) {
    if (lower.startsWith(`${prefix} `)) {
      lower = lower.slice(prefix.length + 1);
      break;
    }
  }
  return lower;
}

function resolveTags(name: string, category = ""): string {
  const base = stripVariants(name);
  for (const [keyword, tags] of KEYWORD_TAGS) {
    if (base.includes(keyword)) return tags;
  }
  const cat = category.toLowerCase();
  if (CATEGORY_TAGS[cat]) return CATEGORY_TAGS[cat];
  const words = base.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  if (words.length >= 2) return `${words[0]},${words[1]}`;
  if (words.length === 1) return `${words[0]},product`;
  return "product,shopping";
}

/** Primary image URL — LoremFlickr keyword photos (always resolves) */
export function imgForProduct(name: string, category = "", size = 400): string {
  const tags = resolveTags(name, category);
  const lock = hashLock(`${name}-${category}`);
  const h = Math.round(size * 0.75);
  return `https://loremflickr.com/${size}/${h}/${tags}?lock=${lock}`;
}

/** Guaranteed fallback — styled placeholder with product name */
export function placeholderForProduct(name: string, size = 400): string {
  const label = encodeURIComponent(name.slice(0, 18).replace(/\s+/g, "+"));
  const h = Math.round(size * 0.75);
  return `https://placehold.co/${size}x${h}/fff9e6/1a1c1b?text=${label}`;
}

/** Full cascade: primary → placeholder (never broken) */
export function productImageUrls(name: string, category = "", size = 400): [string, string] {
  return [imgForProduct(name, category, size), placeholderForProduct(name, size)];
}

/** @deprecated use imgForProduct */
export function productImg(_photoId: string, size = 120): string {
  return imgForProduct("product", "", size);
}
