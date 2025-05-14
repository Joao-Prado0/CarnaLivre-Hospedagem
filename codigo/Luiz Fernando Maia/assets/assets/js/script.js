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

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}
