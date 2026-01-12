const path = require("node:path");

const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const {createMessage, getMessage, getMessages}  = require("./database/db.js");


let message  = [];

app.get("/", async ( req, res) => {
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
	const {name, message} = req.body;
	await createMessage(name, message);
	res.status(201).redirect("/");
});

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
