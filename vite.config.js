import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import blog from './tools/blog/vite-plugin-blog.js'
import { SECURITY_HEADERS } from './tools/security-headers.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Absolute origin used for canonical URLs, sitemap, RSS and share links.
  const siteUrl = (env.SITE_URL || 'https://harshshah.onrender.com').replace(/\/+$/, '')

  return {
    plugins: [react(), blog({ contentDir: 'content/blog', siteUrl })],
    server:{
      port: 3000,
    },
    // Same headers as production (Render), so `npm run preview` can be used
    // to check the CSP before it is enforced. The dev server is unaffected.
    preview: {
      headers: SECURITY_HEADERS,
    },
  }
})
