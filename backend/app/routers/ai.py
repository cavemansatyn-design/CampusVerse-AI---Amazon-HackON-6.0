from fastapi import APIRouter

from app.ai.groq_service import groq_service
from app.schemas import AIChatRequest

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/status")
async def ai_status():
    verify = await groq_service.verify()
    return {
        "groq_available": verify["ok"],
        "mode": "live" if verify["ok"] else "demo_fallback",
        "model": verify.get("model"),
        "error": verify.get("error") or groq_service.last_error,
    }


@router.post("/predict-needs")
async def predict_needs(context: dict):
    return await groq_service.predict_needs(context)


@router.post("/roadmap")
async def generate_roadmap(body: dict):
    goal = body.get("goal", "Learn something new")
    return await groq_service.generate_roadmap(goal, body.get("context", {}))


@router.post("/companion/chat")
async def demo_companion_chat(body: AIChatRequest):
    return await groq_service.companion_chat(body.message, "Explorer Dragon", "Student")


@router.post("/explain")
async def explain_recommendation(item_name: str, reason: str, student_name: str = "Student"):
    return await groq_service.explain_recommendation(item_name, reason, student_name)
