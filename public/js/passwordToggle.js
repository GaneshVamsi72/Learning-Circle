// PASSWORD TOGGLE SCRIPT
const toggle = document.getElementById("togglePassword");
const password = document.getElementById("password");

toggle.addEventListener("touchstart", togglePassword);
toggle.addEventListener("click", togglePassword);

function togglePassword(e) {
  e.preventDefault();

  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    toggle.textContent = "🙈";
  } else {
    password.setAttribute("type", "password");
    toggle.textContent = "👁️";
  }
}