from sqlalchemy import Column, Integer, String

from backend.app.db.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String, nullable=False)

    contact_person = Column(String)

    email = Column(String, unique=True)

    phone = Column(String)

    address = Column(String)