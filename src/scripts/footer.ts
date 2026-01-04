const currentYear = new Date().getFullYear();
const yearElement = document.querySelector("[data-copyright-year]");

const startYear = 2025;
if (yearElement) {
  if (currentYear === startYear) {
    yearElement.textContent = String(startYear);
  } else {
    yearElement.textContent = `${startYear}-${currentYear}`;
  }
}
