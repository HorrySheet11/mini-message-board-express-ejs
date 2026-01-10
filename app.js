const path = require("path");

const express = require("express");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.js;
const messages = [
	{
		text: "Hi there!",
		user: "Amando",
		added: new Date(),
	},
	{
		text: "Hello World!",
		user: "Charles",
		added: new Date(),
	},
];

app.get("/", (req, res) => {
	res.render("index", { title: "Mini Messageboard", messages: messages });
});

app.get("/new", (req, res) => {
	res.render("form");
});

app.get("/details", (req, res) => {
  res.render("inspectMessage", {
    message: messages[req.query.id],
  });
})

app.use(express.urlencoded({ extended: true }));

app.post("/new", (req, res) => {
	messages.push({
		text: req.body.message,
		user: req.body.name,
		added: new Date(),
	});
	res.redirect("/");
});

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.listen(3000);
