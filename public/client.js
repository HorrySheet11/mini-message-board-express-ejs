const hostName =
	window.location.hostname === "localhost"
		? "ws://localhost:4000"
		: "wss://mini-message-board-express-ejs.onrender.com";

const socket = io(hostName);

function reloadMessage() {
	const messages = document.getElementById("messages");
	if (messages) {
		window.location.href = "/";
	}
}

function handleErrors(err) {
	console.log(err);
}

function sendMessage() {
	socket.emit("message", message);
}

socket.on("connection", (socket) => {
	console.log("Client: Connection established!");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

socket.on("message", (msg) => {
	console.log(`Client: ${msg}`);
	reloadMessage();
});

socket.on("connect_error", (err) => {
	console.log("connect_error");
	handleErrors(err);
});
socket.on("connect_failed", (err) => {
	console.log("connect_failed");
	handleErrors(err);
});
