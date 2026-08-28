import { type ReactNode } from "react";
import { motion } from "motion/react";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	children?: ReactNode;
	imageUrl?: string;
}

export default function PageHeader({
	title,
	subtitle,
	children,
	imageUrl,
}: PageHeaderProps) {
	return (
		<section className="relative pt-40 pb-28 overflow-hidden bg-[#0a1a3a]">
			{imageUrl ? (
				<div className="absolute inset-0">
					<img
						src={imageUrl}
						className="w-full h-full object-cover opacity-30 select-none"
						alt=""
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a] via-[#0a1a3a]/80 to-transparent"></div>
				</div>
			) : (
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-[#0a1a3a] to-[#0a1a3a]"></div>
				</div>
			)}

			<div className="max-w-7xl mx-auto px-6 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-3xl space-y-6"
				>
					<span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
						TTC & SOGY
					</span>
					<h1 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter">
						{title}
					</h1>
					{subtitle && (
						<p className="text-xl text-blue-100 font-medium leading-relaxed max-w-2xl">
							{subtitle}
						</p>
					)}
					{children && <div className="pt-4">{children}</div>}
				</motion.div>
			</div>
		</section>
	);
}
