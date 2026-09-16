# bac-exam-platform

Bilingual Moroccan Baccalaureate exam platform (Spring Boot + Angular).

## Structure
- `backend/`  — Spring Boot 3.x (Java 21), monolith, JWT auth, H2 (dev) / PostgreSQL (prod)
- `frontend/` — Angular (standalone components, Signals, Reactive Forms)

## Local development
Backend: `cd backend && ./mvnw spring-boot:run` (uses H2, see `application-local.yml`)
Frontend: `cd frontend && npm install && npm start`

Docker (per-service):