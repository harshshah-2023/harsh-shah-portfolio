import React from 'react'
import DevOpsWebDevShowcase from '../Components/DevOpsWebDevShowcase';
import QuoteSeaction from '../Components/QuoteSeaction';
import ProjectsGallery from '../Components/ProjectGallary/ProjectsGallery';
import Hero3DSlider from '../Components/Hero3DSlider';
import Testimonial from '../Components/Testimonial';
import homepageImg from "../assets/homepagesrc2.png";
import imageOne from "../assets/imageHome1.jpeg";
import imageTwo from "../assets/imageHome2.jpeg";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className='flex flex-col'>

      {/* ========== HERO ========== */}
      <div className='relative w-full min-h-screen flex flex-col lg:flex-row mt-20 mx-4 lg:mx-10 text-white font-serif'>

        {/* LEFT TEXT AREA */}
        <div className='w-full lg:w-[850px] flex-col inline-block pt-24 lg:pt-36 mt-5 lg:ml-5 text-center lg:text-left'>
          <p className='text-5xl md:text-6xl lg:text-8xl py-2'>Hi, I'm Harsh</p>
          <p className='text-2xl md:text-4xl lg:text-5xl py-2 font-light text-[rgb(70,135,145)]'>A Software Developer</p>
          <p className='text-lg md:text-2xl font-extralight py-2 max-w-xl mx-auto lg:mx-0'>
            Step into a world where code transforms ideas into reality. Welcome to my portfolio!
          </p>
          <Link to="/projects">
  <button className='mt-5 px-6 py-3 border rounded-full hover:bg-[rgb(70,135,145)] transition'>
    CHECKOUT MY WORK
  </button>
</Link>

        </div>

        {/* RIGHT IMAGE COLLAGE — Hidden on mobile */}
        <div className='hidden md:flex justify-center lg:justify-end w-full mt-10 lg:mt-0'>

          {/* RESPONSIVE SCALE — Desktop layout stays identical */}
          <div className="
            relative origin-top-left
            scale-[0.55] sm:scale-[0.65] md:scale-[0.78] lg:scale-[1]
            transition-all duration-300
          ">

            <div className="flex flex-wrap justify-center items-center w-full h-full">

              {/* Box 1 */}
              <div className="h-[400px] w-[250px] z-30 overflow-hidden rounded-2xl mt-3">
                <img src={imageOne} className="w-full h-full object-cover" />
              </div>

              {/* Box 2 */}
              <div className="w-[650px] h-[360px] z-10 overflow-hidden rounded-2xl relative top-40 -left-14">
                <img src={homepageImg} className="w-full h-full object-cover" />
              </div>

              {/* Box 3 */}
              <div className="w-[500px] h-[200px] overflow-hidden rounded-2xl relative top-3">
                <img src={homepageImg} className="w-full h-full object-cover" />
              </div>

              {/* Box 4 */}
              <div className="h-[400px] w-[250px] z-30 overflow-hidden rounded-2xl relative left-14">
                <img src={imageTwo} className="w-full h-full object-cover" />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* BELOW SECTIONS */}
      <QuoteSeaction/>
      <DevOpsWebDevShowcase/>
      <Testimonial/>

    </div>
  )
}

export default Home;
