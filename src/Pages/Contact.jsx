// src/Contact.js
import React from 'react';

const Contact = () => {
  return (


    <div className='text-cyan-50'>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi officiis labore, inventore deserunt reiciendis temporibus esse, consequatur alias similique error pariatur.</p>


    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-slate-500  p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Contact Me</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700">Message</label>
            <textarea
              id="message"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Contact;
