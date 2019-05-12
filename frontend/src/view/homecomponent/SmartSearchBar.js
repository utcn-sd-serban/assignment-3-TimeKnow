import React, {Component} from "react";
import searchModel from '../../model/SearchModel'
import searchManagementPresenter from "../../presenter/SearchManagementPresenter"
import SearchBar from './SearchBar'

const mapModelStateToComponentState = modelState => ({
    suggestionList: modelState.suggestionList,
    currentSearch: modelState.currentSearch,
    searchType: modelState.searchType
});


export default class SmartSearchBar extends Component {

    constructor(props) {
        super(props);
        searchManagementPresenter.importFromAPI();
        this.state = mapModelStateToComponentState(searchModel.state);
        this.propertyContentMapper = searchModel.propertyContentMapper;
        this.onChangeEvent = searchManagementPresenter.onChangeEvent;
        this.onSearchEvent = searchManagementPresenter.onSearchEvent;

        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        searchModel.addListener("change", this.listener);
    }

    componentWillUnmount() {
        searchModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <SearchBar
                suggestions={this.state.suggestionList}
                propertyContentMapper={this.propertyContentMapper}
                onPropertyChangeEvent={this.onChangeEvent}
                onSearchEvent={this.onSearchEvent}
            />
        )
    }
}