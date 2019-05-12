import searchModel from '../model/SearchModel'
import NavigationManagement from '../navigation/NavigationManagement'

class SearchManagementPresenter {

    importFromAPI() {
        searchModel.importFromAPI();
    }

    onChangeEvent(property, value) {
        searchModel.changeProperty(property, value);
        searchModel.filterSuggestions();
    }

    refreshSearch() {
        searchModel.filterSuggestions();
    }

    onSelectEvent(postId) {
        searchModel.clear();
        NavigationManagement.gotoPost(postId);
    }

    onSearchEvent() {
        searchModel.filterSuggestions();
        searchModel.filterSearch();
        const searchType = searchModel.state.searchType.replace(' ', '+');
        const term = searchModel.state.currentSearch.replace(/ /g, '+');

        NavigationManagement.gotoSearchQuery(searchType, term);
    }

}

const searchManagementPresenter = new SearchManagementPresenter();

export default searchManagementPresenter;