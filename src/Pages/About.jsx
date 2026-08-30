import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiDocker, SiKubernetes, SiTensorflow, SiTailwindcss } from "react-icons/si";
import ProfilePic from "../assets/ProfilePic-840.webp";


export default function About() {
  return (
    <div className="min-h-screen w-full bg-ink-900 font-sans overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-16 px-6 sm:px-8 md:px-16 lg:px-24 py-32 relative">

        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(70,135,145,0.10)_0%,_transparent_70%)]"></div>

        {/* ================= IMAGE (Responsive) ================= */}
       <div className="relative w-[280px] sm:w-[360px] md:w-[420px] h-[380px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden ring-1 ring-white/[0.08] shadow-e4 group">

  {/*
    Above the fold, so it loads eagerly at high priority (it was lazy before,
    which delayed the LCP). The old `blur-sm group-hover:blur-0` left the photo
    permanently blurred on touch devices, where there is no hover - the blur is
    now only applied where hover actually exists.
  */}
  <img
    src={ProfilePic}
    width={840}
    height={828}
    loading="eager"
    fetchPriority="high"
    decoding="async"
    sizes="(max-width:768px) 60vw, 30vw"
    className="w-full h-full object-cover brightness-[0.85] transition-all duration-700
               [@media(hover:hover)]:blur-sm [@media(hover:hover)]:group-hover:blur-0"
    alt="Portrait of Harsh Shah"
  />

  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-500/10 to-transparent"></div>
</div>


        {/* ================= TEXT ================= */}
        <div className="max-w-xl text-center md:text-left relative">
          <p className="eyebrow mb-4">About Me</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            Hello, I&apos;m <span className="text-accent-500">Harsh Shah.</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-mist-200 font-light">
            Software Product Engineer <span className="text-mist-600">/</span> Software Engineer
          </p>

          <p className="mt-6 max-w-measure text-base sm:text-lg text-mist-400">
            I build products end to end &mdash; from
            <span className="text-accent-300 font-medium"> PRD and system architecture through design, implementation and release. </span>
            Currently a Jr. Product Engineer at Autoplant System, owning a Field Operations Management System from
            requirements to production. Across the stack: frontend experiences, backend systems, CI/CD automation and
            ML inference at scale &mdash; solutions that move fast, deploy seamlessly, and solve real-world problems.
          </p>

          <div className="h-px w-16 bg-accent-500 mt-8 mx-auto md:mx-0 rounded-full"></div>

          {/* ================= SOCIALS ================= */}
          <div className="flex justify-center md:justify-start gap-2 text-xl mt-8">

            <a href="https://github.com/harshshah-2023" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"
              className="p-3 rounded-lg border border-white/[0.07] bg-white/[0.04] text-mist-400
                         transition duration-200 ease-soft
                         hover:-translate-y-0.5 hover:border-accent-500/40 hover:text-accent-300 hover:shadow-glow">
              <FaGithub />
            </a>

            <a href="https://www.linkedin.com/in/harsh-shah-9848hs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"
              className="p-3 rounded-lg border border-white/[0.07] bg-white/[0.04] text-mist-400
                         transition duration-200 ease-soft
                         hover:-translate-y-0.5 hover:border-accent-500/40 hover:text-accent-300 hover:shadow-glow">
              <FaLinkedin />
            </a>

            <a href="mailto:harshshah9848@gmail.com" aria-label="Email Harsh Shah"
              className="p-3 rounded-lg border border-white/[0.07] bg-white/[0.04] text-mist-400
                         transition duration-200 ease-soft
                         hover:-translate-y-0.5 hover:border-accent-500/40 hover:text-accent-300 hover:shadow-glow">
              <FaEnvelope />
            </a>


          </div>
        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="mt-32 text-center px-6 md:px-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          What I <span className="text-accent-500">Do.</span>
        </h2>
        <p className="text-mist-400 max-w-measure mx-auto text-base sm:text-lg mb-16">
          Building scalable technology with modern engineering standards.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Product Engineering", icon:"🧭", desc:"PRD → Architecture → Delivery" },
            { title: "Full-Stack Build", icon:"💻", desc:"React + Node + MERN Systems" },
            { title: "Cloud & DevOps", icon:"☁️", desc:"AWS, Docker, CI/CD, IaC" },
            { title: "AI + ML Models", icon:"🧠", desc:"Training & Production Deployment" }
          ].map((s,i)=>(
            <div key={i} className="surface-interactive p-6 sm:p-8">
              <div className="text-3xl sm:text-4xl mb-4">{s.icon}</div>
              <h3 className="text-sm sm:text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-mist-400 text-xs sm:text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ================= TECH STACK ================= */}
      <section className="mt-32 text-center px-6">
        <h3 className="text-3xl sm:text-4xl font-bold">Tech Stack</h3>
        <p className="text-mist-400 mt-4 mb-16 text-sm sm:text-base">Tools I use to build production systems</p>

        <div className="flex flex-wrap justify-center gap-8 text-4xl text-mist-500">
          <SiNextdotjs className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
          <SiMongodb className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
          <SiDocker className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
          <SiKubernetes className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
          <SiTensorflow className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
          <SiTailwindcss className="transition duration-200 ease-soft hover:-translate-y-0.5 hover:text-accent-400" />
        </div>
      </section>


      {/* ================= CTA ================= */}
      <div className="text-center my-32">
        <Link
          to="/contact"
          className="inline-block px-8 py-4 rounded-lg bg-accent-500 text-ink-950 font-semibold text-base
                     shadow-glow transition duration-200 ease-soft
                     hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-glow-lg"
        >
          ⚡ Contact Me
        </Link>
      </div>

    </div>
  );
}
