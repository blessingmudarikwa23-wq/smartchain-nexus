from app.settings.schemas import *


def get_settings_dashboard():

    return SettingsDashboard(

        profile=ProfileSettings(
            full_name="Blessing Mudarikwa",
            email="blessingmudarikwa23@gmail.com",
            role="Administrator",
        ),

        company=CompanySettings(
            company_name="SmartChain Nexus",
            industry="Supply Chain",
        ),

        users=UserManagement(
            total_users=25,
            active_users=18,
        ),

        notifications=NotificationSettings(
            email_notifications=True,
            sms_notifications=False,
        ),

        appearance=Appearance(
            theme="Dark",
            language="English",
        ),

        security=SecuritySettings(
            two_factor_auth=True,
            last_login="2026-08-03",
        ),

        backup=BackupRestore(
            last_backup="2026-08-02",
            status="Successful",
        ),

        integrations=[
            Integration(system="Power BI", status="Connected"),
            Integration(system="PostgreSQL", status="Connected"),
        ],

        audit_logs=[
            AuditLog(action="User Login", user="Blessing"),
            AuditLog(action="Purchase Order Approved", user="Blessing"),
        ],

        about=AboutSystem(
            system_name="SmartChain Nexus",
            version="1.0.0",
        ),
    )
from sqlalchemy.orm import Session

from app.settings.models import (
    ProfileSettings,
    CompanySettings,
    UserManagement,
    NotificationSettings,
    AppearanceSettings,
    SecuritySettings,
    BackupRestore,
    IntegrationSettings,
    AuditLog,
    AboutSmartChainNexus,
)

from app.settings.schemas import (
    ProfileSettingsCreate,
    ProfileSettingsUpdate,
    CompanySettingsCreate,
    CompanySettingsUpdate,
    UserManagementCreate,
    UserManagementUpdate,
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
    AppearanceSettingsCreate,
    AppearanceSettingsUpdate,
    SecuritySettingsCreate,
    SecuritySettingsUpdate,
    BackupRestoreCreate,
    BackupRestoreUpdate,
    IntegrationSettingsCreate,
    IntegrationSettingsUpdate,
    AuditLogCreate,
    AboutSmartChainNexusCreate,
    AboutSmartChainNexusUpdate,
)


# ==========================================================
# PROFILE SETTINGS
# ==========================================================

def create_profile_settings(
    payload: ProfileSettingsCreate,
    db: Session,
):
    profile = ProfileSettings(
        **payload.model_dump()
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def get_profile_settings(
    profile_id: int,
    db: Session,
):
    return (
        db.query(ProfileSettings)
        .filter(ProfileSettings.id == profile_id)
        .first()
    )


def get_profile_settings_list(
    db: Session,
):
    return (
        db.query(ProfileSettings)
        .order_by(ProfileSettings.id.desc())
        .all()
    )


def update_profile_settings(
    profile_id: int,
    payload: ProfileSettingsUpdate,
    db: Session,
):
    profile = get_profile_settings(
        profile_id,
        db,
    )

    if not profile:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile


def delete_profile_settings(
    profile_id: int,
    db: Session,
):
    profile = get_profile_settings(
        profile_id,
        db,
    )

    if not profile:
        return None

    db.delete(profile)
    db.commit()

    return profile


# ==========================================================
# COMPANY SETTINGS
# ==========================================================

def create_company_settings(
    payload: CompanySettingsCreate,
    db: Session,
):
    company = CompanySettings(
        **payload.model_dump()
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


def get_company_settings(
    company_id: int,
    db: Session,
):
    return (
        db.query(CompanySettings)
        .filter(CompanySettings.id == company_id)
        .first()
    )


def get_company_settings_list(
    db: Session,
):
    return (
        db.query(CompanySettings)
        .order_by(CompanySettings.id.desc())
        .all()
    )


def update_company_settings(
    company_id: int,
    payload: CompanySettingsUpdate,
    db: Session,
):
    company = get_company_settings(
        company_id,
        db,
    )

    if not company:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)

    return company


def delete_company_settings(
    company_id: int,
    db: Session,
):
    company = get_company_settings(
        company_id,
        db,
    )

    if not company:
        return None

    db.delete(company)
    db.commit()

    return company


# ==========================================================
# USER MANAGEMENT
# ==========================================================

def create_user_management(
    payload: UserManagementCreate,
    db: Session,
):
    user = UserManagement(
        **payload.model_dump()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_management(
    user_id: int,
    db: Session,
):
    return (
        db.query(UserManagement)
        .filter(UserManagement.id == user_id)
        .first()
    )


def get_user_management_list(
    db: Session,
):
    return (
        db.query(UserManagement)
        .order_by(UserManagement.id.desc())
        .all()
    )


def update_user_management(
    user_id: int,
    payload: UserManagementUpdate,
    db: Session,
):
    user = get_user_management(
        user_id,
        db,
    )

    if not user:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


def delete_user_management(
    user_id: int,
    db: Session,
):
    user = get_user_management(
        user_id,
        db,
    )

    if not user:
        return None

    db.delete(user)
    db.commit()

    return user


# ==========================================================
# NOTIFICATION SETTINGS
# ==========================================================

def create_notification_settings(
    payload: NotificationSettingsCreate,
    db: Session,
):
    notification = NotificationSettings(
        **payload.model_dump()
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def get_notification_settings(
    notification_id: int,
    db: Session,
):
    return (
        db.query(NotificationSettings)
        .filter(NotificationSettings.id == notification_id)
        .first()
    )


def get_notification_settings_list(
    db: Session,
):
    return (
        db.query(NotificationSettings)
        .order_by(NotificationSettings.id.desc())
        .all()
    )


def update_notification_settings(
    notification_id: int,
    payload: NotificationSettingsUpdate,
    db: Session,
):
    notification = get_notification_settings(
        notification_id,
        db,
    )

    if not notification:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(notification, field, value)

    db.commit()
    db.refresh(notification)

    return notification


def delete_notification_settings(
    notification_id: int,
    db: Session,
):
    notification = get_notification_settings(
        notification_id,
        db,
    )

    if not notification:
        return None

    db.delete(notification)
    db.commit()

    return notification


# ==========================================================
# APPEARANCE SETTINGS
# ==========================================================

def create_appearance_settings(
    payload: AppearanceSettingsCreate,
    db: Session,
):
    appearance = AppearanceSettings(
        **payload.model_dump()
    )

    db.add(appearance)
    db.commit()
    db.refresh(appearance)

    return appearance


def get_appearance_settings(
    appearance_id: int,
    db: Session,
):
    return (
        db.query(AppearanceSettings)
        .filter(AppearanceSettings.id == appearance_id)
        .first()
    )


def get_appearance_settings_list(
    db: Session,
):
    return (
        db.query(AppearanceSettings)
        .order_by(AppearanceSettings.id.desc())
        .all()
    )


def update_appearance_settings(
    appearance_id: int,
    payload: AppearanceSettingsUpdate,
    db: Session,
):
    appearance = get_appearance_settings(
        appearance_id,
        db,
    )

    if not appearance:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(appearance, field, value)

    db.commit()
    db.refresh(appearance)

    return appearance


def delete_appearance_settings(
    appearance_id: int,
    db: Session,
):
    appearance = get_appearance_settings(
        appearance_id,
        db,
    )

    if not appearance:
        return None

    db.delete(appearance)
    db.commit()

    return appearance


# ==========================================================
# SECURITY SETTINGS
# ==========================================================

def create_security_settings(
    payload: SecuritySettingsCreate,
    db: Session,
):
    security = SecuritySettings(
        **payload.model_dump()
    )

    db.add(security)
    db.commit()
    db.refresh(security)

    return security


def get_security_settings(
    security_id: int,
    db: Session,
):
    return (
        db.query(SecuritySettings)
        .filter(SecuritySettings.id == security_id)
        .first()
    )


def get_security_settings_list(
    db: Session,
):
    return (
        db.query(SecuritySettings)
        .order_by(SecuritySettings.id.desc())
        .all()
    )


def update_security_settings(
    security_id: int,
    payload: SecuritySettingsUpdate,
    db: Session,
):
    security = get_security_settings(
        security_id,
        db,
    )

    if not security:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(security, field, value)

    db.commit()
    db.refresh(security)

    return security


def delete_security_settings(
    security_id: int,
    db: Session,
):
    security = get_security_settings(
        security_id,
        db,
    )

    if not security:
        return None

    db.delete(security)
    db.commit()

    return security


# ==========================================================
# BACKUP & RESTORE
# ==========================================================

def create_backup_restore(
    payload: BackupRestoreCreate,
    db: Session,
):
    backup = BackupRestore(
        **payload.model_dump()
    )

    db.add(backup)
    db.commit()
    db.refresh(backup)

    return backup


def get_backup_restore(
    backup_id: int,
    db: Session,
):
    return (
        db.query(BackupRestore)
        .filter(BackupRestore.id == backup_id)
        .first()
    )


def get_backup_restore_list(
    db: Session,
):
    return (
        db.query(BackupRestore)
        .order_by(BackupRestore.id.desc())
        .all()
    )


def update_backup_restore(
    backup_id: int,
    payload: BackupRestoreUpdate,
    db: Session,
):
    backup = get_backup_restore(
        backup_id,
        db,
    )

    if not backup:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(backup, field, value)

    db.commit()
    db.refresh(backup)

    return backup


def delete_backup_restore(
    backup_id: int,
    db: Session,
):
    backup = get_backup_restore(
        backup_id,
        db,
    )

    if not backup:
        return None

    db.delete(backup)
    db.commit()

    return backup


# ==========================================================
# INTEGRATIONS
# ==========================================================

def create_integration_settings(
    payload: IntegrationSettingsCreate,
    db: Session,
):
    integration = IntegrationSettings(
        **payload.model_dump()
    )

    db.add(integration)
    db.commit()
    db.refresh(integration)

    return integration


def get_integration_settings(
    integration_id: int,
    db: Session,
):
    return (
        db.query(IntegrationSettings)
        .filter(IntegrationSettings.id == integration_id)
        .first()
    )


def get_integration_settings_list(
    db: Session,
):
    return (
        db.query(IntegrationSettings)
        .order_by(IntegrationSettings.id.desc())
        .all()
    )


def update_integration_settings(
    integration_id: int,
    payload: IntegrationSettingsUpdate,
    db: Session,
):
    integration = get_integration_settings(
        integration_id,
        db,
    )

    if not integration:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(integration, field, value)

    db.commit()
    db.refresh(integration)

    return integration


def delete_integration_settings(
    integration_id: int,
    db: Session,
):
    integration = get_integration_settings(
        integration_id,
        db,
    )

    if not integration:
        return None

    db.delete(integration)
    db.commit()

    return integration


# ==========================================================
# AUDIT LOGS
# ==========================================================

def create_audit_log(
    payload: AuditLogCreate,
    db: Session,
):
    audit_log = AuditLog(
        **payload.model_dump()
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log


def get_audit_log(
    audit_id: int,
    db: Session,
):
    return (
        db.query(AuditLog)
        .filter(AuditLog.id == audit_id)
        .first()
    )


def get_audit_logs(
    db: Session,
):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .all()
    )


def delete_audit_log(
    audit_id: int,
    db: Session,
):
    audit_log = get_audit_log(
        audit_id,
        db,
    )

    if not audit_log:
        return None

    db.delete(audit_log)
    db.commit()

    return audit_log


# ==========================================================
# ABOUT SMARTCHAIN NEXUS
# ==========================================================

def create_about_smartchain_nexus(
    payload: AboutSmartChainNexusCreate,
    db: Session,
):
    about = AboutSmartChainNexus(
        **payload.model_dump()
    )

    db.add(about)
    db.commit()
    db.refresh(about)

    return about


def get_about_smartchain_nexus(
    about_id: int,
    db: Session,
):
    return (
        db.query(AboutSmartChainNexus)
        .filter(AboutSmartChainNexus.id == about_id)
        .first()
    )


def get_about_smartchain_nexus_list(
    db: Session,
):
    return (
        db.query(AboutSmartChainNexus)
        .order_by(AboutSmartChainNexus.id.desc())
        .all()
    )


def update_about_smartchain_nexus(
    about_id: int,
    payload: AboutSmartChainNexusUpdate,
    db: Session,
):
    about = get_about_smartchain_nexus(
        about_id,
        db,
    )

    if not about:
        return None

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(about, field, value)

    db.commit()
    db.refresh(about)

    return about


def delete_about_smartchain_nexus(
    about_id: int,
    db: Session,
):
    about = get_about_smartchain_nexus(
        about_id,
        db,
    )

    if not about:
        return None

    db.delete(about)
    db.commit()

    return about