import { useState } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import mainLogo from '../../assets/svg/logo.svg'
import { toast } from 'react-toastify'

const CertificateReviewModal = ({ certificate, onClose, onApprove, onReject }) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    onReject(certificate.id, rejectionReason);
  }

  // Check if certificate is in a state that allows actions
  const canTakeAction = certificate.registrations?.status === 'PENDING' || certificate.registrations?.status === 'REJECTED';

  return (
    <section className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-light max-w-4xl w-full max-h-[90vh] overflow-y-auto relative'>
        <button
          aria-label='Close Button'
          onClick={onClose}
          className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10'
        >
          <X size={24} />
        </button>

        {/* Certificate Format */}
        <section className='p-8 certificate-prevent-copy'>

          {/* Header */}
          <section className="flex gap-4 items-center">
            <section>
              <img src={mainLogo} alt="Main Logo" className="w-40 h-40" />
            </section>
            <section className='text-center pb-4 mb-2 w-full'>
              <h1 className="text-md font-bold">
                अनुसुची-२० <br />
                नियम २० को उपनियम (१) को खण्ड (क) संग सम्बधित
              </h1>
              <h2 className='text-lg font-bold mt-2'>नेपाल सरकार (Government of Nepal)</h2>
              <h3 className='text-lg font-semibold mt-2'>गृह मन्त्रालय (Office of Local Registrar)</h3>
              <h4 className='text-lg font-semibold mt-2'>
                {certificate.address.municipality_np} - वडा नं. {certificate.address.ward_number}, {certificate.address.district_np} जिल्ला, {certificate.address.province_np} प्रदेश
              </h4>
              <h5 className="text-lg font-semibold">
                {certificate.address.municipality_en} - Ward No. {certificate.address.ward_number}, {certificate.address.district_en} District, {certificate.address.province_en} Province
              </h5>
            </section>
          </section>

          {/* Certificate Title */}
          <section className="text-center mb-5">
            <h3 className='text-3xl font-bold mt-3 text-red-600'>जन्म दर्ता प्रमाणपत्र</h3>
            <h4 className='text-3xl font-bold text-red-600 underline'>Birth Registration Certificate</h4>
          </section>

          {/* Certificate Number and Date */}
          <section className='flex justify-between mb-6 mt-3 text-sm'>
            <div>
              <p><strong>दर्ता नं. / Registration No.:</strong> {certificate.registrations.registration_number}</p>
            </div>
            <div>
              <p><strong>दर्ता मिति / Registration Date:</strong> {new Date(certificate.registrations.submitted_at).toLocaleDateString()}</p>
            </div>
          </section>

          {/* Certificate Details */}
          <section>
            {/* Child Details */}
            <section className='mb-6'>
              <h3 className='font-bold text-lg mb-3 border-b pb-2'>बालबालिकाको विवरण / Child's Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold'>पूरा नाम:</p>
                  <p>{certificate.full_name_np}</p>
                </div>
                <div>
                  <p className='font-semibold'>Full Name:</p>
                  <p>{certificate.full_name_en}</p>
                </div>
                <div>
                  <p className='font-semibold'>लिङ्ग / Gender:</p>
                  <p>{certificate.gender}</p>
                </div>
                <div>
                  <p className='font-semibold'>जन्म मिति / Date of Birth:</p>
                  <p>{certificate.dob_np} ({new Date(certificate.dob_en).toLocaleDateString()})</p>
                </div>
                <div>
                  <p className='font-semibold'>जन्म स्थान:</p>
                  <p>{certificate.birth_details.birth_place_np}</p>
                </div>
                <div>
                  <p className='font-semibold'>Birth Place:</p>
                  <p>{certificate.birth_details.birth_place_en}</p>
                </div>
              </div>
            </section>

            {/* Grandfather Details */}
            <section className='mb-6'>
              <h3 className='font-bold text-lg mb-3 border-b pb-2'>हजुरबुवाको विवरण / Grandfather's Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold'>पूरा नाम:</p>
                  <p>{certificate.grandfathers.grandfather_name_np}</p>
                </div>
                <div>
                  <p className='font-semibold'>Full Name:</p>
                  <p>{certificate.grandfathers.grandfather_name_en}</p>
                </div>
              </div>
            </section>

            {/* Parents Details */}
            <section className='mb-6'>
              <h3 className='font-bold text-lg mb-3 border-b pb-2'>अभिभावकको विवरण / Parent's Details</h3>
              {certificate.parent_details.map((parent, index) => (
                <div key={index} className='mb-4'>
                  <p className='font-semibold mb-2'>{parent.parent_type} / {parent.parent_type === 'Father' ? 'बुवा' : 'आमा'}</p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm font-semibold'>पूरा नाम:</p>
                      <p>{parent.full_name_np}</p>
                    </div>
                    <div>
                      <p className='text-sm font-semibold'>Full Name:</p>
                      <p>{parent.full_name_en}</p>
                    </div>
                    <div>
                      <p className='text-sm font-semibold'>नागरिकता नं.:</p>
                      <p>{parent.citizenship_number_np}</p>
                    </div>
                    <div>
                      <p className='text-sm font-semibold'>Citizenship No.:</p>
                      <p>{parent.citizenship_number_en}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Address */}
            <section className='mb-6'>
              <h3 className='font-bold text-lg mb-3 border-b pb-2'>ठेगाना / Address</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold'>ठेगाना:</p>
                  <p>{certificate.address.municipality_np} - वडा नं. {certificate.address.ward_number}, {certificate.address.district_np} जिल्ला, {certificate.address.province_np} प्रदेश</p>
                </div>
                <div>
                  <p className='font-semibold'>Address:</p>
                  <p>{certificate.address.municipality_en} - Ward No. {certificate.address.ward_number}, {certificate.address.district_en} District, {certificate.address.province_en} Province</p>
                </div>
              </div>
            </section>

            {/* Informant Details */}
            <section className='mb-6'>
              <h3 className='font-bold text-lg mb-3 border-b pb-2'>सूचनादाताको विवरण / Informant's Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='font-semibold'>पूरा नाम:</p>
                  <p>{certificate.registrations.informant_name_np}</p>
                </div>
                <div>
                  <p className='font-semibold'>Full Name:</p>
                  <p>{certificate.registrations.informant_name_en}</p>
                </div>
                <div>
                  <p className='font-semibold'>नागरिकता नं.:</p>
                  <p>{certificate.registrations.citizenship_number_np}</p>
                </div>
                <div>
                  <p className='font-semibold'>Citizenship No.:</p>
                  <p>{certificate.registrations.citizenship_number_en}</p>
                </div>
              </div>
            </section>

            {/* Show rejection reason if rejected */}
            {certificate.registrations?.status === 'REJECTED' && certificate.registrations?.rejection_reason && (
              <section className='mb-6 p-4 bg-red-50 border-l-4 border-decline rounded'>
                <h3 className='font-bold text-lg mb-2 text-red-700'>Rejection Reason:</h3>
                <p className='text-gray-800'>{certificate.registrations.rejection_reason}</p>
              </section>
            )}

            {/* footer officer details only show for approved certificates*/}
            {certificate.registrations?.status === 'APPROVED' && (
              <>
                <section className="flex justify-between items-center gap-4 mt-5">
                  <div>
                    <h5 className="mt-20 border-b"></h5>
                    <h5 className="font-bold text-md mb-3">अधिकारीको सही/ Officer Signature</h5>
                  </div>
                  <div className="border p-3 w-60 h-32"></div>
                </section>
                <section>
                  <p className="text-md font-semibold my-2 text-right">कार्यालयको छाप/ Official Stamp</p>
                  <p className="text-right font-semibold">{certificate.address.municipality_np}, {certificate.address.district_np} जिल्ला</p>
                </section>
              </>
            )}
          </section>
        </section>

        {/* Action buttons - only show for PENDING and REJECTED status */}
        {canTakeAction && (
          !showRejectForm ? (
            <section className='flex gap-4 mt-3 p-8 border-t'>
              {/* Reject button */}
              <button
                onClick={() => setShowRejectForm(true)}
                className='flex-1 flex items-center justify-center gap-2 bg-decline text-white py-3 rounded-md hover:bg-red-600 transition-colors font-semibold font-poppins cursor-pointer'
              >
                <XCircle size={20} /> Reject Certificate
              </button>

              {/* Approve button */}
              <button
                onClick={() => onApprove(certificate.id)}
                className='flex-1 flex items-center justify-center gap-2 bg-success text-light py-3 rounded-md hover:bg-green-600 transition-colors font-semibold font-poppins cursor-pointer'
              >
                <CheckCircle size={20} /> Approve Certificate
              </button>
            </section>
          ) : (
            <form onSubmit={handleRejectSubmit} className='mt-3 p-8 border-t'>
              <label className='block mb-2 font-semibold'>Rejection Reason:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                placeholder='Provide a valid reason to reject certificate'
                className='w-full p-3 rounded-md border hover:outline-0 focus:outline-0'
                required
              />
              <section className='flex gap-4 mt-4'>
                <button
                  type='button'
                  onClick={() => setShowRejectForm(false)}
                  className='flex-1 bg-mid-dark text-white py-3 rounded-md hover:bg-gray-600 transition-colors font-semibold font-poppins cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-decline text-white py-3 rounded-md hover:bg-red-600 transition-colors font-semibold font-poppins cursor-pointer'
                >
                  Confirm Rejection
                </button>
              </section>
            </form>
          )
        )}
      </div>
    </section>
  )
}

export default CertificateReviewModal