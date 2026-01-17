const path = require("node:path");
const express = require("express");
const http = require("node:http");
const { Server } = require("socket.io");
const configure = require("./routers/indexRouter");
const { getMessages } = require("./database/db.js");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
configure(app);
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
	// 	cors: {
	// 		origin:
	// 			process.env.NODE_ENV === "production"
	// 				? false
	// 				: ["http://localhost:5500", "http://127.0.0.1:5500"],
	// 	},
});

io.on("connection", (socket) => {
	console.log("Client connected");
	socket.on("disconnect", () => {
		console.log("Connection closed");
	});
	socket.on("error", (error) => {
		console.log(error);
	});
	socket.on("unauthorized", (err) => {
		console.log("There was an error with the authentication:", err.message);
	});
	socket.on("message", async (message) => {
		const messages = await getMessages();
		socket.broadcast(messages);
	});
});

io.use((socket, next) => {
	if (!socket.request.headers.BadAuth) {
		next(new Error("Authentication failed"));
		return;
	}
	next();
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});