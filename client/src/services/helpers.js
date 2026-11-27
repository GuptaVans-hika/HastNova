// 0-1 yrs Beginner, 2-4 Intermediate, 5+ Advanced
export function getLevel(years) {
  const y = Number(years) || 0;
  if (y >= 5) return 'Advanced';
  if (y >= 2) return 'Intermediate';
  return 'Beginner';
}

export const levelBadgeVariant = {
  Beginner: 'green',
  Intermediate: 'mustard',
  Advanced: 'terracotta',
};

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRupees(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'Karigar';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
