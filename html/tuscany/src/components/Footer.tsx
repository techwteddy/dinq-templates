import logo from '../assets/logo.svg'
import Image from 'next/image'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import { FaLocationDot } from "react-icons/fa6";
import { BsTelephoneFill } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="px-16 py-10 bg-darker text-white">
      <div className="container mx-auto flex flex-col gap-10">
        <Image src={logo} alt='logo' width={130} height={133} />

        <div className="flex justify-between flex-wrap gap-6 flex-1 mt-4 md:mt-0">
          <div>
            <h3 className="font-bold mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Bike and Rickshaw rental',
                'Guided Tours of Lucca',
                'Guided Bike Tour of Lucca',
                'Trip In The Tuscan Hills',
                'Transportation With Luxury Cars',
                'Wine Tours By Bus With Guide'
              ].map((text, i) => (
                <li className='mb-4' key={i}>
                  <a
                    href="#"
                    className="text-white font-semibold hover:underline transition duration-150"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="font-bold mb-3">Home</h3>
            <ul className="space-y-2 text-sm">
              {['Home', 'About Us', 'Tour Packages'].map((text, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white font-semibold hover:underline transition duration-150"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Help</h3>
            <ul className="space-y-2 text-sm">
              {['Terms of Use', 'Privacy Policy'].map((text, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white font-semibold hover:underline transition duration-150"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Contacts</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className='flex items-center gap-3 text-white font-semibold hover:underline transition duration-150'><span><FaLocationDot color='#FA8B02' size={18}/></span> Piazza Napoleone, Lucca, Tuscany</li>
              <li className='flex items-center gap-3 text-white font-semibold hover:underline transition duration-150'><span><BsTelephoneFill color='#FA8B02'size={18}/></span> +39 346 368 5708</li>
              <li className='flex items-center gap-3 text-white font-semibold hover:underline transition duration-150'><span><FaEnvelope color='#FA8B02' size={18}/></span> italianlimo@gmail.com</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-orange p-2 rounded-full text-darker">
                <FaTwitter />
              </a>
              <a href="#" className="bg-orange p-2 rounded-full text-darker">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-orange p-2 rounded-full text-darker">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />
      <p className="text-center text-sm text-gray-400">
        Copyright © 2022. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
