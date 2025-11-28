import React from "react";
import { motion } from "framer-motion";
import resumePDF from "../assets/Harshshah_resume_SDE.pdf";
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
          Full-Stack | DevOps | AI/ML I architect systems where performance meets prediction, and automation replaces human friction.
        </p>

        <a
          href={resumePDF}
          download="HarshShah_Resume.pdf"
          className="inline-flex items-center gap-3 mt-8 px-8 py-3 
                     text-lg font-semibold rounded-xl border border-[rgb(70,135,145)]
                     hover:bg-[rgb(70,135,145)] hover:text-white shadow-[0_0_15px_rgba(70,135,145,0.4)]
                     transition-all duration-300"
        >
          <FileDown /> Download Resume
        </a>
      </motion.div>


      {/* ===================================== EXPERIENCE ===================================== */}
      <SectionTitle icon={<Briefcase />} title="Experience" accent={primary} />

      <div className="space-y-7">
        {[
          {
            role: "Full Stack Developer Intern — AB Enterprise",
            date: "Jan 2025 – June 2025",
            pts: [
              "Developed scalable backend handling 50,000+ daily requests.",
              "Reduced API latency by 35% using Redis caching + indexes.",
              "CI/CD pipelines using GitHub Actions + Docker."
            ]
          },
          {
            role: "Software Engineer Intern — Ashtavinayak Automobile",
            date: "Aug 2024 – Nov 2024",
            pts: [
              "Inventory engine processing 30,000+ transactions/day.",
              "Real-time WebSocket based booking system.",
              "RBAC + AES-256 secure system with audit trail."
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
      <SectionTitle icon={<Layers />} title="Major Projects" accent={primary} />

      <div className="grid sm:grid-cols-2 gap-8 mt-6">
        {[
          {
            title: "Pregaview – AI Maternal Health Risk Prediction",
            points: ["94% ML accuracy", "1000+ real-time predictions/hour"],
          },
          {
            title: "Medicare – IoT + ML Medical Automation System",
            points: ["Fall detection 96% accurate", "<50ms emergency response latency"],
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
      <SectionTitle icon={<BrainCircuit />} title="Technical Skills" accent={primary} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[
          "JavaScript · Python · C++",
          "Node.js · Express · WebSockets",
          "MongoDB · PostgreSQL · Redis",
          "Docker · CI/CD · Kubernetes",
          "TensorFlow · TFLite · CNNs",
          "System Design · Microservices",
        ].map((skill,i)=>(
          <SkillBadge key={i}>{skill}</SkillBadge>
        ))}
      </div>


      {/* ===================================== EDUCATION ===================================== */}
      <SectionTitle icon={<GraduationCap />} title="Education" accent={primary} />

      <Card>
        <p className="text-xl font-semibold">B.Tech — Computer Engineering</p>
        <p className="text-gray-300">Amity University — Graduation 2026</p>
        <p className="mt-2 text-gray-400">HSC: 91.67% | CBSE: 82.40%</p>
      </Card>

      <div className="pb-20" />
    </div>
  );
}


/* ============================================================================================
   🔥 REUSABLE UI COMPONENTS — makes the design look premium + consistent
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
