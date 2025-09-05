import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const AdminDashboard = () => {
  return (
    <>
    <Navbar/>
    <section className='text-center mt-5'>
      <h1 className='font-bold'>Welcome to Admin Dashboard</h1>
    </section>
    <Footer/>
    </>

  )
}

export default AdminDashboard