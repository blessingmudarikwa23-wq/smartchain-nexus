from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)

from app.database import Base


class DMAIC(Base):
    __tablename__ = "dmaic"

    id = Column(Integer, primary_key=True, index=True)

    project_name = Column(String(255), nullable=False)
    define = Column(Text, nullable=False)
    measure = Column(Text, nullable=False)
    analyze = Column(Text, nullable=False)
    improve = Column(Text, nullable=False)
    control = Column(Text, nullable=False)

    improvement_percentage = Column(Float, nullable=True)

    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
class SIPOC(Base):
    __tablename__ = "sipoc"

    id = Column(Integer, primary_key=True, index=True)

    process_name = Column(String(255), nullable=False)

    suppliers = Column(Text, nullable=False)
    inputs = Column(Text, nullable=False)
    process = Column(Text, nullable=False)
    outputs = Column(Text, nullable=False)
    customers = Column(Text, nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class FishboneAnalysis(Base):
    __tablename__ = "fishbone_analysis"

    id = Column(Integer, primary_key=True, index=True)

    problem = Column(String(255), nullable=False)

    people = Column(Text, nullable=False)
    process = Column(Text, nullable=False)
    equipment = Column(Text, nullable=False)
    materials = Column(Text, nullable=False)
    environment = Column(Text, nullable=False)
    measurement = Column(Text, nullable=False)

    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
class ParetoAnalysis(Base):
    __tablename__ = "pareto_analysis"

    id = Column(Integer, primary_key=True, index=True)

    problem = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    frequency = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    cumulative_percentage = Column(Float, nullable=False)

    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
class FMEA(Base):
    __tablename__ = "fmea"

    id = Column(Integer, primary_key=True, index=True)

    process_step = Column(String(255), nullable=False)
    failure_mode = Column(String(255), nullable=False)
    effect = Column(Text, nullable=False)
    cause = Column(Text, nullable=False)

    severity = Column(Integer, nullable=False)
    occurrence = Column(Integer, nullable=False)
    detection = Column(Integer, nullable=False)

    rpn = Column(Integer, nullable=False)

    recommended_action = Column(Text, nullable=False)

    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
class ControlChart(Base):
    __tablename__ = "control_charts"

    id = Column(Integer, primary_key=True, index=True)

    process_name = Column(String(255), nullable=False)
    measurement = Column(Float, nullable=False)

    mean = Column(Float, nullable=False)
    upper_control_limit = Column(Float, nullable=False)
    lower_control_limit = Column(Float, nullable=False)

    status = Column(String(50), nullable=False, default="Active")

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
class RootCauseAnalysis(Base):
    __tablename__ = "root_cause_analysis"

    id = Column(Integer, primary_key=True, index=True)

    issue = Column(String(255), nullable=False)
    root_cause = Column(Text, nullable=False)
    analysis = Column(Text, nullable=False)
    corrective_action = Column(Text, nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )