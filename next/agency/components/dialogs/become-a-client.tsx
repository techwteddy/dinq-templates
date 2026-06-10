import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";

interface BecomeClientDialogProps {
  onClose: () => void;
  initialPackage: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  package: string;
  message: string;
}

type FormErrors = {
  [key in keyof FormData]?: string;
};

const packageData = [
  {
    title: "Starter",
    price: "Starting from $2,500",
    description: "For teams launching a first version with clear scope and limited risk.",
    keyFeatures: [
      "Validated scope and production-ready foundation",
      "Clear, maintainable UI/UX aligned with your goals",
      "Basic SEO and performance best practices",
      "Mobile-friendly implementation",
      "Contact and lead capture integration",
      "1 month post-launch support to address early issues",
    ],
  },
  {
    title: "Growth",
    price: "Starting from $5,000",
    description:
      "For teams adding complexity, data, and real operational requirements.",
    keyFeatures: [
      "Systems hardened for scale and operational complexity",
      "Custom backend development aligned with your product requirements",
      "Database design focused on reliability and future growth",
      "Secure user authentication and access control",
      "API integrations with third-party services",
      "3 months post-launch support for stabilization and iteration",
    ],
  },
  {
    title: "Enterprise",
    price: "Starting from $10,000",
    description: "For organizations where reliability, security, and coordination matter more than speed alone.",
    keyFeatures: [
      "Long-term ownership, security review, and coordination",
      "Advanced data analytics and reporting",
      "Third-party integrations across internal and external systems",
      "Performance optimization for scale and reliability",
      "Security review and compliance considerations",
      "6 months premium support and collaboration",
    ],
  },
] as const;

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  package: "",
  message: "",
};

const bounceVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, type: "spring", damping: 10, stiffness: 100 },
  }),
};

const BecomeClientDialog: React.FC<BecomeClientDialogProps> = ({
  onClose,
  initialPackage,
}) => {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    package: initialPackage,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [clickCount, setClickCount] = useState(0);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [toastTimer]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone number";
    if (!formData.organization.trim())
      newErrors.organization = "Organization name is required";
    if (!formData.package) newErrors.package = "Please select a package";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setClickCount((prev) => prev + 1);
    if (toastTimer) clearTimeout(toastTimer);
    const newTimer = setTimeout(() => {
      setToast({ message: "", type: "" });
      setClickCount(0);
    }, 5000);
    setToastTimer(newTimer);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please correct the errors in the form", "error");
      return;
    }
    const formDataToSend = new FormData(e.currentTarget);
    formDataToSend.append("formType", "becomeClient");
    const result = await sendEmail(formDataToSend);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("We'll be in touch soon!", "success");
      setFormData(initialFormData);
      setTimeout(onClose, 2000);
    }
  };

  const togglePackageDetails = (packageTitle: string) => {
    setExpandedPackage(expandedPackage === packageTitle ? null : packageTitle);
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg borderBlack 
    bg-white dark:bg-gray-800 text-black dark:text-white 
    transition-all duration-300 outline-none 
    focus:ring-2 focus:ring-blue-500 text-sm`;

  const shakeAnimation: TargetAndTransition = {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4, repeat: 2, repeatType: "reverse" as const },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-100 dark:bg-gray-900 p-5 rounded-lg w-full max-w-xl text-center relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <motion.h2
          variants={bounceVariant}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-lg font-bold mb-1.5 text-gray-800 dark:text-white"
        >
          Let's Innovate Together!
        </motion.h2>
        <motion.p
          variants={bounceVariant}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-xs text-gray-700 mb-3 dark:text-white/80"
        >
          Please fill out the form below to apply for our services.
        </motion.p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <motion.div
            variants={bounceVariant}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  className={inputClasses}
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  className={inputClasses}
                  name="organization"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Your organization name"
                  value={formData.organization}
                  onChange={handleChange}
                />
                {errors.organization && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.organization}
                  </p>
                )}
              </div>
              <div>
                <input
                  className={inputClasses}
                  name="email"
                  type="email"
                  required
                  maxLength={500}
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  className={inputClasses}
                  name="phone"
                  type="tel"
                  required
                  maxLength={15}
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={bounceVariant}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="mb-2">
              <h3 className="text-sm font-semibold mb-1.5">Choose a Package</h3>
              <div className="space-y-1.5">
                {packageData.map((pkg) => (
                  <div
                    key={pkg.title}
                    className={`border rounded-lg transition-colors ${
                      formData.package === pkg.title
                        ? "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700"
                        : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                    }`}
                  >
                    <label className="flex items-center justify-between p-1.5 cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="package"
                          value={pkg.title}
                          checked={formData.package === pkg.title}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-medium text-xs">{pkg.title}</span>
                      </div>
                      <span className="font-bold text-xs">{pkg.price}</span>
                    </label>
                    <div className="px-1.5 pb-1.5">
                      <p className="text-xs mb-0.5">{pkg.description}</p>
                      <button
                        type="button"
                        onClick={() => togglePackageDetails(pkg.title)}
                        className="text-blue-500 text-xs flex items-center"
                      >
                        {expandedPackage === pkg.title ? (
                          <>
                            <ChevronUp size={14} className="mr-0.5" /> Hide
                            details
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-0.5" /> Show
                            details
                          </>
                        )}
                      </button>
                      {expandedPackage === pkg.title && (
                        <ul className="mt-1.5 text-sm space-y-1">
                          {pkg.keyFeatures.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2"
                            >
                              <svg
                                className="w-4 h-4 text-accent-lavender dark:text-accent-lavenderDark flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {errors.package && (
              <p className="text-red-500 text-xs mt-1">{errors.package}</p>
            )}
          </motion.div>

          <motion.div
            variants={bounceVariant}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <textarea
              className={`${inputClasses} resize-none`}
              name="message"
              placeholder="Your message"
              required
              maxLength={5000}
              rows={6}
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && (
              <p className="text-red-500 text-xs">{errors.message}</p>
            )}
          </motion.div>

          <motion.div
            variants={bounceVariant}
            initial="hidden"
            animate="visible"
            custom={5}
            className="flex justify-center mt-0.5"
          >
            <button
              type="submit"
              className="px-5 py-2 bg-white/80 border border-white/40 hover:bg-white/90 dark:bg-gray-950/75 dark:border-black/40 dark:hover:bg-gray-950/85 backdrop-blur-[0.5rem] shadow-lg shadow-black/[0.03] font-semibold rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition disabled:opacity-65 text-sm"
            >
              Submit
            </button>
          </motion.div>
        </form>
      </motion.div>
      <AnimatePresence>
        {toast.message && (
          <motion.div
            key={clickCount}
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 left-4 p-3 rounded-lg text-white text-sm ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ zIndex: 1002 }}
          >
            <motion.div
              animate={clickCount > 1 ? shakeAnimation : {}}
              onAnimationComplete={() => {
                if (clickCount > 1) {
                  setToast({ message: "", type: "" });
                  setClickCount(0);
                }
              }}
            >
              {toast.message}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BecomeClientDialog;
