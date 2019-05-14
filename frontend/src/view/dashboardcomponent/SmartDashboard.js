import React, {Component} from "react";
import postModel from '../../model/PostModel'
import postManagementPresenter from "../../presenter/PostManagementPresenter"
import Dashboard from "./Dashboard";
import searchManagementPresenter from "../../presenter/SearchManagementPresenter";


const mapModelStateToComponentState = modelState => ({
    postList: modelState.ownerEditablePosts
});


export default class SmartCreatePostForm extends Component {

    constructor(props) {
        super(props);

        searchManagementPresenter.importFromAPI();
        postManagementPresenter.refreshOwnerPostList();
        this.propertyContentMapper = postModel.propertyContentMapper;
        this.onEditEvent = postManagementPresenter.editPostEvent;
        this.onDeleteEvent = postManagementPresenter.deletePostEvent;
        this.state = mapModelStateToComponentState(postModel.state);
        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        postModel.addListener("change", this.listener);
    }

    componentWillUnmount() {
        postModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <Dashboard
                postList={this.state.postList}
                onEditEvent={this.onEditEvent}
                onDeleteEvent={this.onDeleteEvent}
            />
        )
    }
}