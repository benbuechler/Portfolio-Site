// @ts-check
// .mjs is a JavaScript module. The directive above asks the editor to check
// types even though this file uses JavaScript rather than TypeScript (.ts).
// defineConfig supplies autocomplete/type information for Astro's settings.
import { defineConfig } from 'astro/config';

// Integrations extend Astro: React supports React components, and MDX supports
// Markdown containing components. They are configured even though the current
// pages use .astro components and ordinary .md files.
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
// export default gives Astro the configuration object when it loads this file.
// The [] is an array; react() and mdx() call functions to create integrations.
export default defineConfig({
  integrations: [react(), mdx()]
});
