import { FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Affinsight</h3>
            <p className="text-gray-400 mb-4">
              Your trusted source for affiliate network information, reviews, and insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/networks" className="text-gray-400 hover:text-white transition">Affiliate Networks</a></li>
              <li><a href="/offers" className="text-gray-400 hover:text-white transition">Offers</a></li>
              <li><a href="/programs" className="text-gray-400 hover:text-white transition">Affiliate Programs</a></li>
              <li><a href="/reviews" className="text-gray-400 hover:text-white transition">Reviews</a></li>
              <li><a href="/resources" className="text-gray-400 hover:text-white transition">Resources</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Affiliate Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Success Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tools</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Glossary</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Get the latest affiliate marketing insights and updates.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 Affinsight. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 