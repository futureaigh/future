import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Trash2, Upload } from "lucide-react";
import {
	fetchGallery,
	uploadGalleryImage,
	updateGalleryImage,
	deleteGalleryImage,
} from "@/lib/api";
import type { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ACCEPT = "image/jpeg,image/png,image/webp";

export default function GalleryManager() {
	const queryClient = useQueryClient();
	const inputRef = useRef<HTMLInputElement>(null);
	const dragId = useRef<number | null>(null);
	const [uploading, setUploading] = useState(0);

	const { data: images = [], isLoading } = useQuery({
		queryKey: ["gallery-admin"],
		queryFn: () => fetchGallery(true),
	});

	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: ["gallery-admin"] });

	const editMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: Partial<Pick<GalleryImage, "caption" | "sort_order" | "visible">>;
		}) => updateGalleryImage(id, data),
		onSuccess: () => invalidate(),
		onError: () => toast.error("Update failed"),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteGalleryImage(id),
		onSuccess: () => {
			invalidate();
			toast.success("Image deleted");
		},
		onError: () => toast.error("Delete failed"),
	});

	// ponytail: native HTML5 drag, no dnd lib; switch when touch-reorder is needed
	function move(draggedId: number, targetId: number) {
		if (draggedId === targetId) return;
		const order = [...images];
		const from = order.findIndex((i) => i.id === draggedId);
		const to = order.findIndex((i) => i.id === targetId);
		if (from < 0 || to < 0) return;
		const [m] = order.splice(from, 1);
		order.splice(to, 0, m);
		queryClient.setQueryData(["gallery-admin"], order);
		Promise.all(
			order.map((img, idx) =>
				idx === img.sort_order
					? null
					: updateGalleryImage(img.id, { sort_order: idx }),
			),
		)
			.then(() => invalidate())
			.catch(() => {
				invalidate();
				toast.error("Reorder failed");
			});
	}

	async function handleFiles(files: FileList | null) {
		if (!files?.length) return;
		const list = [...files].filter((f) =>
			["image/jpeg", "image/png", "image/webp"].includes(f.type),
		);
		if (list.length !== files.length)
			toast.error("Only JPEG, PNG or WebP files allowed");
		if (!list.length) return;
		setUploading(list.length);
		let done = 0;
		for (const file of list) {
			try {
				await uploadGalleryImage(file);
				done++;
			} catch {
				toast.error(`Upload failed: ${file.name}`);
			}
		}
		setUploading(0);
		invalidate();
		if (done) toast.success(`${done} image${done > 1 ? "s" : ""} uploaded`);
		if (inputRef.current) inputRef.current.value = "";
	}

	if (isLoading)
		return <p className="text-sm text-gray-400 font-medium">Loading gallery…</p>;

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-black text-gray-900 tracking-tight">
					Gallery
				</h1>
				<p className="text-sm text-gray-500 mt-2">
					Upload photos (JPEG, PNG, WebP — max 10MB). Stored in S3 as AVIF
					with a WebP thumbnail. Drag cards to reorder.
				</p>
			</div>

			<button
				onClick={() => inputRef.current?.click()}
				disabled={uploading > 0}
				className="w-full flex items-center justify-center gap-2 px-6 py-8 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-sm font-bold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all disabled:opacity-50"
			>
				<Upload className="w-5 h-5" />
				{uploading > 0 ? "Uploading…" : "Click to upload images"}
			</button>
			<input
				ref={inputRef}
				type="file"
				accept={ACCEPT}
				multiple
				className="hidden"
				onChange={(e) => handleFiles(e.target.files)}
			/>

			{images.length === 0 ? (
				<div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center">
					<p className="text-gray-400 font-medium">
						No gallery images yet. Upload the first one above.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{images.map((img) => (
						<div
							key={img.id}
							draggable
							onDragStart={() => (dragId.current = img.id)}
							onDragOver={(e) => e.preventDefault()}
							onDrop={() =>
								dragId.current !== null && move(dragId.current, img.id)
							}
							className={cn(
								"bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-move",
								!img.visible && "opacity-60",
							)}
						>
							<div className="aspect-square bg-gray-50">
								<img
									src={img.thumb_url || img.url}
									alt={img.caption || "Gallery image"}
									className="w-full h-full object-cover pointer-events-none"
									loading="lazy"
									draggable={false}
								/>
							</div>
							<div className="p-3 space-y-2">
								<input
									defaultValue={img.caption}
									placeholder="Add a caption…"
									onBlur={(e) => {
										if (e.target.value !== img.caption)
											editMutation.mutate({
												id: img.id,
												data: { caption: e.target.value },
											});
									}}
									className="w-full px-2 py-1.5 text-xs font-medium border border-gray-100 rounded-lg focus:outline-none focus:border-blue-400"
								/>
								<div className="flex items-center justify-between">
									<button
										onClick={() =>
											editMutation.mutate({
												id: img.id,
												data: { visible: !img.visible },
											})
										}
										className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900"
									>
										{img.visible ? (
											<>
												<Eye className="w-3.5 h-3.5" /> Visible
											</>
										) : (
											<>
												<EyeOff className="w-3.5 h-3.5" /> Hidden
											</>
										)}
									</button>
									<button
										onClick={() => {
											if (confirm("Delete this image?"))
												deleteMutation.mutate(img.id);
										}}
										className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
										aria-label="Delete image"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
