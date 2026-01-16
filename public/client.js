
let ws = null;

function closeConnection() {
	if (ws) {
		ws.close();
	}
}

function reloadMessage() {
	const messages = document.getElementById("messages");
	if (messages) {
		window.location.href = "/";
	}
}

function sendMessage() {
	socket.send(message);
}

closeConnection();

const isLocalhost = window.location.hostname === "localhost" ? "ws://localhost:3000" : 'wss://mini-message-board-express-ejs.onrender.com:10000';

const socket = new WebSocket(`${isLocalhost}`);

socket.addEventListener("open", (event) => {
	console.log("Client: Connection established!");
});

socket.addEventListener("message", (event) => {
	console.log(`Client: ${event}`);
	reloadMessage();
});

socket.addEventListener("error", (event) => {
	console.error("Client: Connection error!");
});

socket.addEventListener("close", (event) => {
	console.log("Client: Connection closed.");
});


