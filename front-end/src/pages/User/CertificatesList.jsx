import React from 'react'

const CertificatesList = ({ className }) => {

  const registeredCertificates = [
    {
      id: 1,
      name: "Certificate 1",
    },
    {
      id: 2,
      name: "Certificate 2",
    },
    {
      id: 3,
      name: "Certificate 3",
    },
  ]

  return (
    <section className={`${className}`}>
      <h1 className='font-poppins font-semibold text-2xl'>Certificates Registered</h1>
      <hr className='mt-1 mb-3' />

      <section className='flex justify-between items-center gap-6 my-5'>
        {registeredCertificates.map((cValues) => (
          <div key={cValues.id} className='w-full'>
            <section className='bg-cards p-3 rounded-md w-full h-30'>
              <h2 className='text-center font-semibold font-poppins'>{cValues.name}</h2>
              <div className='float-end flex gap-4 mt-5'>
                <button className='bg-card-btn font-poppins font-semibold p-3 rounded-md cursor-pointer'>View</button>
                <button className='bg-card-btn font-poppins font-semibold p-3 rounded-md cursor-pointer'>Download</button>
              </div>
            </section>

          </div>
        ))}

      </section>

    </section>
  )
}

export default CertificatesList