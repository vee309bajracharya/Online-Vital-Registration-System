import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const LogoutUsers = () => {

    const {setToken, user, setUser} = useStateContext();
    const navigate = useNavigate();

    const handleLogout = async ()=>{
        try{
            await axiosClient.post('/logout');
            setToken(null);
            setUser(null);
            toast.success("Logout success");

            //after logout, redirect users acc. to their role
            if(user?.role === 'OFFICER'){
                navigate('/login-officer');
            }else if(user?.role === 'ADMIN'){
                navigate('/login-admin');
            }else{
                navigate('/login'); //default: citizen login page
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout error:", error);
        }
    };



  return (
    <button
        aria-label='Logout Button'
        onClick={handleLogout}
        className='px-6 py-2 bg-hover-blue text-light rounded-lg hover:bg-hover-blue transition-colors cursor-pointer'>
            Logout
    </button>
  )
}

export default LogoutUsers