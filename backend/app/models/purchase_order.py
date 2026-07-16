from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.app.db.database import Base


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)

    supplier_id = Column(Integer, ForeignKey("suppliers.id"))

    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Integer, nullable=False)

    status = Column(String, default="Pending")

    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier")

    product = relationship("Product")