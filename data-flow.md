# DATA FLOW DIAGRAM — Voice-to-Trace Assistant (Java + Angular)

This document explains how data travels across all tiers of the Voice-to-Trace Assistant system.  
It complements the evolving architecture diagrams to show the real-time data transactions from voice input to final Trace API submission.

---

## **End-to-End Data Flow Overview**

```mermaid
sequenceDiagram
    participant U as User (Field Worker)
    participant F as Angular Frontend
    participant B as Spring Boot Backend
    participant S as Google Speech-to-Text
    participant N as NLP Parser
    participant T as Trace API
    participant M as MongoDB

    U->>F: Speak "Lot 234 harvested in Field 5"
    F->>B: POST /api/v1/speech/upload (audio blob)
    B->>S: Send audio to Google STT
    S-->>B: Transcription {"text": "Lot 234 harvested in Field 5"}
    B->>M: Save transcript record
    B-->>F: Return transcription text

    F->>B: POST /api/v1/nlp/parse (transcription text)
    B->>N: Process NLP rules
    N-->>B: Extracted JSON {"lot":234,"field":5,"action":"harvested"}
    B->>M: Store parsed event
    B-->>F: Return structured entities

    F->>B: POST /api/v1/trace/sync (validated JSON)
    B->>T: Push data to Trace Management API
    T-->>B: Response (success or failure)
    B->>M: Record audit log
    B-->>F: Display confirmation & status
```

---

## **Data Entities by Stage**

| Stage | Entity | Example |
|--------|---------|----------|
| Voice Capture | Audio Blob | audio_2025-10-17.wav |
| Transcription | Transcript Record | “Lot 234 harvested in Field 5” |
| NLP Extraction | Parsed Event | `{lot: 234, field: "5", action: "harvested"}` |
| JSON Creation | Trace Record | Valid JSON schema payload |
| API Sync | Integration Record | Response object + sync status |
| Audit Logging | Audit Trail | Lifecycle metadata |

---

## **Data Lifecycle Summary**

1. **Voice Input:** Captured in Angular with MediaRecorder API.  
2. **Speech Processing:** Sent to Spring Boot → Google STT API for transcription.  
3. **Entity Extraction:** NLP service identifies Lot, Field, Action.  
4. **Record Generation:** Formatted into Trace JSON schema via backend.  
5. **Trace Synchronization:** JSON sent securely (HTTPS + JWT) to Trace API.  
6. **Audit Logging:** Persist all stages into MongoDB for traceability.  

---

## **Error and Retry Mechanism Flow**

```mermaid
flowchart LR
    STT[Speech API Call] -->|Fail| RetrySTT[Retry x3 attempts]
    NLP[NLP Parse] -->|Fail| NotifyUI[User correction prompt]
    TraceSync[Trace API Sync] -->|Fail| LogRetry[Log error + retry job]
    LogRetry --> MongoDB[(Audit Collection)]
```

- **Speech Retry Policy:** Up to 3 attempts, exponential backoff.  
- **Trace API Retry:** Queued retry every 5 mins until confirmed success.  
- **User Notification:** Angular UI displays toast messages for failed phases.

---

## **Security Data Flow Controls**

| Layer | Security Feature | Description |
|--------|------------------|--------------|
| Frontend | Token Interceptor | Attaches JWT from session storage |
| Backend | Spring Security | JWT authorization for all `/api/v1/*` routes |
| API Integration | HTTPS + Auth Keys | Secured integration with Google STT + Trace API |
| Database | Role-based access | RW split for audit vs trace data |

---

**Data Flow Validation Complete — Ready for Backend and Frontend Sprint 0 Initialization.**