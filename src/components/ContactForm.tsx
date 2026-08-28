import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createSubmission } from "@/lib/api";

interface ContactFormProps {
	categories?: string[];
	source?: string;
}

export default function ContactForm({ categories = [], source }: ContactFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const interestOptions = categories.length
		? categories
		: ["General Enquiry", "Volunteer", "Partnership", "Other"];

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			phone: formData.get("phone"),
			interest: formData.get("interest"),
			message: formData.get("message"),
			source: source || null,
		};
		try {
			await createSubmission(data);
			setSubmitted(true);
			(e.target as HTMLFormElement).reset();
		} catch (error) {
			console.error(error);
			alert("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="space-y-6 py-12"
				role="status"
			>
				<div className="w-20 h-20 bg-green-50 rounded-full mx-auto flex items-center justify-center text-green-500">
					<CheckCircle2 className="w-10 h-10" />
				</div>
				<p className="text-2xl font-black text-gray-900 text-center">
					Message Received!
				</p>
				<div className="text-center">
					<button
						onClick={() => setSubmitted(false)}
						className="text-blue-600 font-bold hover:underline"
					>
						Send another message
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 text-left">
			<div className="space-y-2">
				<label className="text-xs font-black text-gray-400 uppercase tracking-widest">
					Full Name *
				</label>
				<input
					required
					name="name"
					className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
					placeholder="Your name"
				/>
			</div>
			<div className="space-y-2">
				<label className="text-xs font-black text-gray-400 uppercase tracking-widest">
					Email *
				</label>
				<input
					required
					name="email"
					type="email"
					className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
					placeholder="you@email.com"
				/>
			</div>
			<div className="space-y-2">
				<label className="text-xs font-black text-gray-400 uppercase tracking-widest">
					Phone (Optional)
				</label>
				<input
					name="phone"
					className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
					placeholder="+1 234 567 8900"
				/>
			</div>
			<div className="space-y-2">
				<label className="text-xs font-black text-gray-400 uppercase tracking-widest">
					I want to... *
				</label>
				<select
					name="interest"
					className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold appearance-none"
					defaultValue={categories.length ? categories[0] : "General Enquiry"}
				>
					{interestOptions.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>
			<div className="md:col-span-2 space-y-2">
				<label className="text-xs font-black text-gray-400 uppercase tracking-widest">
					Message (Optional)
				</label>
				<textarea
					name="message"
					className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold min-h-[120px]"
					placeholder="Tell us more about how you'd like to get involved..."
				></textarea>
			</div>
			<div className="md:col-span-2 pt-4">
				<button
					disabled={isSubmitting}
					type="submit"
					className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-70"
				>
					{isSubmitting ? (
						<Loader2 className="w-6 h-6 animate-spin" />
					) : (
						"Send Message"
					)}
				</button>
			</div>
		</form>
	);
}
