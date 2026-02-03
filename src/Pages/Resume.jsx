import React from "react";
import { motion } from "framer-motion";
import resmePDF2 from "../assets/fullStack_harshshah_resume.pdf"
import { FileDown, Briefcase, GraduationCap, Layers, BrainCircuit } from "lucide-react";

export default function Resume() {

  const primary = "rgb(70,135,145)";

  return (
    <div className="min-h-screen bg-[#05090d] text-white px-6 sm:px-12 lg:px-32 py-32 font-sans relative overflow-hidden">

      {/* ======= BACKGROUND GLOW UI ======= */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-[rgb(70,135,145)] blur-[200px] opacity-25" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-teal-500 blur-[200px] opacity-25" />

      {/* ======= HEADER ======= */}
      <motion.div 
        initial={{ opacity: 0, y:20 }} 
        animate={{ opacity:1, y:0 }} 
        transition={{ duration:.8 }} 
        className="text-center mb-20"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Harsh <span className="text-[rgb(70,135,145)]">Shah</span>
        </h1>
        <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Senior Full-Stack Engineer & AI Systems Architect | Cloud Infrastructure | Platform Engineering | Production ML Systems
        </p>

     {/* <a
  href={resmePDF2}
  download="HarshShah_Resume.pdf"
  className="inline-flex items-center gap-3 mt-8 px-8 py-3 
             text-lg font-semibold rounded-xl border border-[rgb(70,135,145)]
             hover:bg-[rgb(70,135,145)] hover:text-white
             shadow-[0_0_15px_rgba(70,135,145,0.4)]
             transition-all duration-300 cursor-pointer"
>
  <FileDown /> Download Resume
</a> */}
      </motion.div>


      {/* ===================================== EXPERIENCE ===================================== */}
      <SectionTitle icon={<Briefcase />} title="Professional Experience" accent={primary} />

      <div className="space-y-7">
        {[
          {
            role: "Associate Software Engineer — AB Enterprise",
            date: "Jan 2025 – Nov 2025",
            pts: [
               "Architected and deployed cloud-native distributed systems on Azure,capable of handling 500,000+ daily requests with 99.95% uptime SLA",
    "Led full-stack performance optimization reducing API latency by 45% through Redis caching, database indexing, and frontend bundle optimization",
    "Engineered microservices backend architecture with React/Next.js frontend, implementing real-time features and responsive UI components",
    "Designed and implemented enterprise CI/CD pipelines with automated testing, security scanning, and blue-green deployments across cloud environments",
    "Built scalable REST/GraphQL APIs with comprehensive monitoring, logging, and frontend integration for seamless user experiences"
            ]
          },
          {
            role: "Software Engineer Intern — Ashtavinayak Automobile",
            date: "June 2024 – Dec 2024",
            pts: [
              "Designed and implemented full-stack inventory management system with React frontend and Node.js microservices backend.",
    "Built cloud-based real-time booking platform with WebSocket integration, featuring responsive UI components and automatic failover mechanisms",
    "Developed scalable AWS cloud infrastructure with auto-scaling groups and load balancers for high availability deployment",
    "Engineered enterprise security framework with RBAC on frontend, AES-256 encryption in backend APIs, and comprehensive audit trail logging",
    "Created interactive dashboard with real-time data visualization using React, Chart.js, and WebSocket connections for live updates",
    "Implemented CI/CD pipeline for automated deployment of frontend and backend components across development and production environments"
            ]
          }
        ].map((job,i)=>(
          <Card key={i}>
            <h3 className="text-xl sm:text-2xl font-bold">{job.role}</h3>
            <p className="text-gray-400 text-sm sm:text-base mt-1">{job.date}</p>
            <ul className="mt-4 ml-5 list-disc text-gray-300 space-y-1 text-base">
              {job.pts.map((p,j)=><li key={j}>{p}</li>)}
            </ul>
          </Card>
        ))}
      </div>


      {/* ===================================== PROJECTS ===================================== */}
      <SectionTitle icon={<Layers />} title="Architectural Projects" accent={primary} />

      <div className="grid sm:grid-cols-2 gap-8 mt-6">
        {[
          {
            title: "MahaKavach - Enterprise-Scale Smart City Infrastructure Platform",
            points: ["Architected and deployed a city-scale intelligent transportation platform for Mumbai's suburban railways, processing real-time crowd analytics from 150+ stations. Engineered a multi-cloud infrastructure with containerized microservices, achieving 99.99% availability and <500ms p95 latency. Integrated computer vision (YOLOv8) with deterministic GenAI explainability layers, reducing operational decision time by 40%. Implemented privacy-by-design data pipelines with complete anonymization and comprehensive security compliance."],
          },
          {
            title: "Citadel Flow - Enterprise Payment Orchestration & Observability Platform",
            points: ["Architected a cloud-native, state-machine-driven transaction orchestration system for mission-critical payment reliability. Engineered idempotent retry mechanisms with exponential backoff and circuit breaker patterns, increasing transaction recovery rates by 25%. Implemented comprehensive observability with distributed tracing, structured logging, and real-time metrics dashboards. Automated state transition validation through rigorous CI/CD pipelines with automated testing for all failure modes."],
          },
          {
            title: "Pregaview – Production ML System for Maternal Health Risk Assessment",
            points: ["Designed and deployed an end-to-end MLOps platform for real-time pregnancy risk classification using ensemble models (Random Forest/Gradient Boosting) and deep learning architectures. Engineered scalable inference pipelines on cloud infrastructure with automated model versioning, A/B testing capabilities, and comprehensive monitoring. Implemented HIPAA-compliant data pipelines with encryption at rest and in transit, enabling secure processing of sensitive health data."],
          },
          {
            title: "Medicare – IoT-Enabled Healthcare Automation Platform",
            points: ["Architected a distributed, event-driven microservices platform integrating IoT devices, mobile applications, and cloud services for elderly care automation. Designed fault-tolerant data ingestion pipelines handling 10,000+ concurrent device connections with real-time processing. Implemented role-based access control (RBAC) with OAuth 2.0, end-to-end encryption, and comprehensive audit trails. Engineered automated alerting systems with multi-channel notification delivery and escalation policies."]
          }
        ].map((proj,i)=>(
          <Card key={i}>
            <h3 className="text-xl font-semibold">{proj.title}</h3>
            <ul className="ml-5 list-disc text-gray-300 mt-3 space-y-1">
              {proj.points.map((p,j)=><li key={j}>{p}</li>)}
            </ul>
          </Card>
        ))}
      </div>


      {/* ===================================== SKILLS ===================================== */}
      <SectionTitle icon={<BrainCircuit />} title="Technical Architecture & Expertise" accent={primary} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[
          "System Design & Architecture",
          "Microservices & Distributed Systems",
          "Cloud Infrastructure (AWS/Azure/GCP)",
          "Kubernetes & Container Orchestration",
          "MLOps & Production ML Systems",
          "LLM Integration & AI Systems",
          "Real-time Data Processing",
          "Enterprise Security & Compliance",
          "Database Performance Optimization",
          "CI/CD & DevOps Automation",
          "API Design & REST/GraphQL",
          "Monitoring & Observability"
        ].map((skill,i)=>(
          <SkillBadge key={i}>{skill}</SkillBadge>
        ))}
      </div>

       {/* ===================================== ACHIEVEMENTS ===================================== */}
      <SectionTitle icon={<award className="w-6 h-6" />} title="Achievements" accent={primary} />

      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">🏆 1st Place Winner — Intra University Engineering Day Competition</h3>
            <p className="text-gray-300 mt-1">
              Awarded for developing a cloud-based IoT integrated full-stack system featuring real-time data processing, 
              device management dashboard, and predictive analytics using machine learning
            </p>
          </div>
          <a 
            href="https://www.linkedin.com/posts/harsh-shah-9848hs_engineeringday-innovation-iot-activity-7382267970267508736-ez37?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD3nXAoBNEekk4L3T3FgtjZSBXlmAIuru6Y" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-[rgb(70,135,145)] text-[rgb(70,135,145)] 
                     hover:bg-[rgb(70,135,145)] hover:text-white transition-all duration-300 
                     whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            View on LinkedIn
          </a>
        </div>
      </Card>


      {/* ===================================== EDUCATION ===================================== */}
      <SectionTitle icon={<GraduationCap />} title="Education" accent={primary} />

      <Card>
        <p className="text-xl pb-2 font-semibold">Bachelor of Technology — Computer Engineering</p>
        <p className="text-gray-300">Amity University — Graduation 2026</p>
        <p className="mt-2 text-gray-400">Higher Secondary: 91.67% | Secondary: 82.40%</p>
      </Card>

      <div className="pb-20" />
    </div>
  );
}


/* ============================================================================================
   REUSABLE UI COMPONENTS
================================================================================================ */

const SectionTitle = ({ icon, title, accent }) => (
  <motion.h2 
    initial={{ opacity:0, y:20}} 
    whileInView={{ opacity:1, y:0}} 
    viewport={{ once:true }} 
    className="text-3xl sm:text-4xl font-bold mb-10 flex items-center gap-3 border-l-4 pl-3"
    style={{ borderColor: accent }}
  >
    <span style={{ color: accent }}>{icon}</span> {title}
  </motion.h2>
);

const Card = ({ children }) => (
  <motion.div
    initial={{ opacity:0, y:20 }}
    whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true }}
    className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 
               shadow-[0_0_25px_rgba(255,255,255,0.05)] backdrop-blur-md 
               hover:border-[rgb(70,135,145)] hover:shadow-[0_0_25px_rgba(70,135,145,0.35)]
               transition-all duration-300"
  >
    {children}
  </motion.div>
);

const SkillBadge = ({ children }) => (
  <div className="text-center bg-white/5 border border-white/10 py-3 rounded-xl 
                  hover:border-[rgb(70,135,145)] transition shadow-sm text-sm sm:text-base">
    {children}
  </div>
);