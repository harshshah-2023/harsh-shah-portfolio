import MahakavachHero from "../../assets/Mahakavach_hero.webp";
import MahakavachCard from "../../assets/Mahakavach_card.webp";
import citadelHero from "../../assets/citadelFlowHero.webp";
import citadelCard from "../../assets/citadelFlow_card.webp";
import PregaHero from "../../assets/PregaviewHero.webp";
import PregaCard from "../../assets/Pregaview_card.webp";

/**
 * Project catalogue. Kept at module scope so the array (and every nested
 * object in it) is allocated once instead of on every ProjectsGallery render.
 *
 * `image` / `heroImage` may be null - the UI renders a branded gradient tile
 * in that case rather than a broken <img>.
 */
export const PROJECTS = [
  {
    id: 1,
    title: "MahaKavach — AI Crowd Prediction & Transit Analytics Platform",
    description: "CV + GenAI-powered crowd intelligence for public transit with real-time APIs.",
    fullDescription:
      "MahaKavach is a city-scale crowd prediction system for Mumbai suburban railways integrating computer vision (YOLO), GenAI explainability, and real-time APIs. The platform processes live video feeds from 150+ stations, provides crowd density predictions, and generates actionable insights through GenAI interpretation. Features include heatmap visualizations, predictive analytics for peak hours, automated alerts, and a comprehensive dashboard for transit authorities. Built with microservices architecture for high availability and low latency.",
    image: MahakavachCard,
    heroImage: MahakavachHero,
    logo: "🚇",
    technologies: [
      "Computer Vision (YOLO)", "GenAI", "Python", "FastAPI", "React",
      "Real-time WebSocket", "Microservices", "Docker", "Kubernetes",
      "Redis", "PostgreSQL", "AWS Cloud", "OpenCV", "TensorFlow"
    ],
    category: "ai-transit",
    featured: true,
    githubUrl: "https://github.com/harshshah-2023/Mahakavach-realtime-crowd-safety",
    liveUrl: "https://www.mahakavach.in/",
    hasLiveDemo: true,
    metrics: {
      accuracy: "94% Crowd Density Accuracy",
      latency: "<500ms Real-time Processing",
      stations: "150+ Station Coverage",
      uptime: "99.99% Platform Availability"
    },
    highlights: [
      "YOLO-based real-time crowd detection and counting",
      "GenAI-powered explainability for operational insights",
      "Predictive analytics for peak hour crowd forecasting",
      "City-scale deployment with multi-region failover",
      "Real-time dashboard with heatmaps and alerts"
    ],
    maturityRating: "Production Deployed",
    year: "2025"
  },
  {
    id: 2,
    title: "Citadel Flow — Payment Observability & Retry Orchestration System",
    description: "State-machine driven payment reliability with idempotency & real-time telemetry.",
    fullDescription:
      "Citadel Flow is an enterprise-grade payment observability platform that models real gateway failure modes using state machines, idempotent retry logic, and comprehensive real-time telemetry. The system ensures payment reliability through deterministic lifecycle transitions, automated retry orchestration with exponential backoff, and circuit breaker patterns. Features include distributed tracing, structured logging, correlation IDs, and real-time diagnostics for sub-second visibility into transaction lifecycles. Engineered for mission-critical checkout reliability with automated state transition validation.",
    image: citadelCard,
    heroImage: citadelHero,
    logo: "💳",
    technologies: [
      "State Machines", "Idempotency", "Node.js", "TypeScript", "Redis",
      "PostgreSQL", "Distributed Tracing", "Grafana", "Prometheus",
      "Docker", "Kubernetes", "AWS Lambda", "Event-Driven Architecture"
    ],
    category: "fintech-devops",
    featured: true,
    githubUrl: "https://github.com/harshshah-2023/checkout-optimization-engine",
    liveUrl: "https://citadelflow-checkout-optimization-engine.onrender.com/",
    hasLiveDemo: true,
    metrics: {
      recovery: "92% Transaction Recovery Rate",
      latency: "200ms Observability Overhead",
      retries: "27% Reduction in Redundant Retries",
      uptime: "99.95% System Reliability"
    },
    highlights: [
      "State-machine driven transaction lifecycle management",
      "Idempotent retry orchestration with failure-aware logic",
      "Comprehensive observability with distributed tracing",
      "Real-time telemetry and correlation ID tracking",
      "Automated CI/CD for state transition validation"
    ],
    maturityRating: "Enterprise Production",
    year: "2025"
  },
  {
    id: 3,
    title: "IoT Medicine Dispenser + AI Health Monitoring System",
    description: "Smart IoT dispenser with ML fall detection, health prediction & caregiver supervision.",
    fullDescription:
      "A full MERN + IoT healthcare ecosystem designed for elderly/bedridden patients. Features include automated medicine dispensing, ML-powered fall detection using wearable accelerometer data, and health risk prediction from vitals & symptoms. Integrated with real-time monitoring dashboard, caregiver app, emergency push-alerts, and cloud-synced logs. The system is containerized, CI/CD enabled, and supports scalable deployments via DevOps pipelines.",
    image: null,
    heroImage: null,
    logo: "⚕️",
    technologies: [
      "MERN Stack", "Kotlin", "IoT-ESP32", "TensorFlow Lite", "MQTT",
      "Node.js", "Express", "React", "Firebase", "Cloud Messaging",
      "Machine Learning Models", "Docker", "Sensors & Actuators"
    ],
    category: "iot-healthcare",
    featured: true,
    githubUrl: "https://github.com/harshshah-2023/MedicalIotAndroidapp",
    liveUrl: "",
    hasLiveDemo: false,
    metrics: {
      accuracy: "92% Fall-Detection Accuracy",
      response: "0.9s Emergency Trigger",
      uptime: "24/7 Real-Time Monitoring",
      automation: "Auto-Dispense + Dose-Lock System"
    },
    highlights: [
      "Automatic medicine scheduling + missed-dose alerts",
      "Wearable ML model for real-time fall detection",
      "Secure caregiver + doctor monitoring dashboard",
      "DevOps deployment with Docker-based scaling",
      "Health-risk prediction based on vitals history"
    ],
    maturityRating: "Production Ready",
    year: "2025"
  },
  {
    id: 4,
    title: "CropRakshak — AI Crop Disease Detection & Hyperlocal Advisory",
    description: "CNN-based disease classifier + climate-aware advisory panel for small-scale farmers.",
    fullDescription:
      "CropRakshak is built using a MERN architecture with an ML-powered CNN model for disease identification. Farmers upload leaf samples, receive probability output, stage-detection, cure steps and pesticide recommendation. Weather APIs + NOAA data enable climate-aware disease forecasting and infection probability mapping. Dashboard includes heatmaps, yield projections, vegetation trendline analytics and soil disease history logging.",
    image: null,
    heroImage: null,
    logo: "🌾",
    technologies: [
      "MERN Stack", "CNN Deep Learning", "OpenCV", "Python", "Flask API",
      "Node.js", "Express", "React", "Firebase", "REST APIs",
      "NOAA Weather Data", "Javascript", "MongoDB"
    ],
    category: "ai-agriculture",
    featured: true,
    githubUrl: "",
    liveUrl: "",
    hasLiveDemo: false,
    metrics: {
      accuracy: "88-94% Classifier Confidence",
      speed: "2.4s Avg Inference Time",
      rollout: "100+ Field-Test Samples",
      coverage: "Hyperlocal Heatmap x 10 Regions"
    },
    highlights: [
      "CNN disease classification with real-time suggestions",
      "Climate-linked infection forecasting model",
      "Farm-history & treatment analytics dashboard",
      "Offline image capture → cloud sync pipeline",
      "Pesticide cure guidance + stage-severity detection"
    ],
    maturityRating: "Research + Pilot Deployment",
    year: "2025"
  },
  {
    id: 5,
    title: "Pregaview — ML-Based Maternal Health Risk Prediction",
    description: "Predicts pregnancy-related complications using vitals + symptoms via inference API.",
    fullDescription:
      "Pregaview runs on a dual architecture — Kotlin Android App + MERN Web Platform — connected to an ML engine (Random Forest) for pregnancy complication probability scoring. Tracks vitals, symptoms, trimester history & generates severity predictions with real-time doctor notifications. Backend deployed with Docker, CI/CD automation, and scalable inference routing. Supports low-network zones, emergency triage alerts, caregiver dashboard + medical-history timeline records.",
    image: PregaCard,
    heroImage: PregaHero,
    logo: "🤰",
    technologies: [
      "MERN Stack", "Random Forest ML", "React Native", "FastAPI", "Flask API",
      "Cloud Messaging", "Docker", "Python", "Data Engineering", "MongoDB"
    ],
    category: "health-ai",
    featured: true,
    githubUrl: "https://github.com/harshshah-2023/mHealth-PregaView",
    liveUrl: "",
    hasLiveDemo: false,
    metrics: {
      sensitivity: "96% High-Risk Case Sensitivity",
      latency: "0.6s Alert Delivery",
      load: "5K Parallel ML Requests",
      features: "15+ Medical Feature Inputs"
    },
    highlights: [
      "Risk prediction using vitals + symptoms-based ML",
      "Doctor/caregiver tracking + escalation system",
      "DevOps CI/CD rollout + containerized ML backend",
      "Push notification alerts for critical risk spikes",
      "Automated medical-history + patient timeline log"
    ],
    maturityRating: "Research → Deployment Ready",
    year: "2024"
  },
  {
    id: 6,
    title: "Smart Real-Estate Marketplace with Property Intelligence",
    description: "AI-powered property valuation + fraud detection + location analytics marketplace.",
    fullDescription:
      "Built using MERN + analytics-powered backend to predict pricing, compare locality value, detect fake/duplicate listings, and score neighbourhood by proximity to hospitals, metro, schools. Features valuation engine (ML), geo-map search, ROI projection graphs, rent-yield calculator, and secured multi-role logins for owners, buyers and agents.",
    image: null,
    heroImage: null,
    logo: "🏠",
    technologies: [
      "MERN Stack", "GeoSearch", "Mapbox API", "JWT Auth",
      "Python Analytics", "Node.js", "React", "MongoDB", "TailwindCSS"
    ],
    category: "real-estate",
    featured: false,
    githubUrl: "",
    liveUrl: "",
    hasLiveDemo: false,
    metrics: {
      searchTime: "350ms Geo-Index Lookup",
      valuationModel: "±5-12% Price Estimation",
      fraudFilter: "AI-Based Auto-Flagging",
      dataset: "50K+ Property Data Points"
    },
    highlights: [
      "Price-estimation + Smart Recommendation Engine",
      "Neighbourhood Index Scorecard",
      "Fraud-scan + duplicate detection NLP model",
      "ROI Projection + Rent-Yield Visual Analytics",
      "Secure role system — Buyer/Seller/Admin"
    ],
    maturityRating: "Beta Launch",
    year: "2024"
  }
];
