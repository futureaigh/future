import { Helmet } from "react-helmet-async";
import { useSiteContent } from "../lib/useSiteContent";

export default function SiteHead() {
	const { content } = useSiteContent();
	const favicon = content.branding?.favicon || "";
	const seo = content.seo || {};

	return (
		<Helmet>
			{seo.title && <title>{seo.title}</title>}
			{seo.description && <meta name="description" content={seo.description} />}
			{seo.keywords && <meta name="keywords" content={seo.keywords} />}
			{favicon && <link rel="icon" type="image/png" href={favicon} />}
			{seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
		</Helmet>
	);
}
