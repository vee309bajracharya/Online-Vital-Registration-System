import { useState } from 'react'
import BirthIcon from '../../assets/svg/birthRegisterIcon.svg'
import DeathIcon from '../../assets/svg/deathRegisterIcon.svg'
import MigrationIcon from '../../assets/svg/migrationRegisterIcon.svg'
import PhoneNumberVerify from '../Auth/PhoneNumberVerify'
import OTPVerify from '../Auth/OTPVerify'
import { useStateContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const RegisterCertificates = ({ className }) => {

  const { user } = useStateContext();
  const navigate = useNavigate();

  const [currentModal, setCurrentModal] = useState(null); // phone, otp, birth-form
  const [selectedCertificate, setSeletedCertificate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const certificates = [
    {
      id: 1,
      certificateName: 'Register Birth Certificate',
      icon: BirthIcon,
      iconName: 'Birth Certificate Icon',
      type: 'birth',
    },
    {
      id: 2,
      certificateName: 'Register Death Certificate',
      icon: DeathIcon,
      iconName: 'Death Certificate Icon',
      type: 'death',
    },
    {
      id: 3,
      certificateName: 'Register Migration Certificate',
      icon: MigrationIcon,
      iconName: 'Migration Certificate Icon',
      type: 'migration',
    },
  ]

  const handleCertificateClick = (certificate) => {
    setSeletedCertificate(certificate);

    //check if phone is already verified
    if (user?.phone_verified_at) {
      if (certificate.type === 'birth') {
        navigate('/birth-certificate/new');
      } else if (certificate.type === 'death') {
        navigate('/death-certificate/new');
      } else if (certificate.type === 'migration') {
        navigate('/migration-certificate/new');
      }
    } else {
      //start with phone verification
      setCurrentModal('phone');
    }
  }
  // Close all modals
  const closeModal = () => {
    setCurrentModal(null)
    setPhoneNumber('')
  }

  const handlePhoneVerified = (phone) => {
    setPhoneNumber(phone);
    setCurrentModal('otp');
  }

  const handleOTPVerified = () => {

    setCurrentModal(null);
    setSeletedCertificate(null);
    setPhoneNumber('');

    setTimeout(() => {
      if (selectedCertificate?.type === 'birth') {
        navigate('/birth-certificate/new');
      } else if (selectedCertificate?.type === 'death') {
        navigate('/death-certificate/new');
      } else if (selectedCertificate?.type === 'migration') {
        navigate('/migration-certificate/new');
      }
    }, 1000);
  }


  return (
    <>
      <section className={`dashboardCard flex flex-col ${className}`}>
        <h1 className='font-poppins font-semibold text-2xl'>Register for Certificates</h1>
        <hr className='mt-1 mb-3' />

        {certificates.map((certificate) => (
          <div key={certificate.id}>
            <section
              className='flex items-center bg-primary-blue hover:bg-hover-blue hover:transition-colors text-light font-poppins font-semibold p-1 rounded-md my-3 cursor-pointer'
              onClick={() => handleCertificateClick(certificate)}>

              <div
                className='w-10 h-10 rounded-full flex items-center justify-center m-2'>
                <img src={certificate.icon} className='w-9 h-9' />
              </div>
              <div className='flex-grow'>
                <h2>{certificate.certificateName}</h2>
              </div>

            </section>
          </div>

        ))}
      </section>

      {/* modal overlay */}
      {currentModal && (
        <section
          className='fixed inset-0 bg-black/70 backdrop-blur-sm transition duration-500 flex items-center justify-center z-50'>

          <section
            className='bg-light rounded-md p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>

            {/* phone verification modal */}
            {currentModal === 'phone' && (
              <PhoneNumberVerify
                onSuccess={handlePhoneVerified}
                onClose={closeModal}
              />
            )}

            {/* otp verification modal */}
            {currentModal === 'otp' && (
              <OTPVerify
                phoneNumber={phoneNumber}
                onSuccess={handleOTPVerified}
                onClose={closeModal}
              />
            )}

          </section>
        </section>
      )}

    </>
  )
}

export default RegisterCertificates