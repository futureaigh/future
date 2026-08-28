import { type ReactNode, type Key } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "blue" | "white";

const VARIANTS: Record<Variant, string> = {
	primary:
		"bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/30 rounded-xl font-black",
	secondary:
		"border-2 border-white/20 text-white hover:bg-white/10 active:scale-95 backdrop-blur-sm rounded-xl font-black",
	blue: "bg-blue-600/90 text-white hover:bg-blue-700 shadow-lg rounded-xl font-black",
	white:
		"bg-white text-blue-900 hover:bg-blue-50 rounded-full font-black shadow-lg",
};

const SIZES: Record<string, string> = {
	sm: "px-6 py-2 text-sm gap-2",
	md: "px-10 py-4 text-lg gap-3",
	lg: "px-12 py-5 text-xl gap-3",
};

interface ButtonProps {
	variant?: Variant;
	size?: "sm" | "md" | "lg";
	className?: string;
	children?: ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	disabled?: boolean;
	key?: Key;
}

export default function Button({
	variant = "primary",
	size = "md",
	className,
	children,
	type = "button",
	onClick,
	disabled,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"flex items-center justify-center transition-all",
				VARIANTS[variant],
				SIZES[size],
				className,
			)}
		>
			{children}
		</button>
	);
}

export function Section({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <section className={cn("py-24", className)}>{children}</section>;
}

export function Container({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn("max-w-7xl mx-auto px-6", className)}>{children}</div>;
}
