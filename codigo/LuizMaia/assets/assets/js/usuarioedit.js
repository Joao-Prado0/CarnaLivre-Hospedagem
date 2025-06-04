document.addEventListener("DOMContentLoaded", async function () {
  // Pega o ID do usuário da URL (?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioId = parseInt(urlParams.get("id"));

  if (!usuarioId) {
    alert("Usuário não identificado!");
    return;
  }

  try {
    const res = await fetch(`/usuarios/${usuarioId}`);
    const usuario = await res.json();

    if (usuario) {
      document.querySelector('input[name="nome_completo"]').value = usuario.nome_completo;
      document.querySelector('input[name="login"]').value = usuario.login;
      document.querySelector('input[name="email"]').value = usuario.email;
      document.querySelector('input[name="data_nasc"]').value = usuario.data_nasc;
      document.querySelector('input[name="senha"]').value = usuario.senha;
    }
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err);
  }

  document.querySelector("button").addEventListener("click", async function () {
    const dadosAtualizados = {
      id: usuarioId,
      nome_completo: document.querySelector('input[name="nome_completo"]').value,
      login: document.querySelector('input[name="login"]').value,
      email: document.querySelector('input[name="email"]').value,
      data_nasc: document.querySelector('input[name="data_nasc"]').value,
      senha: document.querySelector('input[name="senha"]').value
    };

    try {
      const response = await fetch(`/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
      });

      if (response.ok) {
        alert("Dados atualizados com sucesso!");
      } else {
        alert("Erro ao salvar dados.");
      }
    } catch (err) {
      console.error("Erro ao enviar atualização:", err);
    }
  });
});


//backend==============================================================================================================================================================


const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // se quiser servir coisas estáticas

// Caminho para o JSON
const DB_PATH = path.join(__dirname, "db", "dbusuarios.json");

// GET /usuarios/:id
app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const usuario = db.usuarios.find(u => u.id === id);

  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// PUT /usuarios/:id
app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const dadosNovos = req.body;

  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const index = db.usuarios.findIndex(u => u.id === id);

  if (index !== -1) {
    db.usuarios[index] = dadosNovos;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
