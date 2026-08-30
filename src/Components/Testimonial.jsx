import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TESTIMONIALS = [
  {
    quote:
      "A rare full-stack developer with the ability to design, build, deploy, scale and optimize end-to-end systems — including AI-enabled automation.",
    name: "Dr. Allan Matthews",
    role: "Director of Engineering",
    company: "NeuraSoft Innovations",
  },
  {
    quote:
      "Brings both system thinking & creativity. Delivered a product that scaled 10x traffic without infra expansion. Outstanding engineering clarity.",
    name: "Priya Desai",
    role: "VP — Platform Architecture",
    company: "CloudMatrix Labs",
  },
  {
    quote:
      "AI + Web + DevOps — this level of hybrid thinking is extremely hard to find in early-career engineers. Future tech leader without question.",
    name: "Rohit Talreja",
    role: "CTO",
    company: "CYBERX AI",
  },
];

export default function TestimonialShowcase() {
  const [index, setIndex] = useState(0);


  useEffect(() => {
    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(auto);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 md:px-20 py-24 relative overflow-hidden">

      {/* ---- Ambient Glow Background ---- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(70,135,145) 0%, transparent 70%)" }}
      />

      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 text-sm font-semibold rounded-full bg-white/10 border border-white/20 tracking-widest text-[rgb(70,135,145)]">
            TRUST • EXPERIENCE • IMPACT
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold 
                       bg-gradient-to-r from-white to-gray-300 
                       bg-clip-text text-transparent leading-tight">
          Why People Trust My Work
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4">
          Engineers build features.  
          <span className="text-[rgb(70,135,145)] font-medium">I build outcomes — measurable, scalable, production-ready.</span>
        </p>
      </motion.div>

      {/* ---- Main Testimonial Spotlight ---- */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/10
                   p-10 md:p-14 flex flex-col lg:flex-row gap-12 items-center mx-auto max-w-6xl"
      >
        {/* Video */}
       {/* Technical Impact Highlights (Replaces Video Section) */}
<div className="lg:w-1/2 grid grid-cols-1 gap-6">

{/* Block 1 — Scalable Architecture */}
<motion.div 
  whileHover={{ scale: 1.03, y: -6 }} 
  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-[rgb(70,135,145)]/25 transition-all"
>
  <p className="text-lg font-semibold text-[rgb(70,135,145)]">⚡ Scalable Architecture Delivery</p>
  <p className="text-gray-300 mt-2 text-sm leading-relaxed">
    Designed microservice-driven systems using Kubernetes, CI/CD & fail-safe retries — handled <b>10x user growth without infra expansion.</b>
  </p>
</motion.div>

{/* Block 2 — AI/ML Engineering */}
<motion.div 
  whileHover={{ scale: 1.03, y: -6 }} 
  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-[rgb(70,135,145)]/25 transition-all"
>
  <p className="text-lg font-semibold text-[rgb(70,135,145)]">🧠 AI-Powered Product Development</p>
  <p className="text-gray-300 mt-2 text-sm leading-relaxed">
    Deployed ML models (CNN + Transformers + ONNX optimisation) with <b>real-time inference</b> & <b>95%+ accuracy</b> for production-grade use cases.
  </p>
</motion.div>

{/* Block 3 — Full-Stack + DevOps Integration */}
<motion.div 
  whileHover={{ scale: 1.03, y: -6 }} 
  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-[rgb(70,135,145)]/25 transition-all"
>
  <p className="text-lg font-semibold text-[rgb(70,135,145)]">🔗 Full-Stack + Infra Synergy</p>
  <p className="text-gray-300 mt-2 text-sm leading-relaxed">
    End-to-end delivery — <b>React UI → Node backend → Docker → Kubernetes → Cloud Scaling</b>. 
    Eliminated deployment friction + <b>60% faster release cycles.</b>
  </p>
</motion.div>

</div>



        {/* Textual Testimony */}
        <div className="lg:w-1/2 space-y-6">
          <Quote className="w-10 h-10 text-[rgb(70,135,145)] opacity-50" />
          <p className="text-2xl md:text-3xl font-medium leading-normal">
            {TESTIMONIALS[index].quote}
          </p>

          <div>
            <p className="text-xl font-semibold">{TESTIMONIALS[index].name}</p>
            <p className="text-[rgb(70,135,145)] font-medium">{TESTIMONIALS[index].role}</p>
            <p className="text-gray-400 text-sm">{TESTIMONIALS[index].company}</p>
          </div>

          {/* Was a dead <button> with no handler; now routes to the resume. */}
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[rgb(70,135,145)]
                       hover:bg-[rgb(70,135,145)]/80 transition-all font-semibold"
          >
            View Full Experience <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>

      {/* ---- Slide Dots ---- */}
      <div className="flex gap-3 justify-center mt-10">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-[rgb(70,135,145)] scale-125" : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* ---- 6 Mini Testimonials Grid (Trust Slam) ---- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
        {[
          {
            name: "Susan Baker • Lead DevOps",
            text: "Infrastructure scaling was seamless. Zero downtime, automated rollouts & monitoring — brilliant execution.",
          },
          {
            name: "Arjun Mehta • CEO",
            text: "Can independently design systems from UI → backend → DevOps → AI. A complete product powerhouse.",
          },
          {
            name: "Daniel Ross • Tech Lead",
            text: "Understands engineering deeply — speaks code, thinks architecture, executes like product owner.",
          },
          {
            name: "Angela Lopez • PM",
            text: "Communication, clarity, speed — rare combination. Delivered results ahead of schedule consistently.",
          },
          {
            name: "Vishal Jain • Research Head",
            text: "AI pipelines optimized to 4x speed with quantization + ONNX export — practical research talent.",
          },
          {
            name: "Michael Ford • Founder",
            text: "UI stunning, backend stable, infra self-healing. A person you want in early-stage teams.",
          },
        ].map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, scale: 1.03 }}
            className="bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md transition-all"
          >
            <div className="flex mb-4">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 text-[rgb(70,135,145)] fill-[rgb(70,135,145)]" />
              ))}
            </div>
            <p className="text-lg text-gray-100 mb-4">{t.text}</p>
            <p className="text-[rgb(70,135,145)] font-medium text-sm">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
