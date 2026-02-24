// ==============================
// INITIAL DOM READY
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // LOADER
  // ==============================
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.transition = "opacity 0.6s ease";
      loader.style.opacity = "0";
    }, 300);

    setTimeout(() => loader.remove(), 1000);
  }

  // ==============================
  // SCROLL REVEAL
  // ==============================
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==============================
  // MOBILE MENU
  // ==============================
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");

  if (btn && menu) {

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    document.querySelectorAll("#mobileMenu a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.add("hidden");
      });
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }

  // ==============================
  // CHAT SYSTEM
  // ==============================
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const chatSend = document.getElementById("chat-send");
  const chatInput = document.getElementById("chat-input-field");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatToggle || !chatBox || !chatSend || !chatInput || !chatMessages) return;

  // Ensure proper alignment
  chatMessages.style.display = "flex";
  chatMessages.style.flexDirection = "column";

  // Toggle chat visibility
  chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("chat-hidden");
  });

  // Create message bubble
  function createMessage(text, sender = "user") {
    const msg = document.createElement("div");
    msg.textContent = text;

    msg.style.marginBottom = "10px";
    msg.style.padding = "8px 12px";
    msg.style.borderRadius = "12px";
    msg.style.maxWidth = "80%";
    msg.style.fontSize = "13px";
    msg.style.wordWrap = "break-word";

    if (sender === "user") {
      msg.style.background = "#1e40af";
      msg.style.color = "#fff";
      msg.style.alignSelf = "flex-end";
    } else {
      msg.style.background = "#06b6d4";
      msg.style.color = "#000";
      msg.style.alignSelf = "flex-start";
    }

    return msg;
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    const userMsg = createMessage(message, "user");
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";

    // Add temporary loading bubble
    const loadingMsg = createMessage("Thinking...", "bot");
    loadingMsg.style.opacity = "0.6";
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch("https://portfolio-backend-3-t5w8.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      loadingMsg.remove();

      const botReply = createMessage(data.reply || "No response received.", "bot");
      chatMessages.appendChild(botReply);
      chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
      loadingMsg.remove();

      const errorMsg = createMessage("Server is waking up. Try again in a few seconds.", "bot");
      chatMessages.appendChild(errorMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
