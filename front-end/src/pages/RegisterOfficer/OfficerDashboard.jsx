import { useState, useEffect } from 'react'
import Navbar from '../../components/navigations/Navbar'
import Footer from '../../components/common/Footer'
import axiosClient from '../../api/axiosClient'
// import { useStateContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { Eye, FileClock, FileCheck2, FileX2, Printer } from 'lucide-react'
import CertificateReviewModal from '../../components/officer/CertificateReviewModal'
import PrintBirthForm from '../../components/officer/PrintBirthForm'

const OfficerDashboard = () => {

  // const { user } = useStateContext();
  const [officerInfo, setOfficerInfo] = useState(null); //officer_info: function,municipality and ward
  const [statistics, setStatistics] = useState(null); //  statistical count for pending, approved and rejected
  const [certificates, setCertificates] = useState(null); // stores all certificates
  const [selectedCertificate, setSelectedCertificate] = useState(null); //current certificate selected
  const [filteredCertificates, setFilteredCertificates] = useState([]) // certificates based on active filter
  const [activeFilter, setActiveFilter] = useState('PENDING');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!certificates || certificates.length === 0) {
      setFilteredCertificates([]);
      return;
    }
    const filtered = certificates.filter(
      cert => cert.registrations?.status === activeFilter);
    setFilteredCertificates(filtered);
  }, [activeFilter, certificates]);

  const fetchData = async () => {
    try {
      const [statRes, allCertRes] = await Promise.all([
        axiosClient.get('/officer/statistics'),
        axiosClient.get('/officer/certificates/all-certificates/'),
      ]);

      setStatistics(statRes.data.data);
      setCertificates(allCertRes.data.data);
      setOfficerInfo(allCertRes.data.officer_info);
    } catch (error) {
      toast.error('Failed to load dashboard data', error);
    }
  }

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowReviewModal(true);
  }

  const handleApprove = async (certificateId) => {
    if (!window.confirm('Are you sure you want to approve this certificate?')) return;
    try {
      await axiosClient.post(`/officer/certificates/approve/${certificateId}`);
      toast.success('Certificate approved successfully');;
      fetchData();
      setShowReviewModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve certificate');
    }
  }

  const handleReject = async (certificateId, reason) => {
    try {
      await axiosClient.post(`/officer/certificates/reject/${certificateId}`, {
        rejection_reason: reason,
      });
      toast.success('Certificate rejected');
      fetchData();
      setShowReviewModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject certificate');
    }
  }


  return (
    <>
      <Navbar />

      <section className='min-h-screen mt-5 py-5 wrapper'>

        {/* Officer info header */}
        <h1 className='font-bold font-poppins text-2xl my-2'>Officer Dashboard</h1>
        <div className='font-poppins flex items-center gap-3'>
          <span className='text-dark font-semibold'>
            Role:
            <span className='text-primary-blue ml-1 uppercase font-semibold'>{officerInfo?.function} Registration Officer</span>
          </span>
          <span>|</span>
          <span className="font-semibold text-dark">Location:
            <span className="text-gray-800 ml-2">
              {officerInfo?.municipality}, Ward {officerInfo?.ward}
            </span>
          </span>
        </div>
        <hr className='mt-1 mb-2' />

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5 font-poppins">

          {/* Pending */}
          <section
            className={`bg-yellow-50 border-pending rounded-lg p-6 shadow-md cursor-pointer hover:transition-shadow ${activeFilter === 'PENDING' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setActiveFilter('PENDING')}>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 font-poppins">Pending</p>
                <p className="text-3xl font-bold text-yellow-700 mt-2">{statistics?.pending || 0}</p>
              </div>
              <FileClock className="w-12 h-12 text-yellow-500" />
            </div>
          </section>

          {/* Approved */}
          <section
            className={`bg-green-50 border-success rounded-lg p-6 shadow-md cursor-pointer hover:transition-shadow ${activeFilter === 'APPROVED' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setActiveFilter('APPROVED')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 font-poppins">Approved</p>
                <p className="text-3xl font-bold text-green-700 mt-2">{statistics?.approved || 0}</p>
              </div>
              <FileCheck2 className="w-12 h-12 text-green-500" />
            </div>
          </section>

          {/* Rejected */}
          <section
            className={`bg-red-50 border-decline rounded-lg p-6 shadow-md cursor-pointer hover:transition-shadow ${activeFilter === 'REJECTED' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setActiveFilter('REJECTED')}>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-600 font-poppins">Rejected</p>
                <p className="text-3xl font-bold text-red-700 mt-2">{statistics?.rejected || 0}</p>
              </div>
              <FileX2 className="w-12 h-12 text-red-500" />
            </div>
          </section>
        </section>


        {/* Certificates Table */}
        <section className="my-3 rounded-lg">
          <h2 className="text-2xl font-bold font-poppins mb-4">
            {activeFilter} Certificates
          </h2>

          {filteredCertificates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No {activeFilter.toLowerCase()} certificates</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <table className="w-full font-poppins p-2 border border-gray-100 cursor-pointer">
                <thead className="bg-mid-light">
                  <tr>
                    <th className="px-4 py-3 text-left">Registration No.</th>
                    <th className="px-4 py-3 text-left">Informant Name</th>
                    <th className="px-4 py-3 text-left">Submitted Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">{cert.registrations?.registration_number}</td>
                      <td className="px-4 py-3">{cert.registrations?.informant_name_en}</td>
                      <td className="px-4 py-3">
                        {new Date(cert.registrations?.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${cert.registrations?.status === 'PENDING'
                            ? 'bg-pending text-mid-dark'
                            : cert.registrations?.status === 'APPROVED'
                              ? 'bg-success text-mid-dark'
                              : 'bg-decline text-light'
                            }`}
                        >
                          {cert.registrations?.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title={
                              cert.registrations?.status === 'PENDING' ? 'Review' : 'View'
                            }
                          >
                            <Eye size={16} />
                          </button>

                          {cert.registrations?.status === 'APPROVED' && (
                            <button
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setShowPrintModal(true)
                              }}
                              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                              title="Print"
                            >
                              <Printer size={16} />
                            </button>
                          )}

                          {cert.registrations?.status === 'REJECTED' && (
                            <button
                              onClick={() => {
                                setSelectedCertificate(cert)
                                setShowPrintModal(false)
                              }}
                            >
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      {/* Review Modal */}
      {showReviewModal && selectedCertificate && (
        <CertificateReviewModal
          certificate={selectedCertificate}
          onClose={() => setShowReviewModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Print Modal */}
      {showPrintModal && selectedCertificate && (
        <PrintBirthForm
          certificate={selectedCertificate}
          onClose={() => setShowPrintModal(false)}
        />
      )}


      <Footer />
    </>
  )
}

export default OfficerDashboard