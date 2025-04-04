import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js";
import { createNavigator } from "./components/navigator.js";
import { createForm } from "./components/formLogin.js";
import { createPubSub } from "./components/pubSub.js"
import { chatWebsocket } from "./components/chatWebsocket.js";

const socket = io();
const navigator = createNavigator();
const pubSub = createPubSub();
const form = createForm(document.getElementById("formLogin"), pubSub);
const chat = chatWebsocket(document.getElementById("chat"), pubSub, socket)

form.render();
chat.render();