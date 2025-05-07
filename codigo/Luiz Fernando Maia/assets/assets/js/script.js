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

document.querySelector(".login-btn").addEventListener("click", function () {
  setTimeout(() => {
    const alertHTML = `
      
            <div class="alert alert-warning" role="alert">
         Você esta sendo redirecionado para pagina Inicial!
      </div>
      <div class="alert alert-success" role="alert">
        Login realizado com sucesso.Caso queira ir para tela de cadastro <a href="codigo/HenriquePereira/cadastrousuario.html" class="alert-link">Clique aqui.</a>.
      </div>

    `;


    document.getElementById("alert-container").innerHTML = alertHTML;
  }, 1500);
});

document.querySelector(".forgot").addEventListener("click", function () {
  setTimeout(() => {
    const alertHTML = `
      
      
      <div class="alert alert-success" role="alert">
        Você recebera um e-mail pedindo a confirmação da senha.Caso queira reenviar o e-mail <a href="codigo/HenriquePereira/cadastrousuario.html" class="alert-link">Clique aqui.</a>.
      </div>
    `;

    document.getElementById("alert-container").innerHTML = alertHTML;
  }, 1500);
});


