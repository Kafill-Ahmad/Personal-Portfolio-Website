// ========== AOS (scroll animations) ==========
if (window.AOS) {
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });
}

// ========== Dark / Light Theme Toggle ==========
const body = document.body;
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
  if (toggleBtn) toggleBtn.textContent = "🌙"; // in light mode, show moon
} else {
  if (toggleBtn) toggleBtn.textContent = "☀️"; // in dark mode, show sun
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");
    toggleBtn.textContent = isLight ? "🌙" : "☀️";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// ========== CONTACT FORM BACKEND CONNECTION ==========
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const subject = document.getElementById("subject")
      ? document.getElementById("subject").value.trim()
      : "";
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in Name, Email and Message.");
      return;
    }

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        contactForm.reset();
      } else {
        alert("Something went wrong: " + (data.message || "Please try again."));
      }
    } catch (err) {
      console.error(err);
      alert("Error: Backend server is not running or unreachable.");
    }
  });
}
