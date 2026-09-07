import { useRef, useState, type ChangeEvent } from "react";
import {
	Save,
	Loader2,
	Upload,
	X,
	ChevronUp,
	ChevronDown,
} from "lucide-react";
import { uploadImage } from "@/lib/api";
import { CATEGORIES } from "@/pages/WhatWeDo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProgramsManagerProps {
	data: any;
	onSave: (programs: any) => void;
	isSaving: boolean;
}

const BLANK = { title: "", category: "outreach", text: "", imageUrl: "" };

export default function ProgramsManager({
	data,
	onSave,
	isSaving,
}: ProgramsManagerProps) {
	const [draft, setDraft] = useState(data?.programs ?? { list: [] });
	const [uploading, setUploading] = useState<number | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const [activeIdx, setActiveIdx] = useState<number | null>(null);

	const lastRef = useRef(data?.programs);
	if (JSON.stringify(data?.programs) !== JSON.stringify(lastRef.current)) {
		setDraft(data?.programs ?? { list: [] });
		lastRef.current = data?.programs;
	}

	const list = Array.isArray(draft.list) ? draft.list : [];

	const setList = (next: any[]) =>
		setDraft((d: any) => ({ ...d, list: next }));

	const patchItem = (idx: number, field: string, value: string) => {
		const next = [...list];
		next[idx] = { ...next[idx], [field]: value };
		setList(next);
	};

	const move = (idx: number, dir: -1 | 1) => {
		const to = idx + dir;
		if (to < 0 || to >= list.length) return;
		const next = [...list];
		[next[idx], next[to]] = [next[to], next[idx]];
		setList(next);
	};

	async function handleFile(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file || activeIdx === null) return;
		setUploading(activeIdx);
		try {
			const url = await uploadImage(file);
			patchItem(activeIdx, "imageUrl", url);
			toast.success("Image uploaded — hit Save Programmes to publish");
		} catch {
			toast.error("Image upload failed");
		} finally {
			setUploading(null);
			setActiveIdx(null);
		}
	}

	return (
		<div className="space-y-6">
			<input
				type="file"
				ref={fileRef}
				className="hidden"
				accept="image/*"
				onChange={handleFile}
			/>

			<div>
				<label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
					Section title
				</label>
				<input
					type="text"
					value={draft.title ?? ""}
					onChange={(e) => setDraft((d: any) => ({ ...d, title: e.target.value }))}
					className="mt-1.5 w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white shadow-sm"
				/>
			</div>
			<div>
				<label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
					Section subtitle
				</label>
				<input
					type="text"
					value={draft.subtitle ?? ""}
					onChange={(e) =>
						setDraft((d: any) => ({ ...d, subtitle: e.target.value }))
					}
					className="mt-1.5 w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white shadow-sm"
				/>
			</div>

			<label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
				Programmes ({list.length})
			</label>
			<div className="space-y-4">
				{list.map((item: any, idx: number) => (
					<div
						key={idx}
						className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm"
					>
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
								Programme #{idx + 1}
							</span>
							<div className="flex items-center gap-1">
								<button
									onClick={() => move(idx, -1)}
									disabled={idx === 0}
									className="p-1.5 text-gray-300 hover:text-blue-600 disabled:opacity-30 transition-colors"
									aria-label="Move up"
								>
									<ChevronUp className="w-4 h-4" />
								</button>
								<button
									onClick={() => move(idx, 1)}
									disabled={idx === list.length - 1}
									className="p-1.5 text-gray-300 hover:text-blue-600 disabled:opacity-30 transition-colors"
									aria-label="Move down"
								>
									<ChevronDown className="w-4 h-4" />
								</button>
								<button
									onClick={() => {
										if (confirm(`Delete "${item.title || "this programme"}"?`))
											setList(list.filter((_, i) => i !== idx));
									}}
									className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
									aria-label="Delete programme"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-28 h-20 shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
								{item.imageUrl ? (
									<img
										src={item.imageUrl}
										className="w-full h-full object-cover"
										alt=""
									/>
								) : (
									<span className="text-[10px] font-bold text-gray-300 uppercase">
										No image
									</span>
								)}
							</div>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<button
										onClick={() => {
											setActiveIdx(idx);
											fileRef.current?.click();
										}}
										disabled={uploading === idx}
										className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:text-blue-700"
									>
										{uploading === idx ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<Upload className="w-3 h-3" />
										)}
										Upload image
									</button>
									{item.imageUrl && (
										<button
											onClick={() => patchItem(idx, "imageUrl", "")}
											className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase"
										>
											Remove
										</button>
									)}
								</div>
								<select
									value={item.category ?? ""}
									onChange={(e) => patchItem(idx, "category", e.target.value)}
									className="w-full px-3 py-2 text-xs font-bold border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:border-blue-400"
								>
									{!(item.category in CATEGORIES) && item.category && (
										<option value={item.category}>{item.category}</option>
									)}
									{Object.entries(CATEGORIES).map(([k, v]) => (
										<option key={k} value={k}>
											{v}
										</option>
									))}
								</select>
							</div>
						</div>

						<input
							type="text"
							placeholder="Programme title"
							value={item.title ?? ""}
							onChange={(e) => patchItem(idx, "title", e.target.value)}
							className="w-full px-4 py-2.5 text-sm font-bold border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none bg-gray-50/50"
						/>
						<textarea
							placeholder="Programme description"
							value={item.text ?? ""}
							onChange={(e) => patchItem(idx, "text", e.target.value)}
							className="w-full px-4 py-2.5 text-xs border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none bg-gray-50/50 min-h-[80px]"
						/>
					</div>
				))}

				<button
					onClick={() => setList([...list, { ...BLANK }])}
					className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-xs font-bold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all uppercase tracking-widest"
				>
					+ Add programme
				</button>
			</div>

			<div className="flex justify-end pt-4">
				<button
					onClick={() => onSave(draft)}
					disabled={isSaving}
					className={cn(
						"flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[24px] text-lg font-black tracking-tight transition-all",
						"hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-blue-600/30",
					)}
				>
					{isSaving ? (
						<Loader2 className="w-6 h-6 animate-spin" />
					) : (
						<Save className="w-6 h-6" />
					)}
					{isSaving ? "Syncing…" : "Save Programmes"}
				</button>
			</div>
		</div>
	);
}
