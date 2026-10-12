export const money = value => `Bs. ${value.toFixed(2)}`;
export const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
