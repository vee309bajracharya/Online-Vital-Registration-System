import React from 'react'
// import NepalFlag from '../assets/images/NepalFlag.png'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/AuthContext.jsx';
import axiosClient from '../api/axiosClient.js';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const { setToken } = useStateContext();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout');
      setToken(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Logout Failed');
    }
  };

  return (
    <section className='bg-primary-blue'>

      <section className='wrapper flex justify-between items-center'>
        {/* content-left */}
        <div>
          {/* <picture>
            <img
              src={NepalFlag}
              alt="Nepal Flag Icon"
              loading='lazy'
              className='w-16 h-16 object-contain' />
          </picture> */}
          <span className='font-poppins font-semibold text-light text-xl'>Gov.</span>
        </div>

        {/* content-right */}
        <div>
          <button
            aria-label='Logout Button'
            onClick={handleLogout}
            className="px-6 py-2 bg-hover-blue text-light rounded-lg hover:bg-hover-blue transition-colors cursor-pointer"
          >
            Logout
          </button>

        </div>
      </section>

    </section>
  )
}

export default Navbar