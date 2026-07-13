from sqlalchemy import Column, Integer, Float, String, ForeignKey

from backend.app.db.database import Base


class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Float, nullable=False)

    status = Column(String, default="Pending")