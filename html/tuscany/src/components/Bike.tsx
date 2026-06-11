import background from "../assets/background.webp";
import bike from "../assets/bikeSection.webp";
import Image from "next/image";

const Bike = () => {
  return (
    <section
      className="relative mt-[64px] mb-[154px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="backdrop-brightness-100 py-16 px-4 md:px-0">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-start gap-10 relative">
          
          <div className="flex flex-col items-center w-full max-w-xl z-10">
            <h2 className="text-[32px] font-[800] text-center mb-6 text-darker">
              Book Now Bike
            </h2>
            <div className="bg-[#FFFFFF33] p-6 md:p-10 rounded-3xl shadow-md w-full" data-aos = "fade-right">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name and Surname
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name and surname"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your telephone number"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Type
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select the service types
                    </option>
                    <option>Repair</option>
                    <option>Check-up</option>
                    <option>Customization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    placeholder="Select date"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    placeholder="Select time"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>
              </form>

              <div className="flex justify-center mt-6">
                <button className="bg-orange hover:bg-orange-300 text-white font-semibold px-8 py-2 rounded-full transition-all duration-300 cursor-pointer">
                  Book Now
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-[724px] h-[542px] top-[100px] hidden md:block scale-x-[-1]" data-aos= "fade-left">
            <Image
              src={bike}
              alt="bike"
              fill
              style={{ objectFit: "contain" }}
              className="absolute bottom-0 right-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bike;
