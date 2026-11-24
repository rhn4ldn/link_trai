const WHATSAPP_NUMBER = "6287841712932";

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}

const statusLabels = {
  included: "Termasuk",
  excluded: "Tidak termasuk",
  optional: "Opsional / Biaya tambahan",
  confirm: "Perlu konfirmasi"
};

function buildSpecs(revisionDetail) {
  return [
    {
      label: "Domain",
      status: "confirm",
      detail: "Jenis domain yang digunakan, termasuk biaya dan ketentuannya, dibahas saat konsultasi."
    },
    {
      label: "Hosting",
      status: "confirm",
      detail: "Fasilitas hosting dan masa aktifnya dibahas saat konsultasi."
    },
    {
      label: "Revisi",
      status: "included",
      detail: revisionDetail
    },
    {
      label: "Source Code",
      status: "confirm",
      detail: "Ketentuan penyerahan file source code dibahas saat konsultasi."
    },
    {
      label: "Deployment",
      status: "confirm",
      detail: "Website disiapkan siap tayang; teknis publikasi dibahas saat konsultasi."
    },
    {
      label: "Maintenance",
      status: "confirm",
      detail: "Layanan pemeliharaan setelah website selesai belum tercantum dalam paket."
    }
  ];
}

const packageDetails = {
  starter: {
    name: "Starter",
    price: "Rp 75.000",
    messagePrice: "Rp 75.000",
    timeline: "Estimasi pengerjaan 2–3 hari",
    description: "Cocok untuk acara atau promosi singkat yang butuh satu halaman sederhana.",
    specs: buildSpecs("1x revisi."),
    features: ["1 halaman sederhana", "Desain responsif", "Tombol WhatsApp"]
  },
  bisnis: {
    name: "Bisnis",
    price: "Rp 125.000",
    messagePrice: "Rp 125.000",
    timeline: "Estimasi pengerjaan 3–4 hari",
    description: "Paling cocok untuk UMKM dan usaha kecil yang membutuhkan halaman lebih lengkap.",
    specs: buildSpecs("2x revisi."),
    features: ["1 halaman lengkap", "Form kontak + tombol WhatsApp", "Optimasi mobile"]
  },
  premium: {
    name: "Premium",
    price: "Rp 200.000",
    messagePrice: "Rp 200.000",
    timeline: "Estimasi pengerjaan 5–6 hari",
    description: "Untuk tampilan yang lebih menarik dan lengkap.",
    specs: buildSpecs("3x revisi."),
    features: ["Multi-section + animasi ringan", "Optimasi kecepatan", "Custom warna & font"]
  },
  pro: {
    name: "Pro",
    price: "Rp 300.000+",
    messagePrice: "mulai Rp 300.000",
    timeline: "Timeline menyesuaikan",
    description: "Untuk kebutuhan khusus dengan scope custom penuh dan konsultasi mendalam.",
    specs: buildSpecs("Sesuai kesepakatan proyek."),
    features: ["Fully custom sesuai brief", "Konsultasi mendalam", "Prioritas pengerjaan"]
  }
};

const whatsappModal = document.getElementById("whatsapp-modal");
const messagePreview = document.getElementById("message-preview");
const confirmWhatsAppButton = document.getElementById("confirm-whatsapp");
const consultButton = document.getElementById("consult-button");

const packageModal = document.getElementById("package-modal");
const packageDialog = packageModal.querySelector(".package-dialog");
const packageTitle = document.getElementById("package-modal-title");
const packageDescription = document.getElementById("package-modal-description");
const packagePrice = document.getElementById("package-modal-price");
const packageTimeline = document.getElementById("package-modal-timeline");
const packageSpecs = document.getElementById("package-modal-specs");
const packageFeatures = document.getElementById("package-modal-features");
const packageOrderButton = document.getElementById("package-order-button");

let pendingMessage = "";
let previouslyFocusedElement = null;
let activePackageKey = null;
let packageTriggerElement = null;

let scrollLockCount = 0;
let lockedScrollPosition = 0;

function lockPageScroll() {
  if (scrollLockCount === 0) {
    lockedScrollPosition = window.scrollY;
    document.body.style.top = `-${lockedScrollPosition}px`;
    document.body.classList.add("scroll-locked");
  }
  scrollLockCount += 1;
}

function unlockPageScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount > 0) return;

  document.body.classList.remove("scroll-locked");
  document.body.style.top = "";

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, lockedScrollPosition);
  root.style.scrollBehavior = previousScrollBehavior;
}

function buildWhatsAppUrl(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number.length < 8) {
    throw new Error("Nomor WhatsApp belum diatur dengan benar.");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildPackageMessage(pkg) {
  return `Halo LinkTrai! Saya tertarik memesan paket ${pkg.name} dengan harga ${pkg.messagePrice}.\n\nSaya ingin mengetahui lebih lanjut mengenai proses pemesanan dan kebutuhan website saya.\n\nApakah bisa dibantu untuk konsultasi lebih lanjut?`;
}

function openWhatsAppModal(message) {
  if (whatsappModal.classList.contains("is-open")) return;

  pendingMessage = message;
  previouslyFocusedElement = document.activeElement;
  messagePreview.textContent = message;
  whatsappModal.classList.add("is-open");
  whatsappModal.setAttribute("aria-hidden", "false");
  lockPageScroll();
  confirmWhatsAppButton.focus({ preventScroll: true });
}

function closeWhatsAppModal() {
  if (!whatsappModal.classList.contains("is-open")) return;

  whatsappModal.classList.remove("is-open");
  unlockPageScroll();
  pendingMessage = "";

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
    previouslyFocusedElement.focus({ preventScroll: true });
  }
  previouslyFocusedElement = null;
  whatsappModal.setAttribute("aria-hidden", "true");
}

function createStatusBadge(status) {
  const badge = document.createElement("span");
  badge.className = `status-badge status-${status}`;

  const dot = document.createElement("span");
  dot.className = "status-dot";
  dot.setAttribute("aria-hidden", "true");

  badge.append(dot, document.createTextNode(statusLabels[status] || statusLabels.confirm));
  return badge;
}

function renderPackageDetails(packageKey) {
  const pkg = packageDetails[packageKey];
  if (!pkg) return;

  packageTitle.textContent = pkg.name;
  packageDescription.textContent = pkg.description;
  packagePrice.textContent = pkg.price;
  packageTimeline.textContent = pkg.timeline;

  packageSpecs.replaceChildren();
  pkg.specs.forEach((spec) => {
    const row = document.createElement("div");
    row.className = "package-spec";

    const label = document.createElement("dt");
    label.className = "package-spec-label";
    label.textContent = spec.label;

    const content = document.createElement("dd");
    content.className = "package-spec-content";
    content.append(createStatusBadge(spec.status));

    const detail = document.createElement("p");
    detail.textContent = spec.detail;
    content.append(detail);

    row.append(label, content);
    packageSpecs.append(row);
  });

  packageFeatures.replaceChildren();
  pkg.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    packageFeatures.append(item);
  });
}

function openPackageModal(packageKey, trigger) {
  if (!packageDetails[packageKey]) return;

  const isAlreadyOpen = packageModal.classList.contains("is-open");
  renderPackageDetails(packageKey);
  activePackageKey = packageKey;
  packageTriggerElement = trigger || document.activeElement;

  packageModal.classList.add("is-open");
  packageModal.setAttribute("aria-hidden", "false");

  if (!isAlreadyOpen) {
    lockPageScroll();
  }

  packageDialog.focus({ preventScroll: true });
}

function closePackageModal() {
  if (!packageModal.classList.contains("is-open")) return;

  packageModal.classList.remove("is-open");
  unlockPageScroll();
  activePackageKey = null;

  if (packageTriggerElement && typeof packageTriggerElement.focus === "function") {
    packageTriggerElement.focus({ preventScroll: true });
  }
  packageTriggerElement = null;
  packageModal.setAttribute("aria-hidden", "true");
}

function getPackageFocusableElements() {
  return Array.from(
    packageDialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

document.querySelectorAll(".package-detail-button").forEach((button) => {
  button.addEventListener("click", () => {
    openPackageModal(button.dataset.package, button);
  });
});

packageModal.querySelectorAll("[data-close-package-modal]").forEach((element) => {
  element.addEventListener("click", closePackageModal);
});

packageOrderButton.addEventListener("click", () => {
  const pkg = activePackageKey ? packageDetails[activePackageKey] : null;
  if (!pkg) return;

  try {
    const whatsappUrl = buildWhatsAppUrl(buildPackageMessage(pkg));
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    closePackageModal();
  } catch (error) {
    window.alert(error.message);
  }
});

consultButton.addEventListener("click", () => {
  openWhatsAppModal("Halo LinkTrai, saya ingin konsultasi tentang jasa pembuatan landing page. Mohon info lebih lanjut.");
});

confirmWhatsAppButton.addEventListener("click", () => {
  if (!pendingMessage) return;

  try {
    const whatsappUrl = buildWhatsAppUrl(pendingMessage);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    closeWhatsAppModal();
  } catch (error) {
    window.alert(error.message);
  }
});

whatsappModal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeWhatsAppModal);
});

document.addEventListener("keydown", (event) => {
  if (packageModal.classList.contains("is-open")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePackageModal();
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = getPackageFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        packageDialog.focus({ preventScroll: true });
        return;
      }

      if (!packageDialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === packageDialog) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
    return;
  }

  if (event.key === "Escape" && whatsappModal.classList.contains("is-open")) {
    closeWhatsAppModal();
  }
});

const portfolioGrid = document.getElementById("portfolio-grid");
const portfolioToggle = document.getElementById("portfolio-toggle");
const portfolioToggleLabel = portfolioToggle
  ? portfolioToggle.querySelector(".portfolio-toggle-label")
  : null;
const PORTFOLIO_INITIAL_COUNT = 4;

if (portfolioGrid && portfolioToggle && portfolioToggleLabel) {
  const portfolioItems = Array.from(portfolioGrid.querySelectorAll(".portfolio-item"));
  const hasAdditionalPortfolio = portfolioItems.length > PORTFOLIO_INITIAL_COUNT;

  if (hasAdditionalPortfolio) {
    portfolioToggle.hidden = false;

    portfolioToggle.addEventListener("click", () => {
      const isExpanded = portfolioGrid.classList.toggle("is-expanded");
      portfolioToggle.setAttribute("aria-expanded", String(isExpanded));
      portfolioToggleLabel.textContent = isExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua";

      if (!isExpanded) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        requestAnimationFrame(() => {
          portfolioToggle.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "nearest"
          });
        });
      }
    });
  }
}

const navbar = document.querySelector(".navbar");
const navLinksContainer = document.querySelector(".nav-links");
const navIndicator = navLinksContainer
  ? navLinksContainer.querySelector(".nav-indicator")
  : null;
const navSectionLinks = navLinksContainer
  ? Array.from(navLinksContainer.querySelectorAll('a[href^="#"]:not(.btn)'))
      .map((link) => {
        const section = document.querySelector(link.getAttribute("href"));
        return section ? { link, section } : null;
      })
      .filter(Boolean)
  : [];

if (navbar && navLinksContainer && navIndicator && navSectionLinks.length) {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeNavLink = null;
  let navUpdateFrame = 0;
  let navResizeTimer = 0;

  function getNavActivationLine() {
    const navbarHeight = navbar.getBoundingClientRect().height;
    const scrollPadding =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return Math.max(navbarHeight, scrollPadding) + 8;
  }

  function positionNavIndicator() {
    if (!activeNavLink) {
      navIndicator.style.opacity = "0";
      return;
    }

    const offsetTop = activeNavLink.offsetTop + activeNavLink.offsetHeight + 4;
    navIndicator.style.transform = `translate3d(${activeNavLink.offsetLeft}px, ${offsetTop}px, 0) scaleX(${activeNavLink.offsetWidth})`;
    navIndicator.style.opacity = "1";
  }

  function ensureActiveNavLinkVisible(link) {
    if (navLinksContainer.scrollWidth <= navLinksContainer.clientWidth + 1) return;

    const padding = 24;
    const linkLeft = link.offsetLeft;
    const linkRight = linkLeft + link.offsetWidth;
    const visibleLeft = navLinksContainer.scrollLeft;
    const visibleRight = visibleLeft + navLinksContainer.clientWidth;

    if (linkLeft < visibleLeft || linkRight > visibleRight) {
      navLinksContainer.scrollTo({
        left: Math.max(0, linkLeft - padding),
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    }
  }

  function setActiveNavLink(link) {
    if (!link || link === activeNavLink) return;

    if (activeNavLink) activeNavLink.removeAttribute("aria-current");
    activeNavLink = link;
    activeNavLink.setAttribute("aria-current", "location");
    positionNavIndicator();
    ensureActiveNavLinkVisible(activeNavLink);
  }

  function updateActiveNav() {
    const activationLine = getNavActivationLine();
    let current = navSectionLinks[0];

    navSectionLinks.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= activationLine) {
        current = item;
      }
    });

    setActiveNavLink(current.link);
  }

  function requestNavUpdate() {
    if (navUpdateFrame) return;
    navUpdateFrame = requestAnimationFrame(() => {
      navUpdateFrame = 0;
      updateActiveNav();
    });
  }

  window.addEventListener("scroll", requestNavUpdate, { passive: true });

  window.addEventListener("resize", () => {
    window.clearTimeout(navResizeTimer);
    navResizeTimer = window.setTimeout(() => {
      updateActiveNav();
      positionNavIndicator();
    }, 120);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionNavIndicator);
  }

  updateActiveNav();
  positionNavIndicator();
}

const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
