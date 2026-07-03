# 🎭 SmartChain Nexus™ Use Cases

## Document Information

| Item | Details |
|------|---------|
| Project | SmartChain Nexus™ |
| Document | Use Cases |
| Version | 2.0 |
| Status | Approved |
| Author | Blessing Mudarikwa |
| Date | May 2026 |

---

# Purpose

This document defines the primary interactions between users and the SmartChain Nexus system. It describes how different actors achieve business goals through the application.

---

# Actors

| Actor | Description |
|--------|-------------|
| Administrator | Manages users, roles, and system settings |
| Procurement Officer | Creates and manages purchase orders |
| Warehouse Manager | Manages inventory and warehouse operations |
| Logistics Manager | Tracks shipments and deliveries |
| Executive | Reviews dashboards and KPIs |

---

# UC-001 — User Login

## Primary Actor

Registered User

## Goal

Access the SmartChain Nexus platform securely.

### Preconditions

- User account exists.
- User is active.

### Main Flow

1. User enters username and password.
2. System validates credentials.
3. System authenticates the user.
4. Dashboard is displayed.

### Alternative Flow

- Invalid credentials.
- Locked account.

### Postconditions

- User session is created.
- Audit log is recorded.

---

# UC-002 — Register Supplier

## Primary Actor

Procurement Officer

### Preconditions

- User is authenticated.
- User has procurement permissions.

### Main Flow

1. Open Supplier Module.
2. Select **Add Supplier**.
3. Enter supplier information.
4. Validate supplier details.
5. Save supplier record.

### Alternative Flow

- Duplicate supplier detected.
- Missing required fields.

### Postconditions

- Supplier is stored in the database.

---

# UC-003 — Create Purchase Order

## Primary Actor

Procurement Officer

### Preconditions

- Supplier exists.
- Inventory request approved.

### Main Flow

1. Select supplier.
2. Add requested items.
3. Review order.
4. Submit purchase order.
5. System assigns PO number.

### Postconditions

- Purchase order status becomes **Pending Approval**.

---

# UC-004 — Update Inventory

## Primary Actor

Warehouse Manager

### Main Flow

1. Select inventory item.
2. Update quantity.
3. Save changes.
4. System updates stock level.
5. Inventory history is recorded.

---

# UC-005 — View Executive Dashboard

## Primary Actor

Executive

### Main Flow

1. Login.
2. Open Dashboard.
3. View KPIs.
4. Filter reports.
5. Export analytics.

### Postconditions

- Reports generated successfully.

---

# Use Case Summary

| ID | Use Case | Actor |
|----|----------|-------|
| UC-001 | User Login | Registered User |
| UC-002 | Register Supplier | Procurement Officer |
| UC-003 | Create Purchase Order | Procurement Officer |
| UC-004 | Update Inventory | Warehouse Manager |
| UC-005 | View Executive Dashboard | Executive |

---

# Traceability Matrix

| Use Case | User Story | Functional Requirement |
|-----------|------------|------------------------|
| UC-001 | US-002 | FR-002 |
| UC-002 | US-003 | FR-006 |
| UC-003 | US-007 | FR-011 |
| UC-004 | US-005 | FR-017 |
| UC-005 | US-009 | FR-031 |

---

# Conclusion

These use cases define the core business interactions supported by SmartChain Nexus and provide the foundation for system architecture, database design, API development, user interface implementation, and testing.

---

**Document Owner:** Blessing Mudarikwa

**Project:** SmartChain Nexus™

**Version:** 2.0

**Status:** Approved

**Last Updated:** May 2026
