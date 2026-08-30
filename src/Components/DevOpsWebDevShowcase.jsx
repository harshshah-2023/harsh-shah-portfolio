import { useState } from 'react';
import { Laptop, Cloud, Brain, Network } from "lucide-react";
import { Link } from "react-router-dom";

export default function PortfolioSkillsShowcase() {
  const [tab, setTab] = useState("web");

  const sections = {
    web: {
      title: "Full Stack Engineering",
      icon: <Laptop className="w-5 h-5" />,
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
      icon: <Cloud className="w-5 h-5" />,
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
      icon: <Network className="w-5 h-5" />,
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
      icon: <Brain className="w-5 h-5" />,
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
    <div className="min-h-screen w-full px-6 sm:px-8 md:px-16 py-24 bg-ink-900">

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="mx-auto max-w-measure-lg text-3xl sm:text-4xl md:text-5xl font-bold text-mist-50">
          Full Stack Engineering <span className="text-mist-600">•</span> <span className="text-accent-500">Cloud Architecture</span> <span className="text-mist-600">•</span> Platform Engineering <span className="text-mist-600">•</span> <span className="text-accent-500">Machine Learning Systems</span>
        </h1>
        <p className="mt-6 mx-auto max-w-measure text-base sm:text-lg font-light text-mist-400">
          From system design to production deployment — I architect and build scalable systems with production-grade AI/ML integration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center overflow-x-auto no-scrollbar px-2 sm:px-0 mb-16 gap-2">
        {Object.keys(sections).map((key)=>(
          <button key={key} type="button" onClick={()=>setTab(key)}
            aria-pressed={tab===key}
            className={`px-4 sm:px-6 py-3 text-sm rounded-lg whitespace-nowrap
            transition duration-200 ease-soft
            ${tab===key
              ? "bg-ink-750 text-mist-50 ring-1 ring-accent-500/40 shadow-glow"
              : "text-mist-400 hover:-translate-y-0.5 hover:text-mist-100 hover:bg-white/[0.04]"}`}>
            <div className="flex items-center gap-2">
              <span className={tab===key ? "text-accent-400" : "text-mist-500"}>{sections[key].icon}</span>
              <span>{sections[key].title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Skills */}
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-mist-50">
        Expertise in <span className="text-accent-500">{sections[tab].title}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {sections[tab].skills.map((skill,i)=>(
          <div key={i} className="surface-interactive p-6">
            <h3 className="text-lg font-semibold mb-4 text-accent-400">{skill.title}</h3>
            <div className="flex flex-wrap gap-2">{skill.stack.map(s=>
              <span key={s} className="text-xs px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-mist-400">{s}</span>
            )}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-mist-50">
        Enterprise <span className="text-accent-500">Projects</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections[tab].projects.map((p,i)=>(
          <div key={i} className="surface-interactive p-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-accent-400">{p.name}</h3>
            <p className="text-sm text-mist-400 mb-6 max-w-measure">{p.desc}</p>
            <div className="flex flex-wrap gap-2">{p.tech.map(t=>
              <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-mist-400">{t}</span>
            )}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link to="/contact">
          <button className="rounded-lg border border-accent-500/60 px-8 py-3
          text-sm sm:text-base font-medium text-mist-100 shadow-e2
          transition duration-200 ease-soft
          hover:-translate-y-0.5 hover:bg-accent-500 hover:text-ink-950 hover:shadow-glow-lg">
            Let&apos;s Build Something Together
          </button>
        </Link>
      </div>

    </div>
  );
}
