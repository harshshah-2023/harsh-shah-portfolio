import { useCallback, useMemo, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import {
  CONTACT_EMAIL,
  buildMailtoFallback,
  sendContactMessage,
  validateContactForm,
} from "../lib/contactService";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const IDLE = { state: "idle", msg: "" };

export default function ContactUs() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(IDLE);

  // Bots fill every input they find; humans never see this one.
  const honeypotRef = useRef("");
  const firstFieldRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setForm((current) => {
      const fieldErrors = validateContactForm(current);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      return current;
    });
  }, []);

  const mailtoHref = useMemo(() => buildMailtoFallback(form), [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.state === "sending") return;

    if (honeypotRef.current) {
      // Silently pretend it worked - no feedback for the bot to learn from.
      setForm(EMPTY_FORM);
      setStatus({ state: "success", msg: "Message sent. I will get back to you shortly." });
      return;
    }

    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ state: "error", msg: "Please fix the highlighted fields." });
      firstFieldRef.current?.focus();
      return;
    }

    setStatus({ state: "sending", msg: "" });
    const result = await sendContactMessage(form);

    if (result.ok) {
      setForm(EMPTY_FORM);
      setTouched({});
      setErrors({});
      setStatus({
        state: "success",
        msg: "Message sent. I will get back to you shortly.",
      });
    } else {
      setStatus({ state: "error", msg: result.message, showFallback: true });
    }
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
  });

  const sending = status.state === "sending";

  return (
    <section className="relative bg-gradient-to-b from-ink-950 via-ink-900 to-ink-850 py-24 px-6 md:px-16 xl:px-24 overflow-hidden">
      {/* Ambient glow. Rendered as a radial gradient rather than a huge blur()
          filter - a 140px blur forces a full-viewport repaint on every scroll
          frame and was the main source of jank on this page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-0 w-[450px] h-[450px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(70,135,145,0.34) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 w-[430px] h-[430px] rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(45,89,97,0.5) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto grid gap-16 md:grid-cols-2 items-start">
        {/* LEFT INFO PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left px-2"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Let&rsquo;s <span className="text-accent-500">Connect.</span>
          </h1>

          <p className="text-mist-400 mt-6 max-w-measure-sm mx-auto md:mx-0 text-base sm:text-lg">
            Whether it&rsquo;s work, collaboration, or an idea worth exploring &mdash; my inbox is open.
          </p>

          <div className="mt-12 grid gap-4 max-w-sm mx-auto md:mx-0">
            <InfoCard
              icon={<Mail aria-hidden="true" />}
              title="Email"
              value={CONTACT_EMAIL}
              link={`mailto:${CONTACT_EMAIL}`}
            />
            <InfoCard icon={<Phone aria-hidden="true" />} title="Phone" value="Available on request" />
            <InfoCard icon={<MapPin aria-hidden="true" />} title="Location" value="India — Remote Friendly" />
          </div>

          <div className="flex justify-center md:justify-start gap-2 mt-8">
            <Social label="GitHub" icon={<FaGithub />} link="https://github.com/harshshah-2023" />
            <Social label="LinkedIn" icon={<FaLinkedin />} link="https://www.linkedin.com/in/harsh-shah-9848hs" />
            <Social label="Email" icon={<FaEnvelope />} link={`mailto:${CONTACT_EMAIL}`} />
          </div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="surface rounded-2xl bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-e4 max-w-lg w-full mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold">Send Message</h2>
          <p className="text-mist-500 text-sm mt-2 mb-8">I usually reply within a few hours.</p>

          <Input label="Name" autoComplete="name" {...fieldProps("name")} inputRef={firstFieldRef} />
          <Input label="Email" type="email" autoComplete="email" {...fieldProps("email")} />
          <Input label="Subject" {...fieldProps("subject")} />
          <Textarea label="Message" {...fieldProps("message")} />

          {/* Honeypot - hidden from users and assistive tech, tempting to bots. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company-website">Company website</label>
            <input
              id="company-website"
              name="company-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              onChange={(e) => {
                honeypotRef.current = e.target.value;
              }}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full mt-8 flex items-center justify-center gap-2 rounded-lg
                       bg-accent-500 py-4 text-base font-semibold text-ink-950 shadow-glow
                       transition duration-200 ease-soft
                       hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-glow-lg
                       disabled:opacity-60 disabled:cursor-not-allowed
                       disabled:hover:translate-y-0 disabled:hover:shadow-glow"
          >
            {sending ? (
              <span
                className="w-[18px] h-[18px] rounded-full border-2 border-black/30 border-t-black animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
            {sending ? "Sending..." : "Send Message"}
          </button>

          <div aria-live="polite" role="status">
            <AnimatePresence>
              {status.msg && (
                <motion.div
                  key={status.msg}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`mt-6 p-4 rounded-lg border text-sm flex items-start gap-2 ${
                    status.state === "success"
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                      : "bg-red-500/10 border-red-500/25 text-red-200"
                  }`}
                >
                  {status.state === "success" ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-[1px]" aria-hidden="true" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 mt-[1px]" aria-hidden="true" />
                  )}
                  <span>
                    {status.msg}
                    {status.showFallback && (
                      <>
                        {" "}
                        <a href={mailtoHref} className="underline underline-offset-2 font-medium hover:text-mist-50">
                          Send it by email instead
                        </a>
                        .
                      </>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

/* ========== COMPONENTS ========== */

const InfoCard = ({ icon, title, value, link }) => {
  const content = (
    <>
      <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.07] text-accent-400
                      transition duration-200 group-hover:border-accent-500/40">{icon}</div>
      <div>
        <p className="text-mist-500 text-xs font-medium uppercase tracking-[0.12em]">{title}</p>
        <p className="mt-1 font-medium text-mist-200 transition duration-200 group-hover:text-accent-300">{value}</p>
      </div>
    </>
  );

  const className = "flex gap-4 items-center group transition duration-200 ease-soft hover:-translate-y-0.5 text-left";

  // Cards without a link were rendering as <a href={undefined}>, a focusable
  // no-op link. Render a plain div in that case.
  return link ? (
    <a href={link} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
};

const Social = ({ icon, link, label }) => (
  <a
    href={link}
    aria-label={label}
    target={link.startsWith("mailto:") ? undefined : "_blank"}
    rel="noopener noreferrer"
    className="p-3 rounded-lg border border-white/[0.07] bg-white/[0.04] text-mist-400
               shadow-e1 transition duration-200 ease-soft
               hover:-translate-y-0.5 hover:border-accent-500/40 hover:text-accent-300 hover:shadow-glow"
  >
    {icon}
  </a>
);

const Input = ({ label, name, error, inputRef, ...props }) => (
  <div className="mb-6">
    <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.12em] text-mist-500">
      {label}
    </label>
    <input
      {...props}
      id={name}
      name={name}
      ref={inputRef}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full mt-2 px-4 py-3 rounded-lg bg-ink-800/80 border text-sm text-mist-100
        placeholder:text-mist-600 outline-none transition duration-200
        focus:border-accent-500/50 focus:bg-ink-800 focus:ring-2 focus:ring-accent-500/30
        ${error ? "border-red-500/60" : "border-white/[0.08] hover:border-white/[0.14]"}`}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-300 text-xs mt-2">
        {error}
      </p>
    )}
  </div>
);

const Textarea = ({ label, name, error, ...props }) => (
  <div className="mb-6">
    <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.12em] text-mist-500">
      {label}
    </label>
    <textarea
      {...props}
      id={name}
      name={name}
      rows={6}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full mt-2 px-4 py-3 rounded-lg bg-ink-800/80 border text-sm text-mist-100
        placeholder:text-mist-600 outline-none transition duration-200
        focus:border-accent-500/50 focus:bg-ink-800 focus:ring-2 focus:ring-accent-500/30
        ${error ? "border-red-500/60" : "border-white/[0.08] hover:border-white/[0.14]"}`}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-300 text-xs mt-2">
        {error}
      </p>
    )}
  </div>
);
