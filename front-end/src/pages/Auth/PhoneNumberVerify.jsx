import { Loader, Phone, X } from 'lucide-react';
import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const PhoneNumberVerify = ({ onSuccess, onClose }) => {

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  })

  const { values, errors, touched, handleBlur, handleSubmit, handleChange } = useFormik({
    initialValues: {
      phone_number: '',
    },
    validationSchema,
    onSubmit: async (formValues) => {
      setIsLoading(true);
      try {
        await axiosClient.post('/phone/otp/request', formValues);
        toast.success('OTP sent to your registered email');
        onSuccess(formValues.phone_number);
      } catch (error) {
        const { response } = error;
        if (response?.data?.message) {
          toast.error(response.data.message);
        } else {
          toast.error('Failed to send OTP. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  })

  return (
    <section className='relative'>

      {/* close btn */}
      <button
        type='button'
        aria-label='Close Button'
        onClick={onClose}
        className='absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full'
      >
        <X size={20} />
      </button>

      <h1 className='text-2xl font-bold font-poppins mb-4'>Verify your Phone Number</h1>

      {/* form starts here */}
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>

        <div className='relative'>
          <div className='absolute left-3 top-4 -translate-y-1/6'>
            <Phone size={20} />
          </div>
          <input
            type="text"
            placeholder='Enter your phone number'
            className='w-full pl-12 pr-4 py-3 rounded-lg hover:outline-0 focus:outline-0 bg-placeholder-blue'
            id='phone_number'
            value={values.phone_number}
            onChange={handleChange}
            onBlur={handleBlur} />
          {errors.phone_number && touched.phone_number && (
            <p className='text-decline text-sm mt-1'>{errors.phone_number}</p>
          )}

        </div>

        <div className='flex gap-3 mt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex-1 py-3 cursor-pointer bg-primary-blue text-light rounded-md font-medium hover:bg-hover-blue transition-all disabled:opacity-50'>
            {isLoading ? <Loader className='animate-spin mx-auto w-5 h-5'/> : 'Send OTP'}
          </button>
        </div>
      </form>
    </section>

  )
}

export default PhoneNumberVerify