const path = require("node:path");
const WebSocket = require("ws");
const http = require("node:http");
const express = require("express");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const { createMessage, getMessage, getMessages } = require("./database/db.js");
let message = [];

app.get("/", async (req, res) => {
	message = await getMessages();
	res.render("index", { title: "Mini Messageboard", messages: message });
});

app.get("/new", (req, res) => {
	res.render("form");
});

app.get("/details", async (req, res) => {
	res.render("inspectMessage", {
		message: await getMessage(req.query.id),
	});
});

app.use(express.urlencoded({ extended: true }));

app.post("/new", async (req, res) => {
	const { name, message } = req.body;
	await createMessage(name, message);
	res.status(201).redirect("/");
});

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const port = process.env.PORT || 4000;

app.use((err, req, res, next) => {
	console.error(err.stack); // Log the error stack for debugging
	res.status(err.status || 500).render("error"); // Send a generic response
});

const serve = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocket.Server({ server : serve });

wss.on("connection", (ws) => {
	console.log("Client connected");

	ws.on("message", (message,res) => {
		console.log(`Received: ${message}`);
		res.render("/");
		ws.send(`Server received: ${message}`);
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});

