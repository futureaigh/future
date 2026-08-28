import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Users, Handshake, Heart, HeartHandshake } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import Button, { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

const PILLAR_ICONS = [Heart, Users, Handshake, HeartHandshake];

export default function Home() {
	const { content, isLoading } = useSiteContent();
	if (isLoading) return null;

	const home = content.home;
	const seo = content.seo;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>{seo.title}</title>
				<meta name="description" content={seo.description} />
				<meta name="keywords" content={seo.keywords} />
				<meta property="og:title" content={seo.title} />
				<meta property="og:description" content={seo.description} />
				{seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
			</Helmet>

			{/* Hero */}
			<section
				id="home"
				className="relative min-h-screen flex items-center pt-20 pb-28 overflow-hidden bg-[#0a1a3a]"
			>
				{home.hero.imageUrl && (
					<div className="absolute inset-0">
						<img
							src={home.hero.imageUrl}
							className="w-full h-full object-cover opacity-30 select-none"
							alt=""
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a] via-[#0a1a3a]/80 to-transparent"></div>
					</div>
				)}

				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<div className="max-w-3xl space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="space-y-6"
						>
							<div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
								TTC & SOGY
							</div>
							<h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
								{home.hero.title}
							</h1>
							<p className="text-xl text-blue-100 font-medium leading-relaxed max-w-2xl">
								{home.hero.intro}
							</p>
							{home.hero.quote && (
								<div className="pl-4 border-l-2 border-orange-500 py-1">
									<p className="text-lg text-orange-400 font-bold italic tracking-tight">
										{home.hero.quote}
									</p>
								</div>
							)}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="flex flex-wrap gap-4 pt-4"
						>
							<Link to="/what-we-do">
								<Button variant="primary">
									{home.hero.ctaButtons?.[0] || "Discover Our Work"}{" "}
									<ArrowRight className="w-5 h-5" />
								</Button>
							</Link>
							<Link to="/get-involved">
								<Button variant="blue">
									<Users className="w-5 h-5" />{" "}
									{home.hero.ctaButtons?.[1] || "Partner With Us"}
								</Button>
							</Link>
							<Link to="/get-involved#donate">
								<Button variant="secondary">
									{home.hero.ctaButtons?.[2] || "Support a Young Person"}
								</Button>
							</Link>
						</motion.div>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 w-full leading-none z-20">
					<svg
						className="w-full h-12 fill-white"
						viewBox="0 0 1440 120"
						preserveAspectRatio="none"
					>
						<path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
					</svg>
				</div>
			</section>

			{/* Intro */}
			<Section className="bg-white relative">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-center">
						<div className="space-y-6">
							<SectionHeader align="left" title={home.intro.heading} className="mb-0">
								<p className="text-gray-600 font-medium leading-relaxed whitespace-pre-line">
									{home.intro.text}
								</p>
							</SectionHeader>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
								{(home.intro.stats || []).map((stat: any) => (
									<div
										key={stat.label}
										className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center"
									>
										<p className="text-3xl font-black text-blue-700 tracking-tight">
											{stat.value}
										</p>
										<p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
											{stat.label}
										</p>
									</div>
								))}
							</div>
						</div>
						{home.intro.imageUrl && (
							<div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
								<img
									src={home.intro.imageUrl}
									className="w-full h-full object-cover"
									alt=""
								/>
							</div>
						)}
					</div>
				</Container>
			</Section>

			{/* Pillars */}
			<Section className="bg-gray-50">
				<Container>
					<SectionHeader
						title={home.pillars.title}
						subtitle={home.pillars.subtitle}
					/>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{home.pillars.list.map((item: any, i: number) => {
							const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
							return (
								<motion.div
									key={item.title}
									whileHover={{ y: -10 }}
									className="p-10 bg-white rounded-[40px] shadow-sm border border-gray-100 space-y-6 hover:shadow-xl transition-all"
								>
									<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
										<Icon className="w-6 h-6" />
									</div>
									<h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
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

			{/* Invitation */}
			<Section className="bg-white overflow-hidden">
				<Container>
					<div className="bg-blue-700 rounded-[50px] p-12 md:p-20 text-center text-white space-y-8 shadow-3xl shadow-blue-700/30 relative overflow-hidden">
						<div className="relative z-10 space-y-6">
							<h2 className="text-4xl md:text-5xl font-black tracking-tight">
								{home.invitation.title}
							</h2>
							<p className="text-xl md:text-2xl font-bold leading-relaxed opacity-90 max-w-4xl mx-auto">
								{home.invitation.text}
							</p>
							<div className="pt-4">
								<Link to="/get-involved">
									<Button variant="white">
										Join Our Global Community <ArrowRight className="w-5 h-5" />
									</Button>
								</Link>
							</div>
						</div>
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
