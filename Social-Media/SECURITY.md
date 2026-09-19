# Pulse — Security Architecture, Threat Model & Penetration Testing Report

---

## 🛡️ Security Architecture Overview

Pulse implements comprehensive **Defense-in-Depth** across HTTP REST APIs, WebSockets, background tasks, and AI integrations.

```
                    ┌──────────────────────────────────────┐
                    │           Client / Browser           │
                    └──────────────────┬───────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
   [HTTP REST APIs]                                      [WebSockets / WSS]
  • SessionAuth + CSRF Token                            • AuthMiddlewareStack
  • Scoped Rate Limiting                                • Origin Validation
  • IsAuthorOrReadOnly / BOLA Checks                    • Conversation Membership Checks
            │                                                     │
            └──────────────────────────┬──────────────────────────┘
                                       ▼
                     ┌────────────────────────────────────┐
                     │       Backend Security Layer       │
                     │ • SSRF Socket Pre-Validation       │
                     │ • Pillow Magic Byte Validation     │
                     │ • Random UUID4 File Storage        │
                     │ • Untrusted AI Output Sanitization │
                     │ • Community Server-Side RBAC       │
                     │ • Trust & Reputation Tiers         │
                     │ • SQL Parameterization             │
                     │ • XSS-Safe DOM Rendering           │
                     └─────────────────┬──────────────────┘
                                       ▼
                     ┌────────────────────────────────────┐
                     │   Database Constraints (Postgres)  │
                     │ • Unique user+post likes           │
                     │ • Unique user+post bookmarks       │
                     │ • Unique post+collaborator         │
                     │ • Unique community+user membership │
                     │ • CheckConstraint (no self-follow) │
                     │ • CheckConstraint (no self-block)  │
                     └────────────────────────────────────┘
```

---

## 🎯 Threat Model & Mitigations

| Threat Vector | Attack Scenario | Mitigation in Pulse | Automated Test Verification |
| :--- | :--- | :--- | :--- |
| **Server-Side Request Forgery (SSRF)** | Attacker submits `http://169.254.169.254/latest/meta-data/` or redirects to private IPs via 301/302. | Socket IP pre-resolution + `SafeRedirectHandler` validating destination on all HTTP redirects. Blocks loopback, private subnets (RFC 1918/4193), link-local, and cloud metadata. 3s timeout & 512KB limit. | `test_ssrf_validate_url_blocks_private_and_metadata_ips`, `test_ssrf_safe_redirect_handler_blocks_private_destination` |
| **Community & Story BOLA / IDOR** | Attacker accesses private community discussions or close-friends-only stories by guessing ID. | Strict audience resolution (`StoryDetailView`) and private community membership verification (`CommunityPostsListView`). | `test_private_story_access_denied_for_non_follower`, `test_private_community_posts_hidden_from_non_members` |
| **PII & Email Leakage** | Attacker accesses public profile endpoint to scrape user email addresses. | `ProfileSerializer` uses dynamic `SerializerMethodField` hiding `email` from third parties. | `test_profile_email_privacy_for_unauthorized_users`, `test_profile_email_returned_for_owner_and_staff` |
| **Community Privilege Escalation** | Community moderator attempts to access platform-wide admin endpoints or delete global users. | Server-side RBAC separates community permissions from global `is_staff` / `is_superuser`. | `test_community_ban_prevents_rejoining` |
| **Fake Account Verification** | Attacker calls `PATCH /api/profiles/me/` with `is_verified: true`. | `is_verified` is read-only on profile update serializers and only settable via staff verification review endpoint. | `test_verification_request_and_approval_workflow` |
| **Broken Object-Level Auth (BOLA / IDOR)** | Attacker attempts to read messages in another user's conversation or delete another user's post. | Server-side `ConversationMember` checks in views & consumers; `IsAuthorOrReadOnly` and `IsOwnerOrReadOnly` permission classes. | `test_unauthorized_conversation_access_rejection`, `test_unauthorized_post_modification_rejected`, `test_is_owner_or_read_only_author_support` |
| **WebSocket Hijacking** | Unauthenticated user attempts to listen to real-time chat or notification streams. | `ChatConsumer` and `NotificationConsumer` reject unauthenticated scopes with WebSocket code `4001`; CSP includes `ws:` and `wss:`. | `test_unauthenticated_websocket_connection_rejected`, `test_security_headers_csp_contains_websocket_support` |
| **Malicious Web-Shell Uploads** | Attacker uploads executable with `.jpg` extension. | Pillow magic-byte inspection (`Image.open(file).verify()`) + UUID4 hash renaming. | `test_malicious_executable_disguised_as_image_rejected` |
| **Cross-Site Scripting (XSS)** | Attacker inputs `<script>alert(1)</script>` in post, story, or message. | Content rendered via DOM `textContent` and safe string escaping. | `test_xss_payload_in_post_content_is_escaped` |
| **SQL Injection** | Attacker inputs `' OR 1=1 --` into search, hashtags, or filters. | Parameterized queries exclusively via Django ORM. | `test_sql_injection_attempt_in_search_query` |

---

## 🔍 Penetration Testing Summary

* **Automated Tests**: 84 Test Cases (including 10 hardening & security regression tests)
* **Status**: 100% Passed (0 Failures, 0 Errors)
* **Execution Time**: ~104.3s
* **Categories Tested**:
  1. Authentication & Session Management
  2. SSRF Protection on Link Previews & Safe Redirects
  3. Private Stories Audience Enforcement & BOLA Protection
  4. Community RBAC, Private Discussion Isolation & Membership
  5. Collaborative Post Attributions & Security
  6. Translation Service & Caching
  7. AI Writing Assistant & Heuristics
  8. Trust Scoring & Account Risk Tiers
  9. User Verification Review Pipeline
  10. WebSockets Authorization, Handshake & CSP
  11. File Upload Magic Byte Armor
  12. SQL Injection & XSS Payloads
  13. PII Disclosure & Email Privacy
  14. Rate Limiting on Abuse-Sensitive Endpoints
