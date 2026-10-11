export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
export const errMsg = (e) => e?.response?.data?.message || e.message || 'Something went wrong';
export const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
