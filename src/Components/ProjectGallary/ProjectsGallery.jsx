import React, { useState, useRef, useEffect } from "react";
import ProjectHero from "./ProjectHero";
import ProjectModal from "./ProjectModal";
import MahakavachHero from "../../assets/Mahakavach_hero.png";
import citadelHero from "../../assets/citadelFlowHEro.png";
import PregaHero from "../../assets/PregaviewHero.jpeg";

export default function ProjectsGallery() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "MahaKavach — AI Crowd Prediction & Transit Analytics Platform",
      description: "CV + GenAI-powered crowd intelligence for public transit with real-time APIs.",
      fullDescription:
        "MahaKavach is a city-scale crowd prediction system for Mumbai suburban railways integrating computer vision (YOLO), GenAI explainability, and real-time APIs. The platform processes live video feeds from 150+ stations, provides crowd density predictions, and generates actionable insights through GenAI interpretation. Features include heatmap visualizations, predictive analytics for peak hours, automated alerts, and a comprehensive dashboard for transit authorities. Built with microservices architecture for high availability and low latency.",
      image: MahakavachHero,
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
      image: citadelHero,
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
      image: "/api/placeholder/800/450",
      heroImage: "/api/placeholder/1920/1080",
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
      image: "/api/placeholder/800/450",
      heroImage: "/api/placeholder/1920/1080",
      logo: "🌾",
      technologies: [
        "MERN Stack", "CNN Deep Learning", "OpenCV", "Python", "Flask API",
        "Node.js", "Express", "React", "Firebase", "REST APIs",
        "NOAA Weather Data", "Javascript", "MongoDB"
      ],
      category: "ai-agriculture",
      featured: true,
      githubUrl: "https://github.com/yourusername/croprakshak",
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
      image: PregaHero,
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
      image: "/api/placeholder/800/450",
      heroImage: "/api/placeholder/1920/1080",
      logo: "🏠",
      technologies: [
        "MERN Stack", "GeoSearch", "Mapbox API", "JWT Auth",
        "Python Analytics", "Node.js", "React", "MongoDB", "TailwindCSS"
      ],
      category: "real-estate",
      featured: false,
      githubUrl: "https://github.com/yourusername/smart-realestate",
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

  useEffect(() => {
    setActiveProject(projects[0]);
  }, []);

  const openProject = (p) => {
    setActiveProject(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectDetails = () => {
    console.log("handleProjectDetails called, activeProject:", activeProject);
    if (activeProject) {
      console.log("Setting selected project:", activeProject.title);
      setSelectedProject(activeProject);
      setIsModalOpen(true);
    } else {
      console.log("No active project found");
    }
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleStartProject = () => {
    window.location.href = "/contact";
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#020611] via-black to-[#020611]">

      <div ref={heroRef}>
        {activeProject && (
          <ProjectHero 
            project={activeProject} 
            onInfo={handleProjectDetails} 
          />
        )}
      </div>

      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <p className="px-6 inline-block py-1 text-sm tracking-widest rounded-full bg-[#0a1b28] text-[rgb(70,135,145)] border border-[#123a4a]">
            🚀 HIGH-IMPACT PROJECT BUILDS
          </p>

          <h2 className="text-6xl font-bold mt-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Built for Scale & Performance
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto mt-3 leading-relaxed">
            Systems engineered like products — optimized, automated & production-focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => openProject(p)}
              className="group p-[2px] rounded-3xl cursor-pointer transition duration-500
                         bg-gradient-to-br from-[#11202c] to-[#050a11]
                         hover:shadow-[0_0_35px_-6px_rgba(70,135,145,0.5)] hover:scale-[1.04]">

              <div className="rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10">

                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 duration-700" 
                  />
                  <span className="absolute top-3 right-3 px-3 text-xs rounded-full bg-black/70 border border-white/20">
                    {p.category}
                  </span>
                  {p.hasLiveDemo && (
                    <span className="absolute top-3 left-3 px-3 text-xs rounded-full bg-green-900/70 border border-green-500/20">
                      🌐 Live Demo
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold group-hover:text-[rgb(70,135,145)] duration-200">{p.title}</h3>
                  <p className="text-gray-400 text-sm my-2 line-clamp-2">{p.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.technologies.slice(0, 4).map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-full border border-white/10">
                        {t}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="text-[10px] opacity-70">+{p.technologies.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 pb-6">
                  <span className="text-gray-500 text-xs">{p.year}</span>
                  <span className="text-[rgb(70,135,145)] text-[11px] border border-white/10 px-2 py-1 rounded-full">
                    {p.maturityRating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-28">
          <h3 className="text-3xl font-bold mb-4">Want a System Like These?</h3>
          <p className="text-gray-400 mb-6">Let's build something technically serious.</p>
          <button 
            onClick={handleStartProject}
            className="px-8 py-4 bg-[rgb(70,135,145)] rounded-xl text-black font-semibold hover:bg-[#57bcca] transition shadow-lg cursor-pointer"
          >
            🔥 Start a Project
          </button>
        </div>
      </section>

      {isModalOpen && selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal} 
        />
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 p-3 rounded-lg text-xs z-50">
          <div>Active: {activeProject?.title}</div>
          <div>Modal: {isModalOpen ? "Open" : "Closed"}</div>
        </div>
      )}
    </div>
  );
}