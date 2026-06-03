'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User, MessageSquare, Check, AlertCircle, ArrowRight, Users, PartyPopper, ChevronDown, Download, HelpCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

const eventOptions = [
  { value: 'general',  label: 'General Inquiry',        icon: HelpCircle },
  { value: 'private',  label: 'Private/Corporate Event', icon: Users },
  { value: 'festival', label: 'Festival Catering',       icon: PartyPopper },
  { value: 'catering', label: 'Tray Ordering',           icon: Download },
];

const DINQ_ORG_ID  = process.env.NEXT_PUBLIC_DINQ_ORG_ID;
const DINQ_VERTICAL = process.env.NEXT_PUBLIC_DINQ_VERTICAL || 'restaurant';
const SITE_NAME    = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Your Restaurant';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
    event_type: 'general', subscribe_newsletter: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const selectedEvent = eventOptions.find(o => o.value === formData.event_type) || eventOptions[0];
  const SelectedEventIcon = selectedEvent.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        name:     formData.name,
        email:    formData.email,
        phone:    formData.phone,
        business: SITE_NAME,
        vertical: DINQ_VERTICAL,
        message:  formData.message,
        source:   DINQ_VERTICAL,
        meta: {
          event_type:           selectedEvent.label,
          subscribe_newsletter: formData.subscribe_newsletter,
          org_id:               DINQ_ORG_ID || null,
        },
      };

      // If client is on DinqPlus → post to their vertical
      // If not → post to agency_quotes via dinqdigital.com
      const endpoint = DINQ_ORG_ID
        ? `https://dinqplus.app/api/book/${DINQ_ORG_ID}`
        : 'https://dinqdigital.com/api/quote'\;

      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      setSubmitStatus({ type: 'success', message: "Message sent! We'll get back to you as soon as possible." });
      setFormData({ name: '', email: '', phone: '', message: '', event_type: 'general', subscribe_newsletter: false });

    } catch (err) {
      console.error(err);
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative space-y-8 bg-white/90 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="space-y-2 text-center mb-8">
          <h3 className="text-2xl font-display font-bold text-your-black">Get in Touch</h3>
          <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="relative group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-your-orange/80 z-10" size={20} />
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-your-orange focus:ring-2 focus:ring-your-orange/20 transition-all bg-white" />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-your-orange/80 z-10" size={20} />
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-your-orange focus:ring-2 focus:ring-your-orange/20 transition-all bg-white" />
            </div>
          </div>

          {/* Phone */}
          <div className="relative group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-your-orange/80 z-10" size={20} />
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(123) 456-7890"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-your-orange focus:ring-2 focus:ring-your-orange/20 transition-all bg-white" />
            </div>
          </div>

          {/* Event Type */}
          <div className="relative group">
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
            <div className="relative">
              <SelectedEventIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-your-orange/80 z-10" size={20} />
              <select id="event_type" name="event_type" value={formData.event_type} onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-your-orange focus:ring-2 focus:ring-your-orange/20 transition-all bg-white appearance-none cursor-pointer">
                {eventOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="relative group">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-your-orange/80" size={20} />
            <textarea id="message" name="message" value={formData.message} onChange={handleChange}
              placeholder="How can we help you?" required rows={4}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-your-orange focus:ring-2 focus:ring-your-orange/20 transition-all bg-white" />
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="subscribe_newsletter" name="subscribe_newsletter"
            checked={formData.subscribe_newsletter}
            onChange={(e) => setFormData(prev => ({ ...prev, subscribe_newsletter: e.target.checked }))}
            className="h-5 w-5 rounded border-gray-300 text-your-orange focus:ring-your-orange" />
          <label htmlFor="subscribe_newsletter" className="text-sm text-your-black">
            Subscribe to our newsletter for exclusive promotions and special offers.
          </label>
        </div>

        {/* Status */}
        <AnimatePresence>
          {submitStatus.type && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {submitStatus.type === 'success' ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="w-full bg-your-orange hover:bg-your-orange/90 text-white px-8 py-4 rounded-full font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isSubmitting ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
          ) : (
            <>Send Message <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
