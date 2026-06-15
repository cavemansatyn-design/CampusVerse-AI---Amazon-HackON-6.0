from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai.groq_service import groq_service
from app.config import settings
from app.database import Base, engine
from app.routers import ai, dashboard, intelligence, network, planner, students

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    groq = await groq_service.verify()
    if groq["ok"]:
        logger.info("Groq AI live (%s)", groq.get("model"))
    else:
        logger.warning("Groq AI in demo fallback mode: %s", groq.get("error"))
    yield


app = FastAPI(
    title="CampusVerse AI",
    description="The AI Operating System for Student Life",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(intelligence.router, prefix="/api/v1")
app.include_router(network.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": "CampusVerse AI",
        "tagline": "The AI Operating System for Student Life",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
