// Cloudflare Workers rejects any individual static asset larger than 25 MiB.
// Run after Astro builds; an optional directory argument also supports spot checks.
import { readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const limit = 25 * 1024 * 1024;
const directory = resolve(process.argv[2] ?? fileURLToPath(new URL("../dist/", import.meta.url)));
const folders = [directory];
const oversized = [];

while (folders.length > 0) {
  const folder = folders.pop();
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) {
      folders.push(file);
    } else if (entry.isFile()) {
      const { size } = await stat(file);
      if (size > limit) oversized.push({ file, size });
    }
  }
}

if (oversized.length > 0) {
  for (const { file, size } of oversized) {
    console.error(`[assets] ${relative(directory, file)} is ${(size / 1024 / 1024).toFixed(2)} MiB; Cloudflare's limit is 25 MiB per file.`);
  }
  console.error("[assets] Compress oversized assets before deploying. Keep uncompressed originals outside public/.");
  process.exitCode = 1;
} else {
  console.log("[assets] All static assets are within Cloudflare's 25 MiB per-file limit.");
}
