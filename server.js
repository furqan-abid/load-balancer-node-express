const app = require("./app");
const https = require("https");
const fs = require("fs")

const options = {
    key:fs.readFileSync('./ssl/key.pem'),
    cert:fs.readFileSync('./ssl/cert.pem')
}

//handling uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log("Error: " + err.message);
    console.log('shutting down the server due to uncaught exception')
    process.exit(1);
})

app.get("/app",(req,res)=>{
    res.send(`Hello from server! Host: ${process.env.HOSTNAME}`);
})

const server= app.listen(3000,()=>{
    console.log(`server is runing on ${3000}`);
})


//Unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err}`);
    console.log(`shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})