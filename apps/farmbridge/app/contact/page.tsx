import Link from 'next/link';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-2">We&apos;re here to help. Reach out anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Cards */}
          <div className="space-y-4">
            <a href="https://wa.me/2349077753551" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <p className="text-gray-500 text-sm">09057773551</p>
                <p className="text-green-700 text-xs mt-1">Tap to chat →</p>
              </div>
            </a>

            <a href="mailto:farmpricenigeria@gmail.com" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition block">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-500 text-sm">farmpricenigeria@gmail.com</p>
                <p className="text-amber-700 text-xs mt-1">Send email →</p>
              </div>
            </a>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <p className="font-semibold text-gray-900 mb-1">Response Time</p>
              <p className="text-gray-500 text-sm">We typically respond within <strong className="text-green-700">2 hours</strong> during business hours.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition">
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                  <option>Advertising</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" rows={4} placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white rounded-xl py-3.5 font-semibold hover:bg-amber-700 transition shadow-md">Send Message</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
