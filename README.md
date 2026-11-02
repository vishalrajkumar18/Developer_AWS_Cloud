# CivicTrack – Smart Public Grievance Registration Portal

**CivicTrack** is a modern, responsive web application for civic issue reporting and municipal grievance redressal. It empowers citizens to report local civic issues (road damage, streetlights, water leakage, sanitation, drainage, traffic) and enables municipal administrators and departments to manage, track, and resolve complaints with transparency.

---

## 🏛️ Key Features

- **Modern Authentication System**:
  - Split-screen layout adhering to government-service portal standards.
  - Email/Password login and registration with validation and password strength meter.
  - **Google OAuth Authentication** via Firebase with official Google Identity branding and profile cards.
  - Quick 1-click evaluation shortcuts for Citizen, Admin, and Department logins.
- **Admin Control Center**:
  - Live grievance status management: **Pending Review**, **In Progress**, **Resolved**, and **Rejected**.
  - Quick inline status change directly from the complaint table.
  - Detailed **Admin Complaint Modal** to reassign departments, assign field officers, adjust priorities, and write official resolution notes.
  - Real-time department workload and resolution metrics.
  - Multi-parameter filtering by status, department, and priority with instant search.
- **Citizen Dashboard & Grievance Tracking**:
  - Citizen complaint submission with categories and priority.
  - Real-time grievance tracking with interactive timeline stages.
  - Personal complaint history and status breakdown.
- **Department Dashboard**:
  - Department-specific complaint management.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, JavaScript (ESM)
- **Styling**: CSS3 with modern glassmorphism and responsive design
- **Routing**: React Router DOM v6
- **Authentication**: Firebase Authentication v11
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 🛠️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/vishalrajkumar18/Developer_AWS_Cloud.git
cd Developer_AWS_Cloud/civictrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the `civictrack/` directory:
```bash
cp .env.example .env
```

### 4. Run the development server
```bash
npm run dev
```

The application will be running at `http://localhost:5173/`.

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Citizen** | `citizen@example.com` | `citizen123` |
| **Admin** | `admin@civictrack.gov.in` | `admin123` |
| **Department (PWD)** | `pwd@civictrack.gov.in` | `dept123` |

---

## 📄 License
MIT License
