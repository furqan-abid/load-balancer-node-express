const axios = require("axios");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { servers } = require("../config/servers");
const fs = require("fs");
const https = require("https");
const router = express.Router();
const options = new https.Agent({
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
  rejectUnauthorized: false,
});
const proxyOptions = {
  target: "",
  changeOrigin: true,
  onProxyReq: (ProxyReq, req) => {
    ProxyReq.setHeader("X-Special-Proxy-Header", "foobar");
  },
  logLevel: "debug",
};

let healthyServers = [];
let totals = [];
const COOKIE_NAME = "lb-affinity";

function intiWeights() {
  totals = [];

  let runningTotal = 0;

  for (let i = 0; i < healthyServers.length; i++) {
    runningTotal += healthyServers[i].weight;
    totals.push(runningTotal);
  }
}

function getServer() {
  const random =
    Math.floor(Math.random() * totals[healthyServers.length - 1]) + 1;
  for (let i = 0; i < totals.length; i++) {
    if (random <= totals[i]) {
      return servers[i];
    }
  }
}

router.all("*", (req, res) => {
  if (healthyServers.length === 0) {
    return res.status(500).send("No healthy servers!");
  }

  let server = getServer();

  console.log(req.cookies[COOKIE_NAME]);
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, server.id , {
      httpOnly: true,
    });
  } else {
    const affinityId = req.cookies[COOKIE_NAME];
    server = servers.find(
      (s) => s.id == affinityId && healthyServers.find((hs)=>hs.id ==s.id)
    ); 
    if (!server) {
      server = getServer()
        res.cookie(COOKIE_NAME, server.id, {
          httpOnly: true,
        });
    }
  }

  const target = `http://${server.host}:${server.port}`;
  proxyOptions.target = target;
  createProxyMiddleware(proxyOptions)(req, res);
});

async function healthCheck() {
  try {
    const response = await axios.get("https://localhost:443/health", {
      httpsAgent: options,
    });
    healthyServers = response.data.results.filter(
      (result) => result.status === "passing"
    );
    console.log(healthyServers);
  } catch (error) {
    healthyServers = [];
  }
}

healthCheck();
intiWeights();
setInterval(healthCheck, 10000);
setInterval(intiWeights, 10000);

module.exports = router;
