import React from 'react'
import { User, UserPen, ShieldUser } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const LoginTabs = () => {
    const location = useLocation();

    // user roles switch
    const userRoles = [
        {
            id: 1,
            label: "Citizen",
            icon: User,
            path: "/login",
        },
        {
            id: 2,
            label: "Register Officer",
            icon: UserPen,
            path: "/login-officer",
        },
        {
            id: 3,
            label: "Admin",
            icon: ShieldUser,
            path: "/login-admin",
        },
    ];
    return (
        <>
            {/* Role Tabs */}
            <section className="flex justify-center items-center gap-3 mb-3 ">
                {userRoles.map((role) => {
                    const isActive = location.pathname === role.path;

                    return (
                        <Link
                            key={role.id}
                            to={role.path}
                            className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${isActive ? 'bg-primary-blue text-light font-poppins font-medium' : 'bg-hover-blue text-light hover:bg-hover-blue'} cursor-pointer`}
                        >
                            <role.icon className="w-7 h-7" />
                            <span className='font-poppins'>{role.label}</span>
                        </Link>
                    )
                })}
            </section>
        </>
    )
}

export default LoginTabs