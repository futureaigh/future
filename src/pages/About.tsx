import { motion } from "motion/react";
import {
	Target,
	Eye,
	Cross,
	BookOpen,
	Handshake,
	Heart,
	Users,
	Gem,
	ShieldCheck,
	Globe,
	Lightbulb,
	HeartHandshake,
	Scale,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

const VALUE_ICONS = [
	Cross,
	Scale,
	Gem,
	Heart,
	Users,
	Globe,
	Lightbulb,
	HeartHandshake,
	Handshake,
	ShieldCheck,
];

export default function About() {
	const { content } = useSiteContent();
	const about = content.about;
	const leadership = content.leadership;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>About Us | TTC & SOGY</title>
				<meta
					name="description"
					content="Who we are, our history, vision, mission, core values and leadership at TTC & SOGY."
				/>
			</Helmet>

			<PageHeader
				title="About Us"
				subtitle={about.whoWeAre.title}
				imageUrl={"/media/site-content/1787955708700-group.jpg"}
			/>

			{/* Who We Are */}
			<section id="who-we-are" className="py-24 bg-white relative">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-start">
						<div className="space-y-8">
							<div className="space-y-4">
								<h2 className="text-4xl font-black text-gray-900 tracking-tight">
									{about.whoWeAre.title}
								</h2>
							</div>
							<div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line space-y-4">
								{about.whoWeAre.text}
							</div>
							{about.identity && (
								<div className="p-6 bg-blue-700 text-white rounded-[32px] space-y-2">
									<p className="text-lg font-black">{about.identity.title}</p>
									<p className="text-blue-50 font-medium">{about.identity.text}</p>
								</div>
							)}
						</div>
						{about.whoWeAre.imageUrl && (
							<div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
								<img
									src={about.whoWeAre.imageUrl}
									className="w-full h-full object-cover"
									alt=""
								/>
							</div>
						)}
					</div>
				</Container>
			</section>

			{/* What the names mean */}
			<Section className="bg-gray-50">
				<Container>
					<SectionHeader
						title="What the Names Mean"
						subtitle="Together, TTC & SOGY unite spiritual transformation with practical development."
					/>
					<div className="grid md:grid-cols-2 gap-8">
						{about.names.map((item: any, i: number) => (
							<motion.div
								key={item.name}
								whileHover={{ y: -5 }}
								className={`p-10 rounded-[40px] shadow-2xl relative overflow-hidden space-y-6 ${
									i === 0
										? "bg-blue-700 text-white"
										: "bg-white border-2 border-blue-600"
								}`}
							>
								<h3
									className={`text-2xl font-black tracking-tight ${
										i === 0 ? "" : "text-blue-600"
									}`}
								>
									{item.name}
								</h3>
								<p
									className={`font-medium leading-relaxed ${
										i === 0 ? "text-blue-50" : "text-gray-600"
									}`}
								>
									{item.text}
								</p>
							</motion.div>
						))}
					</div>
				</Container>
			</Section>

			{/* Biblical foundation + motto */}
			<Section className="bg-white">
				<Container>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-blue-50 rounded-[40px] p-12 space-y-6">
							<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
								<BookOpen className="w-6 h-6" />
							</div>
							<h3 className="text-2xl font-black text-gray-900">
								{about.foundation.title}
							</h3>
							<p className="text-lg text-blue-900 font-bold italic leading-relaxed">
								{about.foundation.verse}
							</p>
							<p className="text-gray-600 font-medium leading-relaxed">
								{about.foundation.text}
							</p>
						</div>
						{about.motto && (
							<div className="bg-blue-700 rounded-[40px] p-12 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
								<p className="text-3xl font-black text-white leading-tight">
									{about.motto.text}
								</p>
								<p className="text-orange-400 font-bold text-lg">
									{about.motto.ref}
								</p>
							</div>
						)}
					</div>
				</Container>
			</Section>

			{/* History */}
			<section id="history" className="py-24 bg-gray-50">
				<Container>
					<SectionHeader
						title={about.history.title}
						subtitle={about.history.subtitle}
					/>
					<div className="max-w-4xl mx-auto space-y-8">
						{about.history.list.map((item: any, i: number) => (
							<div
								key={item.date}
								className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row gap-6 md:items-start"
							>
								<div className="md:w-32 flex-shrink-0">
									<span className="text-lg font-black text-blue-600 tracking-tight">
										{item.date}
									</span>
								</div>
								<div className="space-y-2">
									<h3 className="text-xl font-black text-gray-900 tracking-tight">
										{i + 1}. {item.title}
									</h3>
									<p className="text-gray-600 font-medium leading-relaxed">
										{item.text}
									</p>
								</div>
							</div>
						))}
					</div>
				</Container>
			</section>

			{/* Vision + Mission */}
			<section id="mission" className="py-24 bg-white">
				<Container>
					<SectionHeader title="Vision, Mission & Values" />
					<div className="grid md:grid-cols-2 gap-8 items-stretch">
						<motion.div
							whileHover={{ y: -5 }}
							className="p-10 bg-blue-700 text-white rounded-[40px] shadow-2xl relative overflow-hidden space-y-6"
						>
							<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
								<Eye className="w-6 h-6" />
							</div>
							<h3 className="text-3xl font-black tracking-tight">
								{about.vision.title}
							</h3>
							<p className="text-lg text-blue-50 font-medium leading-relaxed">
								{about.vision.text}
							</p>
							<p className="text-blue-100 font-medium leading-relaxed">
								{about.vision.expanded}
							</p>
						</motion.div>
						<motion.div
							whileHover={{ y: -5 }}
							className="p-10 border-2 border-blue-600 rounded-[40px] shadow-xl bg-white relative overflow-hidden space-y-6"
						>
							<div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
								<Target className="w-6 h-6" />
							</div>
							<h3 className="text-3xl font-black text-blue-600 tracking-tight">
								{about.mission.title}
							</h3>
							<p className="text-lg text-gray-600 font-medium leading-relaxed">
								{about.mission.text}
							</p>
						</motion.div>
					</div>

					<div className="mt-8 bg-gray-50 rounded-[40px] p-10">
						<h3 className="text-xl font-black text-gray-900 mb-6">
							How We Deliver the Mission
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							{about.mission.howWeDeliver.map((point: string) => (
								<div key={point} className="flex items-start gap-3">
									<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
									<p className="text-gray-600 font-medium leading-relaxed">
										{point}
									</p>
								</div>
							))}
						</div>
					</div>
				</Container>
			</section>

			{/* Values */}
			<Section className="bg-gray-50">
				<Container>
					<SectionHeader
						title={about.values.title}
						subtitle={about.values.subtitle}
					/>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{about.values.list.map((item: any, i: number) => {
							const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
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

			{/* Leadership */}
			<section id="leadership" className="py-24 bg-white">
				<Container>
					<SectionHeader
						title={leadership.title}
						subtitle={leadership.subtitle}
					/>
					<p className="text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto text-center mb-12">
						{leadership.text}
					</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{(leadership.profiles || []).map((p: any) => (
							<div
								key={p.name}
								className="bg-gray-50 rounded-[40px] p-10 text-center space-y-4 border border-gray-100"
							>
								{p.imageUrl ? (
									<div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
										<img
											src={p.imageUrl}
											className="w-full h-full object-cover"
											alt={p.name}
										/>
									</div>
								) : (
									<div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl font-black">
										{p.name.slice(0, 1)}
									</div>
								)}
								<div className="space-y-1">
									<h3 className="font-black text-gray-900">{p.name}</h3>
									<p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
										{p.role}
									</p>
								</div>
								<p className="text-sm text-gray-500 font-medium leading-relaxed">
									{p.bio}
								</p>
							</div>
						))}
					</div>
				</Container>
			</section>
		</SiteLayout>
	);
}
