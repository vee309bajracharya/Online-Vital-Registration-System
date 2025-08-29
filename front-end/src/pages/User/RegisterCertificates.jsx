import React from 'react'
import BirthIcon from '../../assets/svg/birthRegisterIcon.svg'
import DeathIcon from '../../assets/svg/deathRegisterIcon.svg'
import MigrationIcon from '../../assets/svg/migrationRegisterIcon.svg'

const RegisterCertificates = ({className}) => {

  const certificates = [
    {
      id: 1,
      certificateName: 'Register Birth Certificate',
      icon: BirthIcon,
      iconName: 'Birth Certificate Icon'
    },
    {
      id: 2,
      certificateName: 'Register Death Certificate',
      icon: DeathIcon,
      iconName: 'Death Certificate Icon'
    },
    {
      id: 3,
      certificateName: 'Register Migration Certificate',
      icon: MigrationIcon,
      iconName: 'Migration Certificate Icon'
    },
  ]


  return (
    <section className={`dashboardCard flex flex-col ${className}`}>
      <h1 className='font-poppins font-semibold text-2xl'>Register for Certificates</h1>
      <hr className='mt-1 mb-3' />

      {certificates.map((certificate)=>(
        <div key={certificate.id}>
          <section className='flex items-center bg-primary-blue hover:bg-hover-blue hover:transition-colors text-light font-poppins font-semibold p-1 rounded-md my-3 cursor-pointer'>
            <div className='w-10 h-10 rounded-full flex items-center justify-center m-2'>
              <img src={certificate.icon} className='w-9 h-9'/>
            </div>
            <div className='flex-grow'>
              <h2>{certificate.certificateName}</h2>
            </div>
    
          </section>
        </div>

      ))}
    </section>
  )
}

export default RegisterCertificates