import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import PageNotFound from './pages/PageNotFound'
import { useStateContext } from './contexts/AuthContext'
import UserDashboard from './pages/User/UserDashboard'

const App = () => {
  const { token } = useStateContext();
  return (
    <section>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={token ? <UserDashboard /> : <Navigate to="/login" />} />

          {/* unknown route */}
          <Route path='*' element={<PageNotFound />} />

        </Routes>
    </section>
  )
}

export default App