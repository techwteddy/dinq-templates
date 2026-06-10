"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error("Form error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative bg-green-50 py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800">
            Let’s Start a Conversation
          </h2>
          <p className="text-gray-600">
            Whether you have a question, a project idea, or just want to say hi,
            our inbox is always open.
          </p>
          <div className="text-green-700 font-medium">
            <p>Email us directly:</p>
            <a
              href="mailto:info.dtpixstudios@gmail.com"
              className="underline underline-offset-4 hover:text-green-900 transition-colors"
            >
              info.dtpixstudios@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-xl rounded-3xl p-8 space-y-6 border border-green-100"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-green-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border border-green-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-green-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border border-green-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-green-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border border-green-200 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="text-green-700 text-sm">
              Your message was sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm">
              Something went wrong. Please try again later.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
