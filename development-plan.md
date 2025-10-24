# Voice-to-Trace Assistant — Comprehensive Development Plan

## Architecture Summary

**Pattern:** Modular Monolith  
**Frontend:** Angular 17.x  
**Backend:** Spring Boot (Java 17)  
**Database:** MongoDB Atlas  
**Speech API:** Google Cloud Speech-to-Text  
**Deployment:** Frontend on Vercel, Backend on Render  

**Rationale:**  
Chosen for simplicity, scalability within MVP constraints, and seamless REST communication. Allows feature-based modules within a single deployable backend service.

---

## Domain-Driven Module Structure

### Backend Modules
| Module | Purpose |
|--------|----------|
| **Auth Module** | Handles JWT-based authentication and authorization |
| **Voice Module** | Manages audio capture endpoints and integration with Speech API |
| **NLP Module** | Performs entity extraction (lot, field, action) |
| **Trace Module** | Generates JSON conforming to Trace schema and syncs via API |
| **Audit Module** | Maintains full event traceability logs |
| **Core Module** | Utilities, exception handling, DTOs, configs |

### Frontend Modules (Angular)
| Page | Function |
|------|-----------|
| **Login Page** | Authenticates Field Worker |
| **Record Page** | Capture, transcribe, and confirm trace data |
| **Records Page** | Displays history of submitted events |
| **Health Check Page** | Checks backend connectivity |

---

## Tactical Sprint Plan

### Sprint 0 – Initialization & Scaffolding
**Goal:** Establish end-to-end runnable baseline environment.  
**Duration:** 1 week

**Tasks:**
1. **Repository Setup** – Initialize GitHub repo and connect Angular + Spring Boot skeletons  
   - *User Input:* GitHub repo URL  
   - *Action:* Push initial structure  
2. **Backend Bootstrapping** – Create Spring Boot API with `/api/health` endpoint  
3. **Frontend Angular Setup** – Generate project with routing, SCSS, and `/health-check` component.  
4. **Environment Config** – Add `.env` for API URLs and MongoDB connection  
   - *User Input:* MongoDB Atlas string  
5. **Deployment Smoke Test** – Deploy initial app (Vercel + Render)  
6. **Manual Test:** User confirms “Status: ok” UI confirmation.

**Commit:**  
```
chore(sprint-0): initialize project structure and baseline setup
```

---

### Sprint 1 – Authentication & User Identity
**Goal:** Secure the app using JWT + role-based access.  
**Duration:** 1 week

**Tasks:**
1. Add User entity and repository.  
2. Implement registration and login in backend.  
3. Integrate AuthService in Angular with token persistence.  
4. Protect routes using JWT guards.  
5. Add login form UI.  
6. **Manual Test:** User confirms successful login and view restriction.

**Commit:**  
```
feat(sprint-1): implement authentication system with JWT login
```

---

### Sprint 2 – Voice Capture & Speech-to-Text Integration
**Goal:** Enable voice input capture and conversion to text.  
**Duration:** 1.5 weeks

**Tasks:**
1. Create `/record` endpoint for audio upload (Spring Boot REST).  
2. Integrate Google Speech-to-Text API for transcription.  
3. Display transcript preview on frontend.  
4. Allow manual text correction before save.  
5. **Manual Test:** User confirms <3s latency and accuracy >90%.

**Commit:**  
```
feat(sprint-2): implement voice recording and speech-to-text conversion
```

---

### Sprint 3 – NLP Parsing and Entity Detection
**Goal:** Extract semantic entities (lot, field, action) from transcribed text.  
**Duration:** 1.5 weeks

**Tasks:**
1. Design ParsedEvent model.  
2. Integrate NLP library or custom regex pipeline.  
3. Render extracted fields for review.  
4. Accept corrections and re-generate preview.  
5. **Manual Test:** User verifies correct entity parsing.

**Commit**  
```
feat(sprint-3): implement NLP entity extraction and parsing preview
```

---

### Sprint 4 – JSON Record Generation & Trace System Integration
**Goal:** Generate JSON trace object and sync to Trace API.  
**Duration:** 1 week

**Tasks:**
1. Define TraceRecord model and schema compliance validator.  
2. Create JSON generator service.  
3. Send generated record via HTTPS with token authentication.  
4. Retry mechanism on failure.  
5. **Manual Test:** Confirm JSON ingestion by Trace API.

**Commit:**  
```
feat(sprint-4): generate JSON and integrate with Trace ingestion API
```

---

### Sprint 5 – Audit Logging, QA, and Deployment Hardening
**Goal:** Complete audit logs, perform debugging, finalize deployment.  
**Duration:** 1 week

**Tasks:**
1. Add audit trail for each event (voice → text → JSON → sync).  
2. Finalize documentation and README updates.  
3. Performance optimization and error reporting.  
4. Conduct user acceptance test.  
5. **Manual Test:** Confirm full workflow success.

**Commit:**  
```
chore(sprint-5): finalize audit logging and deploy stable release
```

---

## Deployment Strategy

1. **Backend (Render):**
   - Deploy from branch per sprint (`sprint-0`, `sprint-1`, etc.).
   - Configure ENV variables:  
     - `MONGO_URI`, `JWT_SECRET`, `SPEECH_API_KEY`
2. **Frontend (Vercel):**
   - Connect to same GitHub repo.  
   - Setup Angular build (`npm run build`)  
   - Define `API_BASE_URL` in environment.ts.

---

## USER INPUT PROTOCOL

### Required Inputs (Execution Phase)
| Sprint | Input | Why Needed | Format |
|---------|--------|-------------|---------|
| 0 | GitHub Repo URL | For repo sync | `https://github.com/<user>/<repo>.git` |
| 0 | MongoDB Atlas URI | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| 2 | Speech API Key | Enable transcription | GCP key string |
| 4 | Trace API Token | Ingest data securely | `Bearer <token>` |

**Manual Testing Confirmations:**
- Each sprint includes user confirmation of feature working (functional + UI).

---

## Commit & Deployment Validation

Each sprint must:
1. Follow naming convention `sprint-{n}` branch.
2. Follow commit message format as defined.
3. Deploy via CI on both platforms.
4. User confirms via testing checklists.

---

## Sprint Tracking Summary (for status.md)

| Sprint | Feature Focus | Status | Next |
|---------|----------------|---------|------|
| Sprint 0 | Setup & Scaffolding | Pending | Init repo |
| Sprint 1 | Authentication | Pending | Secure backend |
| Sprint 2 | Voice-to-Text | Pending | Integrate API |
| Sprint 3 | NLP Parsing | Pending | Entity extraction |
| Sprint 4 | JSON & Trace Sync | Pending | API validation |
| Sprint 5 | Audit & Final QA | Pending | Go Live |

---

## Verification Checklist
- ✅ PRD alignment (feature parity verified)
- ✅ Technical stack compatibility (Angular + Spring Boot)
- ✅ Sprint deliverables cover full MVP flow
- ✅ Deployment tested per sprint
- ✅ Commit, deployment, and user interaction rules embedded

---

*Document prepared for implementation phase following tactical Agile sprints.*