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
  currentSize = Math.min(72, Math.max(6, currentSize + delta));
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

    // ✅ Mobile-only home button translation on click
    const isMobile = window.matchMedia("(hover: none)").matches;
    const translations = ["home", "heim", "σπίτι"];
    let lastIndex = -1;

    if (isMobile) {
      const homeButton = document.querySelector(".home-button");
      if (homeButton) {
        homeButton.addEventListener("click", () => {
          let index;
          do {
            index = Math.floor(Math.random() * translations.length);
          } while (index === lastIndex);
          lastIndex = index;
          homeButton.textContent = translations[index];
        });
      }
    }

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

  // Language switch (desktop only)
  const translations = ["home", "heim", "σπίτι"];
  let lastIndex = -1;

  if (!isMobile && menuLabel) {
    hamburger.addEventListener("mouseover", () => {
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


    // Hover to reveal nav
    hamburger.addEventListener("mouseenter", () => {
      hamburger.classList.add("active");
      navMenu.classList.add("active");
    });

    hamburger.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!navMenu.matches(':hover')) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      }, 200);
    });

    navMenu.addEventListener("mouseleave", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  }

  // ✅ Mobile toggle behavior (no redirect!)
  if (isMobile) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
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
