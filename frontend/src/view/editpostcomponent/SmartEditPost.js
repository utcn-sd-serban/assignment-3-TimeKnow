import React, { Component } from "react";
import postModel from '../../model/PostModel'
import postManagementPresenter from "../../presenter/PostManagementPresenter"
import EditPost from "./EditPost";


const mapModelStateToComponentState = modelState => ({
    id: modelState.editedPost.id,
    body : modelState.editedPost.body
});

const mapURLToState = props =>(
    postManagementPresenter.refreshEditedPost(props.match.params.postId)
);

export default class SmartCreatePostForm extends Component {

    constructor(props){
        super(props);

        mapURLToState(this.props);
        this.onEditQuestionEvent = postManagementPresenter.onChangeEditedPostContentEvent;
        this.onDoneEditingEvent = postManagementPresenter.onEditPostFinishedEvent;
        this.state = mapModelStateToComponentState(postModel.state);

        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        postModel.addListener("change", this.listener);
    }

    componentDidUpdate(prev) {
        if (prev.match.params.postId !== this.props.match.params.postId) {
            mapURLToState(this.props);
        }
    }

    componentWillUnmount() {
        postModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <EditPost
                postContent={this.state.body}
                onPropertyChangeEvent={this.onEditQuestionEvent}
                onActionEvent ={this.onDoneEditingEvent}
            />
        )
    }
}