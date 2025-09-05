import React from 'react'
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import RegisterCertificates from './RegisterCertificates';
import UserDetails from './UserDetails';
import CertificatesList from './CertificatesList';

const UserDashboard = () => {
  return (
    <>
      {/* Navbar render */}
      <Navbar/>

      <section className='grid grid-cols-3 gap-5 min-h-vh wrapper'>

        {/* Top-left portion */}
        <RegisterCertificates className="col-span-1 row-span-1"/>

        {/* Top-right portion */}
        <UserDetails className="col-span-2 row-span-1"/>

        {/* Bottom portion */}
        <CertificatesList className="col-span-3 row-span-2"/>

      </section>
      {/* Footer render */}
      <Footer/>
    </>
  )
}

export default UserDashboard