import { useState, useEffect } from 'react'
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
import BirthCertificateForm from './pages/User/Certificates/BirthCertificateForm';
import DeathCertificateForm from './pages/User/Certificates/DeathCertificateForm';
import MigrationCertificateForm from './pages/User/Certificates/MigrationCertificateForm';
import axiosClient from './api/axiosClient';
import Spinner from './components/loaders/Spinner';
import EditBirthCertificateForm from './pages/User/Certificates/updateCertificatesList/EditBirthCertificateForm';


const App = () => {
  const { token, user, setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user?.id) {
      axiosClient.get('/user/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token, setToken, setUser, user?.id]);

  if (loading) {
    return (
      <Spinner />
    );
  }

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

        {/* auth routes */}
        <Route path="/login" element={token ? getDashboard() : <Login />} />
        <Route path="/signup" element={token ? getDashboard() : <Signup />} />
        <Route path='/login-officer' element={token ? getDashboard() : <RegisterOfficerLogin />} />
        <Route path='/login-admin' element={token ? getDashboard() : <AdminLogin />} />

        {/* dashboards */}
        <Route path='/dashboard' element={getDashboard()} />

        {/* protected certificate routes */}
        <Route 
          path="/birth-certificate/new" 
          element={token && user?.phone_verified_at 
          ? <BirthCertificateForm /> : <Navigate to="/dashboard" />} />

        <Route 
          path="/death-certificate/new" 
          element={token && user?.phone_verified_at 
          ? <DeathCertificateForm /> : <Navigate to="/dashboard" />} />


        <Route 
          path="/migration-certificate/new" 
          element={token && user?.phone_verified_at 
          ? <MigrationCertificateForm /> : <Navigate to="/dashboard" />} />

        {/* edit certificate routes */}
        <Route
          path='/birth-certificate/edit/:id'
          element={
            token && user?.phone_verified_at
            ? <EditBirthCertificateForm/> : <Navigate to="/dashboard"/>
          }/>

        {/* unknown route */}
        <Route path='*' element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App