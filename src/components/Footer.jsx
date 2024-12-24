import React from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

  return (
    <div className='flex justify-center'>
      
        {/* Bottom Navigation Bar */}
        <div className="flex items-center justify-around bg-black text-white p-3 border-t border-gray-800 fixed bottom-0  w-screen md:w-4/12">
          <button
            className="flex flex-col items-center text-gray-400 hover:text-white"
            onClick={() => navigate("/")}
          >
            <AiOutlineHome className="text-2xl" />
            <span className="text-xs">Home</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400 hover:text-white"
            onClick={() => navigate("/post")}
          >
            <FiPlusCircle className="text-2xl" />
            <span className="text-xs">Add Post</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-400 hover:text-white"
            onClick={() => navigate("/profile")}
          >
            <FaUserCircle className="text-2xl" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
    </div>
  )
}

export default Footer
