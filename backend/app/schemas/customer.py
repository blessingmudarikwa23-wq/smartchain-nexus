from pydantic import BaseModel


class CustomerCreate(BaseModel):
    customer_name: str
    email: str
    phone: str
    address: str


class CustomerResponse(BaseModel):
    id: int
    customer_name: str
    email: str
    phone: str
    address: str

    class Config:
        from_attributes = True