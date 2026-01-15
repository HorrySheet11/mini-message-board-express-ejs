const express = require("express");
const router = express.Router();

const { getMessage } = require("../database/db.js");

router
  .get("/", async (req, res) => {
    res.render("inspectMessage", {
      message: await getMessage(req.query.id),
    });
  });

module.exports = router;
