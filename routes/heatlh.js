const axios = require("axios")
const express = require("express")
const { servers } = require("../config/servers")

const router = express.Router()

router.get("/health",async(req,res,next)=>{
    const results = []

    for(let i =0; i < servers.length; i++){
        const server = servers[i]

        try{
            let res = await axios.get(`http://${server.host}:${server.port}/app/healthcheck`)
            if(res.status===200){
                results.push({
                    id:server.port,
                    status:"passing",
                    weight:server.weight
                })
            }
            else{
                results.push({
                    id:server.port,
                    status:"failing"
                })
            }
        }
        catch(e){
            results.push({
                id:server.port,
                status:"failing"
            })
        }
    }

    res.json({results})
})

module.exports = router