from sqlalchemy import Column, Integer, String, Float

from backend.app.db.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String, nullable=False)

    sku = Column(String, unique=True, index=True)

    category = Column(String)

    unit_price = Column(Float)

    quantity_in_stock = Column(Integer, default=0)