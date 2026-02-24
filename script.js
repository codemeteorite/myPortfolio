console.log("JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

  // ================= LOADER =================
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
    }, 300);
    setTimeout(() => loader.remove(), 1000);
  }

  // ================= MOBILE MENU =================
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  }

  // ================= CHAT =================
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const chatSend = document.getElementById("chat-send");
  const chatInput = document.getElementById("chat-input-field");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatToggle || !chatBox || !chatSend || !chatInput || !chatMessages) {
    console.log("Chat elements not found");
    return;
  }

  chatMessages.style.display = "flex";
  chatMessages.style.flexDirection = "column";

  chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("chat-hidden");
  });

  function createMessage(text, sender) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.style.marginBottom = "10px";
    msg.style.padding = "8px 12px";
    msg.style.borderRadius = "12px";
    msg.style.maxWidth = "80%";

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

    chatMessages.appendChild(createMessage(message, "user"));
    chatInput.value = "";

    const loading = createMessage("Thinking...", "bot");
    loading.style.opacity = "0.6";
    chatMessages.appendChild(loading);

    try {
      const res = await fetch("https://portfolio-backend-3-t5w8.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      loading.remove();

      chatMessages.appendChild(createMessage(data.reply || "No reply", "bot"));
    } catch (err) {
      loading.remove();
      chatMessages.appendChild(createMessage("Server sleeping. Try again.", "bot"));
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

});
