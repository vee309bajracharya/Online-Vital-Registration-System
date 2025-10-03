import React, { useState } from 'react'
import LoginIcon from '../../assets/icons/login-icon.png';
import { Eye, EyeOff, Mail, Lock, User, UserPen, ShieldUser, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LoginTabs from './LoginTabs';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Formik Hook
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (formValues, { resetForm }) => {
      setIsLoading(true);
      try {
        const response = await axiosClient.post('/login', formValues);
        setToken(response.data.access_token);
        setUser(response.data.user);
        const profileResponse = await axiosClient.get('/user/profile');
        setUser(profileResponse.data);
        toast.success("Login successful");
        navigate('/dashboard');
        resetForm();
      } catch (error) {
        const { response } = error;
        if (response && response.status === 401) {
          toast.error("Invalid credientals");
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  });



  return (
    <section className="min-h-dvh flex justify-center items-center flex-col bg-gradient-to-b from-sky-400 via-sky-500 to-blue-900 ">

      {/* Roles switch */}
      <LoginTabs/>

      {/* Login Card */}
      <section className="max-w-md w-full bg-light rounded-2xl">

        <div className="w-full rounded-2xl p-9">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-2xl p-3 flex items-center justify-center">
              <img
                src={LoginIcon}
                alt="Auth Logo"
                className="w-full h-full object-contain rounded-md bg-mid-light shadow-md p-3"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center ">
            <h1 className="text-3xl font-bold font-poppins mb-2">Login</h1>
            <p className="text-center font-poppins mb-8">Welcome back !</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Email Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='email'
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <p className="showError">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}

              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-6 -translate-y-1/2 transition-base cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && touched.password && (
                <p className="showError">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/"
                className="font-medium font-poppins text-primary-blue hover:text-hover-blue transition-colors"
              >
                Forgot Password
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              aria-label='Citizen Login Button'
              className="w-full py-3 bg-primary-blue text-light rounded-md font-medium font-poppins cursor-pointer hover:bg-hover-blue transition-all"
            >
              {isLoading ? <Loader className='animate-spin mx-auto w-6 h-6' /> : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <section className="text-center mt-4">
            <p className="font-poppins">
              Don't have an account ? {" "}
              <Link
                to="/signup"
                className="font-medium font-poppins text-primary-blue hover:text-hover-blue transition-colors"
              >
                Signup
              </Link>
            </p>
          </section>

        </div>

      </section>
    </section>
  )
}

export default Login