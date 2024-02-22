const axios = require('axios');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { servers } = require('../config/servers');
const fs = require('fs');
const https = require('https');

const router = express.Router()

const options = new https.Agent({
    key:fs.readFileSync('./ssl/key.pem'),
    cert:fs.readFileSync('./ssl/cert.pem'),
    rejectUnauthorized: false
})

const proxyOptions = {
    target:"",
    changeOrigin:true,
    onProxyReq:(ProxyReq,req)=>{
        ProxyReq.setHeader("X-Special-Proxy-Header","foobar")
    },
    logLevel:'debug'
}


let healthyServers = []; // Initially, no healthy servers



let currIndex = 0

function getServer(){
    currIndex = (currIndex+1) % servers.length
    return servers[currIndex]
}

router.all("*",(req,res)=>{
    if (healthyServers.length === 0) {
        return res.status(500).send('No healthy servers!');
      } 
    let server=getServer();
    const target = `http://${server.host}:${server.port}`
    proxyOptions.target = target
    createProxyMiddleware(proxyOptions)(req,res);
})

async function healthCheck() {
    try {
        const response = await axios.get("https://localhost:443/health",{httpsAgent:options});
        healthyServers = response.data.results.filter(result => result.status === "passing");
        console.log(healthyServers);
    } catch (error) {
        healthyServers = [];
        console.log("error",error)
    }
}


healthCheck()
// Periodic health check (every 10 seconds)
setInterval(healthCheck, 10000);

module.exports = router