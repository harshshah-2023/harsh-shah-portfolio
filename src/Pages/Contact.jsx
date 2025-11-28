import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function ContactUs() {

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: null, msg: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, msg: "" });

    emailjs
      .send(
        "service_7zp1fmr",
        "template_khi9en5",
        {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
        "dQHgsyU-EDyjLUEBS"
      )
      .then(() => {
        setStatus({ loading: false, success: true, msg: "Message sent successfully!" });
        setForm({ name: "", email: "", subject: "", message: "" });
      })
      .catch(() =>
        setStatus({ loading: false, success: false, msg: "Message failed, try again later." })
      );
  };

  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-gray-800 py-20 px-6 md:px-14 xl:px-32">

      {/* Glowing Blurs */}
      <div className="pointer-events-none absolute -left-16 top-0 w-[350px] sm:w-[450px] h-[450px] bg-[#4ee4cb44] blur-[140px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 w-[350px] sm:w-[430px] h-[430px] bg-[#5b36ff33] blur-[150px]" />

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2 items-start text-white">

        {/* LEFT INFO PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          className="text-center md:text-left px-2"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Let’s <span className="text-teal-400">Connect.</span>
          </h1>

          <p className="text-gray-300 mt-3 sm:mt-4 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
            Have an idea or opportunity?  
            Send a message — I personally reply to every one.
          </p>

          {/* Info Cards */}
          <div className="mt-10 grid gap-4 max-w-sm mx-auto md:mx-0">
            <InfoCard icon={<Mail />} title="Email" value="harshshah9848@gmail.com" link="mailto:harshshah9848@gmail.com" />
            <InfoCard icon={<Phone />} title="Phone" value="Available on request" />
            <InfoCard icon={<MapPin />} title="Location" value="India — Remote Friendly" />
            <InfoCard icon={<Clock />} title="Available" value="Mon–Sat 9AM–10PM" />
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-8">
            <Social icon={<FaGithub />} link="https://github.com/harshshah-2023" />
            <Social icon={<FaLinkedin />} link="https://www.linkedin.com/in/harsh-shah-9848hs" />
            <Social icon={<FaEnvelope />} link="mailto:harshshah9848@gmail.com" />
          </div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
          className="bg-gray-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gray-700 shadow-2xl max-w-lg w-full mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold">Send Message</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6">I usually reply within a few hours.</p>

          <Input label="Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} />
          <Textarea label="Message" name="message" value={form.message} onChange={handleChange} />

          <button
            type="submit"
            disabled={status.loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 rounded-lg text-lg transition disabled:opacity-60"
          >
            <Send size={18} />
            {status.loading ? "Sending..." : "Send Message"}
          </button>

          {/* STATUS MESSAGE */}
          <AnimatePresence>
            {status.msg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-4 p-3 rounded-lg text-sm text-center 
                ${status.success ? "bg-green-700/40 text-green-300" : "bg-red-700/40 text-red-300"}`}
              >
                {status.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

      </div>
    </section>
  );
}

/* ========== COMPONENTS ========== */
const InfoCard = ({ icon, title, value, link }) => (
  <a href={link} target="_blank" rel="noreferrer"
    className="flex gap-4 items-center group transition hover:-translate-y-1">
    <div className="p-3 rounded-xl bg-gray-800 border border-gray-700">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="font-medium group-hover:text-teal-400">{value}</p>
    </div>
  </a>
);

const Social = ({ icon, link }) => (
  <a href={link} target="_blank"
    className="p-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-teal-500 hover:text-black transition">
    {icon}
  </a>
);

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-400">{label}</label>
    <input {...props} className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring-2 focus:ring-teal-400 outline-none" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="text-sm text-gray-400">{label}</label>
    <textarea {...props} rows={6} className="w-full mt-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring-2 focus:ring-teal-400 outline-none" />
  </div>
);
