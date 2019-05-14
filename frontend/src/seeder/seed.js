const permissionAdmin = "ADMIN";
const permissionUser = "USER";
const typeQuestion = "QUESTION";

class Seed {
    constructor(){
        this.seedUserList = [
            {
                id: 0,
                email: "superuser@gmail.com",
                username: "superuser",
                password: "superuser",
                banned: false,
                permission: permissionAdmin,
                score: 5
            },
            {
                id: 1,
                email: "test1@gmail.com",
                username: "test1",
                password: "test1",
                banned: false,
                permission: permissionUser,
                score: 4
            },
            {
                id: 2,
                email: "test2@gmail.com",
                username: "test2",
                password: "test2",
                banned: false,
                permission: permissionUser,
                score: 3
            }
        ];

        this.seedTagList = [
            {
                id: 0,
                title: "joldos"
            },
            {
                id: 1,
                title: "test-tag-1"
            },
            {
                id: 2,
                title: "test-tag-2"
            },
        ];

        this.seedPostList = [
            {
                id: 0,
                type: typeQuestion,
                author: this.seedUserList[0],
                parent: null,
                tags: [this.seedTagList[0].title, this.seedTagList[1].title],
                title: "PostTest",
                summary: "post test testh awhwahga",
                body: "post test testh awhwahga",
                date: "2019/14/4",
                upVotes: 2,
                downVotes: 0,
                score : 2,
            },
            {
                id: 1,
                type: typeQuestion,
                author: this.seedUserList[1],
                parent: null,
                tags: [this.seedTagList[0].title, this.seedTagList[2].title],
                title: "PostTest1",
                summary: "post test testh awhwa21hga",
                body: "post test testh awhwa21hga post test testh awhwa21hga post test testh awhwa21hga",
                date: "2019/15/4",
                upVotes: 2,
                downVotes: 1,
                score : 1,
            },
            {
                id: 2,
                type: typeQuestion,
                author: this.seedUserList[2],
                parent: null,
                tags: [this.seedTagList[1].title],
                title: "PostTest2",
                summary: "post test testh awhwah13ga",
                body: "post test testh awhwah13ga post test testh awhwah13ga post test testh awhwah13ga post test testh awhwah13ga",
                date: "2019/15/4",
                upVotes: 2,
                downVotes: 4,
                score : -2,
            }
        ];
    }
}


const seed = new Seed();

export default seed;