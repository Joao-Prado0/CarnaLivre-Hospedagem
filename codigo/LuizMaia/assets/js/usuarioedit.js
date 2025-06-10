let usuarioId;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  usuarioId = parseInt(urlParams.get("id")); // Agora modifica a global

  if (!usuarioId) {
    alert("Usuário não identificado!");
    return;
  }

  // Carregar dados
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
    if (!res.ok) throw new Error("Erro ao carregar");
    
    const usuario = await res.json();
    document.getElementById('nome_completo').value = usuario.nome_completo;
    document.getElementById('login').value = usuario.login;
    document.getElementById('email').value = usuario.email;
    document.getElementById('data_nasc').value = usuario.data_nasc;
    document.getElementById('senha').value = usuario.senha;
    // Não preencher senha por segurança
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao carregar dados");
  }

  // Salvar dados
  document.getElementById('form-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    
const dadosAtualizados = {
  id: usuarioId, // <-- ESSENCIAL
  nome_completo: document.getElementById('nome_completo').value,
  login: document.getElementById('login').value,
  email: document.getElementById('email').value,
  data_nasc: document.getElementById('data_nasc').value,
  senha: document.getElementById('senha').value
};


    try {
      const res = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      
      if (res.ok) {
        const notificacao = document.getElementById('notificacao');
notificacao.classList.add('visivel');
setTimeout(() => {
  notificacao.classList.remove('visivel');
}, 3000);

      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao salvar dados");
    }
  });
});
document.getElementById('toggle-password').addEventListener('click', function() {
  const senhaInput = document.getElementById('senha');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');
  
  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    eyeIcon.style.display = 'none';
    eyeOffIcon.style.display = 'block';
  } else {
    senhaInput.type = 'password';
    eyeIcon.style.display = 'block';
    eyeOffIcon.style.display = 'none';
  }
});

document.getElementById('btn-excluir').addEventListener('click', async () => {
  const confirmacao = confirm("Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.");
  if (!confirmacao) return;

  try {
    const res = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert("Conta excluída com sucesso!");
      localStorage.removeItem('usuarioId'); // limpar o id após exclusão
      // Redirecionar para página inicial ou de login
      window.location.href = "../LucasFranco/login.html";
    } else {
      throw new Error("Erro ao excluir conta");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir conta");
  }
});


