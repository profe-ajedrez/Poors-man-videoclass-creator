"use strict";

const express = require("express");
const app = express();
const config = require("./config/config");
const mongoose = require("mongoose");
const { logger, logError, logRequest } = require("./helpers/logger");
const appSubscribers = require("./subscribers/index");
const cors = require("cors");
const passport = require("passport");

const usersRouter = require("./routes/users");

appSubscribers.register(app);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/users", usersRouter);

app.use(cors());

app.use(async (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => logRequest);

app.use(passport.initialize());
app.use(passport.session());

let conn;

try {
  conn = (async () => {
    return await mongoose.connect(config.host, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  })();

  app.online = true;
  app.emit("dbConnected");
} catch (error) {
  logger.error(error);
  app.emit("dbConnectionError", error);
  app.online = false;
  return error;
}

app
  .listen(config.port, () => {
    app.emit("serverRunning");
  })
  .on("error", (err) => {
    logError(err);
  });

module.exports = { app, express };
