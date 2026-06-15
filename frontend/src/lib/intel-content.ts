export const INTEL_FUNCTIONS = [
  {
    id: "Summarize",
    title: "Inbox Summaries",
    items: [
      { from: "Gmail — Prof. Sharma", text: "Lab submission moved to Friday 5 PM. Attach PDF + code zip.", tag: "academic" },
      { from: "WhatsApp — Coding Club", text: "Weekly contest this Saturday. Register by Thursday.", tag: "club" },
    ],
  },
  {
    id: "Classify",
    title: "Auto Categories",
    items: [
      { from: "Notice Board", text: "Classified as PLACEMENT — Google drive registration.", tag: "placement" },
      { from: "Email — Fest Team", text: "Classified as EVENT — Tech fest volunteer slots open.", tag: "event" },
    ],
  },
  {
    id: "Prioritize",
    title: "Priority Queue",
    items: [
      { from: "Email — Amazon ML Challenge", text: "Priority HIGH — deadline in 24 hours.", tag: "competition" },
      { from: "WhatsApp — Hostel", text: "Priority LOW — water shutdown Tuesday.", tag: "hostel" },
    ],
  },
  {
    id: "Extract Deadlines",
    title: "Deadline Radar",
    items: [
      { from: "Gmail — Internship Portal", text: "Deadline extracted: 18 Jun 2026 — Microsoft SWE intern.", tag: "internship" },
      { from: "Notice — Library", text: "Deadline extracted: 12 Jun 2026 — book return.", tag: "academic" },
    ],
  },
  {
    id: "Detect Opportunities",
    title: "Opportunity Scanner",
    items: [
      { from: "Email — Research Lab", text: "Paid AI fellowship — skills match: Python, ML.", tag: "research" },
      { from: "Club — Hackathon 48", text: "Team slot open — React + UI/UX needed.", tag: "hackathon" },
    ],
  },
  {
    id: "Smart Alerts",
    title: "Smart Alerts",
    items: [
      { from: "System", text: "Alert: Your DSA streak drops if no session today.", tag: "goals" },
      { from: "System", text: "Alert: Mock interview slot with Priya opens at 4 PM.", tag: "network" },
    ],
  },
  {
    id: "Organize Study Material",
    title: "Study Material Organizer",
    items: [
      { from: "Gmail attachment", text: "Sorted: GATE notes → /Academic/GATE/", tag: "files" },
      { from: "WhatsApp PDF", text: "Sorted: Robotics workshop slides → /Clubs/Robotics/", tag: "files" },
    ],
  },
] as const;
