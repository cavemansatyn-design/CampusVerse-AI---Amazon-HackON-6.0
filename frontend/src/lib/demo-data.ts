/** Demo fallback data when backend is offline — hackathon-ready */

export const DEMO_SCENARIOS = [
  { id: "first_year", name: "First-Year Student", description: "New CS freshman navigating DSA and campus life", student_name: "Aarav Sharma", highlight: "DSA Dragon evolution + study buddy matching" },
  { id: "placement", name: "Placement Aspirant", description: "Final year student prepping for Google/Microsoft", student_name: "Priya Patel", highlight: "Mock interviews + career recommendations" },
  { id: "hackathon", name: "Hackathon Participant", description: "Electronics junior gearing up for 48-hour hackathon", student_name: "Rohan Mehta", highlight: "Power bank, USB hub, energy snacks predicted" },
  { id: "hostel_fresher", name: "Hostel Fresher", description: "First-year biotech student settling into hostel", student_name: "Sneha Reddy", highlight: "Dorm essentials + roommate resource sharing" },
  { id: "research", name: "Research Enthusiast", description: "CS junior pursuing ML research and publications", student_name: "Arjun Iyer", highlight: "Research tools + mentorship matching" },
];

export const DEMO_DASHBOARD = {
  first_year: {
    greeting: "Good Morning, Aarav.",
    student: { id: "demo-1", name: "Aarav Sharma", email: "aarav.sharma@campus.edu", age: 18, gender: "Male", department: "Computer Science", year: "First Year", semester: 1, hostel_status: "hostel", interests: ["DSA", "Web Development", "Gaming"], skills: ["Python", "C++"], goals_text: ["Learn DSA", "Improve CGPA"], budget: 8000, personality_type: "INTJ", is_demo: true, demo_scenario: "first_year" },
    companions: [{ id: "c1", name: "DSA Dragon", creature_type: "DSA Dragon", happiness: 82, level: 3, xp: 450, streak: 12, evolution_stage: "Explorer", consistency_score: 0.75 }],
    goals: [{ id: "g1", title: "Learn DSA", category: "Learn", status: "active", progress: 45, roadmap: { phases: ["Arrays", "Trees", "Graphs"] } }, { id: "g2", title: "Improve CGPA", category: "Improve", status: "active", progress: 30, roadmap: null }],
    recommendations: [
      { id: "r1", catalog_item_id: "cat-001", acquisition_type: "borrow", score: 0.92, reason: "Essential for DSA practice — borrow from a senior nearby.", context: "general", priority: 1, item_name: "DSA Book", item_category: "Programming", cost: 0 },
      { id: "r2", catalog_item_id: "cat-002", acquisition_type: "borrow", score: 0.88, reason: "Hackathon approaching — Scientific Calculator will boost your sessions.", context: "hackathon_prep", priority: 1, item_name: "Scientific Calculator", item_category: "Academic", cost: 0 },
      { id: "r3", catalog_item_id: "cat-003", acquisition_type: "rent", score: 0.85, reason: "New hostel student — Extension Board fits your dorm setup.", context: "hostel_fresher", priority: 2, item_name: "Extension Board", item_category: "Dorm Essentials", cost: 50 },
    ],
    announcements: [
      { id: "a1", title: "Amazon ML Challenge 2026", content: "Registrations close tomorrow!", source: "email", category: "competition", priority: "high", summary: "ML competition with internship prizes", tags: ["ML", "Amazon"], deadline: new Date(Date.now() + 86400000).toISOString() },
      { id: "a2", title: "Hackathon 48 - Registrations Open", content: "48-hour hackathon next weekend.", source: "email", category: "hackathon", priority: "high", summary: null, tags: ["Hackathon"], deadline: null },
    ],
    opportunities_count: 12,
    analytics: { student_success_score: 72.5, goal_completion_score: 37.5, campus_engagement_score: 65, productivity_score: 58, resource_sustainability_score: 72, companion_growth_score: 45 },
    insights: ["Your DSA Dragon evolved to Explorer!", "12 opportunities match your goals.", "Amazon ML Challenge 2026 — check deadline!", "Rahul wants a mock interview.", "A hostel roommate nearby is lending a calculator."],
  },
  placement: {
    greeting: "Good Afternoon, Priya.",
    student: { id: "demo-2", name: "Priya Patel", email: "priya.patel@campus.edu", age: 22, gender: "Female", department: "Computer Science", year: "Fourth Year", semester: 7, hostel_status: "day_scholar", interests: ["ML", "Web Development", "Startups"], skills: ["Python", "React", "ML"], goals_text: ["Get Internship", "Build Portfolio"], budget: 12000, personality_type: "ENTP", is_demo: true, demo_scenario: "placement" },
    companions: [{ id: "c2", name: "Career Dragon", creature_type: "Career Dragon", happiness: 90, level: 4, xp: 780, streak: 21, evolution_stage: "Master", consistency_score: 0.88 }],
    goals: [{ id: "g3", title: "Get Internship", category: "Get", status: "active", progress: 65, roadmap: null }, { id: "g4", title: "Build Portfolio", category: "Build", status: "active", progress: 55, roadmap: null }],
    recommendations: [
      { id: "r4", catalog_item_id: "cat-010", acquisition_type: "borrow", score: 0.95, reason: "Placement season — Mock Interview Session strengthens your prep.", context: "placement_season", priority: 1, item_name: "Mock Interview Session", item_category: "Interview Prep", cost: 0 },
      { id: "r5", catalog_item_id: "cat-011", acquisition_type: "used", score: 0.89, reason: "Career prep — System Design Book within your budget.", context: "placement_season", priority: 4, item_name: "System Design Book", item_category: "Interview Prep", cost: 350 },
    ],
    announcements: [{ id: "a3", title: "Placement Drive - Google", content: "CGPA cutoff 7.5. Register by Wednesday.", source: "notice", category: "placement", priority: "high", summary: null, tags: ["Google"], deadline: new Date(Date.now() + 259200000).toISOString() }],
    opportunities_count: 18,
    analytics: { student_success_score: 81.2, goal_completion_score: 60, campus_engagement_score: 78, productivity_score: 75, resource_sustainability_score: 72, companion_growth_score: 68 },
    insights: ["Your Career Dragon evolved to Master!", "18 opportunities match your goals.", "Google placement drive — register by Wednesday!", "3 peers available for mock interviews."],
  },
  hackathon: {
    greeting: "Good Evening, Rohan.",
    student: { id: "demo-3", name: "Rohan Mehta", email: "rohan.mehta@campus.edu", age: 20, gender: "Male", department: "Electronics", year: "Third Year", semester: 5, hostel_status: "hostel", interests: ["Competitive Programming", "Web Development", "Gaming"], skills: ["JavaScript", "React", "C++"], goals_text: ["Hackathon Prep", "Learn React"], budget: 6000, personality_type: "ISTP", is_demo: true, demo_scenario: "hackathon" },
    companions: [{ id: "c3", name: "Hackathon Dragon", creature_type: "Hackathon Dragon", happiness: 95, level: 3, xp: 520, streak: 8, evolution_stage: "Explorer", consistency_score: 0.7 }],
    goals: [{ id: "g5", title: "Hackathon Prep", category: "Hackathon", status: "active", progress: 40, roadmap: null }],
    recommendations: [
      { id: "r6", catalog_item_id: "cat-020", acquisition_type: "borrow", score: 0.96, reason: "Hackathon approaching — Power Bank will boost your build session.", context: "hackathon_prep", priority: 1, item_name: "Power Bank", item_category: "Electronics", cost: 0 },
      { id: "r7", catalog_item_id: "cat-021", acquisition_type: "borrow", score: 0.94, reason: "Essential gear — USB Hub for multi-device setup.", context: "hackathon_prep", priority: 1, item_name: "USB Hub", item_category: "Electronics", cost: 0 },
      { id: "r8", catalog_item_id: "cat-022", acquisition_type: "rent", score: 0.91, reason: "Energy Snacks to fuel your 48-hour sprint.", context: "hackathon_prep", priority: 2, item_name: "Energy Snacks", item_category: "Hackathon", cost: 30 },
    ],
    announcements: [{ id: "a4", title: "Hackathon 48", content: "Themes: AI, Sustainability, FinTech", source: "email", category: "hackathon", priority: "high", summary: null, tags: ["Hackathon"], deadline: null }],
    opportunities_count: 8,
    analytics: { student_success_score: 68, goal_completion_score: 40, campus_engagement_score: 82, productivity_score: 65, resource_sustainability_score: 80, companion_growth_score: 52 },
    insights: ["Hackathon 48 is this weekend!", "Power Bank available from hostel block C.", "Team formation: 2 React devs matched.", "Your Hackathon Dragon needs fuel — complete today's tasks!"],
  },
  hostel_fresher: {
    greeting: "Good Morning, Sneha.",
    student: { id: "demo-4", name: "Sneha Reddy", email: "sneha.reddy@campus.edu", age: 18, gender: "Female", department: "Biotech", year: "First Year", semester: 1, hostel_status: "hostel", interests: ["Fitness", "Research", "Music"], skills: ["Biology", "Excel"], goals_text: ["Improve CGPA", "Gym Transformation"], budget: 5000, personality_type: "ESFJ", is_demo: true, demo_scenario: "hostel_fresher" },
    companions: [{ id: "c4", name: "Fitness Dragon", creature_type: "Fitness Dragon", happiness: 78, level: 2, xp: 200, streak: 5, evolution_stage: "Baby", consistency_score: 0.6 }],
    goals: [{ id: "g6", title: "Gym Transformation", category: "Gym", status: "active", progress: 20, roadmap: null }],
    recommendations: [
      { id: "r9", catalog_item_id: "cat-030", acquisition_type: "borrow", score: 0.97, reason: "New hostel student — Bucket fits your dorm setup.", context: "hostel_fresher", priority: 1, item_name: "Bucket", item_category: "Hostel", cost: 0 },
      { id: "r10", catalog_item_id: "cat-031", acquisition_type: "borrow", score: 0.95, reason: "Essential — Bedsheet from senior in Block A.", context: "hostel_fresher", priority: 1, item_name: "Bedsheet", item_category: "Hostel", cost: 0 },
      { id: "r11", catalog_item_id: "cat-032", acquisition_type: "rent", score: 0.88, reason: "Active fitness goal — Resistance Bands help your transformation.", context: "fitness_goal", priority: 2, item_name: "Resistance Bands", item_category: "Fitness", cost: 40 },
    ],
    announcements: [{ id: "a5", title: "Hostel Block B Water Shutdown", content: "Tuesday 9 AM - 2 PM", source: "whatsapp", category: "notice", priority: "low", summary: null, tags: ["Hostel"], deadline: null }],
    opportunities_count: 5,
    analytics: { student_success_score: 55, goal_completion_score: 25, campus_engagement_score: 45, productivity_score: 40, resource_sustainability_score: 85, companion_growth_score: 30 },
    insights: ["Welcome to hostel life!", "Roommate in Block B has a spare bucket.", "Fitness Club meeting tomorrow.", "Your Fitness Dragon is still an Egg — start your streak!"],
  },
  research: {
    greeting: "Good Afternoon, Arjun.",
    student: { id: "demo-5", name: "Arjun Iyer", email: "arjun.iyer@campus.edu", age: 21, gender: "Male", department: "Computer Science", year: "Third Year", semester: 5, hostel_status: "day_scholar", interests: ["ML", "Research", "AI"], skills: ["Python", "Machine Learning", "TensorFlow"], goals_text: ["Learn ML", "Build Portfolio"], budget: 15000, personality_type: "INTJ", is_demo: true, demo_scenario: "research" },
    companions: [{ id: "c5", name: "Research Dragon", creature_type: "Research Dragon", happiness: 88, level: 4, xp: 650, streak: 15, evolution_stage: "Master", consistency_score: 0.82 }],
    goals: [{ id: "g7", title: "Learn ML", category: "Learn", status: "active", progress: 55, roadmap: null }],
    recommendations: [
      { id: "r12", catalog_item_id: "cat-040", acquisition_type: "borrow", score: 0.93, reason: "Research focus — Mendeley Premium supports your academic work.", context: "research_goal", priority: 1, item_name: "Mendeley Premium", item_category: "Research", cost: 0 },
      { id: "r13", catalog_item_id: "cat-041", acquisition_type: "used", score: 0.90, reason: "Research tools — Kindle within budget.", context: "research_goal", priority: 4, item_name: "Kindle", item_category: "Research", cost: 4500 },
    ],
    announcements: [{ id: "a6", title: "Research Fellowship", content: "Paid AI/ML lab fellowship open", source: "email", category: "research", priority: "high", summary: null, tags: ["Research", "AI"], deadline: null }],
    opportunities_count: 10,
    analytics: { student_success_score: 76, goal_completion_score: 55, campus_engagement_score: 70, productivity_score: 72, resource_sustainability_score: 74, companion_growth_score: 62 },
    insights: ["Research fellowship applications open!", "Senior mentor matched in AI Lab.", "Your Research Dragon reached Master stage!", "3 papers recommended based on your ML goal."],
  },
};

export type DashboardData = (typeof DEMO_DASHBOARD)[keyof typeof DEMO_DASHBOARD];

export function getDemoDashboard(scenarioId: string): DashboardData {
  return DEMO_DASHBOARD[scenarioId as keyof typeof DEMO_DASHBOARD] || DEMO_DASHBOARD.first_year;
}
