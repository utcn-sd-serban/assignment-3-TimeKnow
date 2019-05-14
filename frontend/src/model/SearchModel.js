import {EventEmitter} from "events";
import postModel from './PostModel'
import clientModel from "../auth/ClientModel"

const searchTypeTitle = "By Title";
const searchTypeTag = "By Tag";


class SearchModel extends EventEmitter {

    constructor() {
        super();
        this.state = {
            suggestionList: [],
            filteredPosts: [],
            currentSearch: "",
            searchType: searchTypeTitle
        };

        this.propertyContentMapper = {
            suggestionList: "suggestionList",
            currentSearch: "currentSearch",
            searchType: "searchType"
        };
    }

    importFromAPI() {
        postModel.importFromAPI();
        this.filterSearch();
        this.emit("change", this.state);
    }

    clear() {
        this.state = {
            suggestionList: [],
            filteredPosts: [],
            currentSearch: "",
            searchType: searchTypeTitle
        };
        this.emit("change", this.state);
    }

    filterSuggestions() {
        const client = clientModel.getClient();
        const requestType = this.state.searchType === searchTypeTag ? client.tagCommandHandler.requests.FilterTagByTitle :
            client.postCommandHandler.requests.ListQuestionsByTitle;
        const searchObject = this.state.currentSearch.toLowerCase();
        client.requestAction(requestType, searchObject).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.suggestionList = data.map(x => x.title);
            this.emit("change", this.state);
        });
    }

    filterSearch() {
        const client = clientModel.getClient();
        const requestType = this.state.searchType === searchTypeTag ? client.postCommandHandler.requests.ListQuestionsByTag :
            client.postCommandHandler.requests.ListQuestionsByTitle;
        const searchObject = this.state.currentSearch.toLowerCase();

        client.requestAction(requestType, searchObject).then(data => {
            if ("hasError" in data) {
                this.handleError(data);
                return;
            }
            this.state.filteredPosts = data;
            this.emit("change", this.state);
        });

    }

    changeProperty(property, value) {
        this.state = {
            ...this.state,
            [property]: value
        };
        this.emit("change", this.state);
    }

    handleError(data) {
        if (data.status === 401 || data.status === 404 || data.status===409) {
            data.body.then(x => {alert(x.type)});
        }
    }
}

const searchModel = new SearchModel();

export default searchModel;