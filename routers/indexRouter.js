const { getMessages } = require("../database/db.js");
let message = [];
module.exports = function configure(app) {
	app
		.get("/", async (req, res) => {
			message = await getMessages();
			res.render("index", { title: "Mini Messageboard", messages: message });
		})
		.use("/details", require("./inspectRouter.js"))
		.use("/form", require("./formRouter.js"));
};
