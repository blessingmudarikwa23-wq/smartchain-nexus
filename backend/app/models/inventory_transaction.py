from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.app.db.database import Base


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, ForeignKey("products.id"))

    transaction_type = Column(String, nullable=False)

    quantity = Column(Integer, nullable=False)

    reason = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")