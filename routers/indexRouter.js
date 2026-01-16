const { getMessages } = require("../database/db.js");


module.exports = function configure(app) {
	app
		.get("/", async (req, res) => {
			const message = await getMessages();
			res.render("index", {messages: message });
		})
		.use("/details", require("./inspectRouter.js"))
		.use("/new", require("./formRouter.js"))
		.use((error, req, res, next) => {
			console.error(error.stack);
			switch (error.message) {
				case "Not Found":
					res.render("notFound");
					return;
			}
			res.render("error");
		});
};
