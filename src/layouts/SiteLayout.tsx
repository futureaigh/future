import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useSiteContent } from "@/lib/useSiteContent";

interface SiteLayoutProps {
	children: ReactNode;
	contentOverride?: Record<string, any>;
}

export default function SiteLayout({ children, contentOverride }: SiteLayoutProps) {
	const { content, isLoading } = useSiteContent();
	const location = useLocation();

	useEffect(() => {
		if (!location.hash) {
			window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
		}
	}, [location.pathname]);

	if (isLoading) return <Loading />;

	const merged = contentOverride ?? content;

	return (
		<div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
			<Navbar content={merged} />
			{children}
			<Footer content={merged} />
		</div>
	);
}
