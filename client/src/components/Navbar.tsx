
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';


const Navbar = () => {

  const {navigate, token} = useAppContext();

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-300">
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <div
    className="flex items-center cursor-pointer"
    onClick={() => navigate('/')}
  >
    <img
      src={assets.new_logo}
      alt="logo"
      className="w-10 sm:w-10"
    />
    <p className="text-xl font-semibold text-gray-800">Auto-Scribe</p>
  </div>
      <button onClick={()=>navigate('/admin')} className='flex items-center gap-2 bg-primary rounded-full px-10 py-2.5 text-sm cursor-pointer text-white '>{token ? 'Dashboard':'Login'}<img src={assets.arrow} alt="" className='w-3' /></button>
    </div>
    </div>
  )
}

export default Navbar