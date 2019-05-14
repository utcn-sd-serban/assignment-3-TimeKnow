import React, {Component} from "react";
import postModel from '../../model/PostModel'
import postManagementPresenter from "../../presenter/PostManagementPresenter"
import QuestionPost from "./QuestionPost";
import QuestionAnswers from "./QuestionAnswers";
import PostResponder from "./PostResponder";


const mapModelStateToComponentState = (modelState) => ({
    currentPost: modelState.currentPost,
    answersList: modelState.currentPostAnswers,
    loadingCurrentPost: modelState.loadingCurrentPost
});

const mapUpdatedIdToState = (postId) => {
    postManagementPresenter.mapCurrentPostEvent(postId);
};

export default class SmartCreatePostForm extends Component {

    constructor(props) {
        super(props);
        this.propertyContentMapper = postModel.propertyContentMapper;
        this.onUpVoteEvent = postManagementPresenter.onUpVoteEvent;
        this.onDownVoteEvent = postManagementPresenter.onDownVoteEvent;
        this.onPostResponseEvent = postManagementPresenter.onCreateAnswerEvent;
        this.onChangePropertyEvent = postManagementPresenter.onChangePropertyEvent;

        mapUpdatedIdToState(this.props.match.params.postId);
        this.state = mapModelStateToComponentState(postModel.state);

        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));

        postModel.addListener("change", this.listener);
    }

    componentDidUpdate(prev) {
        if (prev.match.params.postId !== this.props.match.params.postId) {
            mapUpdatedIdToState(this.props.match.params.postId);
        }
    }

    componentWillUnmount() {
        postModel.removeListener("change", this.listener);
    }

    render() {
        if (this.state.loadingCurrentPost)
            return "Loading";
        return (
            <div>
                <QuestionPost
                    post={this.state.currentPost}
                    onUpVoteEvent={this.onUpVoteEvent}
                    onDownVoteEvent={this.onDownVoteEvent}
                />
                <QuestionAnswers
                    answerstList={this.state.answersList}
                    onUpVoteEvent={this.onUpVoteEvent}
                    onDownVoteEvent={this.onDownVoteEvent}
                />
                <PostResponder
                    propertyContentMapper={this.propertyContentMapper}
                    onChangeResponseTextEvent={this.onChangePropertyEvent}
                    onPostResponseEvent={this.onPostResponseEvent}
                />
            </div>
        )
    }
}