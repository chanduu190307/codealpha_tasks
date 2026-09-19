# Pulse — Advanced Social Media Platform & 3D Spatial Universe

A full-stack social media platform engineered with a **Dual-Runtime Architecture**:
* **Option A (Python / Django)**: Django 5.2, Django REST Framework, Django Channels, Daphne, SQLite/PostgreSQL.
* **Option B (Node.js / Express)**: Express 4, WebSockets (`ws`), Three.js WebGL 3D Universe, SQLite3.
* **Frontend**: Vanilla HTML5, modern CSS3 (Glassmorphism, Dark/Light modes), and Modular ES6 JavaScript.

Designed for high-concurrency real-time interactions, decentralized communities, 3D spatial data visualization, and defense-in-depth security.

---

## 🌟 Dual-Runtime Architecture

Pulse provides two production-grade backend implementations sharing the exact same `/api/` REST and WebSocket contract:

| Capability | Node.js Runtime (`server/`) | Python Django Runtime (`backend/`) |
| :--- | :--- | :--- |
| **Primary Engine** | Node.js 20+, Express 4, SQLite3 | Python 3.14+, Django 5.2, DRF, Daphne |
| **Real-Time Layer** | WebSockets (`ws` library) | Django Channels (ASGI ProtocolTypeRouter) |
| **3D Universe** | Native Spatial Coordinates Engine | Compatible REST API Entity Mapping |
| **Security Layer** | Helmet, Express Rate Limit, BOLA Guard | SecurityHeadersMiddleware, SSRF Armor |
| **Recommended For** | **CodeAlpha Demo & 3D Video Recording** | **Enterprise Relational & Security Audits** |
| **Automated Tests** | 16 test suites (`npm test`) | 98 test suites (`python backend/manage.py test tests`) |

### Why Both Exist
1. **Node.js Express Engine**: Delivers lightweight zero-dependency deployment, native WebSockets, and optimized Three.js spatial coordinates clustering for interactive 3D universe navigation.
2. **Django & DRF Engine**: Delivers enterprise-grade Object-Relational Mapping (ORM), granular role-based access controls (RBAC), multi-signal feed ranking, and automated migration management.
3. **Seamless Frontend Interchangeability**: The glassmorphic frontend client connects identically to either backend without configuration changes.

---

## 🪐 3D Spatial Universe Navigation

In addition to traditional 2D feed browsing, Pulse features an interactive **Three.js WebGL Spatial Universe**:
* Posts are mapped as glowing 3D polyhedral nodes clustered around thematic community galaxies.
* Interactive 3D orbital camera controls: drag to rotate, scroll to zoom, click nodes for hologram inspection.
* Dynamic proximity lines connect related posts across shared communities.
* Toggle effortlessly between classic feed view and 3D space with the universe mode switch.

---

## 🛡️ Concrete Security Protections

Pulse implements verified defense-in-depth security mechanisms:
* **Broken Object Level Authorization (BOLA/IDOR)**: Server-side ownership verification prevents unauthorized modification or deletion of posts, comments, or conversations.
* **SSRF Defense-in-Depth**: OpenGraph link preview service pre-resolves hostnames to socket IPs, strictly blocking loopback (`127.0.0.0/8`, `::1`), private RFC 1918/4193 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata endpoints (`169.254.169.254`).
* **CSRF & Session Protection**: Strict CSRF token validation (`X-CSRFToken`) on all mutating HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`).
* **Password Hashing**: Industry-standard cryptographic hashing using `bcryptjs` (Node.js, 10 salt rounds) and PBKDF2 with SHA-256 (Django, 1,000,000 iterations).
* **Input Validation & Sanitization**: Strict username format validation (`^[a-zA-Z0-9_]{3,30}$`), file upload ceiling (5MB limit with MIME inspection), and HTML entity escaping to eliminate XSS risks.
* **Granular Rate Limiting**: Independent IP and endpoint rate limiters on authentication and post creation routes.

---

## 🚀 Quick Start & Local Execution

### 1. Prerequisites
* Node.js v18+ and npm
* Python 3.10+ (for Django backend option)

### 2. Install Dependencies

```powershell
# Install Node.js dependencies
npm install

# (Optional) Install Python virtual environment dependencies
.\.venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Populate Authoritative Demo Dataset

Run the idempotent seed engine to populate both databases (`pulse_3d.sqlite` and `backend/db.sqlite3`):

```powershell
npm run seed
```

This populates:
* **70 Realistic Users** with unique bios and avatars
* **7 Active Communities** (Web Dev, AI, Photography, Design, Fitness, OSS, Cybersecurity)
* **329 Distinct Posts** with clustered 3D galaxy coordinates
* **98 Thematically Matched Image Posts**
* **817 Context-Aware Comments**
* **4,809 Unique Likes**
* **960 Follow Relationships**

### 4. Demo Credentials

For demonstration, portfolio review, and video recording:
* **Username**: `demo_user` (Alex Vance — Community Ambassador)
* **Password**: `PulseDemo2026!`
* *(All 70 fictional demo accounts share this password for testing convenience)*

### 5. Start Application

#### Option A: Node.js 3D Universe Engine (Recommended for CodeAlpha Demo)
```powershell
npm start
```
Open **`http://localhost:8000/`** in your browser.

#### Option B: Python Django Engine
```powershell
.\.venv\Scripts\activate
python backend/manage.py runserver 127.0.0.1:8000
```
Open **`http://127.0.0.1:8000/`** in your browser.

---

## 🧪 Automated Testing & Validation

### Node.js Security & Integration Suite (16 Test Suites)
```powershell
npm test
```

### Python Django Test Suite (98 Test Suites)
```powershell
.\.venv\Scripts\python backend/manage.py test tests
```

### Social Content Integrity Validator
```powershell
npm run validate
```
Validates zero duplicate usernames, valid regex constraints, zero orphaned records, valid 3D coordinates, chronological comment ordering, and verified media reachability across both databases.

---

## 📁 Repository Structure

```text
├── .env.example                     # Environment configuration template
├── .gitignore                       # Multi-stack Git ignore rules
├── package.json                     # Node.js dependencies & run scripts
├── README.md                        # Documentation and architecture guide
├── SECURITY.md                      # Security vulnerability disclosure policy
│
├── frontend/                        # Static Single-Page Application (HTML5/CSS3/ES6)
│   ├── index.html                   # Main 2D/3D feed application
│   ├── login.html                   # Authentication login view
│   ├── register.html                # User registration view
│   ├── css/                         # Glassmorphism & layout stylesheets
│   └── js/                          # Modular ES6 controllers & Three.js canvas
│
├── server/                          # Node.js Express 3D Backend
│   ├── index.js                     # Express server & static asset mount
│   ├── db.js                        # SQLite3 promise wrapper & schema definitions
│   ├── seed.js                      # Idempotent dual-database seed engine
│   ├── middleware/                  # Auth, CSRF, security headers, rate-limiting
│   ├── routes/                      # REST API endpoints (/api/*)
│   ├── scripts/                     # Content integrity validator
│   ├── seeds/                       # Authoritative dataset definitions
│   ├── tests/                       # Automated Node.js integration & security tests
│   └── ws/                          # Real-time WebSocket service with BOLA guards
│
└── backend/                         # Python Django Enterprise Backend
    ├── manage.py                    # Django CLI entrypoint
    ├── requirements.txt             # Python dependencies
    ├── config/                      # Settings, URLs, ASGI/WSGI configuration
    ├── core/                        # Middleware, ranking, SSRF armor, permissions
    ├── accounts/                    # User model, profile, privacy settings
    ├── posts/                       # Post model, collaboration, serializers, views
    ├── comments/                    # Comment model, moderation, endpoints
    ├── interactions/                # Likes, follows, bookmarks
    ├── communities/                 # Decentralized communities & RBAC
    ├── chat/                        # 1-on-1 direct messaging models & views
    ├── notifications/               # Real-time notification models & views
    └── tests/                       # 98 automated unit & integration test suites
```

---

## 📜 License & Acknowledgements

* **Author**: Pulse 3D Engineering Team / CodeAlpha Internship Portfolio
* **License**: MIT
