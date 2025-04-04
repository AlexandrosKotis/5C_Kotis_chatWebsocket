export function chatWebsocket (parentElement, pubSub, socket) {
    const template = "<li class=\"list-group-item\">%MESSAGE</li>";
    const messages = [];
    const userList = [];

    pubSub.subscribe("isLogged", (username) => {
        socket.emit("isLogged", username)
    });

    socket.on("list", (list) => {
        userList.push(list);
    })

    socket.on("chat", (message) => {
        console.log(message);
        messages.push(message);
        instance.render();
    });

    let instance = {
        render: function () {
            console.log(messages);
            let html = `<div class="container">
                            <ul id="wschat" class="list-group">
                                ${
                                    messages.map((message) => {
                                        return template.replace("%MESSAGE", message);
                                    }).join("")
                                }
                            </ul>
                        </div>
                        <div class="row mx-4 mt-4">
                            <input id="input" class="form-control" />
                            <button id="sendButton" type="button" class="btn btn-success">Send</button>
                        </div>`;
                        
            parentElement.innerHTML = html;
            window.scrollTo(0, document.body.scrollHeight);

            const input = document.getElementById("input");
            const button = document.getElementById("sendButton");

            button.onclick = () => {
                socket.emit("message", input.value);
                input.value = "";
            }

            input.onkeydown = (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    button.click();
                }
            }
        }
    };

    return instance;
}