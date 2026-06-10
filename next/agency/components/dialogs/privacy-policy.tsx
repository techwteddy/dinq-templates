import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg w-full max-w-[45rem] text-center relative my-8"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-4 text-gray-800 dark:text-white"
            >
              Privacy Policy
            </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="text-left max-h-[70vh] overflow-y-auto pr-4 custom-scroll"
            >
              <p className="mb-4">
                At Sakia, your privacy is our priority. Here's how we handle
                your information:
              </p>
              <p className="mb-4">
                <strong>Information Collection:</strong> We may collect your
                name, email, and details you provide when contacting us or using
                our services.
              </p>
              <p className="mb-4">
                <strong>Usage:</strong> We use your data to offer services,
                communicate, and improve. We don't sell or share your
                information, except as legally required.
              </p>
              <p className="mb-4">
                <strong>Cookies:</strong> Our site uses cookies to personalize
                your experience. You can disable cookies in your browser
                settings.
              </p>
              <p className="mb-4">
                <strong>Security:</strong> We protect your data but can't
                guarantee complete security due to internet vulnerabilities.
              </p>
              <p className="mb-4">
                <strong>Third-Party Links:</strong> We're not responsible for
                the privacy practices of external sites. Review their policies
                when visiting.
              </p>
              <p className="mb-4">
                <strong>Policy Updates:</strong> We'll post any changes here.
                Continued use of our site means you accept the updates.
              </p>
              <p className="mb-4">
                <strong>Contact:</strong> Questions? Email us at
                sakia.labs@hey.com.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicy;
