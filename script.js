/* ===== Site configuration: edit these values ===== */
const CONFIG = {
  email: "igbinedionnosakhare127@gmail.com",
  // WhatsApp number in international format, digits only (e.g. "2349079089930").
  // Number the "WhatsApp" contact option on the project form opens (his first phone number).
  whatsappNumber: "2349079089930",
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Mobile navigation */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setOpen(false); } });
    document.addEventListener("click", (e) => { if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
  }

  /* Reveal on scroll */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  /* Portfolio filters */
  const filterBar = document.querySelector(".filters");
  if (filterBar) {
    const works = document.querySelectorAll(".work");
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const f = btn.dataset.filter;
      works.forEach((w) => { w.hidden = !(f === "all" || w.dataset.cat.split(" ").includes(f)); });
    });
  }

  /* Lightbox */
  const lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    const img = lb.querySelector("img");
    const title = lb.querySelector("[data-lb-title]");
    const desc = lb.querySelector("[data-lb-desc]");
    let opener = null;
    document.querySelectorAll(".work button").forEach((b) => {
      b.addEventListener("click", () => {
        opener = b;
        img.src = b.dataset.full;
        img.alt = b.dataset.alt || "";
        title.textContent = b.dataset.title || "";
        desc.textContent = b.dataset.desc || "";
        lb.showModal();
      });
    });
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lb-close")) lb.close(); });
    lb.addEventListener("close", () => { if (opener) opener.focus(); });
  }

  /* Project form: builds a message and opens WhatsApp or the email app */
  const form = document.getElementById("project-form");
  if (form) {
    const status = document.getElementById("form-status");
    const fileInput = document.getElementById("files");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const d = Object.fromEntries(new FormData(form).entries());
      const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
      const text = [
        "New project request",
        "Name: " + d.name,
        "Phone: " + d.phone,
        d.email ? "Email: " + d.email : "",
        "Service: " + d.service,
        d.deadline ? "Needed by: " + d.deadline : "",
        "Details: " + d.details,
        "Preferred contact: " + d.contact,
        hasFile ? "(I have reference files to send.)" : "",
      ].filter(Boolean).join("\n");
      let url, msg;
      if (d.contact === "WhatsApp" && CONFIG.whatsappNumber) {
        url = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
        msg = "Opening WhatsApp with your request. Attach any reference files there.";
      } else {
        url = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Project request: " + d.service) + "&body=" + encodeURIComponent(text);
        msg = "Opening your email app with the request filled in. Attach any reference files before sending.";
      }
      status.textContent = msg;
      status.classList.add("is-visible");
      window.location.href = url;
    });
    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const out = document.getElementById("file-name");
        if (out) out.textContent = fileInput.files.length ? "Selected: " + Array.from(fileInput.files).map((f) => f.name).join(", ") : "";
      });
    }
  }
});
