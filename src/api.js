import axios from 'axios';

// Vite proxies /api to http://localhost:8080 in development.
// For production, set VITE_API_URL (e.g. https://api.example.com/api) at build time.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export default api;

// Change the currency here once and every screen follows.
const CURRENCY = 'INR';
const LOCALE = 'en-IN';

export const money = (n) =>
  new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 }).format(n ?? 0);

export const label = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ') : '');
