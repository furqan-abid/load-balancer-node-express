const {app1,app2} = require("./app");
const fs = require("fs")


//handling uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log("Error: " + err.message);
    console.log('shutting down the server due to uncaught exception')
    process.exit(1);
})

app1.get("/app",(req,res)=>{
    res.send(`Hello from server! Host: 3000 ${process.env.HOSTNAME}`);
})
app1.get("/app/healthCheck",(req,res)=>{
    res.status(200).end("working")
})

const firstServer= app1.listen(3000,()=>{
    console.log(`server is runing on ${3000}`);
})
const secondServer= app1.listen(3001,()=>{
    console.log(`server is runing on ${3001}`);
})
