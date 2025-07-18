import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex  w-full  my-4 mx-5 p-2 items-center justify-between   font-serif text-white fixed'>
        <div className="nametag">
            <Link to="/">
                <h1 className='text-4xl cursor-pointer'>Harsh<span className= 'text-[rgb(70,135,145)] '>shah</span> </h1>
            </Link>
        
        </div>
        <div className="navbarList flex pr-20 space-x-10  text-xl font-sans font-medium ">
            <Link to='/Projects'><button className='hover:text-[rgb(70,135,145)]'>Projects</button></Link>
            <Link to='/Contact'><button className='hover:text-[rgb(70,135,145)]'> Contact</button></Link>
            <Link to='/About'><button className='hover:text-[rgb(70,135,145)]'>About</button></Link>
            <Link to='/Resume'><button className='hover:text-[rgb(70,135,145)]'>Resume</button></Link>
            <p className='hover:text-[rgb(70,135,145)] cursor-pointer'>Blog</p>
        </div>



    </div>
  )
}

export default Navbar;
