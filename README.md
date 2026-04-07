# Climpt — Distributed Job Processing System

A Kubernetes-based microservices system for asynchronous job processing with observability using Prometheus and Grafana.

---

## Overview

Climpt demonstrates how to build a scalable background job processing system using a queue-based architecture. It includes job submission, distributed workers, and full observability.

---

## Architecture
```text
Client → Job Submitter → Redis Queue → Worker → Result Store
↓
Prometheus
↓
Grafana
```

---

## Services

| Service        | Description |
|----------------|------------|
| jobsubmitter   | Accepts jobs and pushes them to Redis |
| worker         | Consumes jobs and processes tasks |
| redis          | Queue and job state storage |
| prometheus     | Metrics collection |
| grafana        | Metrics visualization |
| aggregator     | Optional aggregation layer |

---

## Supported Tasks


```text
hash → bcrypt hashing
prime → prime number calculation
sort → sorting operation
```

---

# Kubernetes Setup — Complete Developer Workflow

> **Namespace:** `climpt`

---

## 1. Build Docker Images

From the project root:

```bash
docker build -t jobsubmitter:latest -f Docker/jobsubmitter.Dockerfile .
docker build -t worker:latest -f Docker/worker.Dockerfile .
docker build -t aggregator:latest -f Docker/aggregator.Dockerfile .
```

---

##  2. Load Images into Minikube

```bash
minikube image load jobsubmitter:latest
minikube image load worker:latest
minikube image load aggregator:latest
```

---

##  3. Apply Kubernetes Manifests

**Base (namespace)**
```bash
kubectl apply -f k8s/base/namespace.yml
```

**Core Services**
```bash
kubectl apply -f k8s/redis/redis.yml
kubectl apply -f k8s/jobsubmitter/jobsubmitter.yml
kubectl apply -f k8s/worker/worker.yml
kubectl apply -f k8s/aggregator/aggregator.yml
```

**📊 Monitoring Stack**
```bash
kubectl apply -f k8s/prometheus/prometheus.yml
kubectl apply -f k8s/grafana/grafana.yml
```

**🌐 Ingress** *(optional)*
```bash
kubectl apply -f k8s/ingress/ingress.yml
```

---

##  4. Verify Deployment

**Check pods**
```bash
kubectl get pods -n climpt
```

**Check services**
```bash
kubectl get svc -n climpt
```

**Check logs**
```bash
kubectl logs -n climpt -l app=worker -f
kubectl logs -n climpt -l app=jobsubmitter -f
```

---

## 🔌 5. Port Forwarding

**jobsubmitter**
```bash
kubectl port-forward svc/jobsubmitter -n climpt 80:8000
```

**worker**
```bash
kubectl port-forward svc/worker -n climpt 8001:8001
```

**aggregator**
```bash
kubectl port-forward svc/aggregator -n climpt 8002:8002
```

**Grafana**
```bash
kubectl port-forward svc/grafana -n climpt 3000:3000
```
 Access: [http://localhost:3000](http://localhost:3000)

**Prometheus**
```bash
kubectl port-forward svc/prometheus -n climpt 9090:9090
```
 Access: [http://localhost:9090](http://localhost:9090)

---

## 6. Grafana Setup

**Login credentials**
| Field    | Value             |
|----------|-------------------|
| Username | `admin`           |
| Password | `climpt-admin-123`|

**Add Prometheus datasource**
```
http://promithusclusterip:9090
```

---

## 7. Verify Metrics

Open Prometheus at [http://localhost:9090](http://localhost:9090) and try:
