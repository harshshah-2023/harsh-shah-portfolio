import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Components/common/ScrollToTop';
import PageLoader from './Components/common/PageLoader';
import NotFound from './Components/common/NotFound';

// Home stays in the main bundle (it is the entry point for most visits).
// Every other route is split into its own chunk so the first paint does not
// pay for framer-motion, react-icons and the full project dataset.
import Home from './Pages/Home';

const Contact = lazy(() => import('./Pages/Contact'));
const Projects = lazy(() => import('./Pages/Projects'));
const About = lazy(() => import('./Pages/About'));
const Resume = lazy(() => import('./Pages/Resume'));
const Blog = lazy(() => import('./Pages/Blog'));

function App() {
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
            <Route path="/resume" element={<Resume />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
