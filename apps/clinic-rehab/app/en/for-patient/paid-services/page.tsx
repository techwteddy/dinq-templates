"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Search, Download, FileText, Stethoscope, BookOpen, Plus, Minus, Trash2, ShoppingCart, X } from "lucide-react";

// Імпортуємо англійські компоненти
import HeaderEn from "@/app/components/HeaderEn"; 
import FooterEn from "@/app/components/FooterEn";

// Імпортуємо дані послуг
import { servicesData } from "@/app/data/servicesEn";

interface SelectedService {
  code: string;
  name: string;
  price: string;
  quantity: number;
}

export default function PaidServicesPageEn() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const parsePrice = (priceStr: string) => {
    const clean = priceStr.replace(/[^\d-]/g, "");
    if (clean.includes("-")) {
      const parts = clean.split("-");
      return parseInt(parts[0]) || 0;
    }
    return parseInt(clean) || 0;
  };

  const toggleService = (service: { name: string; code: string; price: string }) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.name === service.name && s.code === service.code);
      if (exists) {
        return prev.filter(s => !(s.name === service.name && s.code === service.code));
      } else {
        return [...prev, { name: service.name, code: service.code, price: service.price, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (name: string, code: string, qty: number) => {
    if (qty <= 0) {
      setSelectedServices(prev => prev.filter(s => !(s.name === name && s.code === code)));
      return;
    }
    setSelectedServices(prev => prev.map(s => (s.name === name && s.code === code) ? { ...s, quantity: qty } : s));
  };

  // Фільтрація послуг за пошуком
  const filteredServices = servicesData.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const medicalServices = filteredServices.filter(s => s.category === "Medical Services");
  const educationalServices = filteredServices.filter(s => s.category === "Educational Services");

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-500 overflow-x-hidden">
      
      {/* АБСТРАКТНИЙ ФОН */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 dark:bg-blue-700 opacity-20 dark:opacity-30 blur-[100px]"></div>
      </div>

      <HeaderEn />

      <main className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ШАПКА СТОРІНКИ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
            Paid Services
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Transparent prices for additional medical and educational services at our center. Check the price list online or download the official document.
          </p>
          
          <a 
            href="/documents/pricelist.pdf" 
            download="PriceList_Sails_of_Life.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition shadow-sm"
          >
            <Download size={18} />
            Download full price list (PDF)
          </a>
        </motion.div>

        {/* ПАНЕЛЬ ПОШУКУ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="mb-12">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for a service (e.g., massage, ultrasound...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* ТАБЛИЦІ */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="space-y-12">
          
          {/* Блок Медичних послуг */}
          {medicalServices.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                  <Stethoscope size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Services</h2>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-6 py-4 font-semibold w-24">Code</th>
                        <th className="px-6 py-4 font-semibold">Service Name</th>
                        <th className="px-6 py-4 font-semibold text-right w-32">Price (UAH)</th>
                        <th className="px-6 py-4 font-semibold text-right w-28">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {medicalServices.map((service, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{service.code}</td>
                          <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{service.name}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">{service.price} ₴</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => toggleService(service)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedServices.some(s => s.name === service.name && s.code === service.code)
                                  ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-400"
                              }`}
                            >
                              {selectedServices.some(s => s.name === service.name && s.code === service.code) ? "Remove" : "Add"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Блок Освітніх послуг */}
          {educationalServices.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Educational Services</h2>
              </div>
              
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <th className="px-6 py-4 font-semibold w-24">Code</th>
                        <th className="px-6 py-4 font-semibold">Service Name</th>
                        <th className="px-6 py-4 font-semibold text-right w-32">Price (UAH)</th>
                        <th className="px-6 py-4 font-semibold text-right w-28">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {educationalServices.map((service, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{service.code}</td>
                          <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{service.name}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">{service.price} ₴</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => toggleService(service)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                selectedServices.some(s => s.name === service.name && s.code === service.code)
                                  ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-400"
                              }`}
                            >
                              {selectedServices.some(s => s.name === service.name && s.code === service.code) ? "Remove" : "Add"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Якщо нічого не знайдено */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No services found for your query. Try changing your search terms.</p>
            </div>
          )}

        </motion.div>
      </main>

      {/* Кнопка плаваючого кошика */}
      {selectedServices.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition"
        >
          <ShoppingCart size={24} />
          <span className="bg-white text-blue-600 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-inner">
            {selectedServices.reduce((sum, s) => sum + s.quantity, 0)}
          </span>
        </motion.button>
      )}

      {/* Панель Кошика (Drawer) */}
      <AnimatePresence>
        {isCartOpen && selectedServices.length > 0 && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-500"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Price Calculation</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedServices.map((service, idx) => {
                  const itemPrice = parsePrice(service.price);
                  return (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{service.name}</div>
                        <button
                          onClick={() => toggleService(service)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-slate-400 font-mono">{service.code}</div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(service.name, service.code, service.quantity - 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-center">{service.quantity}</span>
                          <button
                            onClick={() => updateQuantity(service.name, service.code, service.quantity + 1)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white mt-1 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2">
                        <span className="text-xs text-slate-400 font-normal">Price:</span>
                        <span>{itemPrice * service.quantity} ₴</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer / Total */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex justify-between items-center font-bold text-lg text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400 text-2xl">
                    {selectedServices.reduce((sum, s) => sum + parsePrice(s.price) * s.quantity, 0)} ₴
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                  * Note: The calculated price is approximate. The final price is determined by the registrar after doctor consultation.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedServices([]);
                      setIsCartOpen(false);
                    }}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      if (selectedServices.length > 0) {
                        localStorage.setItem("selected_services", JSON.stringify(selectedServices));
                      }
                      window.location.href = "/en/contacts";
                    }}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    Book appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FooterEn />
    </div>
  );
}