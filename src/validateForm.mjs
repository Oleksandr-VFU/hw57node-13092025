// validateForm.mjs

export function validateFormData(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid data');
  const { name, email } = data;
  if (typeof name !== 'string' || typeof email !== 'string') throw new Error('Invalid data');
  if (!name.trim() || !email.trim()) return false;
  // Simple email validation
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return false;
  return true;
}
