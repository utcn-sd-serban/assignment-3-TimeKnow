import React, { Component } from "react";
import searchModel from '../../model/SearchModel'
import searchManagementPresenter from "../../presenter/SearchManagementPresenter"
import Table from './Table'

const mapModelStateToComponentState = modelState => ({
    filteredPosts : modelState.filteredPosts,
});

const mapURLToState = props => {
    searchManagementPresenter.onChangeEvent(searchModel.propertyContentMapper.currentSearch,
        props.match.params.term.replace(/\+/g, " "));
    searchManagementPresenter.onChangeEvent(searchModel.propertyContentMapper.searchType,
        props.match.params.searchType.replace(/\+/g, " "));

};


const tableHeader = ["Title", "Summary", "Upvotes", "Downvotes", "Author"];

export default class SmartTable extends Component {

    constructor(props){
        super(props);
        mapURLToState(this.props);
        this.state = mapModelStateToComponentState(searchModel.state);
        this.onContentSelected=searchManagementPresenter.onSelectEvent;
        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        searchModel.addListener("change", this.listener);
    }

    componentDidUpdate(prev) {
        if (prev.match.params.term !== this.props.match.params.term) {
            mapURLToState(this.props);
        }
    }

    componentWillUnmount() {
        searchModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <Table
                tableHeader={tableHeader}
                tableContent={this.state.filteredPosts}
                onContentSelected={this.onContentSelected}
            />
        )
    }
}