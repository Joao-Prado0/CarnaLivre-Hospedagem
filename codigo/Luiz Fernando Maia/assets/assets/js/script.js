function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.src ="assets/icon/eye-off-icon.svg" ; 
  } else {
    passwordInput.type = "password";
    eyeIcon.src = "assets/icon/eye-icon.svg" ; 
  }
}
