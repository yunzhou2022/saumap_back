const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./config/express");

mongoose.connect(config.mongo.host);
const db = mongoose.connection;
db.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

const { port } = config;

app.listen(port, () => console.log(`saumap app listening on port ${port}!`));

module.exports = app;
