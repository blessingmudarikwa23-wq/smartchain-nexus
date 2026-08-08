from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    Text,
    func,
)

from app.database import Base


# ==========================================================
# PROFILE SETTINGS
# ==========================================================

class ProfileSettings(Base):
    __tablename__ = "profile_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(50), nullable=True)
    job_title = Column(String(150), nullable=True)
    department = Column(String(150), nullable=True)
    bio = Column(Text, nullable=True)

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


# ==========================================================
# COMPANY SETTINGS
# ==========================================================

class CompanySettings(Base):
    __tablename__ = "company_settings"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)
    industry = Column(String(150), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)

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


# ==========================================================
# USER MANAGEMENT
# ==========================================================

class UserManagement(Base):
    __tablename__ = "user_management"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    role = Column(String(100), nullable=False, default="User")
    department = Column(String(150), nullable=True)

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    last_login = Column(DateTime, nullable=True)

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


# ==========================================================
# NOTIFICATION SETTINGS
# ==========================================================

class NotificationSettings(Base):
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    email_notifications = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    system_notifications = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    workflow_notifications = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    alert_notifications = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    weekly_summary = Column(
        Boolean,
        nullable=False,
        default=True,
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


# ==========================================================
# APPEARANCE SETTINGS
# ==========================================================

class AppearanceSettings(Base):
    __tablename__ = "appearance_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    theme = Column(
        String(50),
        nullable=False,
        default="Light",
    )

    accent_color = Column(
        String(50),
        nullable=False,
        default="Blue",
    )

    compact_mode = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    sidebar_collapsed = Column(
        Boolean,
        nullable=False,
        default=False,
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


# ==========================================================
# SECURITY SETTINGS
# ==========================================================

class SecuritySettings(Base):
    __tablename__ = "security_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    two_factor_enabled = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    login_alerts = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    session_timeout_minutes = Column(
        Integer,
        nullable=False,
        default=30,
    )

    password_expiry_days = Column(
        Integer,
        nullable=False,
        default=90,
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


# ==========================================================
# BACKUP & RESTORE
# ==========================================================

class BackupRestore(Base):
    __tablename__ = "backup_restore"

    id = Column(Integer, primary_key=True, index=True)

    backup_name = Column(String(255), nullable=False)
    backup_type = Column(String(100), nullable=False)
    backup_location = Column(String(500), nullable=True)

    backup_status = Column(
        String(50),
        nullable=False,
        default="Completed",
    )

    backup_date = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )


# ==========================================================
# INTEGRATIONS
# ==========================================================

class IntegrationSettings(Base):
    __tablename__ = "integration_settings"

    id = Column(Integer, primary_key=True, index=True)

    integration_name = Column(String(150), nullable=False)
    integration_type = Column(String(100), nullable=False)

    endpoint = Column(String(500), nullable=True)

    is_enabled = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    description = Column(Text, nullable=True)

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


# ==========================================================
# AUDIT LOGS
# ==========================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True, index=True)
    username = Column(String(100), nullable=True)

    action = Column(String(255), nullable=False)
    resource = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)

    ip_address = Column(String(100), nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )


# ==========================================================
# ABOUT SMARTCHAIN NEXUS
# ==========================================================

class AboutSmartChainNexus(Base):
    __tablename__ = "about_smartchain_nexus"

    id = Column(Integer, primary_key=True, index=True)

    application_name = Column(
        String(255),
        nullable=False,
        default="SmartChain Nexus",
    )

    version = Column(
        String(50),
        nullable=False,
        default="1.0.0",
    )

    description = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    support_email = Column(String(255), nullable=True)

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