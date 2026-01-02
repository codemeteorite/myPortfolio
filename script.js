// Loader
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.transition = "opacity 0.6s ease";
    loader.style.opacity = "0";
  }, 300);

  setTimeout(() => loader.remove(), 1000);
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

// Toggle on hamburger click
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("hidden");
});

// Close when clicking a link
document.querySelectorAll("#mobileMenu a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
  });
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add("hidden");
  }
});
