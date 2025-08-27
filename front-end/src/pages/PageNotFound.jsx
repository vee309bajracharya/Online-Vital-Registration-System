import React from 'react'
import Error from '../assets/svg/page-not-found.svg'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <section>
            <div className='flex justify-center items-center flex-col min-h-screen'>
                <img
                    src={Error}
                    alt="Page Not Found Image"
                    className='max-w-md' />

                <div className='text-center mt-5'>
                    <Link
                        to='/signup'
                        className='text-mid-dark underline font-poppins font-semibold'>
                        Go to Signup
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default PageNotFound