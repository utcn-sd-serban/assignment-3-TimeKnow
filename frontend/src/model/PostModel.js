import {EventEmitter} from "events";
import seed from '../seeder/seed'
import clientModel from "../auth/ClientModel";

const typeQuestion = "QUESTION";
const typeAnswer = "ANSWER";

class PostModel extends EventEmitter {
    constructor() {
        super();
        this.state = {
            postList: [],
            newPost: {
                tags: [],
                title: "",
                body: ""
            },
            editedPost: {
                id: -1,
                body: ""
            },
            loadingCurrentPost: false,
            currentPost: {},
            currentPostAnswers: [],
            ownerEditablePosts: [],
        };
        this.propertyContentMapper = {
            tags: "tags",
            title: "title",
            body: "body"
        };

    }

    importFromAPI() {
        const client = clientModel.getClient();
        client.requestAction(client.postCommandHandler.requests.ListQuestions, null).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state = {

                ...this.state,
                postList: data,
            };
            this.emit("change", this.state);
        });

    }

    importFromSeed() {
        this.state = {
            ...this.state,
            postList: this.state.postList.concat(seed.seedPostList),
        };
        this.emit("change", this.state);
    }

    votePost(id, isUpVote) {
        const client = clientModel.getClient();
        const content = {"postId": parseInt(id), isUpVote: isUpVote};
        client.requestAction(client.postCommandHandler.requests.VotePost, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.postList = this.state.postList.filter(x => x.id !== data.id);
            this.state = {
                ...this.state,
                postList: this.state.postList.concat([{...data, score: data.upvotes - data.downvotes}])
            };
            this.emit("change", this.state);
        });
    }

    changeCurrentPost(id) {
        const client = clientModel.getClient();
        this.state.loadingCurrentPost = true;
        this.emit("change", this.state);
        client.requestAction(client.postCommandHandler.requests.GetPostById, parseInt(id)).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.currentPost = data;
            this.getPostAnswers(id);
        });
    }

    getPostAnswers(id) {
        const client = clientModel.getClient();
        client.requestAction(client.postCommandHandler.requests.ListPostAnswers, parseInt(id)).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.currentPostAnswers = data;
            this.state.loadingCurrentPost = false;
            this.emit("change", this.state);
        });
    }

    changeOwnerPosts() {
        const client = clientModel.getClient();
        client.requestAction(client.postCommandHandler.requests.ListEditablePosts, "").then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.ownerEditablePosts = data;
            this.emit("change", this.state);
        });
    }

    clearNewPost() {
        this.state.newPost = {
            type: null,
            author: null,
            parent: null,
            tags: [],
            date: "",
            title: "",
            body: ""
        };
        this.emit("change", this.state);
    }

    deletePost(id) {
        const client = clientModel.getClient();
        const content = {"id": id};
        client.requestAction(client.postCommandHandler.requests.DeletePost, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.postList = this.state.postList.filter(x => x.id !== id);
            this.state.ownerEditablePosts = this.state.ownerEditablePosts.filter(x => x.id !== id);
            this.emit("change", this.state);
        });
    }

    createPost(type, title, body, author, parent, tags) {
        const client = clientModel.getClient();
        const content = {
            type: type,
            title: title,
            body: body,
            tags: tags,
            author: author,
            parent: parent.id,
        };
        client.requestAction(client.postCommandHandler.requests.getCommandCreatePost, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state = {
                ...this.state,
                postList: this.state.postList.concat([data])
            };
            this.emit("change", this.state);
        });
    }

    refreshEditingPostContent(id) {
        const client = clientModel.getClient();
        client.requestAction(client.postCommandHandler.requests.GetPostById, parseInt(id)).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.editedPost = {
                id: data.id,
                body: data.body
            };
            this.emit("change", this.state);
        });
    }

    editPost(postId, property, value) {
        const post = this.state.postList.filter(x => x.id === postId)[0];

        if (post === null)
            return;

        const client = clientModel.getClient();
        const content = {"id": postId, "body": value};

        client.requestAction(client.postCommandHandler.requests.UpdatePost, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            post[property] = data[property];
            this.emit("change", this.state);
        });

    }

    changeEditedPostProperty(property, value) {
        this.state = {
            ...this.state,
            editedPost: {
                ...this.state.editedPost,
                [property]: value
            }
        };
        this.emit("change", this.state);
    }

    changeNewPostProperty(property, value) {
        this.state = {
            ...this.state,
            newPost: {
                ...this.state.newPost,
                [property]: value
            }
        };
        this.emit("change", this.state);
    }

    handleError(data) {

    }
}

const postModel = new PostModel();

export default postModel;
export {typeQuestion, typeAnswer};