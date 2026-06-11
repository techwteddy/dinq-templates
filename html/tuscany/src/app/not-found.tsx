import logo from '../assets/logo.svg'
import Image from 'next/image';
import { TbHomeMove } from "react-icons/tb";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darker text-orange px-4 py-10 text-center">
      
      <Image
        src={logo}
        alt="Not Found"
        className="w-32 md:w-60 h-auto mb-8"
        data-aos= "fade"
        data-aos-delay= "500"
      />

      <h1 className="text-3xl md:text-5xl font-bold mb-4"  data-aos= "fade"data-aos-delay= "400">Page Not Found ! - 404</h1>

      <p className="text-lg mb-6"     data-aos= "fade"  data-aos-delay= "600">
        Sorry, the page you are looking for is not available or has been moved.
      </p>

      <a
        href="/"
        className="bg-orange text-white font-bold px-6 py-2 rounded-full hover:bg-orange/90 transition flex gap-2 items-center"
        data-aos= "fade"  data-aos-delay= "800"
      >
        Back To Home <span><TbHomeMove className='text-xl' color='#fff'/></span> 
      </a>
    </div>
  );
}

