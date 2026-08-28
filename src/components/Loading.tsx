export default function Loading() {
	return (
		<div className="fixed inset-0 bg-[#071329] flex flex-col items-center justify-center z-50">
			<div className="relative flex flex-col items-center">
				<div className="relative">
					<div className="absolute inset-[-12px] rounded-full border border-blue-400/10 animate-ping duration-1000"></div>
					<div className="w-14 h-14 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
				</div>
				<div className="mt-8 text-center space-y-2">
					<h2 className="text-white text-lg font-black tracking-widest uppercase">
						TTC & SOGY
					</h2>
					<p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
						Loading Website Content...
					</p>
				</div>
			</div>
		</div>
	);
}
