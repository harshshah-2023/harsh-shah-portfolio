import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6
                    text-white flex items-center justify-between 
                    backdrop-blur-md bg-black/40 border-b border-white/10">

      {/* LOGO */}
      <Link to="/">
        <h1 className="text-4xl font-serif cursor-pointer">
          Harsh<span className="text-[rgb(70,135,145)]">shah</span>
        </h1>
      </Link>

      {/* ================= DESKTOP MENU ================= */}
      <div className="hidden md:flex pr-10 space-x-10 text-xl font-medium">
        <Link to='/Projects' className="hover:text-[rgb(70,135,145)]">Projects</Link>
        <Link to='/Contact' className="hover:text-[rgb(70,135,145)]">Contact</Link>
        <Link to='/About' className="hover:text-[rgb(70,135,145)]">About</Link>
        <Link to='/Resume' className="hover:text-[rgb(70,135,145)]">Resume</Link>
        <Link to='/Blog' className="hover:text-[rgb(70,135,145)]">Blog</Link>
      </div>

      {/* ================= MOBILE MENU ICON ================= */}
      <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        {open ? <X size={28}/> : <Menu size={28}/>}
      </div>

      {/* ================= MOBILE SLIDE NAV ================= */}
      <div className={`
        fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-lg 
        border-l border-white/10 p-8 pt-20 flex flex-col space-y-6 text-xl
        transform transition-all duration-300 md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}
      `}>
        <Link to='/Projects'   onClick={() => setOpen(false)} className="hover:text-[rgb(70,135,145)]">Projects</Link>
        <Link to='/Contact' onClick={() => setOpen(false)} className="hover:text-[rgb(70,135,145)]">Contact</Link>
        <Link to='/About'   onClick={() => setOpen(false)} className="hover:text-[rgb(70,135,145)]">About</Link>
        <Link to='/Resume'  onClick={() => setOpen(false)} className="hover:text-[rgb(70,135,145)]">Resume</Link>
        <Link to='/Blog'    onClick={() => setOpen(false)} className="hover:text-[rgb(70,135,145)]">Blog</Link>
      </div>

    </nav>
  );
};

export default Navbar;
