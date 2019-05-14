import Command from "./Command";

export default class UserCommandHandler {
    constructor(authorization, base, endpoint) {
        this.authorization = authorization;
        this.base = base;
        this.endpoint = endpoint;
        this.requests = {
            LoginUser: "LoginUser",
            RegisterUser: "RegisterUser",
            ListUsers: "ListUsers",
            BanUser: "BanUser",
        };
        this.mapRequestsToCommands = {
            [this.requests.LoginUser]: this.getCommandLoginUser(),
            [this.requests.RegisterUser]: this.getCommandRegisterUser(),
            [this.requests.ListUsers]: this.getCommandListUsers(),
            [this.requests.BanUser]: this.getCommandBanUser(),
        };
    }

    getCommandLoginUser() {
        const execution = (body) => fetch(this.base + "/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": body.username,
                "password": body.password
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });
        return new Command(execution, null, null);
    }

    getCommandRegisterUser() {
        const execution = (body) => fetch(this.base + "/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": body.username,
                "password": body.password,
                "email": body.email
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });
        return new Command(execution, null, null);
    }

    getCommandListUsers() {
        const execution = (body) => fetch(this.base + this.endpoint, {
            method: "GET",
            headers: {
                "Authorization": this.authorization
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });
        return new Command(execution, null, null);
    }

    getCommandBanUser() {
        const execution = (body) => fetch(this.base + this.endpoint + "/ban", {
            method: "PUT",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": body.id,
                "banned": body.banned
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });
        return new Command(execution, null, null);
    }
}