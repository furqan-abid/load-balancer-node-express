const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { servers } = require('../config/servers');

const router = express.Router()


const proxyOptions = {
    target:"",
    changeOrigin:true,
    onProxyReq:(ProxyReq,req)=>{
        ProxyReq.setHeader("X-Special-Proxy-Header","foobar")
    },
    logLevel:'debug'
}

let currIndex = 0

function getServer(){
    currIndex = (currIndex+1) % servers.length
    return servers[currIndex]
}

router.all("*",(req,res)=>{
    let server=getServer();
    const target = `http://${server.host}:${server.port}`
    proxyOptions.target = target
    createProxyMiddleware(proxyOptions)(req,res);
})


module.exports = router