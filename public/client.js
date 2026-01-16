
const socket = new WebSocket(`ws://localhost:4000`);

socket.addEventListener("open", (event) => {
	console.log("Message from server: Connection established!");
});

socket.addEventListener("message", (event) => {
	console.log(`Message from server: ${event}`);
  reloadMessage();
});

socket.addEventListener("error", (event) => {
	console.error("Message from server: Connection error!");
});

socket.addEventListener("close", (event) => {
	console.log("Message from server: Connection closed.");
});

function reloadMessage() {
	const messages = document.getElementById("messages");
  if (messages) {
    window.location.href = "/";
  }

}

function sendMessage() {
	socket.send(message);
}
