// Three.js & GSAP: 3D Robot Avatar, Particle Rain, Letter-by-Letter, & Scroll Animations

let scene, camera, renderer, robot, particleSystem;

function init() {
  // Create Scene with dark background.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121212);

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
    color: 0xc75cff, // Neon Purple.
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
  gsap.utils.toArray('.section h2').forEach((heading) => {
    gsap.fromTo(heading, { opacity: 0, y: -20 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
      }
    });
  });
  
  // Animate cards on scroll.
  gsap.utils.toArray('.card, .section-card').forEach((card) => {
    gsap.fromTo(card, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
      }
    });
  });

  // Add hamburger toggle functionality for mobile.
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  animate();
}

function animateHeroText() {
  // Get hero text elements.
  const heroName = document.getElementById("hero-name");
  const heroTitle = document.getElementById("hero-title");
  // const heroLocation = document.getElementById("hero-location");

  // Split text into spans.
  splitTextToSpans(heroName);
  splitTextToSpans(heroTitle);
  // splitTextToSpans(heroLocation);

  // Animate each letter sequentially.
  gsap.to("#hero-name span", {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.8,
    delay: 0.5,
    ease: "power2.out"
  });
  gsap.to("#hero-title span", {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.8,
    delay: 1,
    ease: "power2.out"
  });
  // gsap.to("#hero-location span", {
  //   opacity: 1,
  //   y: 0,
  //   stagger: 0.05,
  //   duration: 0.8,
  //   delay: 1.5,
  //   ease: "power2.out"
  // });
}

function splitTextToSpans(element) {
  const text = element.textContent.trim();
  element.textContent = "";
  const letters = text.split("");
  letters.forEach(letter => {
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

  // Randomly position particles within a volume.
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xc75cff, // Neon purple for particles.
    size: 0.2,
    transparent: true,
    opacity: 0.8,
  });
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate the robot continuously.
  robot.rotation.y += 0.01;

  // Update particles: move downward and reset if too low.
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

// Handle window resize.
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
