const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json")));
let userList = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../public")));
app.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));

//Creazione del Server WebSocket
const server = http.createServer(app);
const io = new Server(server);


server.listen(config.port, () => {
    console.log("server running on port: " + config.port);
});

io.on('connection', (socket) => {

    console.log("socket connected: " + socket.id);

    //se viene mandato un messaggio dal client
    socket.on('message', (message) => {
        const user = userList.find(u => u.socketID === socket.id);
        if (user) {
            const res = user.name + ": " + message;
            console.log(res);
            io.emit("chat", res);
        }
    });    
    

    //se il client fa il loigin
    socket.on("isLogged", (username) => {
        userList.push({ socketID: socket.id, name: username });
        io.emit("list", userList);
        console.log(userList)
     })

     //se il client si disconnette
     socket.on("disconnect", () => {
        userList = userList.filter(user => user.socketID != socket.id)
        io.emit("list", userList);
        console.log("socket disconnected: " + socket.id);
    })
    
});


