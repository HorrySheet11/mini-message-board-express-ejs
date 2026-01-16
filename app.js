const path = require("node:path");
const express = require("express");
const http = require("node:http");
const {WebSocketServer, WebSocket} = require("ws");
const configure = require("./routers/indexRouter");

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

const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

const webSServer = http.createServer(app);

const wss = new WebSocketServer({ noServer : true });

server.on('upgrade', (req, socket, head) => {
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
  ws.on('error', onSocketPostError);
  ws.on('message', async (msg, isBinary) => {
    // Instead of sending the message to all clients, refresh the index by calling '/' for each client
    // if (msg === '/') {
      // Call the '/' route to refresh the index for the current client
      // app.get('/', async (req, res) => {
        const message = await getMessages();
        ws.send(message);
        // res.render("index", { title: "Mini Messageboard", messages: message });
      // })(req, res);
    // } else {
      // Handle other messages
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    // }
  });
    ws.on('close', () => {
        console.log('Connection closed');
    });
});
