import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	eyebrow?: string;
	children?: ReactNode;
	className?: string;
	ruleClassName?: string;
	align?: "center" | "left";
}

export function SectionHeader({
	title,
	subtitle,
	eyebrow,
	children,
	className,
	ruleClassName,
	align = "center",
}: SectionHeaderProps) {
	return (
		<div
			className={cn(
				"mb-16 space-y-4",
				align === "center" ? "text-center" : "text-left",
				className,
			)}
		>
			{eyebrow && (
				<span className="text-xs font-black text-blue-600 uppercase tracking-widest">
					{eyebrow}
				</span>
			)}
			<h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
				{title}
			</h2>
			{subtitle && (
				<p
					className={cn(
						"text-gray-500 font-medium italic",
						align === "center" && "max-w-3xl mx-auto",
					)}
				>
					{subtitle}
				</p>
			)}
			<div
				className={cn(
					"w-16 h-1.5 bg-blue-600 rounded-full",
					align === "center" && "mx-auto",
					ruleClassName,
				)}
			/>
			{children}
		</div>
	);
}
