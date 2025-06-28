const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const server = express();
const middlewares = jsonServer.defaults();

const router = jsonServer.router({}); 

server.use(express.static(path.join(__dirname, 'public')));

server.use('/paginas', express.static(path.join(__dirname, 'public/paginas')));

server.use('/assets', express.static(path.join(__dirname, 'public/assets')));

server.use('/service', express.static(path.join(__dirname, 'public/service')));

server.use(middlewares);
server.use(router); 

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`- Páginas: http://localhost:${PORT}/paginas/nome-da-pagina.html`);
  console.log(`- Assets: http://localhost:${PORT}/assets/js/cadastro.js`);
  console.log(`- Service: http://localhost:${PORT}/service/blocos-service.js`);
});