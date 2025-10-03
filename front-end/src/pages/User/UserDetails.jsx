import { useEffect, useState } from "react"
import { useStateContext } from "../../contexts/AuthContext"
import axiosClient from "../../api/axiosClient"
import { Loader } from "lucide-react"


const UserDetails = ({ className }) => {
  useStateContext();
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosClient.get('/user/profile')
        setUserProfile(response.data);
      } catch (error) {
        console.error('failed to fetch user profile', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [])

  if (loading) {
    return (
      <section className={`dashboardCard ${className} flex justify-center items-center`}>
        <Loader className="animate-spin" size={30} />
      </section>
    )
  }

  return (
    <section className={`dashboardCard ${className}`}>
      <h1 className='font-poppins font-semibold text-2xl'>Citizen Information</h1>
      <hr className='mt-1 mb-3' />

      <section className='flex flex-col'>
        <div className='space-y-4 font-poppins'>

          <h2 className='font-semibold'>Name: {" "}
            <span className='font-normal'>{userProfile?.name || 'N/A'}</span></h2>

          <h2 className='font-semibold'>Email: {" "}
            <span className='font-normal'>{userProfile?.email || 'N/A'}</span></h2>

          <h2 className='font-semibold'>Phone Number: {" "}
            <span className='font-normal'>{userProfile?.phone_number || 'N/A'}</span></h2>

          <h2 className='font-semibold'>Phone Number Verification: {" "}
            <span className='font-normal'>
              {userProfile?.phone_verified_at ? (
                <span className='text-success font-semibold'> Verified</span>
              ) : (
                <span className='text-decline font-semibold'> Not Verified</span>
              )}</span></h2>

          <h2 className='font-semibold'>Account Created on: {" "}
            <span className='font-normal'>
              {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US') : 'N/A'}
            </span></h2>
        </div>

      </section>

    </section>
  )
}

export default UserDetails