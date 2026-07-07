from fastapi import FastAPI

from backend.app.db.database import Base, engine
from backend.app.models.user import User
from backend.app.routers.user import router as user_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartChain Nexus API",
    description="AI-Powered Enterprise Supply Chain Management Platform",
    version="1.0.0",
)

# Register routers
app.include_router(user_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to SmartChain Nexus API!"
    }