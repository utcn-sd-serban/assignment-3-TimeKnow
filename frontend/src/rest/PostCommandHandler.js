import Command from "./Command";


export default class PostCommandHandler {
    constructor(authorization, base, endpoint) {
        this.authorization = authorization;
        this.base = base;
        this.endpoint = endpoint;
        this.requests = {
            ListQuestions: "ListQuestions",
            ListQuestionsByTitle: "ListQuestionsByTitle",
            ListQuestionsByTag: "ListQuestionsByTag",
            GetPostById: "GetPostById",
            getCommandCreatePost: "getCommandCreatePost",
            DeletePost: "DeletePost",
            UpdatePost: "UpdatePost",
            ListPostAnswers: "ListPostAnswers",
            ListEditablePosts: "ListEditablePosts",
            VotePost: "VotePost",
        };
        this.mapRequestsToCommands = {
            [this.requests.ListQuestions]: this.getCommandListQuestions(),
            [this.requests.ListQuestionsByTitle]: this.getCommandListQuestionsByTitle(),
            [this.requests.ListQuestionsByTag]: this.getCommandListQuestionsByTag(),
            [this.requests.GetPostById]: this.getCommandGetPostById(),
            [this.requests.getCommandCreatePost]: this.getCommandCreatePost(),
            [this.requests.DeletePost]: this.getCommandDeletePost(),
            [this.requests.UpdatePost]: this.getCommandUpdatePost(),
            [this.requests.ListPostAnswers]: this.getCommandListPostAnswers(),
            [this.requests.ListEditablePosts]: this.getCommandListEditablePosts(),
            [this.requests.VotePost]: this.getCommandVotePost(),
        };
    }

    getCommandListQuestions() {
        const execution = () => fetch(this.base + this.endpoint, {
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

    getCommandListEditablePosts() {
        const execution = () => fetch(this.base + this.endpoint + "/editable", {
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

    getCommandListQuestionsByTitle() {
        const execution = (body) => fetch(this.base + this.endpoint + "/title/" + body, {
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

    getCommandListQuestionsByTag() {
        const execution = (body) => fetch(this.base + this.endpoint + "/tag/" + body, {
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

    getCommandGetPostById() {
        const execution = (body) => fetch(this.base + this.endpoint + "/" + body, {
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

    getCommandListPostAnswers() {
        const execution = (body) => fetch(this.base + this.endpoint + "/" + body + "/answers", {
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

    getCommandCreatePost() {
        const execution = (content) => fetch(this.base + this.endpoint, {
            method: "POST",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "author": {
                    id: content.author.id
                },
                "parent": content.parent,
                "tags": content.tags,
                "type": content.type,
                "body": content.body,
                "title": content.title
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        const undo = (content) => fetch(this.base + this.endpoint, {
            method: "DELETE",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": content.id
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        return new Command(execution, undo, null);
    }

    getCommandDeletePost() {
        const execution = (content) => fetch(this.base + this.endpoint, {
            method: "DELETE",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": content.id
            })
        }).then(response => {
            if (response.status === 200) {
                return {};
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        return new Command(execution, null, null);
    }

    getCommandUpdatePost() {
        const execution = (content) => fetch(this.base + this.endpoint, {
            method: "PUT",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": content.id,
                "body": content.body
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        return new Command(execution, null, null);
    }

    getCommandVotePost() {
        const execution = (content) => fetch(this.base + this.endpoint + "/vote", {
            method: "POST",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "postId": content.postId,
                "isUpVote": content.isUpVote
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        const undo = (content) => fetch(this.base + this.endpoint + "/vote", {
            method: "DELETE",
            headers: {
                "Authorization": this.authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "postId": content.postId,
                "isUpVote": content.isUpVote
            })
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else return {"hasError": true, "status": response.status, "body": response.text()};
        });

        return new Command(execution, undo, null);
    }
}