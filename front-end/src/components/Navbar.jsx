import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/svg/logo.svg';
import LogoutUsers from './LogoutUsers.jsx';

const Navbar = () => {

  return (
    <section className='bg-primary-blue'>

      <section className='wrapper flex justify-between items-center'>
        {/* content-left */}
        <div>
          <Link to='/dashboard'>
            <picture>
              <img
                src={Logo}
                alt="Main Logo"
                loading='lazy'
                className='w-16 h-16 object-contain' />
            </picture>
          </Link>
        </div>

        {/* content-right */}
        <div>
          <LogoutUsers />
        </div>
      </section>

    </section>
  )
}

export default Navbar