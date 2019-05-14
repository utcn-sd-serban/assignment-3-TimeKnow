import Command from "./Command";

export default class TagCommandHandler {
    constructor(authorization, base, endpoint) {
        this.authorization = authorization;
        this.base = base;
        this.endpoint = endpoint;
        this.requests = {
            FilterTagByTitle: "FilterTagByTitle"
        };
        this.mapRequestsToCommands = {
            [this.requests.FilterTagByTitle]: this.getCommandListQuestions()
        };
    }

    getCommandListQuestions() {
        const execution = (body) => fetch(this.base + this.endpoint + "/filter/" + body, {
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
}