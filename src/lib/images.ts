import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true }
);

/**
 * Resolve a content.yaml image path ("images/foo.png") to its ImageMetadata.
 * Throws on a miss so a bad path fails the build instead of rendering nothing.
 */
export function resolveImage(path: string): ImageMetadata {
  const key = `/src/assets/images/${path.replace(/^images\//, '')}`;
  const mod = files[key];
  if (!mod) {
    throw new Error(
      `[content] image not found: "${path}" (looked for ${key}). ` +
        `Available: ${Object.keys(files).map((k) => k.split('/').pop()).join(', ')}`
    );
  }
  return mod.default;
}
