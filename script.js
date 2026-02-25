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
  fetch("https://portfolio-backend-3-t5w8.onrender.com/").catch(() => { });

  // ================= MOBILE MENU =================
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    menu.querySelectorAll("a").forEach(link => {
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

  // ================= CHAT =================
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const chatSend = document.getElementById("chat-send");
  const chatInput = document.getElementById("chat-input-field");
  const chatMessages = document.getElementById("chat-messages");

  if (chatToggle && chatBox && chatSend && chatInput && chatMessages) {
    // Initial greeting
    chatMessages.appendChild(createMessage("Hey! I am Abu 🙈 Yahiya's Non Existent Assistant! How can I be useful to you?", "bot"));

    chatToggle.addEventListener("click", () => {
      chatBox.classList.toggle("chat-hidden");
    });

    setTimeout(() => { chatInput.placeholder = "Talk with Abu"; }, 60000);

    function createMessage(text, sender, isTyping = false) {
      const msg = document.createElement("div");
      msg.className = `chat-bubble ${sender === "user" ? "user-bubble" : "bot-bubble"}`;
      if (isTyping) {
        msg.innerHTML = '<div class="typing-container"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
      } else {
        if (sender === "bot") {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          msg.innerHTML = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e40af; text-decoration: underline; font-weight: bold;">${url}</a>`);
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

      try {
        const res = await fetch("https://portfolio-backend-3-t5w8.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });
        loadingBubble.remove();
        if (res.status === 429 || res.status === 500) {
          chatMessages.appendChild(createMessage("Sorry, My Working Hours are done. I'll be back Tommorrow 😴", "bot"));
        } else {
          const data = await res.json();
          chatMessages.appendChild(createMessage(data.reply || "No reply", "bot"));
        }
      } catch (err) {
        loadingBubble.remove();
        chatMessages.appendChild(createMessage("Server sleeping. Try again.", "bot"));
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });
  }

  // ================= PHOTO CAROUSEL =================
  const track = document.getElementById('carouselTrack');
  const nextButton = document.getElementById('nextBtn');
  const prevButton = document.getElementById('prevBtn');
  const indicatorsContainer = document.getElementById('carouselIndicators');

  if (track && nextButton && prevButton && indicatorsContainer) {
    const slides = Array.from(track.children);
    const indicators = Array.from(indicatorsContainer.children);
    let currentIndex = 0, autoSlideTimer;

    const updateSlides = (index) => {
      track.classList.add('transitioning');
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === index));
      currentIndex = index;
      setTimeout(() => track.classList.remove('transitioning'), 1000);
    };

    const nextSlide = (manual = false) => { updateSlides((currentIndex + 1) % slides.length); if (manual) resetTimer(); };
    const prevSlide = () => { updateSlides((currentIndex - 1 + slides.length) % slides.length); resetTimer(); };
    const startTimer = () => autoSlideTimer = setInterval(nextSlide, 5000);
    const resetTimer = () => { clearInterval(autoSlideTimer); startTimer(); };

    nextButton.addEventListener('click', () => nextSlide(true));
    prevButton.addEventListener('click', prevSlide);
    indicators.forEach((ind, idx) => ind.addEventListener('click', () => { updateSlides(idx); resetTimer(); }));

    let touchStartX = 0, touchEndX = 0;
    track.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) nextSlide(true);
      else if (touchEndX > touchStartX + 50) prevSlide();
    }, { passive: true });

    startTimer();
  }
});

// ================= THREE.JS & UI ENHANCEMENTS =================
let scene, camera, renderer, particleSystem, geometryShapes = [];
let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

function init3D() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles
  const pCount = 5000, pGeo = new THREE.BufferGeometry(), pos = new Float32Array(pCount * 3), cols = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const i3 = i * 3;
    pos[i3] = (Math.random() - 0.5) * 300; pos[i3 + 1] = (Math.random() - 0.5) * 300; pos[i3 + 2] = (Math.random() - 0.5) * 300;
    const c = Math.random();
    if (c < 0.33) { cols[i3] = 0.118; cols[i3 + 1] = 0.251; cols[i3 + 2] = 0.686; }
    else if (c < 0.66) { cols[i3] = 0.031; cols[i3 + 1] = 0.569; cols[i3 + 2] = 0.698; }
    else { cols[i3] = 0.231; cols[i3 + 1] = 0.647; cols[i3 + 2] = 0.980; }
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  particleSystem = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
  scene.add(particleSystem);

  // Geometry
  const geos = [
    { g: new THREE.TorusKnotGeometry(10, 3, 128, 16, 2, 3), c: 0x1e40af, p: [-30, -20, -40], r: [0.002, 0.003, 0.001], o: 0.2 },
    { g: new THREE.OctahedronGeometry(8, 0), c: 0x06b6d4, p: [30, 20, -50], r: [0.003, 0.002, 0.004], o: 0.25 },
    { g: new THREE.IcosahedronGeometry(12, 1), c: 0x60a5fa, p: [0, -30, -60], r: [0.001, 0.004, 0.002], o: 0.18 },
    { g: new THREE.DodecahedronGeometry(7, 0), c: 0x3b82f6, p: [-25, 25, -45], r: [0.004, 0.001, 0.003], o: 0.22 },
    { g: new THREE.SphereGeometry(6, 32, 32), c: 0x1e40af, p: [25, -15, -35], r: [0.002, 0.002, 0.002], o: 0.15 }
  ];
  geos.forEach(g => {
    const mesh = new THREE.Mesh(g.g, new THREE.MeshBasicMaterial({ color: g.c, wireframe: true, transparent: true, opacity: g.o }));
    mesh.position.set(...g.p);
    scene.add(mesh);
    geometryShapes.push({ mesh, rotationSpeed: { x: g.r[0], y: g.r[1], z: g.r[2] } });
  });

  document.addEventListener('mousemove', (e) => { targetMouseX = (e.clientX / window.innerWidth) * 2 - 1; targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1; });
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
  window.addEventListener('scroll', () => camera.position.y = window.scrollY * 0.01);

  (function animate() {
    requestAnimationFrame(animate);
    mouseX += (targetMouseX - mouseX) * 0.05; mouseY += (targetMouseY - mouseY) * 0.05;
    particleSystem.rotation.y += 0.0003; particleSystem.rotation.x += 0.0001;
    geometryShapes.forEach(s => {
      s.mesh.rotation.x += s.rotationSpeed.x; s.mesh.rotation.y += s.rotationSpeed.y; s.mesh.rotation.z += s.rotationSpeed.z;
      s.mesh.position.y += Math.sin(Date.now() * 0.0005 + s.mesh.position.x) * 0.02;
    });
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

window.addEventListener('load', () => {
  init3D();

  // Reveal
  const obs = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

  // Visitor
  const cEl = document.getElementById("visitorCount");
  if (cEl) {
    fetch("https://visitor-counter-api-s46z.onrender.com/visitors").then(r => r.json()).then(d => {
      let cur = 0, tar = (parseInt(d.count || 0) + 60), frame = 0, tot = 180;
      const int = setInterval(() => {
        frame++; cur = Math.floor(tar * (1 - Math.pow(1 - (frame / tot), 3)));
        cEl.textContent = cur.toLocaleString();
        if (frame >= tot) { clearInterval(int); cEl.textContent = tar.toLocaleString() + "+"; }
      }, 33);
    }).catch(() => cEl.textContent = "120+");
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function (e) {
    e.preventDefault();
    const t = document.querySelector(this.getAttribute('href'));
    if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  }));

  // See More
  const smb = document.getElementById('seeMoreBtn'), hp = document.getElementById('hiddenProjects');
  if (smb && hp) smb.addEventListener('click', () => {
    hp.classList.toggle('active');
    const act = hp.classList.contains('active');
    smb.innerHTML = `<span class="group-hover:text-blue-300 flex items-center justify-center gap-3">
      <svg class="w-5 h-5 transition-transform ${act ? 'rotate-180' : ''}" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>${act ? 'Show Less' : 'See More Projects'}</span>`;
  });

  // Typewriter
  const ht = document.querySelector('.hero h1');
  if (ht) {
    const txt = ht.textContent; ht.textContent = ''; let i = 0;
    (function type() { if (i < txt.length) { ht.textContent += txt.charAt(i++); setTimeout(type, 50); } })();
  }

  // Cursor
  if (!('ontouchstart' in window)) {
    const cur = document.createElement('div'); cur.className = 'cursor-particle'; document.body.appendChild(cur);
    let cx = 0, cy = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function up() {
      cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
      cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
      requestAnimationFrame(up);
    })();
    document.querySelectorAll('a, button, .project-card, .skill-icon').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.style.width = '40px'; cur.style.height = '40px'; cur.style.backgroundColor = 'rgba(6, 182, 212, 0.7)'; });
      el.addEventListener('mouseleave', () => { cur.style.width = '20px'; cur.style.height = '20px'; cur.style.backgroundColor = 'rgba(30, 64, 175, 0.5)'; });
    });
  }

  // Cards
  document.querySelectorAll('.project-card').forEach(c => {
    c.addEventListener('mousemove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.transform = `perspective(1000px) rotateX(${(r.height / 2 - (e.clientY - r.top)) / (r.height / 2) * 10}deg) rotateY(${((e.clientX - r.left) - r.width / 2) / (r.width / 2) * 10}deg) translateY(-12px) scale(1.02)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });

  // Social Particles
  document.querySelectorAll('.social-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.transform = `translateY(-20px) rotateY(${((x - r.width / 2) / (r.width / 2)) * 20}deg) rotateX(${((r.height / 2 - y) / (r.height / 2)) * 20}deg) scale(1.05)`;
      for (let i = 0; i < 5; i++) {
        const p = document.createElement('div'); p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:4px;height:4px;background-color:${getComputedStyle(card).color};border-radius:50%;pointer-events:none;z-index:2;`;
        card.appendChild(p);
        const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 3, vx = Math.cos(a) * s, vy = Math.sin(a) * s;
        let px = 0, py = 0, op = 1;
        (function anim() { px += vx; py += vy; op -= 0.03; p.style.transform = `translate(${px}px,${py}px)`; p.style.opacity = op; if (op > 0) requestAnimationFrame(anim); else p.remove(); })();
      }
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Skill Animation
  const skS = document.getElementById('skills');
  if (skS) {
    const sObs = new IntersectionObserver((es) => { if (es[0].isIntersecting) document.querySelectorAll('.skill-icon').forEach((ic, ix) => setTimeout(() => ic.style.animation = `float 3s ease-in-out ${ix * 0.1}s infinite`, ix * 100)); }, { threshold: 0.5 });
    sObs.observe(skS);
  }

  // Skill Ripple
  document.querySelectorAll('.skill-icon').forEach(ic => ic.addEventListener('mouseenter', () => {
    const r = ic.getBoundingClientRect();
    const rip = document.createElement('div'); rip.style.cssText = `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:0;height:0;border-radius:50%;background-color:rgba(30,64,175,0.3);transform:translate(-50%,-50%);transition:all 0.6s;z-index:1;pointer-events:none;`;
    document.body.appendChild(rip); requestAnimationFrame(() => { rip.style.width = '200px'; rip.style.height = '200px'; rip.style.opacity = '0'; }); setTimeout(() => rip.remove(), 600);
  }));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { const m = document.getElementById('mobileMenu'); if (m) m.classList.add('hidden'); }
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); const sm = document.getElementById('seeMoreBtn'); if (sm) sm.click(); }
  });

  // Background
  window.addEventListener('scroll', () => { const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight); document.body.style.background = `hsl(${220 + p * 40},80%,3%)`; });

  console.log('%c👋 Hello Developer!', 'font-size:24px;font-weight:bold;color:#1e40af;');
});
