import { motion } from "motion/react";
import {
	HandHeart,
	Handshake,
	HeartHandshake,
	Globe,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Button, { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";

export default function GetInvolved() {
	const { content } = useSiteContent();
	const getInvolved = content.getInvolved;
	const founder = content.founder;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>Get Involved | TTC & SOGY</title>
				<meta
					name="description"
					content="Donate, partner, volunteer or become a Global Ambassador with TTC & SOGY."
				/>
			</Helmet>

			<PageHeader
				title="Get Involved"
				subtitle="Invest in a generation — help us raise purposeful, skilled and Christ-centred global leaders."
				imageUrl={content.branding?.headerLogo || ""}
			/>

			{/* Donate */}
			<section id="donate" className="py-24 bg-white">
				<Container>
					<div className="bg-blue-700 rounded-[50px] p-12 md:p-20 text-white space-y-10 shadow-3xl shadow-blue-700/30 relative overflow-hidden">
						<div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
							<div className="space-y-6">
								<div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
									<HandHeart className="w-8 h-8" />
								</div>
								<h2 className="text-3xl md:text-4xl font-black tracking-tight">
									{getInvolved.donate.title}
								</h2>
								<p className="text-xl text-blue-100 font-medium leading-relaxed">
									{getInvolved.donate.text}
								</p>
								{getInvolved.donate.note && (
									<p className="text-sm text-blue-200 font-medium leading-relaxed opacity-90">
										{getInvolved.donate.note}
									</p>
								)}
							</div>
							<div className="flex flex-col gap-4">
								{(getInvolved.donate.buttons || []).map((label: string) => (
									<Button key={label} variant="white">
										{label} <ArrowRight className="w-5 h-5" />
									</Button>
								))}
							</div>
						</div>
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
					</div>
				</Container>
			</section>

			{/* Partner */}
			<section id="partner" className="py-24 bg-gray-50">
				<Container>
					<SectionHeader
						title={getInvolved.partner.title}
						subtitle={getInvolved.partner.text}
					/>
					<div className="grid md:grid-cols-2 gap-12">
						<div className="space-y-6">
							<h3 className="text-xl font-black text-gray-900">Ways to Partner</h3>
							<div className="space-y-4">
								{getInvolved.partner.ways.map((way: string) => (
									<div key={way} className="flex items-start gap-3">
										<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
										<p className="font-bold text-gray-700 leading-relaxed">{way}</p>
									</div>
								))}
							</div>
						</div>
						<div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-6">
							<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
								<Handshake className="w-6 h-6" />
							</div>
							<h3 className="text-xl font-black text-gray-900">Partner Benefits</h3>
							<div className="space-y-3">
								{getInvolved.partner.benefits.map((benefit: string) => (
									<div key={benefit} className="flex items-start gap-3">
										<CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
										<p className="font-bold text-gray-700 leading-relaxed">
											{benefit}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</Container>
			</section>

			{/* Volunteer */}
			<section id="volunteer" className="py-24 bg-white">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-center">
						<div className="space-y-6">
							<div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
								<HeartHandshake className="w-6 h-6" />
							</div>
							<h2 className="text-4xl font-black text-gray-900 tracking-tight">
								{getInvolved.volunteer.title}
							</h2>
							<p className="text-gray-600 font-medium leading-relaxed">
								{getInvolved.volunteer.text}
							</p>
							{getInvolved.volunteer.note && (
								<p className="text-sm text-gray-500 font-medium leading-relaxed">
									{getInvolved.volunteer.note}
								</p>
							)}
							<Button variant="primary">{getInvolved.volunteer.cta}</Button>
						</div>
						<div className="bg-gray-50 rounded-[50px] p-12">
							<ContactForm source="volunteer" categories={[
								"Volunteer",
								"Mentor",
								"Media",
								"General Enquiry",
							]} />
						</div>
					</div>
				</Container>
			</section>

			{/* Global Ambassadors */}
			<section id="ambassadors" className="py-24 bg-gray-50">
				<Container>
					<div className="grid md:grid-cols-2 gap-16 items-center">
						<motion.div
							whileHover={{ y: -5 }}
							className="p-10 bg-blue-700 text-white rounded-[40px] shadow-2xl relative overflow-hidden space-y-6"
						>
							<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
								<Globe className="w-6 h-6" />
							</div>
							<h2 className="text-3xl font-black tracking-tight">
								{getInvolved.ambassadors.title}
							</h2>
							<p className="text-lg text-blue-50 font-medium leading-relaxed">
								{getInvolved.ambassadors.text}
							</p>
						</motion.div>
						<div className="space-y-4">
							<h3 className="text-xl font-black text-gray-900">
								Ambassadors May Help To
							</h3>
							{getInvolved.ambassadors.list.map((item: string) => (
								<div key={item} className="flex items-start gap-3">
									<CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
									<p className="font-bold text-gray-700 leading-relaxed">{item}</p>
								</div>
							))}
						</div>
					</div>
				</Container>
			</section>

			{/* Why it matters */}
			<Section className="bg-white">
				<Container>
					<div className="bg-blue-50 rounded-[50px] p-12 md:p-20 text-center max-w-4xl mx-auto">
						<h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
							{getInvolved.whyItMatters.title}
						</h2>
						<p className="text-xl text-gray-600 font-medium leading-relaxed">
							{getInvolved.whyItMatters.text}
						</p>
						<div className="mt-8">
							<Button variant="blue">
								Express Your Interest <ArrowRight className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
