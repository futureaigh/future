import { motion } from "motion/react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

const CATEGORIES: Record<string, string> = {
	conferences: "Conferences",
	outreach: "School Outreach",
	mentorship: "Mentorship & Leadership",
	skills: "Skills & Enterprise",
	discipleship: "Christian Discipleship",
};

export default function WhatWeDo() {
	const { content } = useSiteContent();
	const whatWeDo = content.whatWeDo;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>What We Do | TTC & SOGY</title>
				<meta
					name="description"
					content="Our programmes and projects — conferences, school outreach, mentorship, skills and Christian discipleship."
				/>
			</Helmet>

			<PageHeader
				title={whatWeDo.intro.title}
				subtitle={whatWeDo.intro.text}
				imageUrl={"/media/site-content/1787955708700-group.jpg"}
			/>

			<Section className="bg-white">
				<Container>
					<SectionHeader
						title={whatWeDo.programs.title}
						subtitle={whatWeDo.programs.subtitle}
					/>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{whatWeDo.programs.list.map((item: any, i: number) => (
							<motion.div
								key={item.title}
								whileHover={{ y: -10 }}
								className="group bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
							>
								{item.imageUrl ? (
									<div className="aspect-[16/10] overflow-hidden">
										<img
											src={item.imageUrl}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
											alt=""
										/>
									</div>
								) : (
									<div className="aspect-[16/10] bg-blue-50 flex items-center justify-center">
										<span className="text-xs font-black text-blue-600 uppercase tracking-widest">
											{CATEGORIES[item.category] || item.category}
										</span>
									</div>
								)}
								<div className="p-8 space-y-4">
									<span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
										{CATEGORIES[item.category] || item.category}
									</span>
									<h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
										{item.title}
									</h3>
									<p className="text-sm text-gray-500 font-medium leading-relaxed">
										{item.text}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</Container>
			</Section>

			{/* Learning Framework */}
			<Section className="bg-gray-50">
				<Container>
					<SectionHeader
						title={whatWeDo.learning.title}
						subtitle={whatWeDo.learning.subtitle}
					/>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{whatWeDo.learning.list.map((point: string, i: number) => (
							<div
								key={point}
								className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center gap-4"
							>
								<div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
									{i + 1}
								</div>
								<span className="font-black text-gray-900 leading-tight">
									{point}
								</span>
							</div>
						))}
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
