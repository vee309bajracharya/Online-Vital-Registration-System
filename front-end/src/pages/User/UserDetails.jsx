import React from 'react'

const UserDetails = ({ className }) => {
  return (
    <section className={`dashboardCard ${className}`}>
      <h1 className='font-poppins font-semibold text-2xl'>Citizen Information</h1>
      <hr className='mt-1 mb-3' />

      {/* citizen info here */}
      <section className='p-2'>
        <h2 className='font-poppins font-semibold'>नागरिकता नं. {" "}
          <span className='font-normal'></span></h2>

        <div className='flex justify-between items-center mt-3'>
          <h2 className='font-poppins font-semibold'>नाम: {" "}
            <span className='font-normal'>{" "}</span></h2>

          <h2 className='font-poppins font-semibold'>लिङ्ग: {" "}
            <span className='font-normal'>{" "}</span></h2>

          <h2 className='font-poppins font-semibold'>जन्मस्थान: {" "}
            <span className='font-normal'>{" "}</span></h2>

        </div>

        <div className='grid grid-cols-2'>
          <div className='mt-3'>
            <h2 className='font-poppins font-semibold'>
              <span className='font-normal'>{" "}</span>जिल्ला / न.पा.: {""}</h2>

            <h2 className='font-poppins font-semibold mt-3'>नागरिकता जारी स्थान: {" "}
              <span className='font-normal'>{" "}</span></h2>

            <h2 className='font-poppins font-semibold mt-3'>बुबाको नाम थर: {" "}
              <span className='font-normal'>{" "}</span></h2>

            <h2 className='font-poppins font-semibold mt-3'>श्रीमान/श्रीमतीको नाम थर: {""}
              <span className='font-normal'>{" "}</span></h2>
          </div>

          <div className='mt-3'>
            <h2 className='font-poppins font-semibold'>जन्म मिति: {" "}
              <span className='font-normal'>{" "}</span></h2>

            <h2 className='font-poppins font-semibold mt-3'>ठेगाना: {""}
              <span className='font-normal'>{" "}</span></h2>

            <h2 className='font-poppins font-semibold mt-3'>आमाको नाम थर: {" "}
              <span className='font-normal'>{" "}</span></h2>
          </div>
        </div>
      </section>

    </section>
  )
}

export default UserDetails