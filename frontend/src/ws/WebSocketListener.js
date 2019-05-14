import {EventEmitter} from "events";
import {Client} from "@stomp/stompjs";

export default class WebSocketListener extends EventEmitter {
    constructor() {
        super();
        this.client = null;
    }

    loginUser(username, password) {
        if (this.client !== null)
            this.client.abort();
        this.brokerURL = "ws://" + username + ":" + password + "@localhost:8081/api/websocket";
        this.client = new Client({
            brokerURL: this.brokerURL,
            onConnect: () => {
                this.client.subscribe("/topic/events", message => {
                    this.emit("event", JSON.parse(message.body));
                })
            }
        });
        this.client.activate();
    }

    logoutUser() {
        this.brokerURL = "None";
        if (this.client !== null)
            this.client.abort();
        this.client = null;
    }
}