const express = require("express");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const router = require("../index.route");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compress());
app.use(methodOverride());
app.use(cors());
app.use(helmet());

app.use("/static", express.static(path.join(__dirname, "../public")));
app.use("/api", router);

module.exports = app;
