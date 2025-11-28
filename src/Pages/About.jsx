import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiDocker, SiKubernetes, SiTensorflow, SiTailwindcss } from "react-icons/si";
import ProfilePic from "../assets/ProfilePic.webp";


export default function About() {
  return (
    <div className="min-h-screen w-full bg-[#020203] text-white font-sans overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 px-6 sm:px-10 md:px-20 lg:px-28 py-28 relative">

        {/* radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,204,0.08)_0%,_transparent_70%)]"></div>

        {/* ================= IMAGE (Responsive) ================= */}
       <div className="relative w-[280px] sm:w-[360px] md:w-[420px] h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden border border-teal-400/30 shadow-[0px_0px_45px_10px_rgba(0,255,200,0.1)] group">

  <img  
    src={ProfilePic}  
    srcSet={`${ProfilePic} 1x, ${ProfilePic} 2x`}
    loading="lazy"
    sizes="(max-width:768px) 60vw, 30vw"
    className="w-full h-full object-cover brightness-[0.82] transition-all duration-700 
               blur-sm group-hover:blur-0"
    alt="Harsh Shah"
  />

  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-300/10 to-transparent"></div>
</div>


        {/* ================= TEXT ================= */}
        <div className="max-w-xl text-center md:text-left relative">
          <p className="text-teal-400 tracking-[4px] text-xs sm:text-sm mb-2 sm:mb-3">ABOUT ME</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Hello, I'm <span className="text-teal-400">Harsh Shah.</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mt-5">
            A full-stack engineer specialising in 
            <span className="text-teal-300 font-semibold"> Web-Dev, DevOps & AI-ML pipelines. </span>
            I build products end-to-end — from frontend UI to backend architecture, 
            container orchestration, cloud infra & ML model deployment.
          </p>

          <div className="h-[2px] w-32 sm:w-40 bg-teal-500 mt-5 sm:mt-6 shadow-[0_0_18px_teal] rounded-full"></div>

          {/* ================= SOCIALS ================= */}
          <div className="flex justify-center md:justify-start gap-6 text-xl sm:text-2xl mt-6 sm:mt-8">

            <a href="https://github.com/harshshah-2023" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-teal-400 transition cursor-pointer" />
            </a>

            <a href="https://www.linkedin.com/in/harsh-shah-9848hs" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-teal-400 transition cursor-pointer" />
            </a>

            <a href="mailto:harshshah9848@gmail.com">
              <FaEnvelope className="hover:text-teal-400 transition cursor-pointer" />
            </a>

            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-teal-400 transition cursor-pointer" />
            </a>
          </div>
        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="mt-24 sm:mt-32 text-center px-6 md:px-20">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
          What I <span className="text-teal-400">Do.</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-12">
          Building scalable technology with modern engineering standards.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { title: "Web Engineering", icon:"💻", desc:"Next.js + MERN + UI/UX Systems" },
            { title: "DevOps Automation", icon:"⚙️", desc:"Docker, CI/CD, Scaling" },
            { title: "Cloud Infra", icon:"☁️", desc:"AWS | Serverless | IaC" },
            { title: "AI + ML Models", icon:"🧠", desc:"Training & Production Deployment" }
          ].map((s,i)=>(
            <div key={i} className="py-8 sm:py-10 rounded-2xl bg-[#07090d] border border-white/10 
                 hover:border-teal-400/40 hover:scale-[1.05] transition shadow-xl">
              <div className="text-3xl sm:text-4xl mb-3">{s.icon}</div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ================= TECH STACK ================= */}
      <section className="mt-24 sm:mt-32 text-center px-4">
        <h3 className="text-3xl sm:text-4xl font-bold">Tech Stack</h3>
        <p className="text-gray-400 mt-2 sm:mt-3 mb-10 text-sm sm:text-base">Tools I use to build production systems</p>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-4xl sm:text-5xl">
          <SiNextdotjs className="hover:text-teal-400 transition" />
          <SiMongodb className="hover:text-teal-400 transition" />
          <SiDocker className="hover:text-teal-400 transition" />
          <SiKubernetes className="hover:text-teal-400 transition" />
          <SiTensorflow className="hover:text-teal-400 transition" />
          <SiTailwindcss className="hover:text-teal-400 transition" />
        </div>
      </section>


      {/* ================= CTA ================= */}
      <div className="text-center my-24 sm:my-32">
        <a href="mailto:harshshah9848@gmail.com"
           className="px-10 sm:px-12 py-4 sm:py-5 rounded-xl bg-teal-500 text-black font-bold text-lg sm:text-xl 
                     hover:bg-teal-300 transition shadow-[0_0_25px_teal]">
          ⚡ Contact Me
        </a>
      </div>

    </div>
  );
}
