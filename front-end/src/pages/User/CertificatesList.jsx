import { useState, useEffect } from "react"
import axiosClient from "../../api/axiosClient"
import { Loader, X } from "lucide-react"
import mainLogo from '../../assets/svg/logo.svg'

const CertificatesList = ({ className }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState("birth");

  // Fetch certificates whenever filter type changes
  useEffect(() => {
    fetchCertificates(activeType);
  }, [activeType]);

  // Fetch all certificates based on type
  const fetchCertificates = async (type = "birth") => {
    setLoading(true);
    try {
      const endpointMap = {
        birth: "/birth-certificates",
        death: "/death-certificates",
        migration: "/migration-certificates",
      };
      const response = await axiosClient.get(endpointMap[type]);
      setCertificates(response.data.data || []);
    } catch (error) {
      console.log("Failed to fetch certificates", error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific certificate only
  const handleView = async (certificateId) => {
    try {
      const endpointMap = {
        birth: `/birth-certificates/${certificateId}`,
        death: `/death-certificates/${certificateId}`,
        migration: `/migration-certificates/${certificateId}`,
      };
      const response = await axiosClient.get(endpointMap[activeType]);
      setSelectedCertificate(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.log("Failed to fetch certificate details", error);
    }
  };

  // Status Badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-pending text-yellow-800",
      APPROVED: "bg-success text-green-800",
      REJECTED: "bg-decline text-white",
    };
    return (
      <span className={`px-3 py-1 rounded-md text-sm font-semibold font-poppins ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <section className={`${className} flex justify-center items-center min-h-[200px]`}>
        <Loader className="animate-spin" size={30} />
      </section>
    );
  }

  return (
    <>
      <section className={`${className}`}>
        <h1 className="font-poppins font-semibold text-2xl">Registered Certificates</h1>
        <hr className="mt-1 mb-3" />

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["birth", "death", "migration"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full font-poppins text-sm font-medium transition-all duration-300 
              ${activeType === type
                  ? "bg-primary-blue text-light shadow-md scale-105 cursor-pointer"
                  : "bg-card-btn hover:bg-gray-300 text-dark cursor-pointer"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Certificates
            </button>
          ))}
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-10">
            <p className="font-poppins text-gray-500">No {activeType} certificates registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="relative group overflow-hidden rounded-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleView(cert.id)}
              >
                <div className="relative h-52 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="relative z-10 text-center px-6">
                    <img src={mainLogo} alt="Logo" className="w-16 h-16 mx-auto opacity-80" />
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                </div>

                <div className="bg-mid-dark p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-light font-semibold font-poppins">
                        Registration No.: {cert.registrations.registration_number}
                      </p>
                      <p className="text-xs text-light font-semibold font-poppins">
                        Registration for: {cert.full_name_en || cert.deceased_name_en || cert.migrator_name_en}
                      </p>
                    </div>
                    <div>{getStatusBadge(cert.registrations.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificate View Modal */}
      {showModal && selectedCertificate && (
        <section className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-light max-w-4xl w-full max-h-[90vh] overflow-y-auto relative'>
            <button
              onClick={() => setShowModal(false)}
              className='absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 cursor-pointer'
            >
              <X size={24} />
            </button>

            {/* Nepali Government Birth Certificate Format */}
            <div className='p-8 certificate-prevent-copy' onContextMenu={(e) => e.preventDefault()}>

              {/* header container */}
              <section className="flex gap-4 items-center">
                {/* logo section */}
                <section>
                  <img
                    src={mainLogo}
                    alt="Main Logo"
                    className="w-40 h-40" />
                </section>

                {/* Header */}
                <section className='text-center pb-4 mb-2 w-full'>
                  <h1 className="text-md font-bold">
                    अनुसुची-२० <br />
                    नियम २० को उपनियम (१) को खण्ड (क) संग सम्बधित
                  </h1>

                  <h2 className='text-lg font-bold mt-2'>नेपाल सरकार (Government of Nepal)</h2>

                  <h3 className='text-lg font-semibold mt-2'>गृह मन्त्रालय (Office of Local Registrar)</h3>

                  <h4 className='text-lg font-semibold mt-2'>
                    {selectedCertificate.address.municipality_np} - वडा नं. {selectedCertificate.address.ward_number}, {selectedCertificate.address.district_np} जिल्ला, {selectedCertificate.address.province_np} प्रदेश
                  </h4>

                  <h5 className="text-lg font-semibold">
                    {selectedCertificate.address.municipality_en} - Ward No. {selectedCertificate.address.ward_number}, {selectedCertificate.address.district_en} District, {selectedCertificate.address.province_en} Province
                  </h5>

                </section>
              </section>

              <section className="text-center mb-5">
                <h3 className='text-3xl font-bold mt-3 text-red-600'>जन्म दर्ता प्रमाणपत्र</h3>
                <h4 className='text-3xl font-bold text-red-600 underline'>Birth Registration Certificate</h4>
              </section>

              {/* Certificate Number and Date */}
              <div className='flex justify-between mb-6 mt-3 text-sm'>
                <div>
                  <p><strong>दर्ता नं. / Registration No.:</strong> {selectedCertificate.registrations.registration_number}</p>
                </div>
                <div>
                  <p><strong>दर्ता मिति / Registration Date:</strong> {new Date(selectedCertificate.registrations.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Certificate Details */}
              <section>
                {/* Child Details */}
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3 border-b pb-2'>बालबालिकाको विवरण / Child's Details</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='font-semibold'>पूरा नाम:</p>
                      <p>{selectedCertificate.full_name_np}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Full Name:</p>
                      <p>{selectedCertificate.full_name_en}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>लिङ्ग / Gender:</p>
                      <p>{selectedCertificate.gender}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>जन्म मिति / Date of Birth:</p>
                      <p>{selectedCertificate.dob_np} ({new Date(selectedCertificate.dob_en).toLocaleDateString()})</p>
                    </div>
                    <div>
                      <p className='font-semibold'>जन्म स्थान:</p>
                      <p>{selectedCertificate.birth_details.birth_place_np}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Birth Place:</p>
                      <p>{selectedCertificate.birth_details.birth_place_en}</p>
                    </div>
                  </div>
                </div>

                {/* Grandfather Details */}
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3 border-b pb-2'>हजुरबुवाको विवरण / Grandfather's Details</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='font-semibold'>पूरा नाम:</p>
                      <p>{selectedCertificate.grandfathers.grandfather_name_np}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Full Name:</p>
                      <p>{selectedCertificate.grandfathers.grandfather_name_en}</p>
                    </div>
                  </div>
                </div>

                {/* Parents Details */}
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3 border-b pb-2'>अभिभावकको विवरण / Parent's Details</h3>
                  {selectedCertificate.parent_details.map((parent, index) => (
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
                </div>

                {/* Address */}
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3 border-b pb-2'>ठेगाना / Address</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='font-semibold'>ठेगाना:</p>
                      <p>{selectedCertificate.address.municipality_np} - वडा नं. {selectedCertificate.address.ward_number}, {selectedCertificate.address.district_np} जिल्ला, {selectedCertificate.address.province_np} प्रदेश</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Address:</p>
                      <p>{selectedCertificate.address.municipality_en} - Ward No. {selectedCertificate.address.ward_number}, {selectedCertificate.address.district_en} District, {selectedCertificate.address.province_en} Province</p>
                    </div>
                  </div>
                </div>

                {/* Informant Details */}
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3 border-b pb-2'>सूचनादाताको विवरण / Informant's Details</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='font-semibold'>पूरा नाम:</p>
                      <p>{selectedCertificate.registrations.informant_name_np}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Full Name:</p>
                      <p>{selectedCertificate.registrations.informant_name_en}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>नागरिकता नं.:</p>
                      <p>{selectedCertificate.registrations.citizenship_number_np}</p>
                    </div>
                    <div>
                      <p className='font-semibold'>Citizenship No.:</p>
                      <p>{selectedCertificate.registrations.citizenship_number_en}</p>
                    </div>
                  </div>
                </div>

                {/* officer details */}
                <section className="flex justify-between items-center gap-4 mt-5">
                  <div>
                    <h5 className="mt-20 border-b"></h5>
                    <h5 className="font-bold text-md mb-3">अधिकारीको सही/ Officer Signature</h5>
                  </div>

                  <div className="border p-3 w-60 h-32">
                  </div>
                </section>

                <div>
                  <p className="text-md font-semibold my-2 text-right">कार्यालयको छाप/ Official Stamp</p>
                  <p className="text-right font-semibold">{selectedCertificate.address.municipality_np}, {selectedCertificate.address.district_np} जिल्ला</p>
                </div>

              </section>

              {/* Footer Note */}
              <div className='text-center text-sm text-gray-600 p-4 border-t mt-5'>
                <p className='font-semibold'>नोट / Note:</p>
                <p>यो प्रमाणपत्र स्वीकृत भएपछि वडा कार्यालयबाट संकलन गर्नुहोस्।</p>
                <p className='mt-1'>After approval, collect the certificate from the ward office.</p>
              </div>




            </div>
          </div>
        </section>
      )}

    </>
  )
}

export default CertificatesList