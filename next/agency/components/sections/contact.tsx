"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/heading";
import { useSectionInView } from "@/lib/hooks";
import ContactForm, { ContactFormData } from "@/components/forms/contact-form";
import Magnetic from "@/components/ui/magnetic";

export default function Contact() {
  const ref = useSectionInView("Contact Us", 0.3);

  const handleSubmit = async (data: ContactFormData) => {
    // Call the API route
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send message");
    }

    const result = await response.json();
    return result;
  };

  return (
    <motion.section
      ref={ref}
      id="contact-us"
      className="mb-28 w-full scroll-mt-28 flex flex-col items-center px-4 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      aria-labelledby="contact-heading"
    >
      {/* Background blobs */}
      <div className="absolute top-[-10rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] bg-[#fbe2e3] dark:bg-[#6b4a4f] sm:w-[68.75rem]"></div>
      <div className="absolute top-[10rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] bg-[#dbd7fb] dark:bg-[#4a4560] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <SectionHeading id="contact-heading">Tell us what you're trying to build</SectionHeading>
        <p className="text-gray-800 dark:text-gray-400 text-lg max-w-2xl mx-auto mt-4">
          We'll review your request and follow up with next steps if it's a good fit.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-100 border border-black/5 rounded-lg overflow-hidden relative hover:bg-gray-200 transition dark:text-white dark:bg-white/10 dark:hover:bg-white/20 p-6">
          <ContactForm onSubmit={handleSubmit} />
        </div>

        {/* Privacy notice */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          role="complementary"
          aria-label="Privacy notice"
        >
          <p className="text-sm text-gray-700 dark:text-gray-500">
            We typically respond within one business day. Your information is never shared.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
