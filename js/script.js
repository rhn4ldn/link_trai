const WHATSAPP_NUMBER = "6289691321070";

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}

const packageMessages = {
  Starter: "Halo LinkTrai, saya tertarik dengan Paket Starter (Rp 75.000). Mohon info lebih lanjut.",
  Bisnis: "Halo LinkTrai, saya tertarik dengan Paket Bisnis (Rp 125.000). Mohon info lebih lanjut.",
  Premium: "Halo LinkTrai, saya tertarik dengan Paket Premium (Rp 200.000). Mohon info lebih lanjut.",
  Pro: "Halo LinkTrai, saya tertarik dengan Paket Pro (mulai Rp 300.000). Saya ingin konsultasi kebutuhan website saya."
};

const modal = document.getElementById("whatsapp-modal");
const messagePreview = document.getElementById("message-preview");
const confirmButton = document.getElementById("confirm-whatsapp");
const consultButton = document.getElementById("consult-button");
let pendingMessage = "";
let previouslyFocusedElement = null;

function buildWhatsAppUrl(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number.length < 8) {
    throw new Error("Nomor WhatsApp belum diatur dengan benar.");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function openWhatsAppModal(message) {
  pendingMessage = message;
  previouslyFocusedElement = document.activeElement;
  messagePreview.textContent = message;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  confirmButton.focus();
}

function closeWhatsAppModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  pendingMessage = "";
  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
    previouslyFocusedElement.focus();
  }
}

document.querySelectorAll(".package-button").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedPackage = button.dataset.package;
    const message = packageMessages[selectedPackage];

    if (!message) {
      window.alert("Template pesan untuk paket ini belum tersedia.");
      return;
    }
    openWhatsAppModal(message);
  });
});

consultButton.addEventListener("click", () => {
  openWhatsAppModal("Halo LinkTrai, saya ingin konsultasi tentang jasa pembuatan landing page. Mohon info lebih lanjut.");
});

confirmButton.addEventListener("click", () => {
  if (!pendingMessage) return;

  try {
    const whatsappUrl = buildWhatsAppUrl(pendingMessage);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    closeWhatsAppModal();
  } catch (error) {
    window.alert(error.message);
  }
});

modal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeWhatsAppModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeWhatsAppModal();
  }
});

const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
