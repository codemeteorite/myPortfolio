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

  // ================= PROACTIVE BACKEND WAKE-UP =================
  // Start waking up the chat backend immediately on page load to minimize cold-start delay
  fetch("https://portfolio-backend-3-t5w8.onrender.com/").catch(() => {
    // Silent catch, we just want to trigger the wake-up
  });

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

  // Dynamic Placeholder Timer
  // Change placeholder after 1 minute to indicate Abu is ready
  setTimeout(() => {
    chatInput.placeholder = "Talk with Abu";
  }, 60000);

  // Initial greeting
  chatMessages.appendChild(createMessage("Hey! I am Abu 🙈 Yahiya's Non Existent Assistant! How can I be useful to you?", "bot"));

  chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("chat-hidden");
  });

  function createMessage(text, sender, isTyping = false) {
    const msg = document.createElement("div");
    msg.className = `chat-bubble ${sender === "user" ? "user-bubble" : "bot-bubble"}`;

    if (isTyping) {
      msg.innerHTML = `
        <div class="typing-container">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
    } else {
      if (sender === "bot") {
        // Link parsing for bot messages
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        msg.innerHTML = text.replace(urlRegex, (url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e40af; text-decoration: underline; font-weight: bold;">${url}</a>`;
        });
      } else {
        msg.textContent = text;
      }
    }

    return msg;
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.appendChild(createMessage(message, "user"));
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const loadingBubble = createMessage("", "bot", true);
    chatMessages.appendChild(loadingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const startTime = Date.now();

    try {
      console.log("CHAT ROUTE HIT");
      const fetchPromise = fetch("https://portfolio-backend-3-t5w8.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      // Wait for both the fetch and at least 2 seconds
      const minWaitPromise = new Promise(resolve => setTimeout(resolve, 2000));
      const [res] = await Promise.all([fetchPromise, minWaitPromise]);

      loadingBubble.remove();

      if (res.status === 429 || res.status === 500) {
        chatMessages.appendChild(createMessage("Sorry, My Working Hours are done. I'll be back Tommorrow 😴", "bot"));
      } else {
        const data = await res.json();
        chatMessages.appendChild(createMessage(data.reply || "No reply", "bot"));
      }
    } catch (err) {
      // Ensure we still wait if there's an error quickly
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
      }
      loadingBubble.remove();
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

  // ================= PHOTO CAROUSEL =================
  const track = document.getElementById('carouselTrack');
  const nextButton = document.getElementById('nextBtn');
  const prevButton = document.getElementById('prevBtn');
  const indicatorsContainer = document.getElementById('carouselIndicators');

  if (track && nextButton && prevButton && indicatorsContainer) {
    const slides = Array.from(track.children);
    const indicators = Array.from(indicatorsContainer.children);

    // Preload all carousel images
    const preloadCarouselImages = () => {
      slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && img.src) {
          const newImg = new Image();
          newImg.src = img.src;
        }
      });
    };
    preloadCarouselImages();

    let currentIndex = 0;
    let autoSlideTimer;

    const updateSlides = (index) => {
      // Add a transition effect class
      track.classList.add('transitioning');

      track.style.transform = `translateX(-${index * 100}%)`;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });

      currentIndex = index;

      // Remove the effect class after transition
      setTimeout(() => {
        track.classList.remove('transitioning');
      }, 1000);
    };

    const nextSlide = (isManual = false) => {
      let index = (currentIndex + 1) % slides.length;
      updateSlides(index);
      if (isManual) resetTimer();
    };

    const prevSlide = () => {
      let index = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides(index);
      resetTimer();
    };

    const startTimer = () => {
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const resetTimer = () => {
      clearInterval(autoSlideTimer);
      startTimer();
    };

    nextButton.addEventListener('click', () => nextSlide(true));
    prevButton.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        updateSlides(index);
        resetTimer();
      });
    });

    // Start the auto-slide
    startTimer();
  }

});
