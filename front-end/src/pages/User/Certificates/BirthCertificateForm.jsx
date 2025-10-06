import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, ArrowLeft, ArrowRight } from 'lucide-react'
import { useFormik } from 'formik'
import { BirthRegisterYupValidation } from '../../../components/validations/BirthRegisterYupValidation'
import axiosClient from '../../../api/axiosClient'
import { toast } from 'react-toastify'
import Navbar from '../../../components/navigations/Navbar'
import Footer from '../../../components/common/Footer'

const BirthCertificateForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 5;

  const initialValues = {
    full_name_en: '',
    full_name_np: '',
    gender: '',
    dob_en: '',
    dob_np: '',
    birth_place_en: '',
    birth_place_np: '',
    grandfather_name_en: '',
    grandfather_name_np: '',
    parents: [
      { parent_type: 'Father', full_name_en: '', full_name_np: '', citizenship_number_en: '', citizenship_number_np: '' },
      { parent_type: 'Mother', full_name_en: '', full_name_np: '', citizenship_number_en: '', citizenship_number_np: '' },
    ],
    province_en: '',
    province_np: '',
    district_en: '',
    district_np: '',
    municipality_en: '',
    municipality_np: '',
    ward_number: '',
    informant_name_en: '',
    informant_name_np: '',
    citizenship_number_en: '',
    citizenship_number_np: ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: BirthRegisterYupValidation[currentStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        await axiosClient.post('/birth-certificate/new', values);
        toast.success('Birth certificate registered successfully');
        navigate('/dashboard');
      } catch (error) {
        const { response } = error;
        if (response?.data?.details) {
          Object.values(response.data.details).forEach(errors => {
            errors.forEach(error => toast.error(error))
          })
        } else {
          toast.error('Failed to register birth certificate. Please try again');
        }
      } finally {
        setIsLoading(false);
      }
    },
  })

  const handleNext = async () => {
    // run validation for the whole form
    const errors = await formik.validateForm();

    // mark all touched for current step so errors show
    formik.setTouched(
      Object.fromEntries(
        Object.keys(BirthRegisterYupValidation[currentStep].fields).map((field) => [
          field,
          true,
        ])
      ),
      true
    );

    if (Object.keys(errors).length === 0) {
      // no errors → move to next step
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill all required fields");
    }
  };


  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }


  return (
    <>
      <Navbar />
      <section className='bg-mid-light py-8'>
        <section className='max-w-2xl mx-auto px-4'>

          {/* intro */}
          <section className='bg-primary-blue text-light text-center p-4 font-poppins mb-6'>
            <h1 className="text-xl font-bold mb-3">जन्म दर्ता फाराम / Birth Registration Form</h1>
            <p className='font-poppins font-normal'>अनुसूची २ ( नियम ५ सँग सम्बन्धित) / Schedule 2 (Related to Rule 5) </p>

          </section>

          {/* Progress Bar */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600">
                {currentStep === 1 && 'Child Details'}
                {currentStep === 2 && 'Birth Details'}
                {currentStep === 3 && 'Grandfather and Parent Details'}
                {currentStep === 4 && 'Address Details'}
                {currentStep === 5 && 'Informant Details'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-blue h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </section>

          {/* form starts here */}
          <section className='bg-light rounded-md shadow-md p-8'>

            <form onSubmit={formik.handleSubmit}>

              {/* Step 1: Child Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <label
                    className='certificateFormLabel'
                    htmlFor='Child Full Name'>Child Full Name (English)</label>
                  <input
                    type="text"
                    className="certificateFormInput"
                    autoComplete='off'
                    {...formik.getFieldProps('full_name_en')}
                  />
                  {formik.touched.full_name_en && formik.errors.full_name_en && (
                    <p className="showError">{formik.errors.full_name_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor='Child Full Name Nepali'>बच्चाको पूरा नाम (Nepali)</label>
                  <input
                    type="text"
                    className="certificateFormInput"
                    {...formik.getFieldProps('full_name_np')}
                  />
                  {formik.touched.full_name_np && formik.errors.full_name_np && (
                    <p className="showError">{formik.errors.full_name_np}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor='Gender'>Gender</label>
                  <select
                    className="certificateFormInput"
                    {...formik.getFieldProps('gender')}
                  >
                    <option value="">Select Options</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="showError">{formik.errors.gender}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor='Date of birth'>Date of Birth</label>
                  <input
                    type="date"
                    className="certificateFormInput"
                    {...formik.getFieldProps('dob_en')}
                  />
                  {formik.touched.dob_en && formik.errors.dob_en && (
                    <p className="showError">{formik.errors.dob_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor='Date of birth Nepali'>जन्म मिति (Nepali - YYYY-MM-DD)</label>
                  <input
                    type="text"
                    className="certificateFormInput"
                    {...formik.getFieldProps('dob_np')}
                  />
                  {formik.touched.dob_np && formik.errors.dob_np && (
                    <p className="showError">{formik.errors.dob_np}</p>
                  )}
                </div>
              )}

              {/* Step 2: Birth Details */}
              {currentStep === 2 && (
                <div className='space-y-4'>

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place'>Birth Place</label>
                  <input
                    type="text"
                    placeholder='Hospital Name'
                    className='certificateFormInput'
                    {...formik.getFieldProps('birth_place_en')} />
                  {formik.touched.birth_place_en && formik.errors.birth_place_en && (
                    <p className="showError">{formik.errors.birth_place_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place Nepali'>जन्म स्थान (Nepali)</label>
                  <input
                    type="text"
                    className='certificateFormInput'
                    {...formik.getFieldProps('birth_place_np')} />
                  {formik.touched.birth_place_np && formik.errors.birth_place_np && (
                    <p className="showError">{formik.errors.birth_place_np}</p>
                  )}
                </div>
              )}

              {/* Step 3: Grandfather and Parent Details */}
              {currentStep === 3 && (
                <section className="">

                  {/* grandparents */}
                  <section className='flex gap-4 w-full'>

                    <div className='flex flex-col'>
                      <label
                        className="certificateFormLabel"
                        htmlFor='Grandfather Name'>Grandfather Name (English)</label>
                      <input
                        type="text"
                        className="certificateFormInput w-full"
                        {...formik.getFieldProps('grandfather_name_en')}
                      />
                      {formik.touched.grandfather_name_en && formik.errors.grandfather_name_en && (
                        <p className="showError">{formik.errors.grandfather_name_en}</p>
                      )}

                    </div>

                    <div className='flex flex-col'>

                      <label
                        className="certificateFormLabel"
                        htmlFor='Grandfather Name Nepali'>Grandfather Name (Nepali)</label>
                      <input
                        type="text"
                        className="certificateFormInput"
                        {...formik.getFieldProps('grandfather_name_np')}
                      />
                      {formik.touched.grandfather_name_np && formik.errors.grandfather_name_np && (
                        <p className="showError">{formik.errors.grandfather_name_np}</p>
                      )}
                    </div>
                  </section>

                  {/* parents details */}
                  <section className='grid grid-cols-2 gap-2'>
                    {/* Father Details */}
                    <div className="space-y-3">

                      <div>
                        <label
                          className='certificateFormLabel'
                          htmlFor='Father Name'>Father's Full Name (English)</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[0].full_name_en')}
                        />
                      </div>

                      <div>
                        <label
                          className='certificateFormLabel'
                          htmlFor='Father Name Nepali'>बुबाको पूरा नाम (Nepali)</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[0].full_name_np')}
                        />

                      </div>

                      <div>
                        <label className='certificateFormLabel'>Citizenship Number</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[0].citizenship_number_en')}
                        />

                      </div>

                      <div>
                        <label className='certificateFormLabel'>नागरिकता नम्बर</label>

                        <input
                          type="text"
                          placeholder=""
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[0].citizenship_number_np')}
                        />
                      </div>
                    </div>

                    {/* Mother Details */}
                    <div className="space-y-3">

                      <div>
                        <label
                          className='certificateFormLabel'
                          htmlFor='Mother Name'>Mother's Full Name (English)</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[1].full_name_en')}
                        />
                      </div>

                      <div>
                        <label
                          className='certificateFormLabel'
                          htmlFor='Father Name Nepali'>आमाको पूरा नाम (Nepali)</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[1].full_name_np')}
                        />

                      </div>

                      <div>
                        <label className='certificateFormLabel'>Citizenship Number</label>
                        <input
                          type="text"
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[1].citizenship_number_en')}
                        />

                      </div>

                      <div>
                        <label className='certificateFormLabel'>नागरिकता नम्बर</label>

                        <input
                          type="text"
                          placeholder=""
                          className="certificateFormInput"
                          {...formik.getFieldProps('parents[1].citizenship_number_np')}
                        />
                      </div>
                    </div>
                  </section>
                </section>
              )}

              {/* Step 4: Address */}
              {currentStep === 4 && (
                <div className="space-y-4">

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>Province (English)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('province_en')} />
                  {formik.touched.province_en && formik.errors.province_en && (
                    <p className="showError">{formik.errors.province_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>प्रदेश</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('province_np')} />
                  {formik.touched.province_np && formik.errors.province_np && (
                    <p className="showError">{formik.errors.province_np}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>District (English)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('district_en')} />
                  {formik.touched.district_en && formik.errors.district_en && (
                    <p className="showError">{formik.errors.district_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>जिल्ला (Nepali)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('district_np')} />
                  {formik.touched.district_np && formik.errors.district_np && (
                    <p className="showError">{formik.errors.district_np}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>Municipality (English)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('municipality_en')} />
                  {formik.touched.municipality_en && formik.errors.municipality_en && (
                    <p className="showError">{formik.errors.municipality_en}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>नगरपालिका (Nepali)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('municipality_np')} />
                  {formik.touched.municipality_np && formik.errors.municipality_np && (
                    <p className="showError">{formik.errors.municipality_np}</p>
                  )}

                  <label
                    className='certificateFormLabel'
                    htmlFor=''>Ward Number</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('ward_number')} />
                  {formik.touched.ward_number && formik.errors.ward_number && (
                    <p className="showError">{formik.errors.ward_number}</p>
                  )}
                </div>
              )}

              {/* Step 5: Informant Details */}
              {currentStep === 5 && (
                <div className='space-y-4'>

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place Nepali'>Informant Name (English)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('informant_name_en')} />

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place Nepali'>सूचनादाताको नाम (Nepali)</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('informant_name_np')} />

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place Nepali'>Citizenship Number</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('citizenship_number_en')} />

                  <label
                    className='certificateFormLabel'
                    htmlFor='Birth Place Nepali'>नागरिकता नम्बर</label>
                  <input
                    type="text"
                    className="certificateFormInput" {...formik.getFieldProps('citizenship_number_np')} />
                </div>
              )}


              {/* Navigation Buttons */}
              <section className="flex gap-3 mt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-6 py-3 bg-mid-dark text-white rounded-md hover:bg-gray-600 cursor-pointer"
                  >
                    <ArrowLeft size={20} /> Previous
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    Next <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-success text-dark rounded-md hover:bg-green-600 hover:text-light disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Submit Registration'}
                  </button>
                )}
              </section>


            </form>
          </section>

        </section>


      </section >
      <Footer />

    </>
  )
}

export default BirthCertificateForm