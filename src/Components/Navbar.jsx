import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between 
                      py-4 px-6 text-white backdrop-blur-xl bg-black/30 border-b border-white/10">

        {/* LOGO */}
        <Link to="/" onClick={() => setOpen(false)}>
          <h1 className="text-4xl font-serif cursor-pointer">
            Harsh<span className="text-[rgb(70,135,145)]">shah</span>
          </h1>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex pr-12 space-x-12 text-lg font-medium tracking-wide">
          {["Projects","Contact","About","Resume","Blog"].map((item,i)=>(
            <Link 
              key={i} 
              to={`/${item}`}
              className="hover:text-[rgb(70,135,145)] transition"
            >{item}</Link>
          ))}
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden p-2 text-white hover:scale-110 transition"
          onClick={() => setOpen(true)}
        >
          <Menu size={32}/>
        </button>
      </nav>

      {/* ================= PREMIUM FULLSCREEN MOBILE NAV ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
                        bg-black/80 backdrop-blur-xl animate-fadeIn">
          
          {/* Close */}
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-gray-300 hover:text-[rgb(70,135,145)] transition"
          ><X size={34}/></button>

          {/* Center Menu */}
          <div className="text-center space-y-8">
            {["Projects","Contact","About","Resume","Blog"].map((page,i)=>(
              <Link 
                key={i}
                to={`/${page}`}
                onClick={() => setOpen(false)}
                className="block text-3xl font-light text-gray-200 tracking-wide
                           hover:text-[rgb(70,135,145)] hover:scale-110 transition duration-300"
              >
                {page}
              </Link>
            ))}

            {/* CTA */}
            <Link 
              to="/Contact"
              onClick={() => setOpen(false)}
              className="inline-block mt-6 px-8 py-3 rounded-full border border-[rgb(70,135,145)]
                         hover:bg-[rgb(70,135,145)] hover:text-black text-gray-200
                         shadow-[0_0_25px_rgba(70,135,145,0.5)]
                         transition-all duration-300"
            >
              Hire Me 🚀
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
