import postModel, {typeAnswer, typeQuestion} from '../model/PostModel'
import userModel from '../model/UserModel'
import NavigationManagement from '../navigation/NavigationManagement'

class PostManagementPresenter {
    onChangeTagsEvent(tagsString) {
        postModel.changeNewPostProperty(postModel.propertyContentMapper.tags, tagsString.split(',')
            .map(x => x.replace(" ", "")));
    }

    onChangePropertyEvent(property, value) {
        postModel.changeNewPostProperty(property, value);
    }

    onCreateQuestionEvent() {
        postModel.createPost(
            typeQuestion,
            postModel.state.newPost.title,
            postModel.state.newPost.body,
            userModel.state.currentUser,
            null,
            postModel.state.newPost.tags);
        postModel.clearNewPost();
        NavigationManagement.gotoHome();
    }

    onCreateAnswerEvent() {
        postModel.createPost(
            typeAnswer,
            "",
            postModel.state.newPost.body,
            userModel.state.currentUser,
            postModel.state.currentPost,
            []);
        postModel.changeCurrentPost(postModel.state.currentPost.id);
        postModel.clearNewPost();
    }

    onUpVoteEvent(id) {
        postModel.votePost(id, true);
    }

    onDownVoteEvent(id) {
        postModel.votePost(id, false);
    }

    refreshOwnerPostList() {
        postModel.changeOwnerPosts();
    }

    refreshEditedPost(id) {
        postModel.refreshEditingPostContent(parseInt(id));
    }

    onChangeEditedPostContentEvent(value) {
        postModel.changeEditedPostProperty(postModel.propertyContentMapper.body, value);
    }

    onEditPostFinishedEvent() {
        postModel.editPost(postModel.state.editedPost.id, postModel.propertyContentMapper.body, postModel.state.editedPost.body);
        postModel.changeEditedPostProperty(postModel.propertyContentMapper.body, "");
        postModel.changeEditedPostProperty(postModel.propertyContentMapper.id, -1);
        NavigationManagement.gotoDashboard();
    }

    editPostEvent(id) {
        NavigationManagement.gotoEditPage(id)
    }

    deletePostEvent(id) {
        postModel.deletePost(parseInt(id));
    }

    mapCurrentPostEvent(id) {
        postModel.changeCurrentPost(parseInt(id));
    }
}

const postManagementPresenter = new PostManagementPresenter();

export default postManagementPresenter;