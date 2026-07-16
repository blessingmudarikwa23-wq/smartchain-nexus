from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, default=0)

    minimum_stock = Column(Integer, default=10)

    product = relationship("Product")