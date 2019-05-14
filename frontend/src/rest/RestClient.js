import PostCommandHandler from "./PostCommandHandler";
import TagCommandHandler from "./TagCommandHandler";
import UserCommandHandler from "./UserCommandHandler";

const BASE_URL = "http://localhost:8081";

export default class RestClient {
    constructor() {
        this.authorization = "None";
        this.commandHistory = [];
        this.userData = {"username": "", "password": ""};
        this.postCommandHandler = new PostCommandHandler(this.authorization, BASE_URL, "/posts");
        this.tagCommandHandler = new TagCommandHandler(this.authorization, BASE_URL, "/tags");
        this.userCommandHandler = new UserCommandHandler(this.authorization, BASE_URL, "/users");
    }

    isLoggedIn() {
        return this.authorization !== "None";
    }

    loginUser(username, password) {
        this.userData = {"username": username, "password": password};
        this.authorization = "Basic " + btoa(username + ":" + password);
        this.refreshAuthorization();
    }

    logoutUser() {
        this.authorization = "None";
        this.userData = {"username": "", "password": ""};
        this.refreshAuthorization();
    }

    refreshAuthorization() {
        this.postCommandHandler.authorization = this.authorization;
        this.tagCommandHandler.authorization = this.authorization;
        this.userCommandHandler.authorization = this.authorization;
    }

    requestAction(request, body) {
        let handler = null;
        if (request in this.postCommandHandler.requests) {
            handler = this.postCommandHandler;
        } else if (request in this.tagCommandHandler.requests) {
            handler = this.tagCommandHandler;
        } else if (request in this.userCommandHandler.requests) {
            handler = this.userCommandHandler;
        } else return;

        const command = handler.mapRequestsToCommands[request];
        this.commandHistory.push(command);
        return command.execute(body)
    }
}