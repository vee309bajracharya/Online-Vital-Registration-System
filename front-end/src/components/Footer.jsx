import React from 'react'

const Footer = () => {
  return (
    <section className='bg-primary-blue p-4 mt-1'>
      <p className='text-light font-poppins font-semibold text-center wrapper'>
        &copy; Copyright {new Date().getFullYear()}
        {" "}| Online Vital Registration System. All Rights Reserved
      </p>
    </section>
  )
}

export default Footer