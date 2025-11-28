import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0C0F12] text-gray-300 border-t border-white/10 pt-16 pb-10">

      {/* ==== TOP GRID ==== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 
                      grid gap-16 sm:grid-cols-2 lg:grid-cols-3 
                      text-center sm:text-left">

        {/* INTRO SECTION */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white tracking-tight">
            Harsh <span className="text-[rgb(70,135,145)]">Shah</span>
          </h2>

          <p className="text-[14.5px] text-gray-400 leading-relaxed max-w-sm mx-auto sm:mx-0">
            Software Engineer • Full-Stack • DevOps  
            Building scalable systems & intelligent AI-powered products.
          </p>

          {/* Tags */}
          <div className="flex justify-center sm:justify-start gap-2 flex-wrap pt-2">
            {["Full-Stack", "DevOps", "Cloud", "AI/ML"].map((tag,i) => (
              <span key={i}
                className="px-3 py-[6px] text-[12px] rounded-full border border-white/10
                           bg-white/[0.05] text-gray-200 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg mb-2">
            Navigation
            <span className="block w-10 h-1 mt-1 mx-auto sm:mx-0 rounded-full bg-[rgb(70,135,145)]"></span>
          </h3>

          <ul className="space-y-3 text-[15px] font-light">
            {[
              {name:"Home",href:"/"},
              {name:"Projects",href:"/projects"},
              {name:"About",href:"/about"},
              {name:"Blog",href:"/blog"},
              {name:"Contact",href:"/contact"}
            ].map((nav,i)=>(
              <li key={i}>
                <a href={nav.href}
                   className="block hover:text-white hover:translate-x-1 transition-all duration-200">
                  {nav.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">
            Connect
            <span className="block w-10 h-1 mt-1 mx-auto sm:mx-0 rounded-full bg-[rgb(70,135,145)]"></span>
          </h3>

          <p className="text-[15px] text-gray-400 max-w-sm mx-auto sm:mx-0 leading-relaxed">
            Available for roles, collaborations & freelance development.
          </p>

          {/* Social Buttons — Center on Mobile, Left on Desktop */}
          <div className="flex justify-center sm:justify-start gap-4 mt-4 flex-wrap">
            {[
              {icon:Github,href:"https://github.com/harshshah-2023"},
              {icon:Linkedin,href:"https://www.linkedin.com/in/harsh-shah-9848hs"},
              {icon:Mail,href:"mailto:harshshah9848@gmail.com"}
            ].map((social,i)=>(
              <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg border border-white/10 bg-white/[0.05]
                           hover:bg-white/[0.12] hover:border-[rgb(70,135,145)]/60
                           transition-all duration-300 shadow-md hover:shadow-[0_0_10px_rgba(70,135,145,.4)]">
                <social.icon size={22} className="text-gray-300 hover:text-white"/>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ==== BOTTOM COPYRIGHT ==== */}
      <div className="mt-14 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Harsh Shah — All Rights Reserved.
        <p className="mt-2 text-[13px] text-gray-600">
          Built with React + Tailwind • Made with ❤️ & consistency
        </p>
      </div>
    </footer>
  );
}
