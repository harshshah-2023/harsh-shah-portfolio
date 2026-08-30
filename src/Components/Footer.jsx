import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-mist-300 border-t border-white/[0.06] pt-24 pb-10">

      {/* ==== TOP GRID ==== */}
      <div className="max-w-7xl mx-auto px-6 md:px-8
                      grid gap-16 sm:grid-cols-2 lg:grid-cols-3
                      text-center sm:text-left">

        {/* INTRO SECTION */}
        <div>
          <h2 className="text-3xl font-semibold text-mist-50">
            Harsh <span className="text-accent-500">Shah</span>
          </h2>

          <p className="mt-4 text-sm text-mist-400 max-w-measure-sm mx-auto sm:mx-0">
            Software Product Engineer • Full-Stack • DevOps
            <br />
            Building scalable systems &amp; intelligent AI-powered products.
          </p>

          {/* Tags */}
          <div className="flex justify-center sm:justify-start gap-2 flex-wrap mt-6">
            {["Product Engineering", "Full-Stack", "DevOps", "Cloud", "AI/ML"].map((tag,i) => (
              <span key={i}
                className="px-3 py-1 text-xs rounded-full border border-white/[0.07]
                           bg-white/[0.04] text-mist-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-mist-50">
            Navigation
            <span className="block w-8 h-px mt-2 mx-auto sm:mx-0 rounded-full bg-accent-500"></span>
          </h3>

          <ul className="mt-6 space-y-2 text-sm font-light">
            {[
              {name:"Home",href:"/"},
              {name:"Projects",href:"/projects"},
              {name:"About",href:"/about"},
              {name:"Blog",href:"/blog"},
              {name:"Contact",href:"/contact"}
            ].map((nav,i)=>(
              <li key={i}>
                <Link to={nav.href}
                   className="inline-block py-1 text-mist-400 hover:text-mist-50
                              hover:translate-x-0.5 transition duration-200 ease-soft">
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-mist-50">
            Connect
            <span className="block w-8 h-px mt-2 mx-auto sm:mx-0 rounded-full bg-accent-500"></span>
          </h3>

          <p className="mt-6 text-sm text-mist-400 max-w-measure-sm mx-auto sm:mx-0">
            Available for roles, collaborations &amp; freelance development.
          </p>

          {/* Social Buttons — Center on Mobile, Left on Desktop */}
          <div className="flex justify-center sm:justify-start gap-2 mt-6 flex-wrap">
            {[
              {icon:Github,label:"GitHub",href:"https://github.com/harshshah-2023"},
              {icon:Linkedin,label:"LinkedIn",href:"https://www.linkedin.com/in/harsh-shah-9848hs"},
              {icon:Mail,label:"Email",href:"mailto:harshshah9848@gmail.com"}
            ].map((social,i)=>(
              <a key={i} href={social.href} aria-label={social.label}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-white/[0.07] bg-white/[0.04]
                           text-mist-400 shadow-e1
                           transition duration-200 ease-soft
                           hover:-translate-y-0.5 hover:border-accent-500/40
                           hover:bg-white/[0.07] hover:text-mist-50 hover:shadow-glow">
                <social.icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ==== BOTTOM COPYRIGHT ==== */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-24 pt-8 border-t border-white/[0.06]
                      text-center text-xs text-mist-500">
        © {new Date().getFullYear()} Harsh Shah — All Rights Reserved.
        <p className="mt-2 text-xs text-mist-600">
          Built with React + Tailwind • Made with ❤️ &amp; consistency
        </p>
      </div>
    </footer>
  );
}
