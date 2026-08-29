import { Link } from "react-router-dom";
import {
	Twitter,
	Github,
	Linkedin,
	Mail,
	Phone,
	Heart,
} from "lucide-react";

interface FooterProps {
	content: any;
}

export default function Footer({ content }: FooterProps) {
	const { contact, navbar, shared } = content;

	return (
		<footer className="bg-[#0c1626] text-white py-24 relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10">
				<div className="space-y-8 col-span-1 md:col-span-2">
					<div className="flex items-center gap-3">
						{content.footerLogo ? (
							<div className="h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-sm">
								<img
									src={content.footerLogo}
									className="h-full w-auto object-contain max-w-[180px]"
									alt={navbar.logoText}
								/>
							</div>
						) : (
							<div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
								{navbar.logoSub?.slice(0, 2).toUpperCase() || "SO"}
							</div>
						)}
						<div className="flex flex-col -space-y-1">
							<span className="text-xl font-black tracking-tight">
								{navbar.logoText}
							</span>
							<span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
								{navbar.logoSub}
							</span>
						</div>
					</div>
					<p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
						{shared.footerText}
					</p>
					<div className="flex items-center gap-4">
						{[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
							<a
								key={i}
								href="#"
								className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
								aria-label="Social link"
							>
								<Icon className="w-4 h-4 text-gray-400" />
							</a>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
						Contact Us
					</h4>
					<div className="flex items-center gap-3">
						<Mail className="w-4 h-4 text-blue-500" />
						<span className="text-sm font-bold text-gray-300">
							{contact.email}
						</span>
					</div>
				</div>

				<div className="space-y-6">
					<h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
						Phone Numbers
					</h4>
					<div className="space-y-4">
						{(contact.phones || []).map((phone: any) => (
							<div key={phone.label} className="flex gap-3">
								<Phone className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
								<div className="flex flex-col">
									<span className="text-sm font-bold text-gray-300">
										{phone.value}
									</span>
									<span className="text-[10px] font-bold text-gray-500 uppercase">
										({phone.label})
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
				<p className="text-xs font-bold text-gray-500">
					© {new Date().getFullYear()} {navbar.logoText}. All rights reserved.
					{shared.charityNumber && (
						<span className="text-gray-600"> Charity No. {shared.charityNumber}</span>
					)}
				</p>
				<div className="flex items-center gap-6">
					<Link
						to="/admin"
						className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
					>
						Admin Dashboard
					</Link>
					<p className="text-xs font-bold text-gray-500 flex items-center gap-1">
						Made with <Heart className="w-3.5 h-3.5 text-red-500" /> for the
						Gospel
					</p>
				</div>
			</div>

			<div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2"></div>
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/2"></div>
		</footer>
	);
}
