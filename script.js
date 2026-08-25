// Mouse Trail Glow Movement
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }
});

// Smart Image Loader
function tryLoadImage(imgElement, num) {
  const attempts = [
    `images/Mahal ko  (${num}).JPG`,
    `images/Mahal ko  (${num}).jpg`,
    `images/Mahal ko (${num}).JPG`,
    `images/Mahal ko (${num}).jpg`,
    `images/Mahal ko (${num}).jpeg`,
    `images/Mahal ko  (${num}).jpeg`
  ];

  let currentStep = parseInt(imgElement.dataset.step || "0");

  if (currentStep < attempts.length) {
    imgElement.dataset.step = currentStep + 1;
    imgElement.src = attempts[currentStep];
  }
}

// Web Audio API Synthesizer Sound Effect
function playPopSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Audio Context handled on click
  }
}

// Load All 60 Photos
document.addEventListener("DOMContentLoaded", () => {
  const grid1 = document.getElementById('gridPart1');
  const grid2 = document.getElementById('gridPart2');
  const grid3 = document.getElementById('gridPart3');

  if (grid1) {
    for (let i = 2; i <= 20; i++) {
      grid1.innerHTML += createPhotoCardHTML(i);
    }
  }

  if (grid2) {
    for (let i = 21; i <= 40; i++) {
      grid2.innerHTML += createPhotoCardHTML(i);
    }
  }

  if (grid3) {
    for (let i = 41; i <= 60; i++) {
      grid3.innerHTML += createPhotoCardHTML(i);
    }
  }

  setupScrollReveal();
  setupModalImageHearts();
});

function createPhotoCardHTML(num) {
  return `
    <div class="tilt-card" onclick="openModal('images/Mahal ko  (${num}).JPG')">
      <img src="images/Mahal ko  (${num}).JPG" 
           alt="Mahal ko (${num})"
           onerror="tryLoadImage(this, ${num})">
    </div>
  `;
}

// Scroll Reveal Setup
function setupScrollReveal() {
  const mainContent = document.getElementById('mainContent');
  const reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const revealTop = reveal.getBoundingClientRect().top;
      if (revealTop < windowHeight - 80) {
        reveal.classList.add('active');
      }
    });
  }

  if (mainContent) {
    mainContent.addEventListener('scroll', checkReveal);
  }
  checkReveal();
}

// Gift Envelope Click Intro
function openGift() {
  playPopSound();
  fireConfetti();
  
  setTimeout(() => {
    const intro = document.getElementById('introScreen');
    const main = document.getElementById('mainContent');
    
    if (intro && main) {
      intro.style.opacity = '0';
      setTimeout(() => {
        intro.style.display = 'none';
        main.style.opacity = '1';
        document.body.style.overflow = 'auto';
        setupScrollReveal();
      }, 1000);
    }
  }, 400);
}

// Toggle Bucket Items (Red Circle -> Green Check)
function toggleBucket(row) {
  playPopSound();
  const icon = row.querySelector('.status-icon');
  
  if (row.classList.contains('checked')) {
    row.classList.remove('checked');
    icon.innerText = '⭕';
  } else {
    row.classList.add('checked');
    icon.innerText = '✅';
    fireConfetti();
  }
}

// Floating Hearts Background
function createHeart() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;
  
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '💖';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 4 + 's';
  container.appendChild(heart);

  setTimeout(() => { heart.remove(); }, 7000);
}
setInterval(createHeart, 500);

// === DIRECT HEART TAP ON ZOOMED IMAGE ===
function setupModalImageHearts() {
  const modalImg = document.getElementById('modalImg');
  
  if (modalImg) {
    modalImg.addEventListener('click', (e) => {
      // Huwag i-close ang modal pag picture ang tinap
      e.stopPropagation(); 
      createHeartBurstAtPoint(e.clientX, e.clientY);
    });
  }
}

function createHeartBurstAtPoint(x, y) {
  playPopSound();
  
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = Math.floor(Math.random() * 14 + 22) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '30000';
    
    const xMove = (Math.random() - 0.5) * 300;
    const yMove = (Math.random() - 0.5) * 300;
    
    document.body.appendChild(heart);
    
    heart.animate([
      { transform: 'translate(0, 0) scale(0.6)', opacity: 1 },
      { transform: `translate(${xMove}px, ${yMove}px) scale(1.8)`, opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out',
      fill: 'forwards'
    });
    
    setTimeout(() => heart.remove(), 1000);
  }
}

// Confetti Cannon
function toggleSecret() {
  playPopSound();
  const msg = document.getElementById('secretMessage');
  const btn = document.getElementById('confettiBtn');
  
  if (msg.style.display === "block") {
    msg.style.display = "none";
    btn.innerText = "Pindutin mo 'to By!";
  } else {
    msg.style.display = "block";
    btn.innerText = "Love You! 💖";
    fireConfetti();
  }
}

function fireConfetti() {
  for (let i = 0; i < 60; i++) {
    createConfettiParticle();
  }
}

function createConfettiParticle() {
  const particle = document.createElement('div');
  const colors = ['#ff5c8a', '#ff85a2', '#ffb6c1', '#ffffff', '#ffd1dc'];
  
  particle.style.position = 'fixed';
  particle.style.width = Math.random() * 10 + 5 + 'px';
  particle.style.height = Math.random() * 18 + 6 + 'px';
  particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  particle.style.top = '50%';
  particle.style.left = '50%';
  particle.style.zIndex = '25000';
  particle.style.opacity = '1';
  particle.style.borderRadius = '3px';
  
  const destinationX = (Math.random() - 0.5) * 1000;
  const destinationY = (Math.random() - 0.5) * 1000;
  
  document.body.appendChild(particle);
  
  particle.animate([
    { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
    { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
  ], {
    duration: Math.random() * 1000 + 1500,
    easing: 'ease-out',
    fill: 'forwards'
  });
  
  setTimeout(() => { particle.remove(); }, 3000);
}

// Lightbox Modal
function openModal(src) {
  playPopSound();
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  if (modal && modalImg) {
    modal.style.display = 'flex';
    modalImg.src = src;
    
    // Auto burst pagkabukas
    createHeartBurstAtPoint(window.innerWidth / 2, window.innerHeight / 2);
  }
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.style.display = 'none';
}