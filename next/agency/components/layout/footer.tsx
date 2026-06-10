"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BsLinkedin,
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsTiktok,
} from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import Magnetic from "@/components/ui/magnetic";
import PrivacyPolicy from "@/components/dialogs/privacy-policy";
import TermsAndConditions from "@/components/dialogs/terms-and-conditions";

interface SocialIconProps {
  Icon: React.ElementType;
  href: string;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ Icon, href, label }) => (
  <Magnetic>
    <motion.a
      className="p-2.5 bg-stone-100/95 border border-white/40 hover:bg-stone-200/95 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] flex items-center justify-center rounded-full focus:scale-110 hover:scale-110 active:scale-105 transition-all cursor-pointer text-gray-700 dark:text-gray-300"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={20} />
    </motion.a>
  </Magnetic>
);

export default function Footer() {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsAndConditionsOpen, setIsTermsAndConditionsOpen] =
    useState(false);

  const handleOpenPrivacyPolicy = useCallback(() => {
    setIsPrivacyPolicyOpen(true);
  }, []);

  const handleClosePrivacyPolicy = useCallback(() => {
    setIsPrivacyPolicyOpen(false);
  }, []);

  const handleOpenTermsAndConditions = useCallback(() => {
    setIsTermsAndConditionsOpen(true);
  }, []);

  const handleCloseTermsAndConditions = useCallback(() => {
    setIsTermsAndConditionsOpen(false);
  }, []);

  return (
    <>
      <footer className="bg-transparent mt-auto relative">
        {/* Background blobs */}
        <div className="absolute top-[-5rem] -z-10 right-[10rem] h-[20rem] w-[20rem] rounded-full blur-[10rem] bg-[#fce4ec] dark:bg-[#4a3540] sm:w-[40rem]"></div>
        <div className="absolute top-[0rem] -z-10 left-[-30rem] h-[20rem] w-[35rem] rounded-full blur-[10rem] bg-[#e8eaf6] dark:bg-[#353d52] sm:w-[40rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
        
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center md:text-left"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Sakia Labs
              </h3>
              <p className="text-base text-gray-800 dark:text-gray-400 leading-relaxed">
                Steady hands for serious products
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Connect With Us
              </h4>
              <div className="flex gap-3">
                <SocialIcon
                  Icon={BsFacebook}
                  href="https://facebook.com/sakialabs"
                  label="Visit Sakia Labs on Facebook"
                />
                <SocialIcon
                  Icon={BsTwitter}
                  href="https://twitter.com/sakialabs"
                  label="Visit Sakia Labs on Twitter"
                />
                <SocialIcon
                  Icon={BsInstagram}
                  href="https://instagram.com/sakialabs"
                  label="Visit Sakia Labs on Instagram"
                />
                <SocialIcon
                  Icon={BsLinkedin}
                  href="https://www.linkedin.com/company/sakialabs"
                  label="Visit Sakia Labs on LinkedIn"
                />
                <SocialIcon
                  Icon={FaGithubSquare}
                  href="https://github.com/sakialabs"
                  label="Visit Sakia Labs on GitHub"
                />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center md:text-right"
            >
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Get In Touch
              </h4>
              <div className="space-y-2 text-base text-gray-800 dark:text-gray-400">
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (437) 219-9433
                </p>
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  sakia.labs@hey.com
                </p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-200 dark:border-opacity-20 my-6" />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-base text-gray-800 dark:text-gray-400">
              © {new Date().getFullYear()} Sakia Labs. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={handleOpenPrivacyPolicy}
                className="text-base text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                aria-label="Open Privacy Policy"
              >
                Privacy Policy
              </button>
              <button
                onClick={handleOpenTermsAndConditions}
                className="text-base text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                aria-label="Open Terms and Conditions"
              >
                Terms & Conditions
              </button>
            </div>
          </motion.div>
        </div>
      </footer>
      <PrivacyPolicy
        isOpen={isPrivacyPolicyOpen}
        onClose={handleClosePrivacyPolicy}
      />
      <TermsAndConditions
        isOpen={isTermsAndConditionsOpen}
        onClose={handleCloseTermsAndConditions}
      />
    </>
  );
}
