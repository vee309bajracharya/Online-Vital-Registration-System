import React, { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useStateContext } from '../../contexts/AuthContext';
import LoginIcon from '../../assets/icons/login-icon.png';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react';
import LoginTabs from './LoginTabs';

const RegisterOfficerLogin = () => {

    const { setToken, setUser } = useStateContext();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            login: "", //employee_id or email
            password: "",
        },
        onSubmit: async (formValues, { resetForm }) => {
            setIsLoading(true);
            try {
                const response = await axiosClient.post("/login-officer", formValues);
                setToken(response.data.access_token);
                setUser(response.data.user);
                toast.success("Officer Login success");
                navigate('/dashboard')
                resetForm();
            } catch (error) {
                const { response } = error;
                if (response && response.status === 401) {
                    toast.error("Invalid Officer credentials");
                } else {
                    toast.error("Something went wrong. Please try again");
                }
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <section className="min-h-dvh flex justify-center items-center flex-col bg-gradient-to-b from-sky-400 via-sky-500 to-blue-900 ">
            {/* Roles switch */}
            <LoginTabs />
            <section className='max-w-md w-full bg-light rounded-2xl'>

                <section className="w-full rounded-2xl p-9">

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

                    {/* form starts */}
                    <form
                        className='space-y-4'
                        onSubmit={handleSubmit}>

                        {/* Employee login credentials */}
                        <div className="relative mb-3">
                            <div className="absolute left-2 top-4 -translate-y-1/6">
                                <Mail size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder='EmployeeID or Email'
                                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                                autoComplete='off'
                                id='login'
                                value={values.login}
                                onChange={handleChange}
                                onBlur={handleBlur} />
                        </div>

                        <div className="relative mb-3">
                            <div className="absolute left-2 top-4 -translate-y-1/6">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                id='password'
                                className="w-full pl-12 pr-4 py-3 bg-placeholder-blue rounded-lg focus:outline-none transition-base"
                                autoComplete='off'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur} />

                            <button
                                type='button'
                                aria-label='password toggle button'
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-6 -translate-y-1/2 transition-base cursor-pointer">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

                            </button>

                        </div>

                        <button
                            type='submit'
                            className="w-full py-3 bg-primary-blue text-light rounded-md font-medium font-poppins cursor-pointer hover:bg-hover-blue transition-all"
                            aria-label='officer login button'
                            disabled={isLoading}>
                            {isLoading ? <Loader className='animate-spin mx-auto w-6 h-6' /> : "Login"}
                        </button>
                    </form>

                </section>

            </section>
        </section>

    )
}

export default RegisterOfficerLogin