import { Head } from "vite-react-ssg";
import { getCanonicalUrl } from "@/lib/seo-routes";

type SeoProps = {
  title: string;
  description: string;
  path: string;
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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};
