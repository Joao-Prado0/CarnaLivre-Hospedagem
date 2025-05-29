fetch("http://localhost:3000/usuarios/1")
  .then(res => res.json())
  .then(usuario => {
    document.getElementById("nome").textContent = usuario.nome;
    document.getElementById("dataNascimento").textContent = formatarData(usuario.dataNascimento);
    document.getElementById("email").textContent = usuario.email;
    document.getElementById("senha").setAttribute("data-senha", usuario.senha);
  });

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function mostrarSenha() {
  const spanSenha = document.getElementById("senha");
  const senhaReal = spanSenha.getAttribute("data-senha");
  spanSenha.textContent = senhaReal;
}
