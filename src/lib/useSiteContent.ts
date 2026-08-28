import { useQuery } from "@tanstack/react-query";
import { fetchContent } from "./api";
import { DEFAULT_CONTENT } from "./defaultContent";

export function useSiteContent() {
	const { data: records = [], isLoading, isError } = useQuery({
		queryKey: ["site-content"],
		queryFn: fetchContent,
	});

	const getSectionData = (key: string): any => {
		const record = records.find((r) => r.section_key === key);
		if (record) return { ...(DEFAULT_CONTENT[key] as any), ...record.content };
		return DEFAULT_CONTENT[key] || {};
	};

	const content: Record<string, any> = {};
	for (const key of Object.keys(DEFAULT_CONTENT)) {
		content[key] = getSectionData(key);
	}

	return { content, isLoading, isError, getSectionData };
}
