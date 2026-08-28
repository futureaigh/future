import { motion } from "motion/react";
import {
	Trophy,
	Church,
	Sparkles,
	BookOpen,
	Handshake,
	TrendingUp,
	CheckCircle2,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

const CHANGE_ICONS = [Church, Sparkles, BookOpen, Handshake, TrendingUp];

export default function Impact() {
	const { content } = useSiteContent();
	const impact = content.impact;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>Our Impact | TTC & SOGY</title>
				<meta
					name="description"
					content="The impact of TTC & SOGY — more than 13,000 young people reached in Ghana and the United Kingdom since 2022."
				/>
			</Helmet>

			<PageHeader
				title={impact.intro.title}
				subtitle={impact.intro.text}
				imageUrl={content.branding?.headerLogo || ""}
			/>

			{/* Impact highlights */}
			<Section className="bg-white">
				<Container>
					<SectionHeader title={impact.highlights.title} />
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{impact.highlights.list.map((item: any) => (
							<div
								key={item.label}
								className="p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center space-y-2"
							>
								<p className="text-4xl font-black text-blue-700 tracking-tight">
									{item.value}
								</p>
								<p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
									{item.label}
								</p>
							</div>
						))}
					</div>
				</Container>
			</Section>

			{/* The Change We Seek */}
			<Section className="bg-gray-50">
				<Container>
					<SectionHeader
						title={impact.change.title}
						subtitle={impact.change.subtitle}
					/>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{impact.change.list.map((item: any, i: number) => {
							const Icon = CHANGE_ICONS[i % CHANGE_ICONS.length];
							return (
								<motion.div
									key={item.title}
									whileHover={{ y: -10 }}
									className="p-10 bg-white rounded-[40px] shadow-sm border border-gray-100 space-y-6 hover:shadow-xl transition-all"
								>
									<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-xl font-black text-gray-900 tracking-tight">
										{item.title}
									</h3>
									<p className="text-sm text-gray-500 font-medium leading-relaxed">
										{item.text}
									</p>
								</motion.div>
							);
						})}
					</div>
				</Container>
			</Section>

			{/* Additional + founder */}
			<Section className="bg-white overflow-hidden">
				<Container>
					<div className="bg-blue-700 rounded-[50px] p-12 md:p-20 text-white space-y-10 shadow-3xl shadow-blue-700/30 relative overflow-hidden">
						<div className="relative z-10 grid md:grid-cols-2 gap-12">
							<div className="space-y-6">
								<div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
									<Trophy className="w-8 h-8" />
								</div>
								<h2 className="text-3xl md:text-4xl font-black tracking-tight">
									{impact.additional.title}
								</h2>
								<div className="space-y-4">
									{impact.additional.list.map((point: string) => (
										<div key={point} className="flex items-start gap-3">
											<CheckCircle2 className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
											<p className="text-lg font-bold text-blue-50 leading-tight">
												{point}
											</p>
										</div>
									))}
								</div>
							</div>
							<div className="flex flex-col items-center md:items-start gap-2">
								<p className="text-xs font-black text-blue-300 uppercase tracking-[0.2em]">
									{content.founder.title}
								</p>
								<p className="text-blue-100 font-medium leading-relaxed">
									{content.founder.text}
								</p>
								<div className="mt-2">
									<p className="font-black text-white">{content.founder.name}</p>
									<p className="text-xs font-bold text-blue-300 uppercase tracking-widest">
										{content.founder.role}
									</p>
								</div>
							</div>
						</div>
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
