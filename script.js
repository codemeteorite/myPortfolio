// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.style.opacity = "0", 600);
  setTimeout(() => loader.remove(), 1400);
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("active");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Mobile menu
const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});
