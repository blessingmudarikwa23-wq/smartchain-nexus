from fastapi import APIRouter

from app.settings.service import get_settings_dashboard

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get("/dashboard")
def settings_dashboard():
    return get_settings_dashboard()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.settings.schemas import (
    ProfileSettingsCreate,
    ProfileSettingsUpdate,
    ProfileSettingsResponse,
    CompanySettingsCreate,
    CompanySettingsUpdate,
    CompanySettingsResponse,
    UserManagementCreate,
    UserManagementUpdate,
    UserManagementResponse,
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
    NotificationSettingsResponse,
    AppearanceSettingsCreate,
    AppearanceSettingsUpdate,
    AppearanceSettingsResponse,
    SecuritySettingsCreate,
    SecuritySettingsUpdate,
    SecuritySettingsResponse,
    BackupRestoreCreate,
    BackupRestoreUpdate,
    BackupRestoreResponse,
    IntegrationSettingsCreate,
    IntegrationSettingsUpdate,
    IntegrationSettingsResponse,
    AuditLogCreate,
    AuditLogResponse,
    AboutSmartChainNexusCreate,
    AboutSmartChainNexusUpdate,
    AboutSmartChainNexusResponse,
)

from app.settings.service import (
    create_profile_settings,
    get_profile_settings,
    get_profile_settings_list,
    update_profile_settings,
    delete_profile_settings,
    create_company_settings,
    get_company_settings,
    get_company_settings_list,
    update_company_settings,
    delete_company_settings,
    create_user_management,
    get_user_management,
    get_user_management_list,
    update_user_management,
    delete_user_management,
    create_notification_settings,
    get_notification_settings,
    get_notification_settings_list,
    update_notification_settings,
    delete_notification_settings,
    create_appearance_settings,
    get_appearance_settings,
    get_appearance_settings_list,
    update_appearance_settings,
    delete_appearance_settings,
    create_security_settings,
    get_security_settings,
    get_security_settings_list,
    update_security_settings,
    delete_security_settings,
    create_backup_restore,
    get_backup_restore,
    get_backup_restore_list,
    update_backup_restore,
    delete_backup_restore,
    create_integration_settings,
    get_integration_settings,
    get_integration_settings_list,
    update_integration_settings,
    delete_integration_settings,
    create_audit_log,
    get_audit_log,
    get_audit_logs,
    delete_audit_log,
    create_about_smartchain_nexus,
    get_about_smartchain_nexus,
    get_about_smartchain_nexus_list,
    update_about_smartchain_nexus,
    delete_about_smartchain_nexus,
)


router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


# ==========================================================
# PROFILE SETTINGS
# ==========================================================

@router.post(
    "/profile",
    response_model=ProfileSettingsResponse,
)
def create_profile(
    payload: ProfileSettingsCreate,
    db: Session = Depends(get_db),
):
    return create_profile_settings(payload, db)


@router.get(
    "/profile/{profile_id}",
    response_model=ProfileSettingsResponse,
)
def get_profile(
    profile_id: int,
    db: Session = Depends(get_db),
):
    profile = get_profile_settings(profile_id, db)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile settings not found",
        )

    return profile


@router.get(
    "/profiles",
    response_model=list[ProfileSettingsResponse],
)
def get_profiles(
    db: Session = Depends(get_db),
):
    return get_profile_settings_list(db)


@router.put(
    "/profile/{profile_id}",
    response_model=ProfileSettingsResponse,
)
def update_profile(
    profile_id: int,
    payload: ProfileSettingsUpdate,
    db: Session = Depends(get_db),
):
    profile = update_profile_settings(
        profile_id,
        payload,
        db,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile settings not found",
        )

    return profile


@router.delete(
    "/profile/{profile_id}",
    response_model=ProfileSettingsResponse,
)
def delete_profile(
    profile_id: int,
    db: Session = Depends(get_db),
):
    profile = delete_profile_settings(
        profile_id,
        db,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile settings not found",
        )

    return profile


# ==========================================================
# COMPANY SETTINGS
# ==========================================================

@router.post(
    "/company",
    response_model=CompanySettingsResponse,
)
def create_company(
    payload: CompanySettingsCreate,
    db: Session = Depends(get_db),
):
    return create_company_settings(payload, db)


@router.get(
    "/company/{company_id}",
    response_model=CompanySettingsResponse,
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
):
    company = get_company_settings(company_id, db)

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company settings not found",
        )

    return company


@router.get(
    "/companies",
    response_model=list[CompanySettingsResponse],
)
def get_companies(
    db: Session = Depends(get_db),
):
    return get_company_settings_list(db)


@router.put(
    "/company/{company_id}",
    response_model=CompanySettingsResponse,
)
def update_company(
    company_id: int,
    payload: CompanySettingsUpdate,
    db: Session = Depends(get_db),
):
    company = update_company_settings(
        company_id,
        payload,
        db,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company settings not found",
        )

    return company


@router.delete(
    "/company/{company_id}",
    response_model=CompanySettingsResponse,
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
):
    company = delete_company_settings(
        company_id,
        db,
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company settings not found",
        )

    return company


# ==========================================================
# USER MANAGEMENT
# ==========================================================

@router.post(
    "/users",
    response_model=UserManagementResponse,
)
def create_user(
    payload: UserManagementCreate,
    db: Session = Depends(get_db),
):
    return create_user_management(payload, db)


@router.get(
    "/users/{user_id}",
    response_model=UserManagementResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = get_user_management(user_id, db)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.get(
    "/users",
    response_model=list[UserManagementResponse],
)
def get_users(
    db: Session = Depends(get_db),
):
    return get_user_management_list(db)


@router.put(
    "/users/{user_id}",
    response_model=UserManagementResponse,
)
def update_user(
    user_id: int,
    payload: UserManagementUpdate,
    db: Session = Depends(get_db),
):
    user = update_user_management(
        user_id,
        payload,
        db,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.delete(
    "/users/{user_id}",
    response_model=UserManagementResponse,
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = delete_user_management(
        user_id,
        db,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


# ==========================================================
# NOTIFICATION SETTINGS
# ==========================================================

@router.post(
    "/notifications",
    response_model=NotificationSettingsResponse,
)
def create_notifications(
    payload: NotificationSettingsCreate,
    db: Session = Depends(get_db),
):
    return create_notification_settings(payload, db)


@router.get(
    "/notifications/{notification_id}",
    response_model=NotificationSettingsResponse,
)
def get_notifications(
    notification_id: int,
    db: Session = Depends(get_db),
):
    notification = get_notification_settings(
        notification_id,
        db,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification settings not found",
        )

    return notification


@router.get(
    "/notifications",
    response_model=list[NotificationSettingsResponse],
)
def get_notification_list(
    db: Session = Depends(get_db),
):
    return get_notification_settings_list(db)


@router.put(
    "/notifications/{notification_id}",
    response_model=NotificationSettingsResponse,
)
def update_notifications(
    notification_id: int,
    payload: NotificationSettingsUpdate,
    db: Session = Depends(get_db),
):
    notification = update_notification_settings(
        notification_id,
        payload,
        db,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification settings not found",
        )

    return notification


@router.delete(
    "/notifications/{notification_id}",
    response_model=NotificationSettingsResponse,
)
def delete_notifications(
    notification_id: int,
    db: Session = Depends(get_db),
):
    notification = delete_notification_settings(
        notification_id,
        db,
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification settings not found",
        )

    return notification


# ==========================================================
# APPEARANCE SETTINGS
# ==========================================================

@router.post(
    "/appearance",
    response_model=AppearanceSettingsResponse,
)
def create_appearance(
    payload: AppearanceSettingsCreate,
    db: Session = Depends(get_db),
):
    return create_appearance_settings(payload, db)


@router.get(
    "/appearance/{appearance_id}",
    response_model=AppearanceSettingsResponse,
)
def get_appearance(
    appearance_id: int,
    db: Session = Depends(get_db),
):
    appearance = get_appearance_settings(
        appearance_id,
        db,
    )

    if not appearance:
        raise HTTPException(
            status_code=404,
            detail="Appearance settings not found",
        )

    return appearance


@router.get(
    "/appearances",
    response_model=list[AppearanceSettingsResponse],
)
def get_appearances(
    db: Session = Depends(get_db),
):
    return get_appearance_settings_list(db)


@router.put(
    "/appearance/{appearance_id}",
    response_model=AppearanceSettingsResponse,
)
def update_appearance(
    appearance_id: int,
    payload: AppearanceSettingsUpdate,
    db: Session = Depends(get_db),
):
    appearance = update_appearance_settings(
        appearance_id,
        payload,
        db,
    )

    if not appearance:
        raise HTTPException(
            status_code=404,
            detail="Appearance settings not found",
        )

    return appearance


@router.delete(
    "/appearance/{appearance_id}",
    response_model=AppearanceSettingsResponse,
)
def delete_appearance(
    appearance_id: int,
    db: Session = Depends(get_db),
):
    appearance = delete_appearance_settings(
        appearance_id,
        db,
    )

    if not appearance:
        raise HTTPException(
            status_code=404,
            detail="Appearance settings not found",
        )

    return appearance


# ==========================================================
# SECURITY SETTINGS
# ==========================================================

@router.post(
    "/security",
    response_model=SecuritySettingsResponse,
)
def create_security(
    payload: SecuritySettingsCreate,
    db: Session = Depends(get_db),
):
    return create_security_settings(payload, db)


@router.get(
    "/security/{security_id}",
    response_model=SecuritySettingsResponse,
)
def get_security(
    security_id: int,
    db: Session = Depends(get_db),
):
    security = get_security_settings(
        security_id,
        db,
    )

    if not security:
        raise HTTPException(
            status_code=404,
            detail="Security settings not found",
        )

    return security


@router.get(
    "/securities",
    response_model=list[SecuritySettingsResponse],
)
def get_securities(
    db: Session = Depends(get_db),
):
    return get_security_settings_list(db)


@router.put(
    "/security/{security_id}",
    response_model=SecuritySettingsResponse,
)
def update_security(
    security_id: int,
    payload: SecuritySettingsUpdate,
    db: Session = Depends(get_db),
):
    security = update_security_settings(
        security_id,
        payload,
        db,
    )

    if not security:
        raise HTTPException(
            status_code=404,
            detail="Security settings not found",
        )

    return security


@router.delete(
    "/security/{security_id}",
    response_model=SecuritySettingsResponse,
)
def delete_security(
    security_id: int,
    db: Session = Depends(get_db),
):
    security = delete_security_settings(
        security_id,
        db,
    )

    if not security:
        raise HTTPException(
            status_code=404,
            detail="Security settings not found",
        )

    return security


# ==========================================================
# BACKUP & RESTORE
# ==========================================================

@router.post(
    "/backup",
    response_model=BackupRestoreResponse,
)
def create_backup(
    payload: BackupRestoreCreate,
    db: Session = Depends(get_db),
):
    return create_backup_restore(payload, db)


@router.get(
    "/backup/{backup_id}",
    response_model=BackupRestoreResponse,
)
def get_backup(
    backup_id: int,
    db: Session = Depends(get_db),
):
    backup = get_backup_restore(
        backup_id,
        db,
    )

    if not backup:
        raise HTTPException(
            status_code=404,
            detail="Backup not found",
        )

    return backup


@router.get(
    "/backups",
    response_model=list[BackupRestoreResponse],
)
def get_backups(
    db: Session = Depends(get_db),
):
    return get_backup_restore_list(db)


@router.put(
    "/backup/{backup_id}",
    response_model=BackupRestoreResponse,
)
def update_backup(
    backup_id: int,
    payload: BackupRestoreUpdate,
    db: Session = Depends(get_db),
):
    backup = update_backup_restore(
        backup_id,
        payload,
        db,
    )

    if not backup:
        raise HTTPException(
            status_code=404,
            detail="Backup not found",
        )

    return backup


@router.delete(
    "/backup/{backup_id}",
    response_model=BackupRestoreResponse,
)
def delete_backup(
    backup_id: int,
    db: Session = Depends(get_db),
):
    backup = delete_backup_restore(
        backup_id,
        db,
    )

    if not backup:
        raise HTTPException(
            status_code=404,
            detail="Backup not found",
        )

    return backup


# ==========================================================
# INTEGRATIONS
# ==========================================================

@router.post(
    "/integrations",
    response_model=IntegrationSettingsResponse,
)
def create_integration(
    payload: IntegrationSettingsCreate,
    db: Session = Depends(get_db),
):
    return create_integration_settings(payload, db)


@router.get(
    "/integrations/{integration_id}",
    response_model=IntegrationSettingsResponse,
)
def get_integration(
    integration_id: int,
    db: Session = Depends(get_db),
):
    integration = get_integration_settings(
        integration_id,
        db,
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found",
        )

    return integration


@router.get(
    "/integrations",
    response_model=list[IntegrationSettingsResponse],
)
def get_integrations(
    db: Session = Depends(get_db),
):
    return get_integration_settings_list(db)


@router.put(
    "/integrations/{integration_id}",
    response_model=IntegrationSettingsResponse,
)
def update_integration(
    integration_id: int,
    payload: IntegrationSettingsUpdate,
    db: Session = Depends(get_db),
):
    integration = update_integration_settings(
        integration_id,
        payload,
        db,
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found",
        )

    return integration


@router.delete(
    "/integrations/{integration_id}",
    response_model=IntegrationSettingsResponse,
)
def delete_integration(
    integration_id: int,
    db: Session = Depends(get_db),
):
    integration = delete_integration_settings(
        integration_id,
        db,
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found",
        )

    return integration


# ==========================================================
# AUDIT LOGS
# ==========================================================

@router.post(
    "/audit",
    response_model=AuditLogResponse,
)
def create_audit(
    payload: AuditLogCreate,
    db: Session = Depends(get_db),
):
    return create_audit_log(payload, db)


@router.get(
    "/audit/{audit_id}",
    response_model=AuditLogResponse,
)
def get_audit(
    audit_id: int,
    db: Session = Depends(get_db),
):
    audit_log = get_audit_log(
        audit_id,
        db,
    )

    if not audit_log:
        raise HTTPException(
            status_code=404,
            detail="Audit log not found",
        )

    return audit_log


@router.get(
    "/audit",
    response_model=list[AuditLogResponse],
)
def get_audit_list(
    db: Session = Depends(get_db),
):
    return get_audit_logs(db)


@router.delete(
    "/audit/{audit_id}",
    response_model=AuditLogResponse,
)
def delete_audit(
    audit_id: int,
    db: Session = Depends(get_db),
):
    audit_log = delete_audit_log(
        audit_id,
        db,
    )

    if not audit_log:
        raise HTTPException(
            status_code=404,
            detail="Audit log not found",
        )

    return audit_log


# ==========================================================
# ABOUT SMARTCHAIN NEXUS
# ==========================================================

@router.post(
    "/about",
    response_model=AboutSmartChainNexusResponse,
)
def create_about(
    payload: AboutSmartChainNexusCreate,
    db: Session = Depends(get_db),
):
    return create_about_smartchain_nexus(
        payload,
        db,
    )


@router.get(
    "/about/{about_id}",
    response_model=AboutSmartChainNexusResponse,
)
def get_about(
    about_id: int,
    db: Session = Depends(get_db),
):
    about = get_about_smartchain_nexus(
        about_id,
        db,
    )

    if not about:
        raise HTTPException(
            status_code=404,
            detail="About SmartChain Nexus record not found",
        )

    return about


@router.get(
    "/about",
    response_model=list[AboutSmartChainNexusResponse],
)
def get_about_list(
    db: Session = Depends(get_db),
):
    return get_about_smartchain_nexus_list(db)


@router.put(
    "/about/{about_id}",
    response_model=AboutSmartChainNexusResponse,
)
def update_about(
    about_id: int,
    payload: AboutSmartChainNexusUpdate,
    db: Session = Depends(get_db),
):
    about = update_about_smartchain_nexus(
        about_id,
        payload,
        db,
    )

    if not about:
        raise HTTPException(
            status_code=404,
            detail="About SmartChain Nexus record not found",
        )

    return about


@router.delete(
    "/about/{about_id}",
    response_model=AboutSmartChainNexusResponse,
)
def delete_about(
    about_id: int,
    db: Session = Depends(get_db),
):
    about = delete_about_smartchain_nexus(
        about_id,
        db,
    )

    if not about:
        raise HTTPException(
            status_code=404,
            detail="About SmartChain Nexus record not found",
        )

    return about