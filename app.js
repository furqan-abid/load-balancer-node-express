const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200,
    })
  );

  app.use(morgan("dev"));

  return app
}

const app = createApp()
const app1 = createApp()
const app2 = createApp()

module.exports ={ app,app1,app2};
