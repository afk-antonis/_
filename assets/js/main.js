const root = document.documentElement;

// ====================
// Font Size Control (using CSS variable)
// ====================
let computedSize = getComputedStyle(document.body).fontSize;
let currentSize = parseInt(computedSize);

console.log("Raw computed font-size:", computedSize);
console.log("Parsed font-size:", currentSize);

if (isNaN(currentSize)) {
  console.warn("Could not parse font size; using fallback of 18px.");
}

function updateFontSize(delta) {
  currentSize = Math.min(32, Math.max(12, currentSize + delta));
  root.style.setProperty("--base-font-size", `${currentSize}px`);
}

// ====================
// DOM Ready
// ====================
window.addEventListener("DOMContentLoaded", () => {
  // Load includes in sequence
  Promise.all([
    fetch('assets/includes/home-button.html').then(res => res.text()),
    fetch('assets/includes/footer.html').then(res => res.text()),
    fetch("nav.html").then(res => res.text())
  ]).then(([homeButtonHTML, footerHTML, navHTML]) => {
    document.getElementById("home-button-container").innerHTML = homeButtonHTML;
    document.getElementById("footer-placeholder").innerHTML = footerHTML;
    document.getElementById("nav-container").innerHTML = navHTML;

    console.log("font-smaller button:", document.getElementById("font-smaller"));
    console.log("font-bigger button:", document.getElementById("font-bigger"));

    document.getElementById("font-smaller")?.addEventListener("click", () => updateFontSize(-2));
    document.getElementById("font-bigger")?.addEventListener("click", () => updateFontSize(2));

    setupNavigation();
  });
});

// ====================
// Navigation Setup
// ====================
function setupNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav');
  const menuLabel = document.querySelector('.menu-label');
  const isMobile = window.matchMedia("(hover: none)").matches;

  // Highlight active page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href").split("?")[0].split("#")[0];
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // Language switching
  const translations = ["home", "heim", "σπίτι"];
  let lastIndex = -1;

  hamburger.addEventListener("mouseover", () => {
    if (!menuLabel) return;

    let index;
    do {
      index = Math.floor(Math.random() * translations.length);
    } while (index === lastIndex);
    lastIndex = index;

    menuLabel.textContent = translations[index];
    menuLabel.classList.add("translated");
  });

  hamburger.addEventListener("mouseout", () => {
    menuLabel.classList.remove("translated");
  });

  // Nav reveal (hover on desktop, click on mobile)
if (isMobile) {
  // Mobile: Instant toggle, no delay, no redirect
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
} else {
  // Desktop: Reveal on hover, and link to index on menu-label click
  hamburger.addEventListener('mouseenter', () => {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
  });

  hamburger.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!navMenu.matches(':hover')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    }, 200);
  });

  navMenu.addEventListener('mouseleave', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });

  // Desktop only: clicking the "home" label links to index
  const homeLabel = hamburger.querySelector('.menu-label');
  homeLabel.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = "index.html";
  });
}
}
// ====================
// Lightbox Settings
// ====================
if (typeof lightbox !== 'undefined') {
  lightbox.option({
    'resizeDuration': 0,
    'imageFadeDuration': 0,
    'fadeDuration': 0,
    'wrapAround': true,
    'albumLabel': "%1 of %2"
  });
}

console.log("Font size buttons connected:", currentSize);
