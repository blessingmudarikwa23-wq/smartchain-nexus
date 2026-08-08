from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# -----------------------------
# Import ALL SQLAlchemy models
# -----------------------------
# Authentication
from app.auth.models import User

# Procurement
# from app.procurement.models import *

# Inventory
# from app.inventory.models import *

# Warehouse
# from app.warehouse.models import *

# Logistics
# from app.logistics.models import *

# Sales
# from app.sales.models import *

# Artificial Intelligence
# from app.ai.models import *

# Data Science
# from app.data_science.models import *

# Lean Six Sigma
# from app.lean_six_sigma.models import *

# Executive Intelligence
# from app.executive_intelligence.models import *