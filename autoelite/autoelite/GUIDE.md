# AutoElite — Complete Guide
# App · Docker · Kubernetes · Jenkins CI/CD · AWS EKS · SonarQube

---

## Project Structure

```
autoelite/
├── car-backend/
│   ├── server.js                      Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── sonar-project.properties
│   └── jenkins/
│       ├── Jenkinsfile.ci             CI — Stages 1 to 7 (until image push)
│       └── Jenkinsfile.cd             CD — Stage 1 (deploy only)
│
├── car-frontend/
│   ├── src/config.js                  reads REACT_APP_API_URL
│   ├── .env                           local dev URL
│   ├── .env.production                production URL (set before Docker build)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── sonar-project.properties
│   └── jenkins/
│       ├── Jenkinsfile.ci             CI — Stages 1 to 7 (until image push)
│       └── Jenkinsfile.cd             CD — Stage 1 (deploy only)
│
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── backend-deployment.yaml        ✅ set your ECR image URI
    ├── backend-service.yaml           ALB LoadBalancer
    ├── frontend-deployment.yaml       ✅ set your ECR image URI
    ├── frontend-service.yaml          ALB LoadBalancer
    ├── ingress.yaml                   optional — domain routing
    └── hpa.yaml                       optional — auto scaling
```

---

## CI vs CD — Clear Separation

```
CI Pipeline (Jenkinsfile.ci)
────────────────────────────────────
Stage 1  Checkout
Stage 2  Build
Stage 3  Test + Coverage
Stage 4  SCA  (npm audit + OWASP)
Stage 5  SAST (Semgrep)
Stage 6  Quality Gate (SonarQube)
Stage 7  Docker Build + Push to ECR
         │
         └──► on success, triggers CD automatically

CD Pipeline (Jenkinsfile.cd)
────────────────────────────────────
Stage 1  Deploy to EKS
         kubectl set image → rollout
```

---

## PART 1 — Jenkins Setup

### Step 1 — Install Plugins

`Jenkins → Manage Jenkins → Plugins → Available`

| Plugin | Purpose |
|---|---|
| Pipeline | Declarative pipeline |
| Git | Code checkout |
| NodeJS | Node.js tool |
| SonarQube Scanner | SonarQube integration |
| OWASP Dependency-Check | SCA scanning |
| Docker Pipeline | Docker build + push |
| AWS Credentials | AWS key management |
| HTML Publisher | Coverage report in Jenkins UI |
| JUnit | Test result charts |

---

### Step 2 — Global Tool Configuration

`Jenkins → Manage Jenkins → Global Tool Configuration`

**NodeJS**
- Name: `NodeJS-20`  ← must match Jenkinsfile exactly
- Version: `20.x`
- Install automatically: ✅

**OWASP Dependency-Check**
- Name: `OWASP-DC`  ← must match Jenkinsfile exactly
- Install automatically: ✅

**SonarQube Scanner**
- Name: `SonarQube Scanner`
- Install automatically: ✅

---

### Step 3 — Add Jenkins Credentials

`Jenkins → Manage Jenkins → Credentials → Global → Add Credentials`

| Credential ID | Type | Value | Used In |
|---|---|---|---|
| `aws-credentials` | AWS Credentials | Access Key + Secret Key | All pipelines |
| `aws-account-id` | Secret Text | 12-digit AWS account ID | Both CI |
| `sonar-token` | Secret Text | SonarQube user token | Both CI |
| `react-app-api-url` | Secret Text | Backend ALB DNS (after backend deploys) | Frontend CI |

**How to get each value:**

```bash
# aws-account-id
aws sts get-caller-identity --query Account --output text

# react-app-api-url — run after backend is deployed
kubectl get svc car-backend -n autoelite
# copy the EXTERNAL-IP value
```

---

### Step 4 — Configure SonarQube Server in Jenkins

`Jenkins → Manage Jenkins → Configure System → SonarQube servers`

- Name: `SonarQube`  ← must match `withSonarQubeEnv('SonarQube')` in Jenkinsfile
- Server URL: `http://your-sonar-server:9000`
- Server authentication token: select `sonar-token`

---

### Step 5 — Create 4 Jenkins Jobs

`Jenkins → New Item → Pipeline → OK`

| Job Name | Script Path |
|---|---|
| `car-backend-ci` | `car-backend/jenkins/Jenkinsfile.ci` |
| `car-backend-cd` | `car-backend/jenkins/Jenkinsfile.cd` |
| `car-frontend-ci` | `car-frontend/jenkins/Jenkinsfile.ci` |
| `car-frontend-cd` | `car-frontend/jenkins/Jenkinsfile.cd` |

For each job:
1. Pipeline → Definition: `Pipeline script from SCM`
2. SCM: `Git` → enter repo URL
3. Script Path: value from table above
4. Save

---

### Step 6 — Update These Values in Each Jenkinsfile

Open `Jenkinsfile.ci` and `Jenkinsfile.cd` for both services and set:

```groovy
AWS_REGION     = 'ap-south-1'                    // ✅ your AWS region
EKS_CLUSTER    = 'autoelite-cluster'             // ✅ your EKS cluster name
SONAR_HOST_URL = 'http://your-sonar-server:9000' // ✅ your SonarQube URL (CI only)
```

---

## PART 2 — SonarQube Quality Gate

### What SonarQube Receives from CI Pipeline

| Data | Sent From | Seen In SonarQube |
|---|---|---|
| Source code | Stage 6 | Issues, Bugs, Code Smells |
| `lcov.info` | Stage 3 (Jest coverage) | Coverage tab — line % and branch % |
| `semgrep-report.json` | Stage 5 (SAST) | Security Issues, Vulnerabilities |
| OWASP XML | Stage 4 (OWASP DC) | Security Hotspots |

### SonarQube Token

```
SonarQube → My Account → Security → Generate Token
  Type: User Token
  Name: jenkins-token
  Copy the value → add as Jenkins credential 'sonar-token'
```

### Create Quality Gate

`SonarQube → Quality Gates → Create → Add Condition`

| Metric | Condition | Value |
|---|---|---|
| Coverage | Less than | 70% |
| Reliability Rating | Worse than | A |
| Security Rating | Worse than | A |
| Maintainability Rating | Worse than | A |
| Security Hotspots Reviewed | Less than | 100% |
| Duplicated Lines | Greater than | 3% |

Assign gate to projects:
`Project → Project Settings → Quality Gate → select your gate`

### SonarQube Dashboard — What to Check

Open `http://your-sonar-server:9000 → Projects → car-backend or car-frontend`

| Tab | What you see |
|---|---|
| Overview | Quality Gate result — Pass or Fail |
| Issues | All bugs, smells, vulnerabilities with file and line |
| Security | OWASP Top 10 breakdown + Semgrep imports |
| Coverage | Line % and branch % from Jest lcov report |
| Duplications | Duplicated code blocks |

If Quality Gate **fails** → Stage 6 of CI fails → Docker image is NOT built → CD is NOT triggered.

---

## PART 3 — AWS Setup

### Create EKS Cluster

```bash
eksctl create cluster \
  --name autoelite-cluster \
  --region ap-south-1 \
  --nodegroup-name autoelite-nodes \
  --node-type t3.medium \
  --nodes 2 \
  --managed

# Connect kubectl
aws eks update-kubeconfig --name autoelite-cluster --region ap-south-1
kubectl get nodes
```

### Create ECR Repositories

```bash
aws ecr create-repository --repository-name car-backend  --region ap-south-1
aws ecr create-repository --repository-name car-frontend --region ap-south-1
```

---

## PART 4 — Deploy Order (First Time)

```
1.  Create EKS cluster
2.  Create ECR repos
3.  Push backend Docker image to ECR
4.  kubectl apply backend K8s files
5.  kubectl get svc car-backend → copy EXTERNAL-IP (ALB DNS)
6.  Set that DNS as Jenkins credential 'react-app-api-url'
7.  Set that DNS in car-frontend/.env.production
8.  Push frontend Docker image to ECR
9.  kubectl apply frontend K8s files
10. kubectl get svc car-frontend → copy EXTERNAL-IP → open in browser ✅
11. Set up Jenkins 4 jobs → push code → CI runs → CD runs automatically
```

### Apply K8s Files

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Update image URIs in deployment files first:
```yaml
# k8s/backend-deployment.yaml
image: YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/car-backend:latest

# k8s/frontend-deployment.yaml
image: YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/car-frontend:latest
```

---

## PART 5 — After First Deploy (Normal Flow)

Every code push:
```
git push → Jenkins CI triggers
         → Stages 1–7 run
         → Quality Gate must pass
         → Image pushed to ECR
         → CI triggers CD automatically
         → CD deploys to EKS
         → Rollback if deploy fails
```

---

## PART 6 — Rollback

Auto rollback runs in `post { failure }` of each CD Jenkinsfile.

Manual rollback:
```bash
kubectl rollout undo deployment/car-backend  -n autoelite
kubectl rollout undo deployment/car-frontend -n autoelite

# Check history
kubectl rollout history deployment/car-backend -n autoelite

# Rollback to specific revision
kubectl rollout undo deployment/car-backend --to-revision=2 -n autoelite
```

---

## PART 7 — Common Issues

| Problem | Cause | Fix |
|---|---|---|
| CD not triggered | CI failed at any stage | Fix the failing stage, re-run CI |
| Quality Gate fails | Coverage below 70% or security issues | Write tests / fix Semgrep findings |
| `ImagePullBackOff` | Image not in ECR | Run CI to push image first |
| `EXTERNAL-IP pending` | ALB still provisioning | Wait 2–3 min, re-run `kubectl get svc` |
| Frontend shows wrong data | `REACT_APP_API_URL` wrong | Update Jenkins credential + re-run CI |
| SonarQube not receiving data | Wrong `SONAR_HOST_URL` or token | Check Jenkinsfile values |
