import React, { useState } from "react";
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
    <div className="min-h-screen bg-[#0B0D0F] text-gray-200 px-6 md:px-20 py-36 font-[Inter]">

      {/* --- Header --- */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight text-white">Blog • Thoughts • Engineering</h1>
        <p className="text-gray-400 mt-4 text-lg leading-relaxed">
          Ideas that shape software written from experience, failure, systems and long nights of debugging.
        </p>
      </div>

      {/* --- Blog Grid --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 max-w-7xl mx-auto">
        {blogPosts.map(post => (
          <motion.div
            key={post.id}
            onClick={() => setSelected(post)}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ duration: 0.25 }}
            className="bg-[#121416] border border-gray-800 hover:border-gray-600 
                       rounded-2xl shadow-md hover:shadow-2xl p-7 cursor-pointer"
          >
            <p className="text-xs tracking-wide text-gray-500">{post.date} • {post.read}</p>
            <h3 className="mt-3 text-xl font-semibold leading-snug text-white">{post.title}</h3>
            <p className="text-gray-400 mt-3 line-clamp-3 text-[15px]">{post.content}</p>

            <button className="flex gap-2 items-center text-gray-300 font-medium mt-5 hover:text-white">
              Read Article <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* --- PREMIUM Modal Reader --- */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center px-5 z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#15171A] max-w-2xl p-10 rounded-3xl shadow-2xl border border-gray-800 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-white">{selected.title}</h2>
                <X size={26} className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setSelected(null)} />
              </div>

              <p className="whitespace-pre-line leading-relaxed text-gray-300 text-[15.5px]">{selected.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
