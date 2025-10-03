import mainLogo from '../../assets/svg/logo.svg';

const Spinner = ()=>{
    return(
        <div className='fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm'>
            <img 
                src={mainLogo} 
                alt="Main Logo"
                className='xs:w-32 xs:h-32 md:w-52 md:h-52 animate-pulse' />
        </div>
    );
}
export default Spinner