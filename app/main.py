from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base
from backend.app.seed import seed_database
from backend.app.api import (
    auth, discovery, assets, documents, claims, chat, scam, consent, admin
)

app = FastAPI(
    title="ADHIKAAR API Engine",
    description="AI-Powered Unified Unclaimed Asset Discovery & Recovery Platform Backend",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(discovery.router, prefix="/api")
app.include_router(assets.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(claims.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(scam.router, prefix="/api")
app.include_router(consent.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

@app.get("/")
def root():
    return {
        "platform": "ADHIKAAR",
        "tagline": "Discovery. Verify. Reclaim.",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "FastAPI + SQLite",
        "entity_resolution": "active",
        "scam_shield": "active",
        "rag_copilot": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
