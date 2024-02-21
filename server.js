const app = require("./app");



//handling uncaught exceptions
process.on('uncaughtException', function(err) {
    console.log("Error: " + err.message);
    console.log('shutting down the server due to uncaught exception')
    process.exit(1);
})



const server= app.listen(4000,()=>{
    console.log(`server is runing on ${4000}`);
})

//Unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err}`);
    console.log(`shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})