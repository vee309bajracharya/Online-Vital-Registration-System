import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import PageNotFound from './pages/PageNotFound'
import { useStateContext } from './contexts/AuthContext'
import UserDashboard from './pages/User/UserDashboard'
import OfficerDashboard from './pages/RegisterOfficer/OfficerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegisterOfficerLogin from './pages/Auth/RegisterOfficerLogin';
import AdminLogin from './pages/Auth/AdminLogin';


const App = () => {
  const { token, user } = useStateContext();

  // map roles to user roles dashboards
  const dashboards = {
    USER: <UserDashboard />,
    OFFICER: <OfficerDashboard />,
    ADMIN: <AdminDashboard />,
  };

  //map roles to login routes
  const loginRoutes = {
    USER: '/login',
    OFFICER: '/login-officer',
    ADMIN: '/login-admin',
  }

  const getDashboard = () => {
    if (!token || !user?.role) {
      return <Navigate to={loginRoutes.USER} />;
    }
    return dashboards[user.role] || <Navigate to={loginRoutes.USER} />;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
      <Routes>

        {/* default route : USER */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* CITIZEN(USER) auth routes */}
        <Route path="/login" element={token ? getDashboard() : <Login />} />
        <Route path="/signup" element={token ? getDashboard() : <Signup />} />

        {/* OFFICER auth route */}
        <Route path='/login-officer' element={token ? getDashboard() : <RegisterOfficerLogin/>}/>

        {/* ADMIN auth route */}
        <Route path='/login-admin' element={token ? getDashboard() : <AdminLogin/>}/>

        {/* dashboards */}
        <Route path='/dashboard' element={getDashboard()} />

        {/* unknown route */}
        <Route path='*' element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App