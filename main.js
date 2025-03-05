// Three.js & GSAP: 3D Robot Avatar, Particle Rain, Letter-by-Letter, & Scroll Animations

let scene, camera, renderer, robot, particleSystem;

function init() {
  // Create Scene with background based on theme.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(
    document.body.classList.contains("light-theme") ? 0xe9efec : 0x121212
  );

  // Setup Camera.
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Setup Renderer.
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("avatar-container").appendChild(renderer.domElement);

  // Add Ambient & Directional Lights.
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);

  // Create the 3D Robot Avatar (a cube placeholder).
  const robotGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const robotMaterial = new THREE.MeshStandardMaterial({
    color: document.body.classList.contains("light-theme") ? "#A294F9" : "#c75cff",
    metalness: 0.6,
    roughness: 0.3,
  });
  robot = new THREE.Mesh(robotGeometry, robotMaterial);
  scene.add(robot);

  // Animate robot sliding in from left.
  robot.position.x = -10;
  gsap.to(robot.position, { x: 0, duration: 2, ease: "power2.out" });
  gsap.to(robot.rotation, { y: Math.PI * 2, duration: 2, ease: "power2.out" });

  // Create the particle rain effect.
  createParticles();

  // Animate hero text with letter-by-letter effect.
  animateHeroText();

  // Animate section headings on scroll.
  gsap.utils.toArray(".section h2").forEach((heading) => {
    gsap.fromTo(
      heading,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "restart none none none",
        },
      }
    );
  });

  // Animate cards on scroll.
  gsap.utils.toArray(".card, .section-card").forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "restart none none none",
        },
      }
    );
  });

  // Add hamburger toggle functionality for mobile.
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("open");
    // If nav menu is open, lower the toggle's z-index so it stays behind the menu.
    if (navLinks.classList.contains("show")) {
      themeToggle.style.zIndex = "5";
    } else {
      themeToggle.style.zIndex = "1000";
    }
  });

  // When a nav-link is clicked, remove the "show" class and restore toggle's z-index.
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        hamburger.classList.remove("open");
        themeToggle.style.zIndex = "1000";
      }
    });
  });

  // Hide mobile nav when user scrolls down and restore toggle's z-index.
  window.addEventListener("scroll", () => {
    if (navLinks.classList.contains("show")) {
      navLinks.classList.remove("show");
      hamburger.classList.remove("open");
      themeToggle.style.zIndex = "1000";
    }
  });

  // Setup EmailJS integration for the contact form.
  setupEmailJS();

  animate();
}

function animateHeroText() {
  const heroName = document.getElementById("hero-name");
  const heroTitle = document.getElementById("hero-title");
  splitTextToSpans(heroName);
  splitTextToSpans(heroTitle);

  gsap.to("#hero-name span", {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.8,
    delay: 0.5,
    ease: "power2.out",
  });
  gsap.to("#hero-title span", {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.8,
    delay: 1,
    ease: "power2.out",
  });
  gsap.fromTo(
    ".contact-links",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1.2 }
  );
}

function splitTextToSpans(element) {
  const text = element.textContent.trim();
  element.textContent = "";
  const letters = text.split("");
  letters.forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.opacity = 0;
    span.style.transform = "translateY(-20px)";
    element.appendChild(span);
  });
}

function createParticles() {
  const particleCount = 500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: document.body.classList.contains("light-theme") ? "#A294F9" : "#c75cff",
    size: 0.2,
    transparent: true,
    opacity: 0.8,
  });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function animate() {
  requestAnimationFrame(animate);
  robot.rotation.y += 0.01;

  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 0.1;
    if (positions[i + 1] < -25) {
      positions[i + 1] = 25;
    }
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

function setupEmailJS() {
  const btn = document.getElementById("button");
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    btn.value = "Sending...";

    emailjs.sendForm("service_nr3dsx4", "template_i8lxe5s", this).then(
      () => {
        btn.value = "Send Message";
        showCustomAlert("Your message has been sent successfully!", true);
        form.reset();
      },
      (err) => {
        btn.value = "Send Message";
        showCustomAlert("Failed to send message. Please try again later.", false);
        console.error(JSON.stringify(err));
      }
    );
  });
}

function showCustomAlert(message, success) {
  const alertContainer = document.getElementById("alert-container");
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.textContent = message;
  alertDiv.style.background = success ? "var(--neon-purple)" : "var(--light-brown)";
  alertDiv.style.color = "#fff";
  alertContainer.appendChild(alertDiv);

  gsap.to(alertDiv, { opacity: 1, y: 0, duration: 0.5 });
  setTimeout(() => {
    gsap.to(alertDiv, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => {
        alertContainer.removeChild(alertDiv);
      },
    });
  }, 3000);
}

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", toggleTheme);

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light-theme");
  const icon = themeToggle.querySelector("i");

  if (isLight) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateThreeTheme(isLight);
}

function updateThreeTheme(isLight) {
  if (scene) {
    scene.background = new THREE.Color(isLight ? 0xe9efec : 0x121212);
  }
  if (robot && robot.material) {
    robot.material.color.set(isLight ? "#A294F9" : "#c75cff");
  }
  if (particleSystem) {
    particleSystem.material.color.set(isLight ? "#A294F9" : "#c75cff");
  }
}

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
  const icon = themeToggle.querySelector("i");
  icon.classList.remove("fa-sun");
  icon.classList.add("fa-moon");
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
