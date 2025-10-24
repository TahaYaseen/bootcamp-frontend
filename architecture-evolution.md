# EVOLVING ARCHITECTURE — Voice-to-Trace Assistant (Java + Angular Version)

This document illustrates the progressive architecture of the **Voice-to-Trace Assistant**, rebuilt using **Java Spring Boot** for backend services and **Angular** for the frontend. Each sprint incrementally adds functional layers until full system integration.

---

## **SPRINT 0 — Project Scaffolding**

Core Setup:
- **Angular Frontend** initialization  
- **Spring Boot Backend** initialization  
- **MongoDB** database connection  
- `/health` endpoint verification  

```mermaid
graph TD
    subgraph Frontend [Angular Frontend]
    HealthPage[Health Check Component]
    end

    subgraph Backend [Spring Boot Backend]
    HealthAPI[/api/v1/health/]
    MongoDB[(MongoDB)]
    end

    HealthPage --> HealthAPI --> MongoDB
```

Deliverable: Fully deployed Angular + Spring Boot skeleton, confirming healthy connectivity and environment readiness.

---

## **SPRINT 1 — Authentication Layer**

Implements authentication and authorization using **Spring Security** and **JWT**.  
Frontend provides Angular login and registration components.

```mermaid
graph TD
    subgraph Frontend
    LoginComponent[Login & Register Component]
    end

    subgraph Backend
    AuthController[/api/v1/auth/]
    UserService[User Service]
    JWTProvider[Spring Security + JWT]
    MongoDB[(Users Collection)]
    end

    LoginComponent --> AuthController --> UserService --> MongoDB
    AuthController --> JWTProvider
```

Deliverable: Secure user authentication system with token-based sessions.

---

## **SPRINT 2 — Speech-to-Text Module**

Integrates voice recording in the Angular app and calls Spring Boot to process audio via **Google Speech-to-Text API**.

```mermaid
graph TD
    Mic[(User Microphone)]
    subgraph Frontend
    RecorderComponent[Audio Recorder Component]
    end

    subgraph Backend
    SpeechController[/api/v1/speech/convert/]
    SpeechService[Speech Handling Service]
    GoogleSTT[Google Cloud Speech-to-Text]
    MongoDB[(Audio + Transcripts)]
    end

    Mic --> RecorderComponent --> SpeechController --> SpeechService --> GoogleSTT --> MongoDB
```

Deliverable: End-to-end voice capture → text transcription workflow functional.

---

## **SPRINT 3 — NLP Parsing and JSON Generation**

Implements rule-based NLP parsing logic in Java and trace JSON builder for standard schema generation.

```mermaid
graph TD
    subgraph Frontend
    ReviewComponent[Review and Edit Parsed Output]
    end

    subgraph Backend
    NLPController[/api/v1/nlp/parse/]
    ParserService[NLP Parser Service]
    TraceBuilder[Trace JSON Builder]
    MongoDB[(Parsed Events + JSON Records)]
    end

    ReviewComponent --> NLPController --> ParserService --> TraceBuilder --> MongoDB
```

Deliverable: Entity extraction (Lot, Field, Action) and JSON record creation fully implemented.

---

## **SPRINT 4 — Trace API Integration & Auditing**

Finalizes the system by integrating with the **Trace API** and implementing audit tracking.

```mermaid
graph TD
    subgraph Frontend
    SyncComponent[Sync & Audit Status View]
    end

    subgraph Backend
    TraceController[/api/v1/trace/sync/]
    TraceService[Trace Sync Service]
    AuditService[Audit Log Service]
    ExternalTrace[Trace Management API]
    MongoDB[(Audit + Trace Records)]
    end

    SyncComponent --> TraceController --> TraceService --> ExternalTrace
    TraceService --> AuditService --> MongoDB
```

Deliverable: Full automated ingestion pipeline to Trace system with audit validation.

---

## **FULL SYSTEM ARCHITECTURE**

```mermaid
graph TD
    User[(Field Worker)]
    subgraph Frontend [Angular Application]
    LoginComponent
    RecorderComponent
    ReviewComponent
    SyncComponent
    end

    subgraph Backend [Spring Boot Server]
    AuthController
    SpeechController
    NLPController
    TraceController
    AuditController
    MongoDB[(MongoDB Database)]
    end

    subgraph Integrations [External APIs]
    GoogleSTT[Google Speech-to-Text]
    TraceAPI[Trace Ingestion API]
    end

    User --> RecorderComponent --> SpeechController
    RecorderComponent --> GoogleSTT
    LoginComponent --> AuthController
    ReviewComponent --> NLPController
    NLPController --> TraceController
    TraceController --> TraceAPI
    TraceController --> AuditController --> MongoDB
```

---

## **ARCHITECTURAL GROWTH SUMMARY**
| Sprint | Core Additions | Deliverable |
|--------|----------------|--------------|
| 0 | Angular + Spring Boot setup | Health connectivity working |
| 1 | JWT Auth | Secure login system |
| 2 | Speech Capture + Transcription | Voice → Text pipeline |
| 3 | NLP Parsing + JSON Builder | Structured trace record creation |
| 4 | API Sync + Auditing | Complete field-to-trace flow |

---

## **DESIGN CONSIDERATIONS**
- **Deployment:** Angular on Firebase Hosting, Spring Boot on Render/Heroku  
- **API Security:** HTTPS + JWT token validation  
- **Scalability:** Modular service classes for future microservice migration  
- **Database:** Mongo DB Atlas for quick iteration  
- **Testing:** JUnit 5 (backend), Jasmine/Karma (frontend)

---

**Architecture Ready for Development — Next Step: Validate readiness and initiate Sprint 0 implementation.**