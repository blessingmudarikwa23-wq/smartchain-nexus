from pydantic import BaseModel


class ProfileSettings(BaseModel):
    full_name: str
    email: str
    role: str


class CompanySettings(BaseModel):
    company_name: str
    industry: str


class UserManagement(BaseModel):
    total_users: int
    active_users: int


class NotificationSettings(BaseModel):
    email_notifications: bool
    sms_notifications: bool


class Appearance(BaseModel):
    theme: str
    language: str


class SecuritySettings(BaseModel):
    two_factor_auth: bool
    last_login: str


class BackupRestore(BaseModel):
    last_backup: str
    status: str


class Integration(BaseModel):
    system: str
    status: str


class AuditLog(BaseModel):
    action: str
    user: str


class AboutSystem(BaseModel):
    system_name: str
    version: str


class SettingsDashboard(BaseModel):
    profile: ProfileSettings
    company: CompanySettings
    users: UserManagement
    notifications: NotificationSettings
    appearance: Appearance
    security: SecuritySettings
    backup: BackupRestore
    integrations: list[Integration]
    audit_logs: list[AuditLog]
    about: AboutSystem
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ==========================================================
# PROFILE SETTINGS
# ==========================================================

class ProfileSettingsBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    job_title: str | None = None
    department: str | None = None
    bio: str | None = None
    status: str = "Active"


class ProfileSettingsCreate(ProfileSettingsBase):
    pass


class ProfileSettingsUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    job_title: str | None = None
    department: str | None = None
    bio: str | None = None
    status: str | None = None


class ProfileSettingsResponse(ProfileSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# COMPANY SETTINGS
# ==========================================================

class CompanySettingsBase(BaseModel):
    company_name: str
    registration_number: str | None = None
    industry: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    status: str = "Active"


class CompanySettingsCreate(CompanySettingsBase):
    pass


class CompanySettingsUpdate(BaseModel):
    company_name: str | None = None
    registration_number: str | None = None
    industry: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    status: str | None = None


class CompanySettingsResponse(CompanySettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# USER MANAGEMENT
# ==========================================================

class UserManagementBase(BaseModel):
    username: str
    email: str
    role: str = "User"
    department: str | None = None
    is_active: bool = True
    last_login: datetime | None = None


class UserManagementCreate(UserManagementBase):
    pass


class UserManagementUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    role: str | None = None
    department: str | None = None
    is_active: bool | None = None
    last_login: datetime | None = None


class UserManagementResponse(UserManagementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# NOTIFICATION SETTINGS
# ==========================================================

class NotificationSettingsBase(BaseModel):
    user_id: int
    email_notifications: bool = True
    system_notifications: bool = True
    workflow_notifications: bool = True
    alert_notifications: bool = True
    weekly_summary: bool = True


class NotificationSettingsCreate(NotificationSettingsBase):
    pass


class NotificationSettingsUpdate(BaseModel):
    email_notifications: bool | None = None
    system_notifications: bool | None = None
    workflow_notifications: bool | None = None
    alert_notifications: bool | None = None
    weekly_summary: bool | None = None


class NotificationSettingsResponse(NotificationSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# APPEARANCE SETTINGS
# ==========================================================

class AppearanceSettingsBase(BaseModel):
    user_id: int
    theme: str = "Light"
    accent_color: str = "Blue"
    compact_mode: bool = False
    sidebar_collapsed: bool = False


class AppearanceSettingsCreate(AppearanceSettingsBase):
    pass


class AppearanceSettingsUpdate(BaseModel):
    theme: str | None = None
    accent_color: str | None = None
    compact_mode: bool | None = None
    sidebar_collapsed: bool | None = None


class AppearanceSettingsResponse(AppearanceSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# SECURITY SETTINGS
# ==========================================================

class SecuritySettingsBase(BaseModel):
    user_id: int
    two_factor_enabled: bool = False
    login_alerts: bool = True
    session_timeout_minutes: int = 30
    password_expiry_days: int = 90


class SecuritySettingsCreate(SecuritySettingsBase):
    pass


class SecuritySettingsUpdate(BaseModel):
    two_factor_enabled: bool | None = None
    login_alerts: bool | None = None
    session_timeout_minutes: int | None = None
    password_expiry_days: int | None = None


class SecuritySettingsResponse(SecuritySettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# BACKUP & RESTORE
# ==========================================================

class BackupRestoreBase(BaseModel):
    backup_name: str
    backup_type: str
    backup_location: str | None = None
    backup_status: str = "Completed"
    backup_date: datetime


class BackupRestoreCreate(BackupRestoreBase):
    pass


class BackupRestoreUpdate(BaseModel):
    backup_name: str | None = None
    backup_type: str | None = None
    backup_location: str | None = None
    backup_status: str | None = None
    backup_date: datetime | None = None


class BackupRestoreResponse(BackupRestoreBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# INTEGRATIONS
# ==========================================================

class IntegrationSettingsBase(BaseModel):
    integration_name: str
    integration_type: str
    endpoint: str | None = None
    is_enabled: bool = True
    description: str | None = None


class IntegrationSettingsCreate(IntegrationSettingsBase):
    pass


class IntegrationSettingsUpdate(BaseModel):
    integration_name: str | None = None
    integration_type: str | None = None
    endpoint: str | None = None
    is_enabled: bool | None = None
    description: str | None = None


class IntegrationSettingsResponse(IntegrationSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# AUDIT LOGS
# ==========================================================

class AuditLogBase(BaseModel):
    user_id: int | None = None
    username: str | None = None
    action: str
    resource: str | None = None
    description: str | None = None
    ip_address: str | None = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogResponse(AuditLogBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================================
# ABOUT SMARTCHAIN NEXUS
# ==========================================================

class AboutSmartChainNexusBase(BaseModel):
    application_name: str = "SmartChain Nexus"
    version: str = "1.0.0"
    description: str | None = None
    website: str | None = None
    support_email: str | None = None


class AboutSmartChainNexusCreate(AboutSmartChainNexusBase):
    pass


class AboutSmartChainNexusUpdate(BaseModel):
    application_name: str | None = None
    version: str | None = None
    description: str | None = None
    website: str | None = None
    support_email: str | None = None


class AboutSmartChainNexusResponse(AboutSmartChainNexusBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)