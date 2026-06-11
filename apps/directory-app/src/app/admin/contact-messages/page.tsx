"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiMail, FiTrash2, FiRefreshCw } from "react-icons/fi";

const supabaseUrl = 'https://hvhaavxjbujkpvbvftkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGFhdnhqYnVqa3B2YnZmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDIxNTksImV4cCI6MjA2NzM3ODE1OX0.Rtyf3tRc8cDiXtuf23BnvGrBw0cbJ4QOTBhm93Typ40';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    fetchMessages();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Contact Messages</h1>
            <p className="text-gray-600">View and manage all contact form submissions</p>
          </div>
          <button
            onClick={() => { setRefreshing(true); fetchMessages().then(() => setRefreshing(false)); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">No contact messages found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-800">{msg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:underline">
                        <FiMail /> {msg.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{msg.subject}</td>
                    <td className="px-6 py-4 whitespace-pre-line text-gray-700 max-w-xs break-words">{msg.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 