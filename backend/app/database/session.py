import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()


# ==========================================================
# DATABASE CONFIGURATION
# ==========================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set.")


# ==========================================================
# DATABASE ENGINE
# ==========================================================

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
        future=True,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        future=True,
    )


# ==========================================================
# DATABASE SESSION
# ==========================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# ==========================================================
# DATABASE DEPENDENCY
# ==========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()