import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

/** Copies text, falling back to a hidden textarea where the API is blocked. */
async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

const buttonClass =
  "inline-flex h-9 items-center gap-2 rounded-lg border border-edge/[0.08] bg-edge/[0.03] px-3 text-sm text-mist-300 " +
  "transition hover:border-accent-500/40 hover:bg-edge/[0.06] hover:text-mist-50";

export default function ShareActions({ url, title, label = true }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="mr-1 text-sm text-mist-500">Share</span>}

      <button type="button" className={buttonClass} onClick={async () => setCopied(await copyText(url))}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </button>

      <a
        className={buttonClass}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn size={14} aria-hidden="true" />
      </a>

      <a
        className={buttonClass}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <FaXTwitter size={14} aria-hidden="true" />
      </a>

      {canShare && (
        <button
          type="button"
          className={buttonClass}
          aria-label="Share using your device"
          onClick={() => navigator.share({ title, url }).catch(() => {})}
        >
          <Share2 size={16} aria-hidden="true" />
        </button>
      )}

      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
