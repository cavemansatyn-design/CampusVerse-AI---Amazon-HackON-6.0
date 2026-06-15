"""Groq AI integration for CampusVerse AI."""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are CampusVerse AI, the intelligent operating system for student life.
You help students with goals, planning, opportunities, and campus resources.
Be concise, actionable, and Gen-Z friendly. Use bullet points for roadmaps.
Always prioritize sustainability (borrow > rent > share > used > refurbished > new)."""

DEFAULT_MODEL = "llama-3.3-70b-versatile"


class GroqService:
    def __init__(self) -> None:
        self._client = None
        self._last_error: str | None = None
        self._verified = False
        self._init_client()

    def _init_client(self) -> None:
        key = settings.groq_api_key.strip()
        if not key:
            self._last_error = "GROQ_API_KEY is not set in backend/.env"
            return
        try:
            from groq import Groq

            self._client = Groq(api_key=key)
        except Exception as exc:
            logger.exception("Failed to initialize Groq client")
            self._client = None
            self._last_error = str(exc)

    @property
    def available(self) -> bool:
        return self._client is not None and self._verified

    @property
    def last_error(self) -> str | None:
        return self._last_error

    def _sanitize_error(self, exc: Exception) -> str:
        text = str(exc)
        if "invalid_api_key" in text or "Invalid API Key" in text:
            return "Invalid Groq API key - create a new key at console.groq.com and update backend/.env"
        if "model" in text.lower() and "not found" in text.lower():
            return f"Groq model unavailable: {DEFAULT_MODEL}"
        return text[:200]

    def _sync_chat(self, user_message: str, max_tokens: int) -> str:
        assert self._client is not None
        response = self._client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content or ""

    async def verify(self, force: bool = False) -> dict[str, Any]:
        """Ping Groq once to confirm the API key works."""
        if not self._client:
            return {"ok": False, "error": self._last_error or "Groq client not initialized"}
        if self._verified and not force:
            return {"ok": True, "model": DEFAULT_MODEL}

        try:
            await asyncio.to_thread(self._sync_chat, "Reply with exactly: ok", 8)
            self._verified = True
            self._last_error = None
            logger.info("Groq API verified successfully")
            return {"ok": True, "model": DEFAULT_MODEL}
        except Exception as exc:
            self._verified = False
            self._last_error = self._sanitize_error(exc)
            logger.error("Groq API verification failed: %s", self._last_error)
            return {"ok": False, "error": self._last_error}

    async def _chat(self, user_message: str, max_tokens: int = 1024) -> tuple[str, str]:
        """Returns (text, source) where source is 'groq' or 'fallback'."""
        if not self._client:
            return self._fallback_response(user_message), "fallback"

        if not self._verified:
            check = await self.verify()
            if not check["ok"]:
                return self._fallback_response(user_message), "fallback"

        try:
            text = await asyncio.to_thread(self._sync_chat, user_message, max_tokens)
            self._last_error = None
            return text, "groq"
        except Exception as exc:
            self._verified = False
            self._last_error = self._sanitize_error(exc)
            logger.error("Groq chat failed: %s", self._last_error)
            return self._fallback_response(user_message), "fallback"

    def _fallback_response(self, user_message: str) -> str:
        lower = user_message.lower()
        if "roadmap" in lower or "goal" in lower or "ml engineer" in lower:
            return json.dumps({
                "roadmap": [
                    {"phase": "Foundation", "duration": "4 weeks", "tasks": ["Python basics", "Linear algebra", "Statistics"]},
                    {"phase": "Core ML", "duration": "8 weeks", "tasks": ["Scikit-learn", "Neural networks", "TensorFlow/PyTorch"]},
                    {"phase": "Projects", "duration": "6 weeks", "tasks": ["Kaggle competition", "Portfolio project", "GitHub showcase"]},
                    {"phase": "Career", "duration": "4 weeks", "tasks": ["Resume polish", "Mock interviews", "Apply to internships"]},
                ],
                "milestones": ["Complete 3 ML projects", "Publish on GitHub", "Land ML internship"],
                "companion": "Research Dragon",
            })
        if "summarize" in lower or "announcement" in lower:
            return "Priority: HIGH. Deadline detected. Skill match: ML, Python. Action: Register before tomorrow."
        if "plan" in lower or "schedule" in lower:
            return json.dumps({
                "daily": ["9:00 AM - DSA practice", "2:00 PM - Project work", "6:00 PM - Gym"],
                "weekly": ["Mon/Wed/Fri - Classes", "Tue/Thu - Club meetings", "Sat - Hackathon prep"],
                "focus_blocks": [{"time": "10:00-11:30", "task": "Deep work on ML project"}],
            })
        if "companion" in lower or "student says" in lower:
            return (
                "I'm in demo mode right now — add a valid GROQ_API_KEY in backend/.env and restart the server. "
                "Meanwhile: keep your streak going and tackle one small goal today!"
            )
        return "I'm CampusVerse AI. Connect your Groq API key for full intelligence. Demo mode provides smart fallbacks."

    async def generate_roadmap(self, goal_text: str, student_context: dict[str, Any]) -> dict:
        prompt = f"""Generate a learning roadmap for this student goal: "{goal_text}"
Student context: {json.dumps(student_context)}
Return JSON with keys: roadmap (list of phases with tasks), milestones (list), projects (list), schedule_suggestion (string), companion_creature (string)."""
        raw, source = await self._chat(prompt)
        try:
            data = json.loads(raw)
            data["source"] = source
            if source == "fallback" and self._last_error:
                data["groq_error"] = self._last_error
            return data
        except json.JSONDecodeError:
            return {
                "roadmap": [{"phase": "Start", "tasks": [goal_text]}],
                "milestones": [f"Complete {goal_text}"],
                "projects": [],
                "schedule_suggestion": "Block 2 hours daily",
                "companion_creature": "Explorer Dragon",
                "ai_note": raw,
                "source": source,
                "groq_error": self._last_error,
            }

    async def summarize_announcement(self, content: str) -> dict:
        prompt = f"""Analyze this campus announcement and return JSON with: summary, priority (high/medium/low), category, deadline (ISO or null), opportunity_detected (bool), skills_relevant (list), action_required (string).

Announcement: {content}"""
        raw, source = await self._chat(prompt, max_tokens=512)
        try:
            data = json.loads(raw)
            data["source"] = source
            return data
        except json.JSONDecodeError:
            return {
                "summary": content[:200],
                "priority": "high" if "tomorrow" in content.lower() or "deadline" in content.lower() else "medium",
                "category": "opportunity",
                "deadline": None,
                "opportunity_detected": "challenge" in content.lower() or "internship" in content.lower(),
                "skills_relevant": [],
                "action_required": "Review and register if interested",
                "source": source,
                "groq_error": self._last_error,
            }

    async def explain_recommendation(self, item_name: str, reason: str, student_name: str) -> dict:
        prompt = f"Explain in 2 sentences why {item_name} is recommended for {student_name}. Reason: {reason}. Mention sustainability preference."
        text, source = await self._chat(prompt, max_tokens=150)
        return {"explanation": text, "source": source, "groq_error": self._last_error}

    async def companion_chat(self, message: str, companion_name: str, student_name: str) -> dict:
        prompt = f"You are {companion_name}, {student_name}'s AI companion dragon. Respond encouragingly in 2-3 sentences. Student says: {message}"
        text, source = await self._chat(prompt, max_tokens=200)
        return {"reply": text, "source": source, "groq_error": self._last_error}

    async def optimize_plan(self, tasks: list[str], events: list[str], goals: list[str]) -> dict:
        prompt = f"""Optimize this student schedule. Tasks: {tasks}. Events: {events}. Goals: {goals}.
Return JSON with: daily_plan, weekly_plan, wellness_note (burnout check), focus_sessions (list)."""
        raw, source = await self._chat(prompt)
        try:
            data = json.loads(raw)
            data["source"] = source
            return data
        except json.JSONDecodeError:
            return {
                "daily_plan": tasks[:5],
                "weekly_plan": events[:3],
                "wellness_note": "Schedule looks balanced. Take a 15-min break every 90 minutes.",
                "focus_sessions": [{"duration": 25, "task": tasks[0] if tasks else "Study"}],
                "source": source,
                "groq_error": self._last_error,
            }

    async def predict_needs(self, student_context: dict[str, Any]) -> dict:
        prompt = f"""Predict 5 items this student will need soon (proactive Amazon-style prediction).
Context: {json.dumps(student_context)}
Return JSON list of item names only."""
        raw, source = await self._chat(prompt, max_tokens=300)
        try:
            data = json.loads(raw)
            items = data if isinstance(data, list) else data.get("items", [])
            return {"items": items, "source": source, "groq_error": self._last_error}
        except json.JSONDecodeError:
            clubs = student_context.get("clubs", [])
            if "Robotics Club" in clubs:
                items = ["Arduino Kit", "Breadboard", "Servo Motors", "Jumper Wires", "Multimeter"]
            else:
                items = ["Power Bank", "Notebook", "USB Hub", "Extension Board", "Scientific Calculator"]
            return {"items": items, "source": source, "groq_error": self._last_error}


groq_service = GroqService()
