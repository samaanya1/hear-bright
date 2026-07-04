import { Head } from "vite-react-ssg";
import { getCanonicalUrl, SITE_URL } from "@/lib/seo-routes";

type SeoProps = {
  title: string;
  description: string;
  path: string;
};

const OG_IMAGE = `${SITE_URL}/og-image.png`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Samaanya Foundation",
  alternateName: ["Samanya Foundation", "सामान्य फाउंडेशन"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Samaanya Foundation supports families and individuals navigating hearing disability in India through awareness, guidance, and community.",
  areaServed: "IN",
  // TODO: add LinkedIn, YouTube, and Google Business Profile URLs once those profiles exist.
  sameAs: ["https://www.instagram.com/samaanya_foundation"],
};

export const Seo = ({ title, description, path }: SeoProps) => {
  const canonical = getCanonicalUrl(path);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Samaanya Foundation" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
    </Head>
  );
};
