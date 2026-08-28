import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import Button, { Section, Container } from "@/components/ui/Button";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

export default function News() {
	const { content } = useSiteContent();

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>News & Events | TTC & SOGY</title>
				<meta
					name="description"
					content="Latest news and events from TTC & SOGY."
				/>
			</Helmet>

			<PageHeader
				title="News & Events"
				subtitle="Updates from TTC & SOGY — conferences, outreach and announcements are coming soon."
				imageUrl={"/media/site-content/1787955708700-group.jpg"}
			/>

			<Section className="bg-white">
				<Container>
					<div className="bg-gray-50 rounded-[50px] p-16 text-center space-y-6 max-w-3xl mx-auto border border-gray-100">
						<div className="w-20 h-20 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center">
							<CalendarDays className="w-9 h-9" />
						</div>
						<div className="space-y-2">
							<h2 className="text-3xl font-black text-gray-900 tracking-tight">
								News Coming Soon
							</h2>
							<p className="text-gray-500 font-medium leading-relaxed">
								We are preparing our news and events hub. Check back soon for
								updates on upcoming conferences, outreach and announcements.
							</p>
						</div>
						<Link to="/contact">
							<Button variant="primary">
								Get Notified <ArrowRight className="w-5 h-5" />
							</Button>
						</Link>
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
