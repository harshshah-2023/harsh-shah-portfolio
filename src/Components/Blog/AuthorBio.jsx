import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ProfilePic from "../../assets/ProfilePic-840.webp";
import { AUTHOR } from "../../blog/posts";

const socialClass =
  "rounded-lg border border-edge/[0.07] bg-edge/[0.04] p-2 text-mist-400 transition " +
  "hover:border-accent-500/40 hover:text-accent-300";

export default function AuthorBio({ name }) {
  // Guest authors get a simple byline; the full card describes the site owner.
  if (name && name !== AUTHOR.name) {
    return (
      <div className="border-t-2 border-mist-50 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-mist-500">Written by</p>
        <p className="mt-2 text-lg font-semibold text-mist-50">{name}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 border-t-2 border-mist-50 pt-8 sm:flex-row">
      <img
        src={ProfilePic}
        alt=""
        width={72}
        height={72}
        loading="lazy"
        decoding="async"
        className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-1 ring-edge/[0.12]"
      />
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-mist-500">Written by</p>
        <p className="mt-2 font-reading text-xl font-semibold text-mist-50">{AUTHOR.name}</p>
        <p className="text-sm text-accent-300">{AUTHOR.role}</p>
        <p className="mt-3 text-[0.9375rem] text-mist-400 max-w-measure">{AUTHOR.bio}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link to="/about" className="mr-2 text-sm font-medium text-accent-400 hover:text-accent-300">
            More about me →
          </Link>
          <a className={socialClass} href="https://github.com/harshshah-2023" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <FaGithub size={16} aria-hidden="true" />
          </a>
          <a className={socialClass} href="https://www.linkedin.com/in/harsh-shah-9848hs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <FaLinkedin size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
