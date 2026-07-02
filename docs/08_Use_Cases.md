# 🎯 SmartChain Nexus™ Use Case Specification

> **Document Version:** 1.0.0  
> **Project:** SmartChain Nexus™  
> **Author:** Blessing Mudarikwa  
> **Status:** Active

---

# Executive Summary

This document describes the interactions between users and SmartChain Nexus™.

Each use case defines how actors interact with the platform to accomplish specific business objectives.

Use cases provide the bridge between business requirements and software implementation.

---

# Primary Actors

- Administrator
- Supply Chain Manager
- Procurement Manager
- Warehouse Manager
- Logistics Manager
- Executive
- Data Analyst

---

# UC-001 User Login

## Primary Actor

User

## Goal

Access the SmartChain Nexus platform securely.

## Preconditions

- User account exists.
- User is active.

## Main Flow

1. User enters email.
2. User enters password.
3. System validates credentials.
4. Dashboard loads.

## Alternative Flow

Invalid credentials.

System displays error.

---

# UC-002 Inventory Dashboard

Actor

Inventory Manager

Goal

View inventory performance.

Flow

- Open Inventory Dashboard
- View KPIs
- Filter inventory
- Export report

---

# UC-003 Supplier Analytics

Actor

Procurement Manager

Goal

Evaluate supplier performance.

Flow

- Select supplier
- View KPIs
- Compare suppliers
- Export scorecard

---

# UC-004 Demand Forecast

Actor

Supply Chain Manager

Goal

Predict future inventory demand.

Flow

- Select product
- Select forecast period
- Run model
- Display predictions

---

# UC-005 Executive Dashboard

Actor

Executive

Goal

Monitor business performance.

Flow

- Login
- View KPIs
- Drill into reports
- Export dashboard

---

# UC-006 Warehouse Analytics

Actor

Warehouse Manager

Goal

Improve warehouse efficiency.

Flow

- View utilization
- View picking metrics
- View storage utilization
- Generate report

---

# UC-007 Logistics Dashboard

Actor

Logistics Manager

Goal

Monitor deliveries.

Flow

- View delivery KPIs
- Filter shipments
- Analyse delays
- Export report

---

# UC-008 AI Recommendations

Actor

Supply Chain Manager

Goal

Receive inventory recommendations.

Flow

- Select product
- Execute prediction
- Receive reorder recommendation
- Accept or reject recommendation

---

# Use Case Traceability

| Use Case | Related User Story |
|----------|--------------------|
| UC-001 | US-001 |
| UC-002 | US-003 |
| UC-003 | US-005 |
| UC-004 | US-010 |
| UC-005 | US-012 |
| UC-006 | US-007 |
| UC-007 | US-009 |
| UC-008 | US-011 |

---

# Conclusion

The use cases provide a detailed description of user interactions and will guide UI design, backend implementation, API development, and testing throughout the SmartChain Nexus™ project.

---

> "Use cases transform business needs into software behaviour."
