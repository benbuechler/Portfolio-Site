// @ts-check
// .mjs is a JavaScript module. The directive above asks the editor to check
// types even though this file uses JavaScript rather than TypeScript (.ts).
// defineConfig supplies autocomplete/type information for Astro's settings.
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

// Integrations extend Astro: React supports React components, and MDX supports
// Markdown containing components. They are configured even though the current
// pages use .astro components and ordinary .md files.
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// export default gives Astro the configuration object when it loads this file.
// The [] is an array; react() and mdx() call functions to create integrations.
export default defineConfig({
  // Used by canonical links, structured data, and the generated sitemap.
  site: 'https://benbuechler.ca',
  trailingSlash: 'never',
  redirects: { '/blog': '/projects' },
  integrations: [react(), mdx(), sitemap({
    // Astro has rendered these directory-format pages when this filter runs.
    // Read their metadata so hasStory: false and future noindex pages stay out.
    filter: (page) => {
      const pathname = new URL(page).pathname.replace(/\/+$/, '');
      const html = readFileSync(new URL(`./dist${pathname}/index.html`, import.meta.url), 'utf8');
      return !/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b/i.test(html);
    },
  })]
});
