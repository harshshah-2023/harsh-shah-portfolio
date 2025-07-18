import React from 'react'

const Home = () => {
  return (
    <div className=' absolute main_body w-full h-full flex mt-20 mx-10 text-white font-serif object-center '>
      <div className=' w-[850px] flex-col inline-block pt-36 mt-5 ml-5  '>
            <p className='text-8xl py-2'>Hi, I'm Harsh</p>
            <p className='text-5xl py-2 font-light text-[rgb(70,135,145)]'>A Software Developer</p>
            <p className='text-2xl font-extralight py-2'>Step into a world where code transforms ideas into reality Welcome to my portfolio!</p>
            <button className='mt-5 p-3 px-6  border rounded-full font-sans hover:bg-[rgb(70,135,145)] font-medium transition duration-3000 ease-in-out'>CHECKOUT MY WORK</button>
            


      </div>
      <div className='inline-block relative  '>

      <div class="flex flex-wrap justify-center items-center w-full h-full " >
  {/* <!-- Container 1 (more height) --> */}
  <div class="h-[400px] w-[250px] z-30  bg-blue-500 top-3 overflow-hidden rounded-2xl">
    <img class="h-full w-full object-cover" src="your-image-url.jpg" alt="Image" />
    <div class="absolute bottom-0 left-0 p-4 text-white">
      <h2 class="text-lg font-bold">Container 1</h2>
      <p>This container has more height.</p>
    </div>
  </div>

  {/* <!-- Container 2 (more width) --> */}
  <div class="w-[650px] h-[360px] z-10 bg-green-500 top-40 -left-14 relative overflow-hidden rounded-2xl">
    <img class="h-full w-full object-cover" src="your-image-url.jpg" alt="Image" />
    <div class="absolute bottom-0 left-0 p-4 text-white">
      <h2 class="text-lg font-bold">Container 2</h2>
      <p>This container has more width.</p>
    </div>
  </div>

  {/* <!-- Container 3 (more width) --> */}
  <div class="w-[500px] h-[200px] top-3 bg-yellow-500 relative overflow-hidden rounded-2xl">
    <img class="h-full w-full object-cover" src="your-image-url.jpg" alt="Image" />
    <div class="absolute bottom-0 left-0 p-4 text-white">
      <h2 class="text-lg font-bold">Container 3</h2>
      <p>This container has more width.</p>
    </div>
  </div>

  {/* <!-- Container 4 (more height) --> */}
  <div class="h-[400px] w-[250px] z-30 bg-pink-500 left-14 relative overflow-hidden rounded-2xl">
    <img class="h-full w-full object-cover" src="your-image-url.jpg" alt="Image" />
    <div class="absolute bottom-0 left-0 p-4 text-white">
      <h2 class="text-lg font-bold">Container 4</h2>
      <p>This container has more height.</p>
    </div>
  </div>
</div>


      </div>
    </div>
  )
}

export default Home;
