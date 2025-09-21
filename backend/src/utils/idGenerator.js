// backend/src/utils/idGenerator.js
export function generatePatientId() {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A–Z
  ).join('');
  const numbers = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
  return letters + numbers; // e.g. "QJZT493028"
}
