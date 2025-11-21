// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const osc = require('osc');

// ---- Servidor HTTP para entregar index.html ----
const server = http.createServer((req, res) => {
  let filePath = 'public' + (req.url === '/' ? '/index.html' : req.url);
  const ext = path.extname(filePath);

  const contentType =
    ext === '.js' ? 'text/javascript' :
    ext === '.html' ? 'text/html' :
    'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// ---- WebSocket ----
const wss = new WebSocket.Server({ server });

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// ---- Servidor OSC ----
// Ajusta el puerto/host según lo que esté enviando Strudel
const oscPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 57120, // por ejemplo
});

oscPort.on('ready', () => {
  console.log('OSC escuchando en 127.0.0.1:57120');
});

oscPort.on('message', msg => {
  // msg.address podría ser "/dirt/play"
  // msg.args podría traer pares clave/valor: ["s", "bd", "n", 0, ...]
  //console.log('OSC message', msg);

  // Heurística simple: si uno de los argumentos es la cadena "bd"
  const hasBd = msg.args.some(a => a === 'bd');

  if (hasBd) {
    broadcast({ type: 'bd' });
  }
});

oscPort.open();

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
