import type { SiteContentRecord, ContactSubmission } from "@/types";

async function j<T>(res: Response): Promise<T> {
	if (!res.ok) {
		throw new Error(`API error ${res.status}`);
	}
	return res.json() as Promise<T>;
}

// ------------------------------------------------------------
// Auth (username/password via /api/login; server sets httpOnly cookie)
// ------------------------------------------------------------
let currentUser: any = null;
const savedUser = localStorage.getItem("ttc_auth_user");
if (savedUser) {
	try {
		currentUser = JSON.parse(savedUser);
	} catch {
		/* ignore malformed session */
	}
}

const listeners: Array<(user: any) => void> = [];

export const auth = {
	get currentUser() {
		return currentUser;
	},
};

export async function login(username: string, password: string) {
	const res = await fetch("/api/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});
	if (!res.ok) {
		throw new Error("Invalid username or password");
	}
	currentUser = {
		uid: "admin-" + username.replace(/[^a-zA-Z0-9]/g, ""),
		username,
		displayName: username,
	};
	localStorage.setItem("ttc_auth_user", JSON.stringify(currentUser));
	listeners.forEach((cb) => cb(currentUser));
	return currentUser;
}

export async function logout() {
	try {
		await fetch("/api/logout", { method: "POST" });
	} catch {
		/* network error on logout, still clear local */
	}
	currentUser = null;
	localStorage.removeItem("ttc_auth_user");
	listeners.forEach((cb) => cb(null));
}

export function onAuthStateChanged(
	_authInstance: any,
	callback: (user: any) => void,
) {
	listeners.push(callback);
	callback(currentUser);
	return () => {
		const idx = listeners.indexOf(callback);
		if (idx !== -1) listeners.splice(idx, 1);
	};
}

// ------------------------------------------------------------
// Content
// ------------------------------------------------------------
export async function fetchContent(): Promise<SiteContentRecord[]> {
	return j(await fetch("/api/content"));
}

export async function saveContent(
	sectionKey: string,
	content: any,
): Promise<void> {
	await j(
		await fetch(`/api/content/${sectionKey}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		}),
	);
}

// ------------------------------------------------------------
// Submissions
// ------------------------------------------------------------
export async function fetchSubmissions(): Promise<ContactSubmission[]> {
	return j(await fetch("/api/submissions"));
}

export async function createSubmission(data: any): Promise<void> {
	await j(
		await fetch("/api/submissions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}),
	);
}

// ------------------------------------------------------------
// Media
// ------------------------------------------------------------
export async function uploadImage(file: File): Promise<string> {
	const res = await fetch(`/api/upload?name=${encodeURIComponent(file.name)}`, {
		method: "POST",
		headers: { "Content-Type": file.type || "application/octet-stream" },
		body: file,
	});
	const data = await j<{ url: string }>(res);
	return data.url;
}
