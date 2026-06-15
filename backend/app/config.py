from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent.parent

# backend/.env wins over stale Windows/user GROQ_API_KEY env vars
load_dotenv(_BACKEND_DIR / ".env", override=True)

# asyncpg does not accept libpq params like sslmode in the URL query string
_STRIP_QUERY_PARAMS = ("sslmode", "ssl", "channel_binding")


class Settings(BaseSettings):
    # Local Docker Postgres (default) OR Neon connection string — see backend/.env
    database_url: str = "postgresql+asyncpg://campusverse:campusverse@localhost:5432/campusverse"
    database_ssl: bool | None = None  # auto-detect for Neon; set true/false to override

    redis_url: str = "redis://localhost:6379/0"
    groq_api_key: str = ""
    cors_origins: str = "http://localhost:3000"
    demo_mode: bool = True

    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("groq_api_key", mode="before")
    @classmethod
    def strip_groq_key(cls, value: str | None) -> str:
        return (value or "").strip()

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def async_database_url(self) -> str:
        """Normalize Neon/local URLs for SQLAlchemy asyncpg driver."""
        url = self.database_url.strip()
        if url.startswith("postgres://"):
            url = "postgresql+asyncpg://" + url[len("postgres://") :]
        elif url.startswith("postgresql://"):
            url = "postgresql+asyncpg://" + url[len("postgresql://") :]
        elif url.startswith("postgresql+psycopg2://"):
            url = "postgresql+asyncpg://" + url[len("postgresql+psycopg2://") :]

        parsed = urlparse(url)
        if not parsed.query:
            return url

        query = parse_qs(parsed.query, keep_blank_values=True)
        for key in _STRIP_QUERY_PARAMS:
            query.pop(key, None)
        clean_query = urlencode({k: v[0] for k, v in query.items()}, doseq=False)
        return urlunparse(parsed._replace(query=clean_query))

    @property
    def use_database_ssl(self) -> bool:
        if self.database_ssl is not None:
            return self.database_ssl
        url = self.database_url.lower()
        return (
            "neon.tech" in url
            or "sslmode=require" in url
            or "ssl=require" in url
            or "channel_binding=require" in url
        )


settings = Settings()
