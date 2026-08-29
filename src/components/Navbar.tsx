import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
	content: any;
}

export default function Navbar({ content }: NavbarProps) {
	const { links, logoText, logoSub, ctaOrange, ctaBlue } = content.navbar || {};
	const headerLogo = content.branding?.headerLogo || content.navbar?.logoUrl;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useScroll();
	const location = useLocation();

	const headerBg = useTransform(
		scrollY,
		[0, 50],
		["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"],
	);
	const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
	const headerShadow = useTransform(
		scrollY,
		[0, 50],
		["none", "0 10px 30px -10px rgba(0,0,0,0.05)"],
	);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	const isDark = !isScrolled;

	return (
		<motion.nav
			style={{
				backgroundColor: headerBg,
				backdropFilter: headerBlur,
				boxShadow: headerShadow,
			}}
			className="fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-300"
		>
			<div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
			<Link to="/" className="flex items-center gap-3">
				{headerLogo && (
					<div className="h-12 flex items-center justify-center overflow-hidden rounded-xl p-1">
						<img
							src={headerLogo}
							className="h-full w-auto object-contain max-w-[180px]"
							alt={logoText}
						/>
					</div>
				)}
			</Link>

				{/* Desktop links */}
				<div className="hidden lg:flex items-center gap-8">
					{Array.isArray(links) &&
						links.map((link: any) =>
							link.children?.length ? (
								<div key={link.label} className="relative group">
									<Link
										to={link.href}
										className={cn(
											"text-[13px] font-bold transition-colors duration-300 flex items-center gap-1",
											isDark
												? "text-gray-100 hover:text-orange-400"
												: "text-gray-600 hover:text-blue-600",
										)}
									>
										{link.label}
										<ChevronDown className="w-3.5 h-3.5" />
									</Link>
									<div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
										<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-56">
											{link.children.map((c: any) => (
												<Link
													key={c.label}
													to={c.href}
													className="block px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
												>
													{c.label}
												</Link>
											))}
										</div>
									</div>
								</div>
							) : (
								<Link
									key={link.label}
									to={link.href}
									className={cn(
										"text-[13px] font-bold transition-colors duration-300",
										isDark
											? "text-gray-100 hover:text-orange-400"
											: "text-gray-600 hover:text-blue-600",
									)}
								>
									{link.label}
								</Link>
							),
						)}
				</div>

				{/* Desktop CTAs */}
				<div className="hidden md:flex items-center gap-4">
					{ctaOrange && (
						<Link
							to="/get-involved#donate"
							className="px-6 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
						>
							<Users className="w-4 h-4" /> {ctaOrange}
						</Link>
					)}
					{ctaBlue && (
						<Link
							to="/get-involved"
							className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all"
						>
							{ctaBlue}
						</Link>
					)}
				</div>

				<button
					className={cn(
						"lg:hidden transition-colors duration-300",
						isDark ? "text-white" : "text-gray-900",
					)}
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle menu"
				>
					{isMenuOpen ? <X /> : <Menu />}
				</button>
			</div>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 lg:hidden shadow-xl max-h-[80vh] overflow-y-auto"
					>
						<div className="flex flex-col gap-2">
							{Array.isArray(links) &&
								links.map((link: any) => (
									<div key={link.label} className="flex flex-col">
										<Link
											to={link.href}
											onClick={() => setIsMenuOpen(false)}
											className="text-lg font-bold text-gray-900 py-2"
										>
											{link.label}
										</Link>
										{link.children?.length && (
											<div className="flex flex-col pl-4 border-l-2 border-gray-100">
												{link.children.map((c: any) => (
													<Link
														key={c.label}
														to={c.href}
														onClick={() => setIsMenuOpen(false)}
														className="text-sm font-bold text-gray-500 hover:text-blue-600 py-2"
													>
														{c.label}
													</Link>
												))}
											</div>
										)}
									</div>
								))}
							<div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
								{ctaOrange && (
									<Link
										to="/get-involved#donate"
										onClick={() => setIsMenuOpen(false)}
										className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-center"
									>
										{ctaOrange}
									</Link>
								)}
								{ctaBlue && (
									<Link
										to="/get-involved"
										onClick={() => setIsMenuOpen(false)}
										className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold text-center"
									>
										{ctaBlue}
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
}
