import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const UserDashboard = () => {
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
    <section className='wrapper'>
      <div className='text-center'>
        <h1 className="text-2xl font-bold mb-4">Welcome to User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-primary-blue text-light rounded-lg hover:bg-hover-blue transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </section>
  )
}

export default UserDashboard