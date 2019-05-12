import React, { Component } from "react";
import CreatePostForm from "./CreatePostForm";
import postModel from '../../model/PostModel'
import postManagementPresenter from "../../presenter/PostManagementPresenter"


const mapModelStateToComponentState = modelState => ({
    title: modelState.newPost.title,
    body: modelState.newPost.body,
});


export default class SmartCreatePostForm extends Component {

    constructor(props){
        super(props);

        this.propertyContentMapper = postModel.propertyContentMapper;
        this.onChangeTagsEvent = postManagementPresenter.onChangeTagsEvent;
        this.onChangePropertyEvent = postManagementPresenter.onChangePropertyEvent;
        this.onCreatePostEvent = postManagementPresenter.onCreateQuestionEvent;

        this.state = mapModelStateToComponentState(postModel.state);

        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        postModel.addListener("change", this.listener);
    }

    componentWillUnmount() {
        postModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <CreatePostForm
                propertyContentMapper={this.propertyContentMapper}
                onPropertyChangeEvent={this.onChangePropertyEvent}
                onPropertyTagsChangeEvent={this.onChangeTagsEvent}
                onActionEvent={this.onCreatePostEvent}
            />
        )
    }
}