import React from 'react'

const Projects = () => {
  return (
    <div className='absolute  w-full h-full  mt-40 mx-10 text-white font-serif '>
{/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste autem hic, quaerat libero ab ducimus? Optio minima eveniet rem enim similique.</p> */}
<div className='flex justify-between'>
    <h1 className='text-5xl mb-4 inline-block'>Featured Projects</h1>
    <button className='bg-slate-400 rounded-lg text-black text-xl mr-5 px-8 py-2 hover:bg-[rgb(70,135,145)] font-medium transition duration-3000 ease-in-out'>View all</button>
    </div>

    <div className='m-8 p-8 grid grid-cols-3 gap-56  '>

    <div className = " w-[550px] h-[350px] p-4 bg-green-200"> 
                HyperText Markup language 
            </div>  
            <div className = "w-[550px] h-[350px] p-4 bg-green-200"> 
                Cascading Style Sheet 
            </div>  
            <div className = " w-[550px] h-[350px] p-4 bg-green-200"> 
                LiveScript Become JavaScript 
            </div>  
            <div className = "w-[550px] h-[350px] p-4 bg-green-200"> 
                LiveScript Become JavaScript 
            </div> 
            <div className = " w-[550px] h-[350px] p-4 bg-green-200"> 
                LiveScript Become JavaScript 
            </div> 
            


    </div>
    <div className='contact_me w-full font-sans font-semibold '>
      <div className='n  w-[800px] h-[200px] items-center   justify-center mx-auto p-4 m-4  '>
        <div className='flex justify-evenly items-centeralign-middle'>
          <div className='ml-2'>

          
      <h1 className='text-4xl '>Let's work togther on your <br /> 
      next project </h1>
     
      </div>
      <button className=' mt-5 p-3 px-6  border rounded-full font-sans hover:bg-[rgb(70,135,145)] font-medium transition duration-3000 ease-in-out'>Contact</button>
      </div>
      
        </div>
      
    </div>
    </div>
  )
}

export default Projects
