import React from "react";
import QuoteSeaction from "../Components/QuoteSeaction";
import DevOpsWebDevShowcase from "../Components/DevOpsWebDevShowcase";
import Testimonial from "../Components/Testimonial";
import heroMain from "../assets/heMainpic1.webp";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col">

      {/* ================= HERO ================= */}
      <section className="w-full min-h-screen px-6 lg:px-16 pt-28 flex flex-col lg:flex-row items-center justify-between text-white">

        {/* LEFT TEXT */}
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight">
            Hi, I'm <br />
            <span className="text-[rgb(70,135,145)]">Harsh Shah</span>
          </h1>

          <p className="text-2xl md:text-3xl font-light mt-2">
            A Software Developer
          </p>

          <p className="text-lg md:text-xl font-extralight mt-4 opacity-90">
            Step into a world where code transforms ideas into reality.
            Welcome to my portfolio.
          </p>

          <Link to="/Projects">
            <button className="mt-6 px-7 py-3 border border-white rounded-full 
              hover:bg-[rgb(70,135,145)] hover:border-none hover:text-black transition">
              CHECKOUT MY WORK
            </button>
          </Link>
        </div>

        {/* RIGHT HERO IMAGE */}
        <div className="mt-10 lg:mt-0 w-full flex justify-center lg:w-[50%]">
          <img 
            src={heroMain} 
            className="w-[95%] max-w-[900px] rounded-xl shadow-2xl drop-shadow-xl 
                      hover:scale-[1.02] transition duration-500"
            alt="Project collage"
          />
        </div>

      </section>

      {/* ================= BELOW CONTENT ================= */}
      <QuoteSeaction />
      <DevOpsWebDevShowcase />
     
    </div>
  );
};

export default Home;
