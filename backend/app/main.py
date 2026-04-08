from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, users, search, summary, blogs

app = FastAPI(title="KVIS Connect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(summary.router, prefix="/api")
app.include_router(blogs.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
