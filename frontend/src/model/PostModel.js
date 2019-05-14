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
            data.forEach(x=> {
                if (this.state.ownerEditablePosts.filter(y => y.id === x.id).length === 0)
                    this.state.ownerEditablePosts = this.state.ownerEditablePosts.concat([x]);
            });
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
            this.removePost(data);

        });
    }

    removePost(post) {
        this.state.postList = this.state.postList.filter(x => x.id !== post.id);
        this.state.ownerEditablePosts = this.state.ownerEditablePosts.filter(x => x.id !== post.id);
        if (this.state.currentPost.id === post.parent)
            this.state = {
                ...this.state,
                currentPostAnswers: this.state.currentPostAnswers.filter(x => x.id !== post.id)
            };
        this.emit("change", this.state);
    }

    createPost(type, title, body, author, parent, tags) {
        const client = clientModel.getClient();
        const content = {
            type: type,
            title: title,
            body: body,
            tags: tags,
            author: author,
            parent: parent,
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
        const client = clientModel.getClient();
        const content = {"id": postId, "body": value};
        client.requestAction(client.postCommandHandler.requests.UpdatePost, content).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
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
        if (data.status === 401 || data.status === 404 || data.status === 409) {
            data.body.then(x => {
                alert(x.type)
            });
        }
    }

    addNewPost(post) {
        const x = this.state.postList.filter(x => x.id === post.id).length;
        if (x > 0)
            return;

        this.state = {
            ...this.state,
            postList: this.state.postList.concat([post])
        };
        if (this.state.currentPost.id === post.parent)
            this.state = {
                ...this.state,
                currentPostAnswers: this.state.currentPostAnswers.concat([post])
            };
        this.emit("change", this.state);
    }

    updateLocalPost(post) {
        const postReference = this.state.postList.filter(x => x.id === post.id)[0];
        if (typeof postReference !== 'undefined') {
            postReference["body"] = post.body;
            postReference["title"] = post.title;
        }
        const editPostReference = this.state.ownerEditablePosts.filter(x => x.id === post.id)[0];
        if (typeof editPostReference !== 'undefined') {
            editPostReference["body"] = post.body;
            editPostReference["title"] = post.title;
        }

        if (this.state.currentPost.id === post.parent)
            this.changeCurrentPost(this.state.currentPost.id);
        this.emit("change", this.state);
    }

    voteLocalPost(post){
        const postReference = this.state.postList.filter(x => x.id === post.id)[0];
        if (typeof postReference !== 'undefined') {
            postReference["upvotes"] = post.upvotes;
            postReference["downvotes"] = post.downvotes;
        }
        this.emit("change", this.state);

        if (this.state.currentPost.id === post.parent || this.state.currentPost.id ===post.id)
            this.changeCurrentPost(this.state.currentPost.id);
    }
}

const postModel = new PostModel();
const listener = clientModel.getListener();
listener.on("event", event => {
    switch (event.type) {
        case "POST_CREATED":
            postModel.addNewPost(event.postDTO);
            break;
        case "POST_UPDATED":
            postModel.updateLocalPost(event.postDTO);
            break;
        case "POST_DELETED":
            postModel.removePost(event.postDTO);
            break;
        case "POST_VOTED":
            postModel.voteLocalPost(event.postDTO);
            break;
    }
});

export default postModel;
export {typeQuestion, typeAnswer};