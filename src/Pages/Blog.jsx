import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export default function Blog() {
  const [selected, setSelected] = useState(null);

  // 📝 Depth + Technical Maturity Added
  const blogPosts = [
    {
      id: 1,
      title: "Scaling Systems for Millions of Users",
      tag: "Systems & Distributed Backend",
      date: "Feb 2025",
      read: "7 min read",
      content: `
Scalability isn’t performance — it’s architecture.

Systems that survive millions of users follow patterns:

• Horizontal scaling > vertical scaling  
• Redis caching saves ~40–70% DB load  
• Kafka → peak traffic becomes a backlog, not failure  
• CDN edge compute kills global latency  
• Sharded databases = growth without rewrite  
• Rate limiting protects your backend from humans and bots  
• Observability is not optional (logs + tracing + alerts)

Scale is not speed  scale is endurance.
      `,
    },
    {
      id: 2,
      title: "Machine Learning in Production — Field Notes",
      tag: "AI/ML Engineering",
      date: "Jan 2025",
      read: "6 min read",
      content: `
Training a model is 20%. Deploying one is 80%.

Loved by engineers, ignored by reality:

• Accuracy decays — data drift is unavoidable  
• Monitoring beats a beautiful confusion matrix  
• GPUs are expensive — inference must be optimized  
• Latency > accuracy for real-time systems  
• Explainability improves adoption more than accuracy  
• If you don't track feature importance, you are blind

A model that ships is better than a model that scores.
      `,
    },
    {
      id: 3,
      title: "UI Engineering — Good Design is Invisible",
      tag: "Frontend & UX",
      date: "Dec 2024",
      read: "4 min read",
      content: `
Premium UI is built on restraint, not decoration.

Fundamentals of expensive-looking design:

• Whitespace is not empty — it is breathing room  
• Minimal color palette feels premium  
• Typography = voice of product  
• Shadow softness decides visual luxury  
• Motion must be subtle, not circus-level  
• Accessibility is a feature — not charity

Good design whispers. Bad design screams.
      `,
    },
    {
      id: 4,
      title: "DevOps Mindset — Ship Faster, Break Less",
      tag: "DevOps & Cloud",
      date: "Nov 2024",
      read: "5 min read",
      content: `
DevOps is not tooling — it is culture.

Teams accelerate when:

• CI/CD removes “fear of release”  
• Infra as Code makes servers disposable  
• Zero-downtime deploys = trust in pipeline  
• Canary + Blue/Green > hope-based rollout  
• Scaling is proactive, not emergency-driven  
• Monitoring answers “why”, not just “what”

DevOps is speed with stability, not speed with chaos.
      `,
    },
    {
      id: 5,
      title: "The Art of Technical Decision Making",
      tag: "Engineering Thought Process",
      date: "Sept 2024",
      read: "8 min read",
      content: `
A senior engineer isn't defined by code — but by choices.

Decision framework I follow:

• Prefer composability over cleverness  
• Delay abstraction until repetition exists  
• Optimize readability first, performance second  
• Choose boring, proven tech for core systems  
• Fancy architecture is debt without a use-case  
• Measure before optimizing — feelings don't scale

Engineering = trade-offs, not perfection.
      `,
    },
    {
      id: 6,
      title: "Career Compass — Build, Don't Wait",
      tag: "Growth & Mindset",
      date: "Aug 2024",
      read: "3 min read",
      content: `
Your real resume is what you build outside instruction.

Lessons that changed my trajectory:

• Projects teach more than tutorials  
• Networking unlocks rooms talent can’t access  
• A GitHub commit beats a LinkedIn line  
• Curiosity compounds — boredom kills growth  
• Ship fast, learn faster, refine later

You're not competing with others — you're evolving from yesterday.
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-ink-900 px-6 md:px-16 py-32 font-sans">

      {/* --- Header --- */}
      <div className="text-center max-w-measure-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold">Blog • Thoughts • Engineering</h1>
        <p className="text-mist-400 mt-6 text-lg font-light">
          Ideas that shape software written from experience, failure, systems and long nights of debugging.
        </p>
      </div>

      {/* --- Blog Grid --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto">
        {blogPosts.map(post => (
          <motion.div
            key={post.id}
            onClick={() => setSelected(post)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="group surface p-8 h-full flex flex-col cursor-pointer transition duration-200
                       hover:border-accent-500/40 hover:bg-white/[0.05] hover:shadow-e3"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-mist-500">{post.date} • {post.read}</p>
            <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
            <p className="mt-4 text-sm text-mist-400 line-clamp-3">{post.content}</p>

            <span className="mt-auto pt-6 inline-flex gap-2 items-center text-sm font-medium text-accent-400
                             transition duration-200 group-hover:gap-3 group-hover:text-accent-300">
              Read Article <ArrowRight size={16} aria-hidden="true" />
            </span>
          </motion.div>
        ))}
      </div>

      {/* --- PREMIUM Modal Reader --- */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/70 backdrop-blur-lg flex items-center justify-center px-6 z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-ink-850 max-w-2xl p-8 sm:p-12 rounded-2xl shadow-e4 border border-white/[0.08] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-6 mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold">{selected.title}</h2>
                <X size={24} className="shrink-0 cursor-pointer text-mist-500 transition hover:text-mist-50" onClick={() => setSelected(null)} />
              </div>

              <p className="whitespace-pre-line text-mist-300 text-base max-w-measure">{selected.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
