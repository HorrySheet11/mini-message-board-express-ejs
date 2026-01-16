const path = require("node:path");
const express = require("express");
const { createServer } = require('http')
const {WebSocketServer, WebSocket} = require("ws");
const configure = require("./routers/indexRouter");
const { getMessages } = require("./database/db.js");


const app = express();
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
configure(app);
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath))


function onSocketPreError(e) {
    console.log(e);
}

function onSocketPostError(e) {
    console.log(e);
}

const port = process.env.PORT || 4000;
module.exports = port;
const s = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/ws'  });

s.on('upgrade', (req, socket, head) => {
    socket.on('error', onSocketPreError);

    // perform auth
    if (!req.headers.BadAuth) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });
});

wss.on('connection', (ws, req) => {
	console.log('Client connected');
  ws.on('error', onSocketPostError);
  ws.on('message', async (msg, isBinary) => {
      wss.clients.forEach(async (client) => {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					const message = await getMessages();
          client.send(message);
        }
      });
  });
    ws.on('close', () => {
        console.log('Connection closed');
    });
});
