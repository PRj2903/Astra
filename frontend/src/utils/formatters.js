// Helper to format currency in Indian numbering system (e.g. ₹1,48,500)
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  const normalized = num < 5000 ? num * 80 : num;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(normalized);
};

export const getRawINR = (amount) => {
  if (!amount || isNaN(amount)) return 0;
  const num = Number(amount);
  return num < 5000 ? num * 80 : num;
};
