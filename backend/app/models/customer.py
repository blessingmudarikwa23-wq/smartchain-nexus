from sqlalchemy import Column, Integer, String

from backend.app.db.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String, nullable=False)

    email = Column(String, unique=True)

    phone = Column(String)

    address = Column(String)