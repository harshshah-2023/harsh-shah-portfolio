import { Link } from "react-router-dom";
import QuoteSeaction from "../Components/QuoteSeaction";
import DevOpsWebDevShowcase from "../Components/DevOpsWebDevShowcase";
import heroMain from "../assets/heroMain-1400.webp";
import heroMainSmall from "../assets/heroMain-800.webp";

const Home = () => {
  return (
    <div className="flex flex-col bg-ink-900">

      {/* ================= HERO ================= */}
      <section className="w-full min-h-screen px-6 lg:px-16 pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* LEFT TEXT */}
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-mist-50">
            Hi, I&apos;m <br />
            <span className="text-accent-500">Harsh Shah</span>
          </h1>

          <p className="mt-6 text-2xl md:text-3xl font-light text-mist-200">
            Software Product Engineer
          </p>

          <p className="mt-6 max-w-measure-sm mx-auto lg:mx-0 text-lg font-light text-mist-400">
            Step into a world where code transforms ideas into reality.
            Welcome to my portfolio.
          </p>

          <Link
            to="/projects"
            className="mt-8 inline-flex items-center rounded-lg border border-white/20
                       px-8 py-3 text-sm font-semibold tracking-[0.08em] text-mist-100
                       shadow-e2 transition duration-200 ease-soft
                       hover:-translate-y-0.5 hover:border-transparent
                       hover:bg-accent-500 hover:text-ink-950 hover:shadow-glow-lg"
          >
            CHECKOUT MY WORK
          </Link>
        </div>

        {/* RIGHT HERO IMAGE */}
        <div className="w-full flex justify-center lg:w-[50%]">
          {/*
            This is the LCP element, so it is eager + high priority and carries
            intrinsic dimensions to reserve its box (no layout shift on load).
            Two widths are served so phones don't download the desktop asset.
          */}
          <img
            src={heroMain}
            srcSet={`${heroMainSmall} 800w, ${heroMain} 1400w`}
            sizes="(max-width: 1024px) 95vw, 45vw"
            width={1400}
            height={1120}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-[95%] max-w-[900px] h-auto rounded-2xl ring-1 ring-white/[0.08]
                       shadow-e4 transition duration-500 ease-soft hover:-translate-y-1"
            alt="Collage of projects built by Harsh Shah"
          />
        </div>

      </section>

      {/* ================= BELOW CONTENT ================= */}
      <QuoteSeaction />
      <DevOpsWebDevShowcase />

    </div>
  );
};

export default Home;
