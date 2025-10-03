import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader } from 'lucide-react';
import authLogo from '../../assets/icons/authLogo.png';
import { YupValidation } from '../../components/validations/YupValidation';
import { useFormik } from 'formik';
import axiosClient from '../../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
};


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const { values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset } = useFormik({
    initialValues: initialValues,
    validationSchema: YupValidation,
    onSubmit: async (formikValues, { resetForm }) => {
      setIsLoading(true);
      setServerErrors(false);
      try {
        await axiosClient.post('/register', {
          name: formikValues.name,
          email: formikValues.email,
          password: formikValues.password,
          password_confirmation: formikValues.password_confirmation,
        });
        toast.success("Registration success! Please login to continue");
        navigate('/login'); //redirect to login after register
        resetForm();
      } catch (error) {
        const { response } = error;
        if (error.response && response.data.errors) {
          setServerErrors(response.data.errors); //server validation errors
        } else {
          setServerErrors({ general: ["Something went wrong. Please try again later."] });
          toast.error("Something went wrong. Please try again later.");
        }
      }finally{
        setIsLoading(false);
      }
    },
  });


  return (
    <section className="min-h-dvh bg-gradient-to-b from-sky-400 via-sky-500 to-blue-900 flex items-center justify-center">

      {/* Sign Up Card */}
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 bg-light">
        {/* Logo */}
        <div className="flex justify-center mb-1">
          <div className="w-20 h-20 rounded-2xl p-3 flex items-center justify-center">
            <img
              src={authLogo}
              alt="Auth Logo"
              className="w-full h-full object-contain shadow-md p-1 rounded-md bg-mid-light"
            />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center font-poppins mb-2">
          Signup
        </h1>
        <p className="text-center font-poppins mb-8">
          Create your account to get started
        </p>
        {/* Display server-side errors */}
        {serverErrors && (
          <div className="text-red-500 text-center mb-4">
            {Object.values(serverErrors).map((err, index) => (
              <p key={index}>{Array.isArray(err) ? err[0] : err}</p>
            ))}
          </div>
        )}

        {/* Form starts here */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <section>

            {/* Name Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <User size={20} />
              </div>
              <input
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onReset={handleReset}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='name'
              />
              {errors.name && touched.name ? (
                <p className='showError'>{errors.name}</p>
              ) : null}
            </div>

            {/* Email Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onReset={handleReset}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='email'
              />
              {errors.email && touched.email ? (
                <span className="showError">{errors.email}</span>
              ) : null}
            </div>

            {/* Password Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onReset={handleReset}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='password'

              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-6 -translate-y-1/2 transition-base"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && touched.password ? (
                <span className="showError">{errors.password}</span>
              ) : null}
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-3">
              <div className="absolute left-2 top-4 -translate-y-1/6">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                onReset={handleReset}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                autoComplete='off'
                id='password_confirmation'
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-6 -translate-y-1/2 transition-base"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password_confirmation && touched.password_confirmation ? (
                <span className="showError">{errors.password_confirmation}</span>
              ) : null}
            </div>

          </section>

          {/* Submit Button */}
          <button
            type="submit"
            aria-label='Citizen Signup Button'
            className="w-full py-3 bg-primary-blue text-light rounded-md font-medium font-poppins cursor-pointer hover:bg-hover-blue transition-all"
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin mx-auto w-6 h-6' /> : "Signup"}
          </button>
        </form>

        {/* Divider */}
        {/* <div className="my-4">
          <div className="relative flex justify-center text-sm">
            <span className="px-4">OR</span>
          </div>
        </div> */}

        {/* Social Login Button */}
        {/* <div className="flex justify-center items-center">
          <button
            className="flex items-center justify-center gap-2 py-3 bg-mid-light rounded-md shadow-md transition-base cursor-pointer font-poppins w-72"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

        </div> */}

        {/* Login Link */}
        <section className="text-center mt-4">
          <p className="font-poppins">
            Already have an account ? {" "}
            <Link
              to="/login"
              className="font-medium font-poppins text-primary-blue hover:text-hover-blue transition-colors"
            >
              Login
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
};

export default Signup;