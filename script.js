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





// ===== CHAT TOGGLE =====
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatSend = document.getElementById("chat-send");
const chatInput = document.getElementById("chat-input-field");
const chatMessages = document.getElementById("chat-messages");

chatToggle.addEventListener("click", () => {
  chatBox.classList.toggle("chat-hidden");
});

// Add message to UI
function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.style.marginBottom = "10px";
  msg.style.padding = "8px 10px";
  msg.style.borderRadius = "8px";
  msg.style.maxWidth = "80%";
  msg.style.fontSize = "13px";

  if (sender === "user") {
    msg.style.background = "#1e40af";
    msg.style.alignSelf = "flex-end";
  } else {
    msg.style.background = "#06b6d4";
    msg.style.color = "#000";
  }

  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";

  // Temporary fake AI reply
  setTimeout(() => {
    addMessage("AI is thinking...", "bot");
  }, 600);
}
