"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Clock, Download, Search, Filter } from "lucide-react";
import { generateInvoice } from '@/lib/generateInvoice';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "ghar2026admin";

type Donor = {
  id: string;
  name: string;
  email: string;
  amount: number;
  donation_type: string;
  project: string;
  payment_method: string;
  status: string;
  created_at: string;
  country: string;
};

export default function AdminDonationsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [invoicePopup, setInvoicePopup] = useState<Donor | null>(null);
  const [confirmPopup, setConfirmPopup] = useState<{donor: Donor, newStatus: string} | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchDonors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false });
    setDonors(data || []);
    setLoading(false);
  };

  useEffect(() => {
  if (authenticated) fetchDonors(); // eslint-disable-line react-hooks/set-state-in-effect
}, [authenticated]);

  const updateStatus = async (id: string, newStatus: string, donor: Donor) => {
    console.log("updateStatus called:", id, newStatus, donor.payment_method);
    if (newStatus === "completed" && (donor.payment_method !== "paypal" || donor.donation_type === "once")) {
      setConfirmPopup({ donor, newStatus });
      return;
    }
    const { error } = await supabase.from("donors").update({ status: newStatus }).eq("id", id);
    console.log("update result:", error);
    fetchDonors();
  };

  const handleConfirmAndSend = async (lang: 'de' | 'en', sendEmail: boolean) => {
    if (!confirmPopup) return;
    setSendingInvoice(true);
    await supabase.from("donors").update({ status: confirmPopup.newStatus }).eq("id", confirmPopup.donor.id);
    if (sendEmail) {
      const { doc, receiptNo } = generateInvoice(confirmPopup.donor, lang);
      const pdfBlob = doc.output('blob');
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `GHAR-Receipt-${receiptNo}.pdf`);
      formData.append('email', confirmPopup.donor.email);
      formData.append('name', confirmPopup.donor.name);
      formData.append('lang', lang);
      formData.append('receiptNo', receiptNo);
      formData.append('amount', confirmPopup.donor.amount.toString());
      await fetch('/api/send-invoice', { method: 'POST', body: formData });
    }
    setSendingInvoice(false);
    setConfirmPopup(null);
    fetchDonors();
  };

  const handleDownloadInvoice = (donor: Donor, lang: 'de' | 'en') => {
    const { doc, receiptNo } = generateInvoice(donor, lang);
    doc.save(`GHAR-Receipt-${receiptNo}.pdf`);
  };

  const handleEmailInvoice = async (donor: Donor, lang: 'de' | 'en') => {
    const { doc, receiptNo } = generateInvoice(donor, lang);
    const pdfBlob = doc.output('blob');
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `GHAR-Receipt-${receiptNo}.pdf`);
    formData.append('email', donor.email);
    formData.append('name', donor.name);
    formData.append('lang', lang);
    formData.append('receiptNo', receiptNo);
    formData.append('amount', donor.amount.toString());

    const res = await fetch('/api/send-invoice', { method: 'POST', body: formData });
    if (res.ok) {
      alert(`✅ Invoice sent to ${donor.email}`);
    } else {
      alert('❌ Failed to send email');
    }
  };

  const filtered = donors.filter((d) => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    const matchMethod = filterMethod === "all" || d.payment_method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  const stats = {
    total: donors.length,
    pending: donors.filter(d => d.status === "pending").length,
    completed: donors.filter(d => d.status === "completed").length,
    abandoned: donors.filter(d => d.status === "abandoned" || d.status === "abandoned2").length,
    expired: donors.filter(d => d.status === "expired").length,
    totalAmount: donors.filter(d => d.status === "completed").reduce((sum, d) => sum + (d.amount || 0), 0),
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Amount", "Type", "Country", "Project", "Payment Method", "Status", "Date"];
    const rows = filtered.map(d => [
      d.name, d.email, d.amount, d.donation_type, d.country || '',
      d.project, d.payment_method, d.status, new Date(d.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghar-donations.csv";
    a.click();
  };

  const statusBadge = (status: string) => {
    if (status === "completed") return <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} />Completed</span>;
    if (status === "cancelled") return <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full"><XCircle size={12} />Cancelled</span>;
    if (status === "abandoned") return <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><Clock size={12} />Abandoned</span>;
    if (status === "abandoned2") return <span className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full"><Clock size={12} />Reminded</span>;
    if (status === "expired") return <span className="flex items-center gap-1 text-xs text-red-400 bg-red-50 px-2 py-1 rounded-full"><XCircle size={12} />Expired</span>;
    return <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full"><Clock size={12} />Pending</span>;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-dark mb-2 text-center">Admin Access</h1>
          <p className="text-gray-400 text-sm text-center mb-8">GHAR Organization — Admin Panel</p>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            {passwordError && <p className="text-red-500 text-xs text-center">Incorrect password</p>}
            <button onClick={handleLogin}
              className="bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-sm transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Donations Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">GHAR Organization — Admin Panel</p>
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Total Donations</p>
            <p className="text-2xl font-bold text-dark">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Abandoned</p>
            <p className="text-2xl font-bold text-gray-400">{stats.abandoned}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Expired</p>
            <p className="text-2xl font-bold text-orange-400">{stats.expired}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs mb-1">Total Received</p>
            <p className="text-2xl font-bold text-primary">€{stats.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="text-sm focus:outline-none w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="abandoned">Abandoned</option>
              <option value="abandoned2">Reminded</option>
              <option value="expired">Expired</option>
            </select>
            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="all">All Methods</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Confirm & Send Invoice Popup */}
        {confirmPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
              <h3 className="text-lg font-bold text-dark mb-2">✅ Confirm Donation</h3>
              <p className="text-gray-400 text-sm mb-2">
                Marking <strong>{confirmPopup.donor.name}</strong> as completed.
              </p>
              <p className="text-gray-400 text-sm mb-6">Send a donation receipt by email?</p>
              {sendingInvoice ? (
                <div className="text-center text-gray-400 text-sm py-4">Sending...</div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-3 text-center">Select language for receipt:</p>
                  <div className="flex flex-col gap-3 mb-4">
                    {[
                      { lang: 'de' as const, label: '🇩🇪 Deutsch (Standard)' },
                      { lang: 'en' as const, label: '🇬🇧 English' },
                    ].map(({ lang, label }) => (
                      <button
                        key={lang}
                        onClick={() => handleConfirmAndSend(lang, true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        📧 {label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleConfirmAndSend('de', false)}
                    className="w-full text-gray-400 hover:text-dark text-sm transition-colors border border-gray-200 rounded-lg py-2"
                  >
                    Complete without sending receipt
                  </button>
                  <button
                    onClick={() => setConfirmPopup(null)}
                    className="w-full text-gray-300 hover:text-dark text-xs transition-colors mt-2"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Invoice Popup */}
        {invoicePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
              <h3 className="text-lg font-bold text-dark mb-2">📄 Generate Invoice</h3>
              <p className="text-gray-400 text-sm mb-6">
                Select language for <strong>{invoicePopup.name}</strong>
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { lang: 'de' as const, label: '🇩🇪 Deutsch' },
                  { lang: 'en' as const, label: '🇬🇧 English' },
                ].map(({ lang, label }) => (
                  <div key={lang} className="flex gap-2">
                    <button
                      onClick={() => handleDownloadInvoice(invoicePopup, lang)}
                      className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ⬇️ {label}
                    </button>
                    <button
                      onClick={() => handleEmailInvoice(invoicePopup, lang)}
                      className="flex-1 flex items-center justify-center gap-2 border border-secondary text-secondary hover:bg-secondary hover:text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      📧 {label}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setInvoicePopup(null)}
                className="w-full text-gray-400 hover:text-dark text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No donations found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Name</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Email</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Amount</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Project</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Method</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Type</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Country</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Date</th>
                    <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-dark">{donor.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{donor.email}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary">€{donor.amount}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{donor.project}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                          {donor.payment_method || 'paypal'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${donor.donation_type === 'monthly' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                          {donor.donation_type === 'monthly' ? '🔄 Monthly' : '1️⃣ Once'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{donor.country || '—'}</td>
                      <td className="px-4 py-3">{statusBadge(donor.status)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(donor.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                              value={donor.status}
                              onChange={(e) => updateStatus(donor.id, e.target.value, donor)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer"
                            >
                              <option value="pending">🕐 Pending</option>
                              <option value="completed">✅ Completed</option>
                              <option value="cancelled">❌ Cancelled</option>
                              <option value="abandoned">🚫 Abandoned</option>
                              <option value="abandoned2">🔔 Reminded</option>
                              <option value="expired">⏰ Expired</option>
                            </select>
                          {donor.status === "completed" && (
                            <button
                              onClick={() => setInvoicePopup(donor)}
                              className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white px-2 py-1.5 rounded-lg transition-colors font-medium"
                            >
                              📄 Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}