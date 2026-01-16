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

const hostName = window.location.hostname === "localhost" ? "ws://localhost:3000" : 'wss://mini-message-board-express-ejs.onrender.com/ws';

const socket = new WebSocket(`${hostName}`);

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


