function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.src = "assets/icon/eye-off-icon.svg";
  } else {
    passwordInput.type = "password";
    eyeIcon.src = "assets/icon/eye-icon.svg";
  }
}

const usuarios = [
  { usuario: "admin", senha: "1234" },
  { usuario: "luiz", senha: "abcd" }
];

document.querySelector(".login-btn").addEventListener("click", function () {
  const inputUsuario = document.querySelector('input[placeholder="Usuário"]').value.trim();
  const inputSenha = document.getElementById("password").value;

  const usuarioValido = usuarios.find(
    (u) => u.usuario === inputUsuario && u.senha === inputSenha
  );

  setTimeout(() => {
    let alertHTML = "";

    if (usuarioValido) {
      alertHTML = `
        <div class="alert alert-warning" role="alert">
          Você está sendo redirecionado para a página inicial!
        </div>
        <div class="alert alert-success" role="alert">
          Login realizado com sucesso. Caso queira ir para a tela de cadastro,
          <a href="codigo/HenriquePereira/cadastrousuario.html" class="alert-link">clique aqui.</a>
        </div>
      `;
    } else {
      alertHTML = `
        <div class="alert alert-danger" role="alert">
          Usuário ou senha incorretos. Por favor, tente novamente.
        </div>

      `;
    }

    document.getElementById("alert-container").innerHTML = alertHTML;
  }, 1500);
});

document.querySelector(".forgot").addEventListener("click", function () {
  setTimeout(() => {
    const alertHTML = `

        <div class="alert alert-warning" role="alert">
            Você receberá um e-mail para redefinir sua senha.
            Caso queira reenviar o e-mail,
        <a href="codigo/HenriquePereira/cadastrousuario.html" class="alert-link">clique aqui.</a>
      </div>
    `;
    document.getElementById("alert-container").innerHTML = alertHTML;
  }, 1500);
});

