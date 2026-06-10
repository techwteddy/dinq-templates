import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isOpen,
  onClose,
}) => {
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
              Terms and Conditions
            </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="text-left max-h-[70vh] overflow-y-auto pr-4 custom-scroll"
            >
              <p className="mb-4">
                Welcome to Sakia! By using our site, you agree to the following
                terms:
              </p>
              <p className="mb-4">
                <strong>Content Use:</strong> All content is Sakia's property.
                No reproduction or use is allowed without permission.
              </p>
              <p className="mb-4">
                <strong>Conduct:</strong> Use our site lawfully and
                respectfully. Any harmful activity is prohibited.
              </p>
              <p className="mb-4">
                <strong>Privacy:</strong> Review our Privacy Policy for details
                on data handling.
              </p>
              <p className="mb-4">
                <strong>Third-Party Links:</strong> Sakia isn't responsible for
                external site content or practices.
              </p>
              <p className="mb-4">
                <strong>Disclaimer:</strong> While we strive for accuracy, Sakia
                doesn't guarantee the completeness of information.
              </p>
              <p className="mb-4">
                <strong>Liability:</strong> Sakia isn't liable for any damages
                from using the site.
              </p>
              <p className="mb-4">
                <strong>Changes:</strong> We may update these terms anytime.
                Continued use means you accept the changes.
              </p>
              <p className="mb-4">
                <strong>Contact:</strong> Questions? Reach us at
                sakia.labs@hey.com.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsAndConditions;
