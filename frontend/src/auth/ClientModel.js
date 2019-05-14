import RestClient from "../rest/RestClient";
import WebSocketListener from "../ws/WebSocketListener";

const client = new RestClient();
const listener = new WebSocketListener();

class ClientModel {
    constructor() {
        this.state = {
            client: client,
            listener: listener,
            userData: null
        };
        this.propertyContentMapper = {
            client: "client",
        };
    }

    setUserData(data) {
        this.state.userData = data;
    }

    loginUser(username, password) {
        this.state.client.loginUser(username, password);
        this.state.listener.loginUser(username, password);
    }

    logoutUser() {
        this.state.client.logoutUser();
        this.state.listener.logoutUser();
    }

    getClient() {
        return this.state.client;
    }

    getListener() {
        return this.state.listener;
    }

    isLoggedIn() {
        return this.state.client.isLoggedIn();
    }


}

const clientModel = new ClientModel();

export default clientModel;