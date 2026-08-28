import { motion } from "motion/react";
import {
	GraduationCap,
	Landmark,
	Target,
	Info,
	CheckCircle2,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

export default function Future() {
	const { content } = useSiteContent();
	const future = content.future;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>Our Future | TTC & SOGY</title>
				<meta
					name="description"
					content="Our medium-term vision for TTC Global Institute and long-term Talent Hubs."
				/>
			</Helmet>

			<PageHeader
				title="Our Future"
				subtitle="From periodic high-impact events to a year-round youth development ecosystem."
				imageUrl={content.branding?.headerLogo || ""}
			/>

			{/* TTC Global Institute */}
			<section id="institute" className="py-24 bg-white">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-start">
						<motion.div
							whileHover={{ y: -5 }}
							className="p-10 bg-blue-700 text-white rounded-[40px] shadow-2xl relative overflow-hidden space-y-6"
						>
							<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
								<GraduationCap className="w-6 h-6" />
							</div>
							<h2 className="text-3xl font-black tracking-tight">
								{future.institute.title}
							</h2>
							<p className="text-lg text-blue-50 font-medium leading-relaxed">
								{future.institute.text}
							</p>
						</motion.div>
						<div className="space-y-8">
							<div className="space-y-4">
								<h3 className="text-xl font-black text-gray-900">
									Proposed Areas of Study
								</h3>
								<div className="grid grid-cols-2 gap-3">
									{future.institute.areas.map((area: string) => (
										<div
											key={area}
											className="flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3"
										>
											<div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
											<span className="text-xs font-bold text-gray-700">
												{area}
											</span>
										</div>
									))}
								</div>
							</div>
							<div className="bg-blue-50 rounded-[40px] p-8 space-y-3">
								<div className="flex items-center gap-3">
									<Target className="w-5 h-5 text-blue-600" />
									<h3 className="font-black text-gray-900">The Medium-Term Outcome</h3>
								</div>
								<p className="text-gray-600 font-medium leading-relaxed">
									{future.institute.outcome}
								</p>
							</div>
						</div>
					</div>
				</Container>
			</section>

			{/* Talent Hubs */}
			<section id="talent-hubs" className="py-24 bg-gray-50">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-start">
						<motion.div
							whileHover={{ y: -5 }}
							className="p-10 border-2 border-blue-600 rounded-[40px] shadow-xl bg-white space-y-6"
						>
							<div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
								<Landmark className="w-6 h-6" />
							</div>
							<h2 className="text-3xl font-black text-blue-600 tracking-tight">
								{future.talentHubs.title}
							</h2>
							<p className="text-lg text-gray-600 font-medium leading-relaxed">
								{future.talentHubs.text}
							</p>
						</motion.div>
						<div className="space-y-8">
							<div className="space-y-4">
								<h3 className="text-xl font-black text-gray-900">
									Proposed Talent Hub Services
								</h3>
								<div className="space-y-3">
									{future.talentHubs.services.map((service: string) => (
										<div key={service} className="flex items-start gap-3">
											<CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
											<span className="font-bold text-gray-700 leading-tight">
												{service}
											</span>
										</div>
									))}
								</div>
							</div>
							<div className="bg-blue-50 rounded-[40px] p-8 space-y-3">
								<h3 className="font-black text-gray-900">Why Talent Hubs Matter</h3>
								<p className="text-gray-600 font-medium leading-relaxed">
									{future.talentHubs.why}
								</p>
							</div>
						</div>
					</div>
				</Container>
			</section>

			{/* Three-year ambition */}
			<Section className="bg-white">
				<Container>
					<SectionHeader
						title={future.threeYear.title}
						subtitle={future.threeYear.text}
					/>
					<div className="space-y-3 max-w-4xl mx-auto">
						{future.threeYear.list.map((point: string, i: number) => (
							<div
								key={point}
								className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
							>
								<div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
									{i + 1}
								</div>
								<span className="font-bold text-gray-800 leading-tight">{point}</span>
							</div>
						))}
					</div>
				</Container>
			</Section>

			{/* Disclaimer */}
			{future.disclaimer && (
				<Section className="bg-blue-50">
					<Container className="max-w-4xl text-center">
						<div className="flex items-start gap-3 justify-center">
							<Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
							<p className="text-gray-700 font-medium leading-relaxed">
								{future.disclaimer}
							</p>
						</div>
					</Container>
				</Section>
			)}
		</SiteLayout>
	);
}
