import { Shield, X, Loader } from 'lucide-react'
import {useState} from 'react'
import axiosClient from '../../api/axiosClient'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

const OTPVerify = ({ phoneNumber, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
      .required('OTP is required'),
  })

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema,
    onSubmit: async (formValues) => {
      setIsLoading(true)
      try {
        await axiosClient.post('/phone/otp/verify', {
          phone_number: phoneNumber,
          otp: formValues.otp
        })
        toast.success('Phone verified successfully!')
        onSuccess()
      } catch (error) {
        const { response } = error
        if (response?.data?.message) {
          toast.error(response.data.message)
        } else {
          toast.error('Invalid OTP. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  })

  const handleResendOTP = async()=>{
    setIsLoading(true);
    try {
      await axiosClient.post('/phone/otp/request', {phone_number: phoneNumber});
      toast.success('OTP resent successfully');
    }catch(error){
      const {response} = error;
      if(response?.data?.message){
        toast.error(response.data.message);
      }else{
        toast.error('Failed to resend OTP. Please try again.');
      }
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <section className='relative'>
      <h1 className='text-2xl font-bold font-poppins mb-4'>Enter OTP Code</h1>
      <p className='text-gray-600 mb-2 font-poppins'>We sent a 6 digit code to your registered email</p>

      {/* form starts here */}
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>

        <div className='relative'>
          <div className='absolute left-3 top-4 -translate-y-1/6'>
            <Shield size={20} />
          </div>
          <input
            type="text"
            placeholder='Enter your OTP code'
            className='w-full pl-12 pr-4 py-3 rounded-lg hover:outline-0 focus:outline-0 bg-placeholder-blue'
            id='otp'
            value={values.otp}
            onChange={handleChange}
            onBlur={handleBlur} />
          {errors.otp && touched.otp && (
            <p className='text-decline text-sm mt-1'>{errors.otp}</p>
          )}

        </div>

        {/* resend otp */}
        <div className='text-right'>
          Didn't receive the code?
          <button
            type='button'
            className='text-primary-blue font-poppins font-medium hover:text-hover-blue transition-colors'
            onClick={handleResendOTP}>
            Resend
          </button>

        </div>

        <div className='flex gap-3 mt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex-1 py-3 cursor-pointer bg-primary-blue text-light rounded-md font-medium hover:bg-hover-blue transition-all disabled:opacity-50'>
            {isLoading ? <Loader className='animate-spin mx-auto w-5 h-5' /> : 'Verify OTP'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default OTPVerify