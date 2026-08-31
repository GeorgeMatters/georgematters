import type { APIRoute } from 'astro';
import { content } from '../lib/content';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config `site` must be set for llms.txt');
  const base = site.href.replace(/\/$/, '');
  const { artist, services, projects, media, social, contact } = content;

  const section = (title: string, links: string[]) =>
    links.length ? `## ${title}\n\n${links.join('\n')}\n` : '';

  const body = [
    `# ${artist.name}`,
    '',
    `> ${content.site.description}`,
    '',
    `${artist.name} ist in ${artist.city}, ${artist.country} ansässig und ${artist.availability}. Genres: ${artist.genres.join(', ')}.`,
    '',
    section('Anlässe', services.items.map((s) => `- [${s.title}](${base}/#anlaesse): ${s.text}`)),
    section('Projekte', projects.items
      .filter((p) => p.visible !== false)
      .map((p) => `- [${p.name}](${p.links[0]?.href ?? `${base}/#projekte`}): ${p.description}`)),
    section('Media', media.items.map((m) => `- [${m.label}](${m.href}): ${m.text}`)),
    section('Profile', social.items.map((s) => `- [${s.label}](${s.href}): Offizielles Profil von ${artist.name}`)),
    section('Kontakt', [
      `- [E-Mail](mailto:${artist.email}): ${contact.emailLabel}`,
      `- [Telefon](tel:${artist.phone.replace(/\s/g, '')}): ${contact.phoneLabel}`,
      `- [Anfrageformular](${base}/#kontakt): ${contact.headline}`
    ])
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
