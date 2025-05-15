const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // para servir o HTML e JS

app.post('/cadastrar', (req, res) => {
    const novoBloco = req.body;

    // Lê o arquivo atual (ou inicia um array vazio se não existir)
    fs.readFile('blocos.json', 'utf8', (err, data) => {
        let blocos = [];
        if (!err && data) {
            blocos = JSON.parse(data);
        }

        // Verifica duplicidade por e-mail ou CNPJ
        const existente = blocos.find(b => b.email === novoBloco.email || b.cnpj === novoBloco.cnpj);
        if (existente) {
            return res.status(400).json({ mensagem: 'Bloco já cadastrado!' });
        }

        blocos.push(novoBloco);

        // Salva de volta no JSON
        fs.writeFile('blocos.json', JSON.stringify(blocos, null, 2), err => {
            if (err) return res.status(500).json({ mensagem: 'Erro ao salvar!' });
            return res.status(200).json({ mensagem: 'Bloco cadastrado com sucesso!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
