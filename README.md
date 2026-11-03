# CivicTrack – Smart Public Grievance Registration Portal
### Enterprise Full-Stack Application, Cloud Infrastructure & DevOps Pipeline

[![CI/CD Pipeline](https://github.com/vishalrajkumar18/Developer_AWS_Cloud/actions/workflows/deploy.yml/badge.svg)](https://github.com/vishalrajkumar18/Developer_AWS_Cloud/actions/workflows/deploy.yml)
[![Docker Support](https://img.shields.io/badge/Docker-Multi--Container-blue.svg?logo=docker)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-623CE4.svg?logo=terraform)](https://www.terraform.io/)
[![Ansible](https://img.shields.io/badge/Config-Ansible-EE0000.svg?logo=ansible)](https://www.ansible.com/)
[![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%26%20Grafana-orange.svg?logo=grafana)](https://grafana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 1. Project Overview

**CivicTrack** is an enterprise-grade, cloud-native public grievance redressal portal. It bridges citizens with municipal authorities to report, track, and resolve urban infrastructure problems in real-time.

### Supported Public Grievance Categories
- 🛣️ **Road Damage & Potholes**: Asphalt wear, road cave-ins, and missing manhole covers.
- 💡 **Streetlight Issues**: Dark streets, flickering bulbs, and electrical line faults.
- 💧 **Water Supply & Leakage**: Burst municipal mains, low water pressure, and pipeline contamination.
- 🚰 **Drainage & Flooding**: Blocked monsoon drains, sewer overflows, and standing water.
- 🗑️ **Garbage Collection**: Uncollected bins, illegal community dumping, and sanitary hazards.
- 🚦 **Traffic Signals**: Jammed traffic lights, timing malfunctions, and broken junction sensors.

---

## 2. End-to-End Architecture

```text
                                 [ Developer ]
                                       │
                                       ▼ (git push main)
                             [ GitHub Repository ]
                                       │
                                       ▼ (triggers webhook)
                          [ GitHub Actions CI/CD ]
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
       [ Stage 1: Test & Lint ]                      [ Stage 2: Docker Build ]
       (React build & PyTest)                        (Multi-stage Dockerfiles)
                                                              │
                                                              ▼
                                                   [ Amazon ECR Registry ]
                                                   (Frontend & Backend images)
                                                              │
                                                              ▼
                                                   [ Stage 3: SSH Deploy ]
                                                              │
                                                              ▼
       [ Terraform IaC ] ──> provisions ──> [ AWS EC2 Cloud Host (Ubuntu 22.04) ]
       [ Ansible CM    ] ──> configures ──>                   │
                                                              ▼
                                               [ Docker Compose Production Stack ]
                                         ┌────────────────────┼────────────────────┐
                                         ▼                    ▼                    ▼
                                  [ React Frontend ]   [ Flask REST API ]    [ MySQL 8.0 DB ]
                                  (Port 80 / Nginx)    (Port 5000 / Gunicorn) (Port 3306)
                                                              │
                                                              ▼
                                                   [ Prometheus Scraper ] (Port 9090)
                                                              │
                                                              ▼
                                                   [ Grafana Dashboard ] (Port 3001)
```

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript (ESM), CSS3 Glassmorphism, React Router v6, Lucide Icons, Recharts |
| **Backend** | Python 3.11, Flask, Flask-SQLAlchemy, PyMySQL, Gunicorn, PyJWT, Werkzeug |
| **Database** | MySQL 8.0 with InnoDB relational schema and persistent Docker volumes |
| **Authentication** | Firebase Authentication v11, Google OAuth 2.0 with official popup interface, JWT sessions |
| **Containerization** | Docker, Multi-stage Dockerfiles, Docker Compose |
| **Cloud Infrastructure (IaC)**| Terraform, AWS (VPC, Public Subnets, Security Groups, EC2, Elastic IP, Amazon ECR, IAM Roles) |
| **Configuration Management**| Ansible Automation Playbooks |
| **CI/CD Pipeline** | GitHub Actions (Automated test, build, ECR push, and remote EC2 deployment) |
| **Observability & Metrics** | Prometheus (`prometheus-flask-exporter`), Grafana 11.0 pre-provisioned dashboards |

---

## 4. Repository Structure

```text
CivicTrack/
├── frontend/                     # React 18 SPA
│   ├── src/                      # Components, pages, context, and styles
│   ├── public/                   # Static civic assets & community images
│   ├── nginx.conf                # Production Nginx reverse proxy configuration
│   ├── Dockerfile                # Multi-stage production container build
│   └── package.json              # Node dependencies
│
├── backend/                      # Python Flask REST API
│   ├── app/                      # Application factory, routes, and models
│   │   ├── routes/               # auth.py, complaints.py, departments.py, admin.py, feedback.py
│   │   ├── models.py             # SQLAlchemy relational models
│   │   └── config.py             # Database and application configuration
│   ├── run.py                    # Server WSGI entrypoint
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Production Python 3.11 container
│
├── database/
│   └── init.sql                  # MySQL database schema & initial seed data
│
├── docker/
│   ├── docker-compose.yml        # Multi-container production stack (MySQL, API, Web, Prometheus, Grafana)
│   └── docker-compose.dev.yml    # Development stack with live code-mounts
│
├── terraform/                    # Infrastructure as Code
│   ├── provider.tf               # AWS provider and constraints
│   ├── variables.tf              # Region, instance sizing, and VPC CIDRs
│   ├── main.tf                   # VPC, Subnets, SG, ECR, IAM, EC2, and EIP
│   └── outputs.tf                # Public IP, URLs, and ECR repository endpoints
│
├── ansible/                      # Configuration Management
│   ├── inventory                 # Target EC2 host inventory
│   └── playbook.yml              # Automated Docker setup, repo sync, and deploy
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline for GitHub Actions
│
├── monitoring/
│   ├── prometheus.yml            # Prometheus scrape targets & intervals
│   └── grafana/
│       ├── provisioning/         # Auto-provisioned datasources & dashboard providers
│       └── dashboards/           # Pre-configured CivicTrack system overview dashboard
│
├── docker-compose.yml            # Root Docker Compose entrypoint
├── .env.example                  # Environment configuration template
└── README.md                     # Comprehensive project documentation
```

---

## 5. Local Development & Docker Deployment

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 18+](https://nodejs.org/) (optional for local frontend development)
- [Python 3.11+](https://www.python.org/) (optional for local backend development)

### Option A: 1-Command Multi-Container Launch (Recommended)
From the project root directory, run:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

This starts all 5 container services:
1. **React Frontend**: [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
2. **Flask REST API**: [http://localhost:5000](http://localhost:5000) (Health check: `/health`, Metrics: `/metrics`)
3. **MySQL Database**: `localhost:3306` (Database: `civictrack_db`, User: `civic_user`)
4. **Prometheus Server**: [http://localhost:9090](http://localhost:9090)
5. **Grafana Dashboard**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)

Check container health status:
```bash
docker compose -f docker/docker-compose.yml ps
```

Stop the stack:
```bash
docker compose -f docker/docker-compose.yml down
```

---

## 6. AWS Cloud Infrastructure with Terraform

### 1. Initialize Terraform
Navigate to the `terraform/` directory:
```bash
cd terraform
terraform init
```

### 2. Review the Provisioning Plan
```bash
terraform plan
```
This provisions:
- Custom VPC (`10.0.0.0/16`) with Internet Gateway & Public Subnet.
- Security Groups with ingress on ports `80`, `443`, `3000`, `5000`, `9090`, `3001`, and `22`.
- Two Amazon ECR Repositories: `civictrack-frontend` and `civictrack-backend`.
- IAM Role with Amazon ECR read permissions and SSM Agent profile.
- AWS EC2 Instance (`t3.medium`) with cloud-init Docker installation.
- AWS Elastic IP (EIP) attached to the EC2 server.

### 3. Apply and Deploy
```bash
terraform apply -auto-approve
```

Outputs will display your static **Public IP**, **Application URL**, **Prometheus URL**, and **Grafana Dashboard URL**.

---

## 7. Server Configuration with Ansible

Once the EC2 instance is created:

1. Update the EC2 IP address in `ansible/inventory`:
   ```ini
   civictrack-ec2 ansible_host=<YOUR_EC2_PUBLIC_IP> ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/civictrack-key.pem
   ```

2. Execute the Ansible playbook:
   ```bash
   cd ansible
   ansible-playbook -i inventory playbook.yml
   ```

Ansible will:
- Install Docker Engine, containerd, and Docker Compose plugin.
- Configure system security and add `ubuntu` user to the `docker` group.
- Clone the CivicTrack repository into `/opt/civictrack`.
- Deploy the multi-container stack and verify health endpoints.

---

## 8. CI/CD Automation with GitHub Actions

The automated pipeline in `.github/workflows/deploy.yml` triggers on every push to the `main` branch.

### GitHub Repository Secrets Required
Navigate to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions** and add:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key with ECR & EC2 permissions | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_ACCOUNT_ID` | 12-digit AWS Account ID | `123456789012` |
| `EC2_HOST` | Elastic IP address of your EC2 instance | `54.210.120.45` |
| `EC2_SSH_KEY` | Private SSH Key (`.pem`) for `ubuntu` user | `-----BEGIN RSA PRIVATE KEY-----...` |

### Pipeline Workflow Stages
1. **🧪 Build & Lint Checks**: Validates Node build and Flask app factory initialization.
2. **🐳 Docker Build & ECR Push**: Builds frontend & backend containers and tags them with git commit SHA and `latest` in Amazon ECR.
3. **🚀 Deploy to AWS EC2**: Connects via SSH, pulls latest images from ECR, and executes rolling container updates with health verification.

---

## 9. Monitoring with Prometheus & Grafana

### Prometheus (`http://<SERVER_IP>:9090`)
Prometheus scrapes live application performance metrics from the Flask backend every 5 seconds:
- `flask_http_request_total`: Total request volume segmented by route and HTTP status.
- `flask_http_request_duration_seconds`: Request response latencies.
- Container uptime and process memory metrics.

### Grafana (`http://<SERVER_IP>:3001`)
- **Default Login**: Username: `admin`, Password: `admin`
- The **CivicTrack System Overview** dashboard is pre-provisioned automatically:
  - **Service Status Gauge**: Instant alert if backend is degraded.
  - **Live Request Rate (QPS)**: Real-time queries per second.
  - **Average Response Latency**: Visual thresholds (green < 500ms, red > 1000ms).
  - **5xx Error Tracker**: Instant detection of server-side exceptions.
  - **Top API Endpoints Traffic**: Breakdown of `/api/complaints`, `/api/auth`, and `/api/admin`.

---

## 10. Demo Credentials & Evaluation Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Citizen Account** | `citizen@example.com` | `citizen123` | Grievance registration, photo upload, personal history, and real-time tracking |
| **System Administrator** | `admin@civictrack.gov.in` | `admin123` | System overview, change complaint status, reassign departments, dispatch field officers |
| **Department Officer (PWD)**| `pwd@civictrack.gov.in` | `dept123` | Department assigned issues, update work progress, resolution notes |
| **Google Sign-In** | Select **Visahl Rajkumar** | *One-Click* | Official Google OAuth 2.0 popup with profile picture and dashboard sync |

---

## 11. Security Best Practices

- **Zero Hardcoded Secrets**: Sensitive database and JWT keys are managed through `.env` and environment variables.
- **Principle of Least Privilege**: IAM roles with explicit Amazon ECR and SSM policies.
- **Docker Isolation**: Containers run on an internal Docker bridge network (`civictrack_network`); MySQL port is shielded.
- **Graceful Fallbacks**: Frontend includes resilient offline caching ensuring zero downtime even during server upgrades.

---

## 📄 License
This project is licensed under the MIT License.
