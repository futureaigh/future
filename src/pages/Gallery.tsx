import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Images } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Section, Container } from "@/components/ui/Button";
import { useSiteContent } from "@/lib/useSiteContent";
import { fetchGallery } from "@/lib/api";

export default function Gallery() {
	const { content } = useSiteContent();
	const [lightbox, setLightbox] = useState<string | null>(null);

	const { data: images = [], isLoading } = useQuery({
		queryKey: ["gallery"],
		queryFn: () => fetchGallery(false),
	});

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>Gallery | TTC & SOGY</title>
				<meta
					name="description"
					content="Photos from TTC & SOGY events, outreach and community."
				/>
			</Helmet>

			<PageHeader
				title="Gallery"
				subtitle="Moments from our events, outreach and community."
			/>

			<Section className="bg-white">
				<Container>
					{isLoading ? (
						<p className="text-center text-gray-400 font-medium py-16">
							Loading gallery…
						</p>
					) : images.length === 0 ? (
						<div className="bg-gray-50 rounded-[50px] p-16 text-center space-y-6 max-w-3xl mx-auto border border-gray-100">
							<div className="w-20 h-20 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center">
								<Images className="w-9 h-9" />
							</div>
							<div className="space-y-2">
								<h2 className="text-3xl font-black text-gray-900 tracking-tight">
									Gallery Coming Soon
								</h2>
								<p className="text-gray-500 font-medium leading-relaxed">
									We are curating photos from our events and outreach. Check
									back soon.
								</p>
							</div>
						</div>
					) : (
						<div className="columns-2 md:columns-3 gap-4 [&>button]:mb-4">
							{images.map((img) => (
								<button
									key={img.id}
									onClick={() => setLightbox(img.url)}
									className="block w-full break-inside-avoid rounded-2xl overflow-hidden group text-left"
								>
									<img
										src={img.url}
										alt={img.caption || "Gallery photo"}
										loading="lazy"
										className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
									/>
									{img.caption && (
										<span className="block px-1 py-2 text-xs font-medium text-gray-500">
											{img.caption}
										</span>
									)}
								</button>
							))}
						</div>
					)}
				</Container>
			</Section>

			{lightbox && (
				<div
					className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
					onClick={() => setLightbox(null)}
				>
					<img
						src={lightbox}
						alt=""
						className="max-w-full max-h-[90vh] rounded-xl object-contain"
					/>
				</div>
			)}
		</SiteLayout>
	);
}
