import RestClient from "../rest/RestClient";


const client = new RestClient();

class ClientModel {
    constructor() {
        this.state = {
            client: client,
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
    }

    getClient() {
        return this.state.client;
    }

    isLoggedIn() {
        return this.state.client.isLoggedIn();
    }


}

const clientModel = new ClientModel();

export default clientModel;