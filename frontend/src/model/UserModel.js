import {EventEmitter} from "events";
import seed from "../seeder/seed";
import clientModel from "../auth/ClientModel"
import NavigationManagement from "../navigation/NavigationManagement";

const permissionAdmin = "ADMIN";
const permissionUser = "USER";


class UserModel extends EventEmitter {
    constructor() {
        super();
        this.state = {
            userList: [],

            newUser: {
                email: "",
                username: "",
                password: ""
            },
            currentUser: null
        };
        this.propertyContentMapper = {
            email: "email",
            username: "username",
            password: "password",
            banned: "banned",
            score: "score"
        };
    }

    importFromAPI() {
        this.state.userList = [];
        const client = clientModel.getClient();
        client.requestAction(client.userCommandHandler.requests.ListUsers, "").then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state = {
                ...this.state,
                userList: this.state.userList.concat(data)
            };
            this.emit("change", this.state);
        });
    }

    clearNewUser() {
        userModel.state.newUser = {
            email: "",
            username: "",
            password: ""
        };
        this.emit("change", this.state);
    }

    importFromSeed() {
        this.state = {
            ...this.state,
            userList: this.state.userList.concat(seed.seedUserList),
            currentUser: seed.seedUserList[0]
        };
        this.emit("change", this.state);
    }

    registerUser(email, username, password) {
        const client = clientModel.getClient();
        const content = {"username": username, "password": password, "email": email};
        client.requestAction(client.userCommandHandler.requests.RegisterUser, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.currentUser = data;
            clientModel.setUserData(data);
            clientModel.loginUser(data.username, password);
            NavigationManagement.gotoHome();
            this.emit("change", this.state);
        });
    }

    handleUserBanStatus(id, banned) {
        const client = clientModel.getClient();
        const content = {"id": id, "banned": banned};
        client.requestAction(client.userCommandHandler.requests.BanUser, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.userList = this.state.userList.filter(x => x.id !== id);
            this.state = {
                ...this.state,
                userList: this.state.userList.concat([data])
            };
            this.state.userList.sort((a, b) => a.id - b.id);
            this.emit("change", this.state);
        });
        return true;
    }

    loginUser(username, password) {
        const client = clientModel.getClient();
        const content = {"username": username, "password": password};
        client.requestAction(client.userCommandHandler.requests.LoginUser, content).then(data => {
            debugger;
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.currentUser = data;
            clientModel.setUserData(data);
            clientModel.loginUser(data.username, password);
            NavigationManagement.gotoHome();
            this.emit("change", this.state);
        });
    }

    changeProperty(property, value) {
        this.state = {
            ...this.state,
            newUser: {
                ...this.state.newUser,
                [property]: value
            }
        };
        this.emit("change", this.state);
    }

    handleError(data) {

    }

}

const userModel = new UserModel();

export default userModel;
export {permissionAdmin, permissionUser};