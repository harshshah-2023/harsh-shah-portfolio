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
      title: "Web Development",
      icon: <Laptop className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { title: "Frontend", stack: ["React", "Next.js", "Tailwind", "TypeScript", "Redux"] },
        { title: "Backend", stack: ["Node.js", "Express", "NestJS", "REST APIs", "GraphQL"] },
        { title: "Databases", stack: ["MongoDB", "PostgreSQL", "Redis", "MySQL"] },
      ],
      projects: [
        { name: "E-Commerce Full-Stack Platform", tech: ["React", "Node.js", "Stripe", "JWT Auth"], desc: "Built scalable product pipelines and real-time inventory system." },
        { name: "Local Business CRM", tech: ["Next.js", "MongoDB", "Tailwind"], desc: "CRM with analytics dashboard + performance optimized API layer." },
      ],
    },

    devops: {
      title: "DevOps Engineering",
      icon: <Network className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { title: "CI/CD Automation", stack: ["GitHub Actions", "Jenkins", "ArgoCD"] },
        { title: "Cloud Infra", stack: ["AWS", "GCP", "Azure", "Docker"] },
        { title: "Monitoring & Scaling", stack: ["Prometheus", "Grafana", "Load Balancer"] }
      ],
      projects: [
        { name: "Multi-Cloud Kubernetes Deployment", tech: ["Kubernetes", "Terraform", "ArgoCD"], desc: "Built fail-safe infra with 75% faster deployment cycles." },
        { name: "CI/CD Pipeline Optimization", tech: ["Docker", "GitLab CI"], desc: "Reduced build time from 25m → 5m using caching & parallel runs." },
      ]
    },

    aiml: {
      title: "AIML Research & Development",
      icon: <Brain className="w-6 h-6 text-[rgb(70,135,145)]" />,
      skills: [
        { title: "Deep Learning", stack: ["CNN", "RNN", "Transformers", "Vision Models"] },
        { title: "ML Engineering", stack: ["TensorFlow", "PyTorch", "Scikit-Learn"] },
        { title: "MLOps", stack: ["ONNX", "Model Serving", "Cloud Inference"] },
      ],
      projects: [
        { name: "Pregaview – Maternal Health AI", tech: ["PyTorch", "FastAPI", "Android Integration"], desc: "AI-based risk prediction from vitals + symptoms." },
        { name: "CropRakshak – Plant Disease AI", tech: ["CNN", "Flask", "Mobile Optimized"], desc: "Crop disease detection + advisory for farmers." }
      ]
    }
  };

  return (
    <div className="min-h-screen w-full text-white px-5 sm:px-8 md:px-14 py-16 bg-gray-950">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Full-Stack • DevOps • <span style={{color:primary}}>AIML</span>
        </h1>
        <p className="text-gray-400 max-w-2xl sm:max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
          From pixels to pipelines to predictions — I build full systems with real-world deployable AI.
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
        Skills in <span style={{color:primary}}>{sections[tab].title}</span>
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
        Featured <span style={{color:primary}}>Projects</span>
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
            Let's Build Something Together 🚀
          </button>
        </Link>
      </div>

    </div>
  );
}
