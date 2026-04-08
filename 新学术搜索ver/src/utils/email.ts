export function isValidEmail(email: string) {
  const normalized = email.trim();
  if (!normalized) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}
