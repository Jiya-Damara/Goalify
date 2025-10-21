// Toast Notification Class
class ToastNotification {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById("toast-container")) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById("toast-container");
    }
  }

  show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");

    const icon = this.getIcon(type);

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${this.escapeHtml(message)}</span>
        <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
      </div>
    `;
    this.container.appendChild(toast);

    setTimeout(() => toast.classList.add("toast-show"), 10);

    const closeButton = toast.querySelector(".toast-close");
    closeButton.addEventListener("click", () => this.hide(toast));

    if (duration > 0) {
      setTimeout(() => this.hide(toast), duration);
    }

    return toast;
  }

  hide(toast) {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons.info;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }
}

const toast = new ToastNotification();

// Animation
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Eye Toggle Icon
function setupPasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggleIcon = document.getElementById(toggleId);

  toggleIcon.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleIcon.classList.toggle("bx-show", !isHidden);
    toggleIcon.classList.toggle("bx-hide", isHidden);
  });
}

setupPasswordToggle("login-password", "toggle-login-password");
setupPasswordToggle("register-password", "toggle-register-password");

// Validation state storage
const validationErrors = {};

function getStoredUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document
    .getElementById("register-confirm-password")
    .value.trim();

  // Validation
  if (!isValidUsername(username)) {
    toast.error("Invalid username. Use 3–25 letters, numbers, or underscores.");
    return;
  }

  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

  if (!isValidPassword(password)) {
    toast.error(
      "Weak password! Must include uppercase, lowercase, number & special character."
    );
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match. Please recheck.");
    return;
  }

  // Check if user already exists
  let users = getStoredUsers();
  if (users.some((u) => u.email === email)) {
    toast.error("This email is already registered.");
    return;
  }

  users.push({ username, email, password });
  saveUsers(users);

  toast.success("Registration successful! You can now log in.", 4000);

  // Clear form
  document.getElementById("register-username").value = "";
  document.getElementById("register-email").value = "";
  document.getElementById("register-password").value = "";
  document.getElementById("register-confirm-password").value = "";

  // Switch to login
  setTimeout(() => container.classList.remove("active"), 1500);
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    toast.warning("Please enter both email and password.");
    return;
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    toast.error("Invalid email or password.");
    return;
  }

  localStorage.setItem("signedInUser", user.username);
  localStorage.setItem("userEmail", user.email);

  toast.success(`👋 Welcome back, ${user.username}!`, 2000);

  setTimeout(() => (window.location.href = "dashboard.html"), 1000);
}

// Validation Functions
function isValidUsername(username) {
  const usernamePattern = /^[A-Za-z0-9_]{3,25}$/;
  return usernamePattern.test(username);
}

function isValidEmail(email) {
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailPattern.test(email);
}

function isValidPassword(password) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$#%*?&^!])[A-Za-z0-9@$#%*?&^!]{8,30}$/;
  return passwordPattern.test(password);
}

// Forgot Password Modal
const forgotLink = document.querySelector(".forgot-link a");
const modal = document.getElementById("forgot-modal");
const closeModal = document.getElementById("close-modal");
const resetBtn = document.getElementById("reset-password-btn");

forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  document.getElementById("forgot-email").value = "";
  document.getElementById("new-password").value = "";
  clearErrors();
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  clearErrors();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    clearErrors();
  }
});

resetBtn.addEventListener("click", () => {
  const email = document.getElementById("forgot-email").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();
  const users = getStoredUsers();

  clearError("forgot-error");

  if (!email) {
    showError("forgot-error", "Please enter your email address.");
    return;
  }

  if (!isValidEmail(email)) {
    showError("forgot-error", "Please enter a valid email address.");
    return;
  }

  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) {
    showError("forgot-error", "Email not found. Please register first.");
    toast.error("Email not found in our records.");
    return;
  }

  if (!newPassword) {
    showError("forgot-error", "Please enter a new password.");
    return;
  }

  if (!isValidPassword(newPassword)) {
    showError(
      "forgot-error",
      "Password must be 8+ chars with uppercase, lowercase, number & special char."
    );
    return;
  }

  users[userIndex].password = newPassword;
  saveUsers(users);

  toast.success("Password reset successful! You can now log in.", 4000);
  modal.style.display = "none";

  // Switch to login form
  container.classList.remove("active");
});

// ESC key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") {
    modal.style.display = "none";
    clearErrors();
  }
});
