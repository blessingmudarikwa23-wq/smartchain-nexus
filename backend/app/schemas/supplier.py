from pydantic import BaseModel


class SupplierCreate(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: str
    address: str


class SupplierResponse(BaseModel):
    id: int
    company_name: str
    contact_person: str
    email: str
    phone: str
    address: str

    class Config:
        from_attributes = True