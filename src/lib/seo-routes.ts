export type SeoEntry = {
  path: string;
  title: string;
  description: string;
  priority: number;
};

const SITE_NAME = "Samaanya Foundation";
export const SITE_URL = "https://samaanyafoundation.com";
const BASE_URL = SITE_URL;

export const seoRoutes: Record<string, SeoEntry> = {
  "/": {
    path: "/",
    title: `Support for Hearing Disability in India | ${SITE_NAME}`,
    description: "Samaanya Foundation supports families and individuals navigating hearing disability in India through awareness, guidance, and community.",
    priority: 1.0,
  },
  "/about": {
    path: "/about",
    title: `About Us | ${SITE_NAME}`,
    description: "Learn about Samaanya Foundation's mission to bring access, information, and dignity to everyone touched by hearing loss in India.",
    priority: 0.8,
  },
  "/understanding": {
    path: "/understanding",
    title: `Understanding Hearing Disability | ${SITE_NAME}`,
    description: "A clear, judgment-free guide to hearing disability — causes, types, and what families need to know.",
    priority: 0.8,
  },
  "/cochlear-implants": {
    path: "/cochlear-implants",
    title: `Cochlear Implants | ${SITE_NAME}`,
    description: "Understand cochlear implants: how they work, who they help, and what the journey looks like for families in India.",
    priority: 0.8,
  },
  "/programs": {
    path: "/programs",
    title: `Programs & Workshops | ${SITE_NAME}`,
    description: "Explore Samaanya Foundation's programs and workshops supporting families and individuals affected by hearing disability.",
    priority: 0.8,
  },
  "/workshops": {
    path: "/workshops",
    title: `Workshops | ${SITE_NAME}`,
    description: "Hands-on workshops from Samaanya Foundation for families, caregivers, and educators.",
    priority: 0.6,
  },
  "/webinars": {
    path: "/webinars",
    title: `Webinars | ${SITE_NAME}`,
    description: "Free webinars for families, caregivers, and anyone curious about hearing disability.",
    priority: 0.7,
  },
  "/stories": {
    path: "/stories",
    title: `Stories | ${SITE_NAME}`,
    description: "Real stories from families and individuals navigating hearing disability with the support of Samaanya Foundation.",
    priority: 0.7,
  },
  "/fundraisers": {
    path: "/fundraisers",
    title: `Fundraisers | ${SITE_NAME}`,
    description: "Support active fundraisers for individuals and families in need of hearing care and cochlear implants.",
    priority: 0.7,
  },
  "/donate": {
    path: "/donate",
    title: `Donate | ${SITE_NAME}`,
    description: "Your donation helps Samaanya Foundation bring access, information, and dignity to those affected by hearing disability.",
    priority: 0.9,
  },
  "/contact": {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description: "Get in touch with Samaanya Foundation — questions, partnerships, or support.",
    priority: 0.8,
  },
};

export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path === "/" ? "" : path}`;
}
