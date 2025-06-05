const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "editusuario.html"));
});



// Caminho para o JSON
const DB_PATH = path.join(__dirname, "..","..","db", "dbusuarios.json");


// GET /usuarios/:id
app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const usuario = db.usuarios.find(u => parseInt(u.id) === id);
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
  const index = db.usuarios.findIndex(u => parseInt(u.id) === id);

if (index !== -1) {
  db.usuarios[index] = { ...db.usuarios[index], ...dadosNovos, id }; // preserva ID original
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  res.json({ success: true });
}

});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// DELETE /usuarios/:id
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const index = db.usuarios.findIndex(u => u.id === id);

  if (index !== -1) {
    db.usuarios.splice(index, 1); // remove 1 usuário do array
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
});
