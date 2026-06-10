import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus } from "lucide-react";

const features = [
  "Frontend Development",
  "E-commerce Integration",
  "SEO",
  "Logo Design",
  "Social Media Integration",
  "API Development",
  "Database Design",
  "Brand Identity Package",
  "Mobile App Development",
  "Advanced Database Solutions",
  "Machine Learning Integration",
  "Motion Graphics & Animations",
  "Support Duration",
];

type PackageName = "Starter" | "Growth" | "Enterprise";

const packageFeatures: Record<PackageName, string[]> = {
  Starter: [
    "Basic",
    "Basic",
    "Basic",
    "✓",
    "✓",
    "✕",
    "✕",
    "✕",
    "✕",
    "✕",
    "✕",
    "✕",
    "1 month",
  ],
  Growth: [
    "Advanced",
    "Advanced",
    "Advanced",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "✕",
    "✕",
    "✕",
    "✕",
    "3 months",
  ],
  Enterprise: [
    "Advanced",
    "Advanced",
    "Advanced",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "✓",
    "6 months",
  ],
};

const bounceVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, type: "spring", damping: 10, stiffness: 100 },
  }),
};

interface ComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonDialog: React.FC<ComparisonDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 rounded-lg w-full max-w-[40rem] max-h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <motion.h2
              variants={bounceVariant}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-xl font-bold text-gray-800 dark:text-white text-center w-full mb-4"
            >
              Package Comparison
            </motion.h2>
            <motion.div
              variants={bounceVariant}
              initial="hidden"
              animate="visible"
              custom={1}
              className="overflow-x-auto"
            >
              <table className="w-full bg-white dark:bg-gray-800 border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-gray-800 dark:text-white font-semibold text-sm">
                      Feature
                    </th>
                    {Object.keys(packageFeatures).map((pkg) => (
                      <th
                        key={pkg}
                        className="px-4 py-3 text-center text-gray-800 dark:text-white font-semibold text-sm"
                      >
                        {pkg}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "bg-white dark:bg-gray-700"
                      }
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-600 text-sm">
                        {feature}
                      </td>
                      {(Object.keys(packageFeatures) as PackageName[]).map(
                        (pkg) => (
                          <td
                            key={pkg}
                            className="px-4 py-3 text-center text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-600 text-sm"
                          >
                            {renderFeatureValue(packageFeatures[pkg][index])}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const renderFeatureValue = (value: string) => {
  if (value === "✓") {
    return <Check className="mx-auto text-green-500" size={18} />;
  } else if (value === "✕") {
    return <Minus className="mx-auto text-red-500" size={18} />;
  } else {
    return value;
  }
};

export default ComparisonDialog;
