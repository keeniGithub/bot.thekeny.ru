import axios from 'axios';

function parseToDateUTC(value) {
	if (value === undefined || value === null) return null;
	if (typeof value === 'number') {
		return value < 1e12 ? new Date(Math.round(value * 1000)) : new Date(Math.round(value));
	}
	const s = String(value).trim();
	if (/^\d+$/.test(s)) {
		const num = Number(s);
		return num < 1e12 ? new Date(num * 1000) : new Date(num);
	}
	if (/[zZ]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s)) {
		return new Date(s);
	}
	const parts = s.split('.');
	const main = parts[0];
	let frac = parts[1] || '';
	frac = (frac.match(/^\d+/) || [''])[0];
	if (frac.length > 3) frac = frac.slice(0, 3);
	while (frac.length < 3) frac += '0';
	const normalized = frac ? `${main}.${frac}Z` : `${main}Z`;
	return new Date(normalized);
}

function timeAgo(value) {
	const d = parseToDateUTC(value);
	if (!d || Number.isNaN(d.getTime())) return 'unknown';
	const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
	if (seconds < 5) return 'just now';
	if (seconds < 60) return `${seconds} sec ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes} min ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} h ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months} mo ago`;
	const years = Math.floor(months / 12);
	return `${years} y ago`;
}

const API_BASE = import.meta.env.VITE_API_URL

export async function getBotStatus() {
	try {
		const url = `${API_BASE}/kenybot`;
		const res = await axios.get(url);
		const data = res.data || {};
		return {
			status: data.status,
			last_ping: data.last_ping,
			last_ping_iso: data.last_ping_iso,
			last_seen: timeAgo(data.last_ping ?? data.last_ping_iso)
		};
	} catch (err) {
		return { status: false, error: err?.response?.data ?? err?.message ?? String(err) };
	}
}

export default getBotStatus;

