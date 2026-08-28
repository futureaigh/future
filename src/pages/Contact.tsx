import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Mail } from "lucide-react";
import SiteLayout from "@/layouts/SiteLayout";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { Section, Container } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

function FAQItem({ qa }: { qa: any; key?: string | number }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left"
			>
				<span className="text-lg font-black text-gray-900 tracking-tight">
					{qa.q}
				</span>
				<ChevronDown
					className={cn(
						"w-5 h-5 text-blue-600 flex-shrink-0 transition-transform",
						open && "rotate-180",
					)}
				/>
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<p className="px-8 pb-6 text-gray-600 font-medium leading-relaxed">
							{qa.a}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function Contact() {
	const { content } = useSiteContent();
	const contact = content.contact;
	const faq = content.faq;

	return (
		<SiteLayout contentOverride={content}>
			<Helmet>
				<title>Contact Us | TTC & SOGY</title>
				<meta
					name="description"
					content="Get in touch with TTC & SOGY — general enquiries, partnerships, volunteering, donations and safeguarding."
				/>
			</Helmet>

			<PageHeader
				title={contact.title}
				subtitle={contact.subtitle}
				imageUrl={"/media/site-content/1787955708700-group.jpg"}
			/>

			<Section className="bg-white">
				<Container className="max-w-4xl">
					<div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-16 text-center space-y-10">
						<ContactForm categories={contact.categories} />
					</div>

					<div className="mt-16 grid md:grid-cols-2 gap-8">
						<div className="bg-gray-50 rounded-[40px] p-10 space-y-6">
							<h3 className="text-xl font-black text-gray-900">Contact Details</h3>
							<div className="flex items-center gap-3">
								<Mail className="w-4 h-4 text-blue-600" />
								<span className="font-bold text-gray-700">{contact.email}</span>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="w-4 h-4 text-blue-600" />
								<span className="font-bold text-gray-700">{contact.website}</span>
							</div>
							<p className="text-sm text-gray-500 font-medium">
								Registered charity: {contact.charityName}{" "}
								(Charity No. {contact.charityNumber})
							</p>
						</div>
						<div className="bg-gray-50 rounded-[40px] p-10">
							<h3 className="text-xl font-black text-gray-900 mb-6">Phone Numbers</h3>
							<div className="space-y-4">
								{(contact.phones || []).map((phone: any) => (
									<div key={phone.label}>
										<span className="text-xs font-bold text-gray-400 uppercase">
											{phone.label}
										</span>
										<p className="font-bold text-gray-700">{phone.value}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</Container>
			</Section>

			<Section className="bg-gray-50">
				<Container className="max-w-4xl">
					<SectionHeader title={faq.title} />
					<div className="space-y-4">
						{(faq.qa || []).map((item: any, i: number) => (
							<FAQItem key={i} qa={item} />
						))}
					</div>
				</Container>
			</Section>
		</SiteLayout>
	);
}
