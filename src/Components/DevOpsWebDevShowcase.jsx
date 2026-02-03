import React, { useState } from "react";
import {
  Laptop, Cloud, Cpu, Database, GitBranch, Zap, Brain, Code, Network, BarChart3, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PortfolioSkillsShowcase() {
  const [tab, setTab] = useState("web");
  const primary = "rgb(70,135,145)";

  const sections = {
    web: {
      title: "Full Stack Engineering",
      icon: <Laptop className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { 
          title: "Frontend Architecture", 
          stack: ["React 18+", "Next.js 14", "TypeScript", "State Management", "Performance Optimization"] 
        },
        { 
          title: "Backend Systems", 
          stack: ["Node.js Microservices", "GraphQL/REST APIs", "Authentication/Authorization", "API Security"] 
        },
        { 
          title: "Data Layer", 
          stack: ["PostgreSQL Optimization", "MongoDB Scalability", "Redis Caching", "Database Design"] 
        },
      ],
      projects: [
        { 
          name: "Enterprise E-Commerce Platform", 
          tech: ["React", "Node.js Microservices", "Payment Integration", "Real-time Analytics"], 
          desc: "Architected scalable platform handling 10k+ concurrent users with optimized checkout flow and inventory management." 
        },
        { 
          name: "B2B SaaS Platform", 
          tech: ["Next.js 14", "TypeScript", "PostgreSQL", "WebSocket"], 
          desc: "Built performant dashboard with real-time collaboration features and automated reporting system." 
        },
      ],
    },

    cloud: {
      title: "Cloud & Infrastructure",
      icon: <Cloud className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { 
          title: "Cloud Architecture", 
          stack: ["AWS Certified", "Multi-region Deployments", "Infrastructure as Code", "Cloud Security"] 
        },
        { 
          title: "Serverless & Compute", 
          stack: ["Lambda Architectures", "Container Orchestration", "Auto-scaling", "Cost Optimization"] 
        },
        { 
          title: "Cloud-Native Services", 
          stack: ["AWS ECS/EKS", "Azure Functions", "GCP Cloud Run", "Managed Databases"] 
        }
      ],
      projects: [
        { 
          name: "Multi-Cloud Migration Strategy", 
          tech: ["AWS", "Terraform", "Kubernetes", "CI/CD Pipeline"], 
          desc: "Led migration of legacy monolith to cloud-native microservices, achieving 99.99% uptime and 60% cost reduction." 
        },
        { 
          name: "Serverless Data Pipeline", 
          tech: ["AWS Lambda", "Step Functions", "S3", "Event-Driven Architecture"], 
          desc: "Designed event-driven architecture processing 1M+ daily events with real-time analytics capabilities." 
        },
      ]
    },

    devops: {
      title: "Platform Engineering",
      icon: <Network className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { 
          title: "CI/CD & Automation", 
          stack: ["GitOps Workflows", "Infrastructure Automation", "Security Scanning", "Release Management"] 
        },
        { 
          title: "Containerization", 
          stack: ["Docker Best Practices", "Kubernetes Administration", "Service Mesh", "Cluster Security"] 
        },
        { 
          title: "Observability", 
          stack: ["Distributed Tracing", "Performance Monitoring", "Alerting Systems", "Incident Response"] 
        }
      ],
      projects: [
        { 
          name: "Platform Engineering Initiative", 
          tech: ["Kubernetes", "ArgoCD", "Prometheus Stack", "Service Mesh"], 
          desc: "Built internal developer platform reducing deployment time from days to minutes with automated security compliance." 
        },
        { 
          name: "SRE Implementation", 
          tech: ["SLI/SLO Definition", "Error Budgets", "Chaos Engineering", "Capacity Planning"], 
          desc: "Established SRE practices improving system reliability from 95% to 99.95% with defined error budgets." 
        },
      ]
    },

    mlai: {
      title: "Machine Learning & AI Systems",
      icon: <Brain className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { 
          title: "ML Engineering", 
          stack: ["MLOps Pipelines", "Model Deployment", "A/B Testing", "Feature Engineering"] 
        },
        { 
          title: "AI Systems Design", 
          stack: ["LLM Integration", "Vector Databases", "RAG Architectures", "AI Safety"] 
        },
        { 
          title: "Data Science", 
          stack: ["Statistical Modeling", "Deep Learning", "Computer Vision", "NLP Systems"] 
        },
      ],
      projects: [
        { 
          name: "Enterprise AI Assistant Platform", 
          tech: ["LLM Fine-tuning", "Vector Embeddings", "RAG Architecture", "API Gateway"], 
          desc: "Built scalable AI assistant integrating multiple LLMs with enterprise data sources and custom fine-tuning." 
        },
        { 
          name: "Predictive Analytics System", 
          tech: ["TensorFlow", "MLflow", "Real-time Inference", "Model Monitoring"], 
          desc: "Developed end-to-end ML pipeline for real-time predictions with automated retraining and model versioning." 
        }
      ]
    }
  };

  return (
    <div className="min-h-screen w-full text-white px-5 sm:px-8 md:px-14 py-16 bg-gray-950">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Full Stack Engineering • <span style={{color:primary}}>Cloud Architecture</span> • Platform Engineering • <span style={{color:primary}}>Machine Learning Systems</span>
        </h1>
        <p className="text-gray-400 max-w-2xl sm:max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
          From system design to production deployment — I architect and build scalable systems with production-grade AI/ML integration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center overflow-x-auto no-scrollbar px-2 sm:px-0 mb-10 gap-2 sm:gap-3">
        {Object.keys(sections).map((key)=>(
          <button key={key} onClick={()=>setTab(key)}
            className={`px-4 sm:px-6 py-2 text-xs sm:text-sm rounded-md whitespace-nowrap transition
            ${tab===key?"bg-gray-800 text-white shadow-lg shadow-[rgba(70,135,145,0.5)] scale-105":
            "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <div className="flex items-center gap-2">{sections[key].icon}<span>{sections[key].title}</span></div>
          </button>
        ))}
      </div>

      {/* Skills */}
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
        Expertise in <span style={{color:primary}}>{sections[tab].title}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {sections[tab].skills.map((skill,i)=>(
          <div key={i}
            className="bg-gray-900 p-5 rounded-xl border border-gray-700 
            hover:border-[rgb(70,135,145)] transition shadow hover:shadow-[rgba(70,135,145,0.4)]">
            <h3 className="text-lg font-semibold mb-2" style={{color:primary}}>{skill.title}</h3>
            <div className="flex flex-wrap gap-2">{skill.stack.map(s=>
              <span key={s} className="text-[10px] sm:text-xs bg-gray-800 px-2 py-1 rounded-md border border-gray-700">{s}</span>
            )}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
        Enterprise <span style={{color:primary}}>Projects</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections[tab].projects.map((p,i)=>(
          <div key={i}
            className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-[rgb(70,135,145)]
            hover:scale-[1.02] transition shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{color:primary}}>{p.name}</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3">{p.desc}</p>
            <div className="flex flex-wrap gap-2">{p.tech.map(t=>
              <span key={t} className="text-[10px] sm:text-xs bg-gray-800 px-2 py-1 rounded-md border border-gray-700">{t}</span>
            )}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link to="/contact">
          <button className="px-6 sm:px-8 py-3 rounded-md border-2 border-[rgb(70,135,145)]
          hover:bg-[rgb(70,135,145)] hover:text-black transition text-sm sm:text-base font-medium">
            Let's Build Something Together 
          </button>
        </Link>
      </div>

    </div>
  );
}