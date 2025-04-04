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
        const response = (userList.find( user => user.socketID == socket.id).name) + ': ' + message;
        console.log(response);
        io.emit("chat", response);
    });
    

    //se il client fa il loigin
    socket.on("isLogged", (username) => {
        userList.push({ socketID: socket.id, name: username });
        io.emit("list", userList);
        console.log(userList)
     })

     //se il client si disconnette
     socket.on("disconnect", function() { 
        userList = userList.reduce((acc, user) => {
            if (user.socketID !== socket.id) acc.push(user);
            return acc;
        }, []);
        console.log(userList);
        console.log("socket disconnected: " + socket.id);
    });
    
});


