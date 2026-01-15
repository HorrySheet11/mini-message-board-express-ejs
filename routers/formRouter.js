const express = require("express");
const router = express.Router();

const { createMessage } = require("../database/db.js");

router
	.get("/", async (req, res) => {
		res.render("form");
	})
	.post("/", async (req, res) => {
		const { name, message } = req.body;
		await createMessage(name, message);
		res.status(201).redirect("/");
	});

module.exports = router;
