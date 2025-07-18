import React from 'react';
// import './App.css';


import Navbar from './Components/Navbar';
import { Routes,Route } from 'react-router-dom';
import Home from './Pages/Home';
import Contact from './Pages/Contact';
import Projects from './Pages/Projects';
import About from './Pages/About';
import Resume from './Pages/Resume';

function App() {
  
  return (
    <div className='w-full'>
      <div className='bg-black'>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path='/Projects' element={<Projects/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/resume' element={<Resume/>}/>
    
    </Routes>
    </div>
    
    </div>
  )
}

export default App
