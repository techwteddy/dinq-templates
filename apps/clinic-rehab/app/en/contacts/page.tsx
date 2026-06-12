"use client";
import { useState, FormEvent, useEffect, Suspense } from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, PhoneCall, Mail, Clock, Send, CheckCircle2, Loader2, Accessibility, Bus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import HeaderEn from "@/app/components/HeaderEn";
import FooterEn from "@/app/components/FooterEn";
import GoogleMap from "@/app/components/GoogleMap";
import Input from "@/app/components/core/Input";
import Textarea from "@/app/components/core/Textarea";
import ConsentCheckboxEn from "@/app/components/core/ConsentCheckboxEn";

function ContactsContentEn() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeForm, setActiveForm] = useState<'appointment' | 'feedback'>('appointment');

  // Стан для наявності електронного направлення
  const [hasReferral, setHasReferral] = useState<"yes" | "no" | "">("");
  const [consent, setConsent] = useState(false);

  interface SelectedService {
    code: string;
    name: string;
    price: string;
    quantity: number;
  }
  const [preselectedServices, setPreselectedServices] = useState<SelectedService[]>([]);

  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    const careType = searchParams.get("careType");
    const referral = searchParams.get("referral");
    const symptoms = searchParams.get("symptoms")?.split(",") || [];
    const needs = searchParams.get("needs");

    if (careType || referral || symptoms.length > 0 || needs) {
      if (referral === "yes") {
        setHasReferral("yes");
      } else if (referral === "no_idea" || referral === "no") {
        setHasReferral("no");
      }

      const docs: string[] = ["PRM Doctor"];
      if (careType === "palliative") {
        docs.push("Psychologist");
        if (symptoms.includes("pain")) {
          docs.push("Pediatric Neurologist");
        }
      }
      if (needs === "child_neuro") {
        docs.push("Pediatric Neurologist", "Speech Therapist / Defectologist", "Psychologist");
      }
      if (symptoms.includes("mobility")) {
        docs.push("Physical Therapist", "Occupational Therapist");
      }
      if (symptoms.includes("care")) {
        docs.push("Occupational Therapist");
      }
      if (symptoms.includes("exhaustion")) {
        docs.push("Psychologist");
      }
      setSelectedDocs(Array.from(new Set(docs)));

      if (careType === "palliative") {
        setDiagnosis("Palliative status (requires symptomatic care)");
      } else if (careType === "child_rehab") {
        if (needs === "child_neuro") {
          setDiagnosis("Neurological disorders / Cerebral Palsy");
        } else if (needs === "rehab_injury") {
          setDiagnosis("Consequences of injury or surgery");
        }
      }

      let info = "Primary screening results from the website:\n";
      if (careType === "palliative") {
        info += "- Recommended: Palliative Medical Care for Children\n";
      } else if (careType === "child_rehab") {
        info += "- Recommended: Comprehensive Child Rehabilitation\n";
      } else {
        info += "- Recommended: PRM Specialist Consultation\n";
      }

      const symptomsMap: Record<string, string> = {
        pain: "Pain",
        care: "Need for caregiver assistance",
        dysphagia: "Swallowing/breathing issues",
        mobility: "Limited mobility",
        exhaustion: "High family stress level"
      };
      const activeSymptoms = symptoms.map(s => symptomsMap[s]).filter(Boolean);
      if (activeSymptoms.length > 0) {
        info += `- Identified conditions: ${activeSymptoms.join(", ")}`;
      }
      setAdditionalInfo(info);
    }
  }, [searchParams]);

  // Read preselected services from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selected_services");
      if (saved) {
        const services = JSON.parse(saved);
        if (Array.isArray(services) && services.length > 0) {
          setPreselectedServices(services);
        }
        localStorage.removeItem("selected_services");
      }
    } catch (e) {
      console.error("Error reading selected services:", e);
    }
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | FormDataEntryValue[]> = {};

    formData.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const cleanKey = key.replace('[]', '');
        if (!data[cleanKey]) {
          data[cleanKey] = [];
        }
        (data[cleanKey] as FormDataEntryValue[]).push(value);
      } else {
        data[key] = value.toString();
      }
    });

    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (Array.isArray(val)) {
        data[key] = val.join(', ');
      }
    });

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setConsent(false);
      } else {
        alert("An error occurred while sending. Please try again.");
      }
    } catch {
      alert("Connection error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <HeaderEn />

      <main className="py-16 md:py-24 relative z-10 max-w-7xl mx-auto px-6">
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
            Contact <span className="text-blue-600 dark:text-blue-400">Us</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We are always ready to answer your questions, provide consultation, or assist with arranging documents for your child&apos;s rehabilitation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-5 space-y-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Our Contacts</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Address</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">8 Korabelna St, Zhytomyr, Ukraine</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Phone</p>
                    <a href="tel:+380674572828" className="text-slate-600 dark:text-slate-400 text-sm mt-1 hover:text-emerald-600 transition-colors block">(067) 457-28-28</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                    <a href="mailto:baby_house@ukr.net" className="text-slate-600 dark:text-slate-400 text-sm mt-1 hover:text-amber-600 transition-colors block">baby_house@ukr.net</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Working Hours</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Mon-Fri: 08:00 - 17:30<br/>Sat-Sun: Closed (inpatient 24/7)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Accessibility & Public Transport */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Accessibility className="text-blue-600 dark:text-blue-400" size={24} />
                  Accessibility & Barrier-Free
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Ramp & barrier-free entrance:</strong> easy access to the building for people in wheelchairs and strollers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Wheelchair-accessible restroom:</strong> a specially equipped restroom for children using wheelchairs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Tactile paving:</strong> installed inside the center to assist visually impaired visitors with navigation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Braille signage:</strong> all offices and navigation signs are duplicated with Braille tactile plates for visually impaired patients.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Sign language:</strong> a cooperation agreement is signed with sign language interpreters to ensure effective communication with deaf patients.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Website accessibility:</strong> for users&apos; convenience, an accessibility menu is available (eye icon on the right) allowing you to adjust text size, change font to Arial, apply color filters (monochrome, contrast, invert), and disable animations.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span><strong>Free parking:</strong> convenient parking spaces located right next to the entrance.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Bus className="text-blue-600 dark:text-blue-400" size={24} />
                  Public Transport
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0 font-bold">🚍</span>
                    <span><strong>Minibus №33:</strong> the &quot;Rehabilitation Center&quot; stop is located directly opposite the entrance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0 font-bold">🚎</span>
                    <span><strong>Trolleybuses №2, 3, 4, 10:</strong> the terminus in the Bohunia direction is situated slightly further away (a few minutes walk).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
              <GoogleMap lang="en" />
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-7">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-bl-full -z-10 pointer-events-none"></div>
              
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                    {activeForm === 'appointment' ? 'Form submitted successfully!' : 'Feedback submitted successfully!'}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                    {activeForm === 'appointment' 
                      ? 'Thank you for reaching out. Our administrator will contact you shortly to arrange all the details.'
                      : 'Thank you for your feedback! Your opinion is very important to us.'}
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    {activeForm === 'appointment' ? 'Submit another form' : 'Send another review'}
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        {activeForm === 'appointment' ? 'Book Rehabilitation' : 'Leave a Review'}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        {activeForm === 'appointment' 
                          ? 'Fill out the form and our administrator will contact you to arrange a visit.'
                          : 'Share your experience with our center.'}
                      </p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 w-fit shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveForm('appointment')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                          activeForm === 'appointment'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Appointment
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm('feedback')}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                          activeForm === 'feedback'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                  
                  {activeForm === 'appointment' ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="Form_Type" value="Appointment" />
                    <input type="text" name="bot_check" className="hidden" autoComplete="off" tabIndex={-1} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Patient's Full Name *" type="text" name="Patient_Name" required placeholder="John Doe" />
                      <Input
                        label="Date of Birth *"
                        type="text" 
                        name="Date_of_Birth" 
                        required 
                        pattern="\d{2}\.\d{2}\.\d{4}"
                        title="Please enter the date in DD.MM.YYYY format (e.g. 15.03.2020)"
                        placeholder="DD.MM.YYYY" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Contact Phone *" type="tel" name="Phone" required placeholder="+38 (000) 000-00-00" />
                      <Input label="Email (optional)" type="email" name="Email" placeholder="mail@example.com" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Do you have an electronic referral from a doctor? *
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 w-full sm:w-fit border border-slate-200/50 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => setHasReferral("yes")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              hasReferral === "yes"
                                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Yes, I do
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasReferral("no")}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              hasReferral === "no"
                                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            No, I don&apos;t
                          </button>
                        </div>
                        <input type="hidden" name="Referral" value={hasReferral === "yes" ? "Yes" : hasReferral === "no" ? "No" : "Not specified"} />
                      </div>

                      {hasReferral === "yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4"
                        >
                          <Input
                            label="Electronic Referral Number *"
                            type="text"
                            name="Referral_Number"
                            required
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Preselected paid services */}
                    {preselectedServices.length > 0 && (
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Selected Services:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {preselectedServices.map((service, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {service.name} <span className="text-slate-400">({service.code})</span> x{service.quantity}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {parseInt(service.price.replace(/[^\d]/g, "")) * service.quantity} ₴
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-sm font-bold text-slate-900 dark:text-white">
                          <span>Total Amount:</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {preselectedServices.reduce((sum, s) => sum + parseInt(s.price.replace(/[^\d]/g, "")) * s.quantity, 0)} ₴
                          </span>
                        </div>
                        <input 
                          type="hidden" 
                          name="Selected_Paid_Services" 
                          value={preselectedServices.map(s => `${s.name} (${s.code}) x${s.quantity} - ${parseInt(s.price.replace(/[^\d]/g, "")) * s.quantity} UAH`).join("; ")} 
                        />
                      </div>
                    )}

                    <Input label="City of Residence *" type="text" name="Address" required placeholder="e.g., Zhytomyr" />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Need for specialist consultation:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {[
                          "PRM Doctor", "Physical Therapist", "Occupational Therapist", 
                          "Speech Therapist / Defectologist", "Psychologist", "Pediatric Neurologist", 
                          "Pediatric Psychiatrist", "Pediatric Orthopedist-Traumatologist"
                        ].map((doc) => (
                          <label key={doc} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              name="Consultation_Needed[]" 
                              value={doc} 
                              checked={selectedDocs.includes(doc)}
                              onChange={() => {
                                setSelectedDocs(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
                              }}
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc}</span>
                          </label>
                        ))}
                        <div className="sm:col-span-2 mt-2">
                           <input type="text" name="Consultation_Other" className="w-full px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400" placeholder="Other (specify specialist)..." />
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Diagnosis (optional)"
                      type="text" 
                      name="Diagnosis" 
                      value={diagnosis} 
                      onChange={(e) => setDiagnosis(e.target.value)} 
                      placeholder="Specify diagnosis..." 
                    />

                    <Textarea
                      label="Additional Information"
                      name="Additional_Information" 
                      value={additionalInfo} 
                      onChange={(e) => setAdditionalInfo(e.target.value)} 
                      rows={3} 
                      placeholder="Add any information you consider important..."
                    />

                    <ConsentCheckboxEn checked={consent} onChange={setConsent} />

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group mt-8 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Submit form
                        </>
                      )}
                    </button>
                  </form>
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="Form_Type" value="Feedback" />
                    <input type="text" name="bot_check" className="hidden" autoComplete="off" tabIndex={-1} />

                    <Textarea label="Your Feedback *" name="Feedback" required rows={5} placeholder="Share your impressions..." />

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group mt-8 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Submit feedback
                        </>
                      )}
                    </button>
                  </form>
                  )}
                </>
              )}

            </div>
          </motion.div>
        </div>

      </main>

      <FooterEn />
    </div>
  );
}

export default function ContactsPageEn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
      </div>
    }>
      <ContactsContentEn />
    </Suspense>
  );
}
