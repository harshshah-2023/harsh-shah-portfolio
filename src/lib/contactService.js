import emailjs from "@emailjs/browser";

/**
 * EmailJS configuration.
 *
 * These are *publishable* browser credentials (EmailJS is designed to be called
 * from the client), but they are read from env vars so they can be rotated or
 * pointed at a different service without a code change. The literals are kept
 * as fallbacks so the form keeps working on a checkout with no .env file.
 * See .env.example.
 */
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_7zp1fmr",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_khi9en5",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "dQHgsyU-EDyjLUEBS",
};

export const CONTACT_EMAIL = "harshshah9848@gmail.com";

export const isEmailJsConfigured = () =>
  Boolean(
    EMAILJS_CONFIG.serviceId &&
      EMAILJS_CONFIG.templateId &&
      EMAILJS_CONFIG.publicKey
  );

let initialised = false;
const ensureInit = () => {
  if (initialised || !isEmailJsConfigured()) return;
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  initialised = true;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Field-level validation. Returns a map of field -> message; empty means valid.
 * Runs before the network call so a bad submit fails instantly and locally
 * instead of coming back as an opaque EmailJS 4xx.
 */
export function validateContactForm(form) {
  const errors = {};

  const name = form.name.trim();
  if (!name) errors.name = "Please tell me your name.";
  else if (name.length < 2) errors.name = "That name looks too short.";

  const email = form.email.trim();
  if (!email) errors.email = "An email is required so I can reply.";
  else if (!EMAIL_RE.test(email)) errors.email = "That doesn't look like a valid email.";

  const subject = form.subject.trim();
  if (!subject) errors.subject = "Add a short subject.";

  const message = form.message.trim();
  if (!message) errors.message = "The message can't be empty.";
  else if (message.length < 10) errors.message = "Give me a little more detail (10+ characters).";
  else if (message.length > 5000) errors.message = "Please keep it under 5000 characters.";

  return errors;
}

/**
 * Turn whatever EmailJS threw into something a visitor can act on.
 * EmailJS rejects with an EmailJSResponseStatus ({ status, text }), a plain
 * Error, or a string depending on where it failed, so all three are handled.
 */
function describeError(error) {
  const status = error?.status;
  const raw = (error?.text || error?.message || String(error || "")).trim();

  if (status === 0 || /failed to fetch|networkerror/i.test(raw))
    return "Couldn't reach the mail service — check your connection and try again.";
  if (status === 400 || status === 422)
    return `The mail service rejected the message${raw ? `: ${raw}` : "."}`;
  if (status === 401 || status === 403)
    return "The contact form isn't authorised right now. Please email me directly.";
  if (status === 418 || /limit/i.test(raw))
    return "Too many messages sent from here just now. Try again in a minute.";
  if (status === 429)
    return "Rate limited by the mail service. Please try again shortly.";
  if (status >= 500)
    return "The mail service is having trouble. Please try again, or email me directly.";

  return raw || "Something went wrong sending the message.";
}

/**
 * Send a contact message.
 *
 * The template params are sent under several common aliases (name/from_name/
 * user_name, email/from_email/reply_to/user_email, ...) because an EmailJS
 * template only substitutes the variable names it was authored with — a
 * mismatch there is the usual cause of a silent "message failed" and of
 * EmailJS's "recipients address is empty" rejection.
 *
 * @returns {Promise<{ok: true}|{ok: false, message: string}>} never throws.
 */
export async function sendContactMessage(form) {
  if (!isEmailJsConfigured()) {
    return {
      ok: false,
      message: "The contact form isn't configured yet. Please email me directly.",
    };
  }

  ensureInit();

  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();

  const templateParams = {
    name,
    from_name: name,
    user_name: name,
    email,
    from_email: email,
    user_email: email,
    reply_to: email,
    subject,
    title: subject,
    message,
    to_name: "Harsh",
    to_email: CONTACT_EMAIL,
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      {
        publicKey: EMAILJS_CONFIG.publicKey,
        // Two sends per minute from one page is plenty for a portfolio and
        // stops an accidental double-click turning into duplicate mail.
        limitRate: { id: "contact-form", throttle: 30000 },
      }
    );
    return { ok: true };
  } catch (error) {
    if (import.meta.env.DEV) console.error("[contact] EmailJS send failed:", error);
    return { ok: false, message: describeError(error) };
  }
}

/** Pre-filled mailto: used as the fallback whenever sending fails. */
export function buildMailtoFallback(form) {
  const subject = form.subject.trim() || "Portfolio enquiry";
  const body = [
    form.message.trim(),
    "",
    "—",
    form.name.trim(),
    form.email.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
