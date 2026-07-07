from sqlalchemy import Column, Integer, String, Boolean

from backend.app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)

    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    username = Column(String, unique=True, index=True, nullable=False)

    password = Column(String, nullable=False)

    is_active = Column(Boolean, default=True)