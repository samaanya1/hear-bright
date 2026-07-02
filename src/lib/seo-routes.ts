export type SeoEntry = {
  path: string;
  title: string;
  description: string;
};

const SITE_NAME = "Samaanya Foundation";
const BASE_URL = "https://samaanyafoundation.com";

export const seoRoutes: Record<string, SeoEntry> = {
  "/": {
    path: "/",
    title: `${SITE_NAME} — Support for hearing disability in India`,
    description: "Samaanya Foundation supports families and individuals navigating hearing disability in India through awareness, guidance, and community.",
  },
  "/about": {
    path: "/about",
    title: `About Us — ${SITE_NAME}`,
    description: "Learn about Samaanya Foundation's mission to bring access, information, and dignity to everyone touched by hearing loss in India.",
  },
  "/understanding": {
    path: "/understanding",
    title: `Understanding Hearing Disability — ${SITE_NAME}`,
    description: "A clear, judgment-free guide to hearing disability — causes, types, and what families need to know.",
  },
  "/cochlear-implants": {
    path: "/cochlear-implants",
    title: `Cochlear Implants — ${SITE_NAME}`,
    description: "Understand cochlear implants: how they work, who they help, and what the journey looks like for families in India.",
  },
  "/programs": {
    path: "/programs",
    title: `Programs & Workshops — ${SITE_NAME}`,
    description: "Explore Samaanya Foundation's programs and workshops supporting families and individuals affected by hearing disability.",
  },
  "/workshops": {
    path: "/workshops",
    title: `Workshops — ${SITE_NAME}`,
    description: "Hands-on workshops from Samaanya Foundation for families, caregivers, and educators.",
  },
  "/webinars": {
    path: "/webinars",
    title: `Webinars — ${SITE_NAME}`,
    description: "Free webinars for families, caregivers, and anyone curious about hearing disability.",
  },
  "/stories": {
    path: "/stories",
    title: `Stories — ${SITE_NAME}`,
    description: "Real stories from families and individuals navigating hearing disability with the support of Samaanya Foundation.",
  },
  "/fundraisers": {
    path: "/fundraisers",
    title: `Fundraisers — ${SITE_NAME}`,
    description: "Support active fundraisers for individuals and families in need of hearing care and cochlear implants.",
  },
  "/donate": {
    path: "/donate",
    title: `Donate — ${SITE_NAME}`,
    description: "Your donation helps Samaanya Foundation bring access, information, and dignity to those affected by hearing disability.",
  },
  "/contact": {
    path: "/contact",
    title: `Contact — ${SITE_NAME}`,
    description: "Get in touch with Samaanya Foundation — questions, partnerships, or support.",
  },
};

export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path === "/" ? "" : path}`;
}
