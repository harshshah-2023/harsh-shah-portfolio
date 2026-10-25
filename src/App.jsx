import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Components/common/ScrollToTop';
import PageLoader from './Components/common/PageLoader';
import NotFound from './Components/common/NotFound';
import { useApplyBlogTheme } from './blog/theme';

// Home stays in the main bundle (it is the entry point for most visits).
// Every other route is split into its own chunk so the first paint does not
// pay for framer-motion, react-icons and the full project dataset.
import Home from './Pages/Home';

const Contact = lazy(() => import('./Pages/Contact'));
const Projects = lazy(() => import('./Pages/Projects'));
const About = lazy(() => import('./Pages/About'));
const BehindTheBuild = lazy(() => import('./Pages/BehindTheBuild'));
const BuildStory = lazy(() => import('./Pages/BuildStory'));
const Blog = lazy(() => import('./Pages/Blog'));
const BlogPost = lazy(() => import('./Pages/BlogPost'));

function App() {
  const { pathname } = useLocation();
  useApplyBlogTheme(pathname);

  return (
    <div className="w-full bg-ink-900">
      <ScrollToTop />
      <Navbar />

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/behind-the-build" element={<BehindTheBuild />} />
            <Route path="/behind-the-build/:slug" element={<BuildStory />} />
            {/* The resume is now a download on About; keep old /resume links working. */}
            <Route path="/resume" element={<Navigate to="/about" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
