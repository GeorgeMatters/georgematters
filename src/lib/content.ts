import { z } from 'astro/zod';
import yaml from 'js-yaml';
import raw from '../data/content.yaml?raw';

/** Icon names Icon.astro actually implements. Anything else fails the build. */
const iconName = z.enum([
  'blend', 'spark', 'map', 'layers', 'flower',
  'candle', 'mic', 'sliders', 'phone', 'mail', 'pin'
]);

const link = z.object({ label: z.string().min(1), href: z.string().min(1) }).strict();
const mediaLink = link.extend({
  platform: z.string().min(1),
  text: z.string().min(1)
}).strict();

/**
 * A legally mandated value that must be supplied before the site can build.
 * Publishing an Impressum containing "TODO: ..." would be worse than having
 * none, so an unfilled placeholder fails the build rather than shipping.
 */
const requiredFact = z
  .string()
  .min(1)
  .refine((v) => !/^TODO\b/i.test(v.trim()), {
    message:
      'still a placeholder — supply the real value in content.yaml before building'
  });
const cta = z.object({ text: z.string().min(1), href: z.string().min(1) }).strict();
const imagePath = z.string().regex(/^images\/.+\.(png|jpe?g|webp|avif)$/, 'must be images/<file>.<ext>');

export const contentSchema = z.object({
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url(),
    locale: z.string().min(2),
    language: z.string().min(2),
    image: imagePath,
    logo: imagePath,
    skipLink: z.string().min(1)
  }).strict(),

  artist: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    city: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().length(2),
    availability: z.string().min(1),
    genres: z.array(z.string().min(1)).min(1),
    countriesPlayed: z.array(z.string().min(1)).min(1)
  }).strict(),

  navigation: z.object({
    items: z.array(link).min(1),
    cta,
    menuOpenLabel: z.string().min(1),
    menuCloseLabel: z.string().min(1)
  }).strict(),

  hero: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    ctaPrimary: cta,
    ctaSecondary: cta,
    badges: z.array(z.string().min(1)).min(1),
    bookingFormats: z.array(z.string().min(1)).min(1),
    stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) }).strict()).min(1),
    imagePrimary: imagePath,
    imagePrimaryAlt: z.string().min(1),
    summaryHeadline: z.string().min(1)
  }).strict(),

  highlights: z.object({
    items: z.array(z.object({
      title: z.string().min(1), text: z.string().min(1), icon: iconName
    }).strict()).min(1)
  }).strict(),

  story: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    quote: z.string().min(1),
    image: imagePath,
    imageAlt: z.string().min(1),
    genresLabel: z.string().min(1),
    countriesLabel: z.string().min(1),
    facts: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) }).strict()).min(1)
  }).strict(),

  services: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    items: z.array(z.object({
      title: z.string().min(1), text: z.string().min(1), icon: iconName
    }).strict()).min(1)
  }).strict(),

  projects: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    items: z.array(z.object({
      name: z.string().min(1),
      visible: z.boolean().optional(),
      since: z.string().min(1),
      description: z.string().min(1),
      image: imagePath,
      links: z.array(link),
      missingLinks: z.array(z.string().min(1)).optional()
    }).strict()).min(1)
  }).strict(),

  media: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    items: z.array(mediaLink).min(1)
  }).strict(),

  gallery: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    items: z.array(z.object({
      image: imagePath,
      alt: z.string().min(1),
      caption: z.string().min(1),
      size: z.enum(['standard', 'wide'])
    }).strict()).min(1)
  }).strict(),

  contact: z.object({
    kicker: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    note: z.string().min(1),
    submitLabel: z.string().min(1),
    mailSubjectPrefix: z.string().min(1),
    phoneLabel: z.string().min(1),
    emailLabel: z.string().min(1),
    locationLabel: z.string().min(1),
    fields: z.array(z.object({
      name: z.string().min(1),
      label: z.string().min(1),
      type: z.enum(['text', 'email', 'tel', 'textarea']),
      required: z.boolean()
    }).strict()).min(1)
  }).strict(),

  footer: z.object({
    logo: imagePath,
    tagline: z.string().min(1),
    navLabel: z.string().min(1),
    contactLabel: z.string().min(1),
    rights: z.string().min(1),
    credit: z.string().min(1)
  }).strict(),

  legal: z.object({
    entityName: requiredFact,
    legalForm: z.string().min(1),
    street: requiredFact.refine((v) => /\d/.test(v), {
      message:
        'a statutory address needs a house number (e.g. "Fischlstraße 12"), not just the street'
    }),
    postalCode: requiredFact,
    vatId: z.string(),
    authority: z.string(),
    chamber: z.string(),
    activity: z.string().min(1),
    direction: z.string().min(1),
    disclaimerHeading: z.string().min(1),
    disclaimer: z.string().min(1),
    copyrightHeading: z.string().min(1),
    copyright: z.string().min(1),
    privacyIntro: z.string().min(1),
    hostingHeading: z.string().min(1),
    hosting: z.string().min(1),
    cookiesHeading: z.string().min(1),
    cookies: z.string().min(1),
    fontsHeading: z.string().min(1),
    fonts: z.string().min(1),
    contactHeading: z.string().min(1),
    contact: z.string().min(1),
    rightsHeading: z.string().min(1),
    rights: z.string().min(1),
    authorityHeading: z.string().min(1),
    authorityText: z.string().min(1),
    authorityName: z.string().min(1),
    authorityUrl: z.string().url(),
    odrHeading: z.string().min(1),
    odrText: z.string().min(1),
    odrUrl: z.string().url(),
    impressumTitle: z.string().min(1),
    impressumHref: z.string().min(1),
    datenschutzTitle: z.string().min(1),
    datenschutzHref: z.string().min(1),
    backLabel: z.string().min(1)
  }).strict(),

  social: z.object({ items: z.array(link).min(1) }).strict()
}).strict();

const result = contentSchema.safeParse(yaml.load(raw));

if (!result.success) {
  const issues = result.error.issues
    .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  throw new Error(`content.yaml failed validation:\n${issues}\n`);
}

export const content = result.data;

/** Component prop types are DERIVED from the schema — never written alongside it. */
export type Content = z.infer<typeof contentSchema>;
export type Site = Content['site'];
export type Artist = Content['artist'];
export type Navigation = Content['navigation'];
export type HeroContent = Content['hero'];
export type Highlights = Content['highlights'];
export type Story = Content['story'];
export type Services = Content['services'];
export type Projects = Content['projects'];
export type Media = Content['media'];
export type Gallery = Content['gallery'];
export type ContactContent = Content['contact'];
export type FooterContent = Content['footer'];
export type Social = Content['social'];
export type Legal = Content['legal'];
