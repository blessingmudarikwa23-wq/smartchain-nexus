from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    Date,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    supplier_code = Column(String(50), unique=True, index=True, nullable=False)

    company_name = Column(String(255), nullable=False)

    contact_person = Column(String(255), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    phone = Column(String(50), nullable=False)

    address = Column(String(255), nullable=False)

    city = Column(String(100), nullable=False)

    country = Column(String(100), nullable=False)

    tax_number = Column(String(100))

    payment_terms = Column(String(100))

    status = Column(Boolean, default=True)

    created_at = Column(DateTime, server_default=func.now())

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

    purchase_orders = relationship(
        "PurchaseOrder",
        back_populates="supplier",
    )


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)

    po_number = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.id"),
        nullable=False,
    )

    order_date = Column(Date, nullable=False)

    expected_delivery = Column(Date, nullable=False)

    status = Column(
        String(50),
        default="Pending",
    )

    total_amount = Column(
        Float,
        default=0.0,
    )

    currency = Column(
        String(20),
        default="ZAR",
    )

    notes = Column(String(500))

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

    supplier = relationship(
        "Supplier",
        back_populates="purchase_orders",
    )