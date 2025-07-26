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
    fetch('/assets/includes/home-button.html').then(res => res.text()),
    fetch('/assets/includes/footer.html').then(res => res.text()),
    fetch("/nav.html").then(res => res.text())
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
    const homeTranslations = ["home", "heim", "σπίτι"];
    
    let lastIndex = -1;

    if (isMobile) {
      const homeButton = document.querySelector(".home-button");
      if (homeButton) {
        homeButton.addEventListener("click", () => {
          let index;
          do {
            index = Math.floor(Math.random() * homeTranslations.length);
          } while (index === lastIndex);
          lastIndex = index;
          homeButton.textContent = homeTranslations[index];
        });
      }
    }

    // ✅ Header translation every 2s (different words)
    const header = document.getElementById("header-translate");
    if (header) {
      const commonTranslations = ["Antonis Antoniadis", "Αντώνης Αντωνιάδης"];
  const rareTranslations = ["( ╥﹏╥) ノシ",  "ᕕ(⌐■_■)ᕗ ♪♬",
       "¯\(°_o)/¯", "(҂◡_◡) ᕤ","sᴉpɐᴉuoʇuⱯ sᴉuoʇuⱯ",
     "ςկƍάιʌოʇʌ∀ ςկʌώʇʌ∀", "Ἀ̕͝ν̿̈́̕τ͊̾ώ͘͘͠ν̈́́͑η͑̓ς̽̈́̽ Ὰ́͒ν͆͛͋τ͛́̔ώ̀͐ν͑͐̚ι̿̕ά͋̈́͠δ͒͆͊η͒̿͠ς̀͑͠", "A̶n̶t̶o̶n̶i̶s̶ A̶n̶t̶o̶n̶i̶a̶d̶i̶s̶" ];
      let lastIndex = -1;
  let intervalId;
  let burstActive = false;
  let isPaused = false;

  const isMobile = window.matchMedia("(hover: none)").matches;

  function getNonRepeatingRandom(arr, last) {
    let index;
    do {
      index = Math.floor(Math.random() * arr.length);
    } while (index === last);
    return index;
  }

  function showCommon() {
    const index = getNonRepeatingRandom(commonTranslations, lastIndex);
    lastIndex = index;
    header.textContent = commonTranslations[index];
  }

  function showRareBurst(callback) {
    burstActive = true;
    let burstCount = Math.floor(Math.random() * 3) + 3; // 3–5 fast changes
    let rareLastIndex = -1;
    let i = 0;

    const burst = setInterval(() => {
      const index = getNonRepeatingRandom(rareTranslations, rareLastIndex);
      rareLastIndex = index;
      header.textContent = rareTranslations[index];
      i++;
      if (i >= burstCount) {
        clearInterval(burst);
        burstActive = false;
        if (callback) callback();
      }
    }, 150);
  }

  function tick() {
    if (isPaused || burstActive) return;
    const triggerRare = Math.random() < 0.4;
    if (triggerRare) {
      showRareBurst();
    } else {
      showCommon();
    }
  }

  function startRotation() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(tick, 2500);
  }

  function pauseRotation() {
    isPaused = true;
  }

  function resumeRotation() {
    isPaused = false;
  }

  // Start interval
  startRotation();

  // Interaction behavior
  if (isMobile) {
    header.addEventListener("click", () => {
      isPaused = !isPaused;
    });
  } else {
    header.addEventListener("mouseenter", pauseRotation);
    header.addEventListener("mouseleave", resumeRotation);
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
