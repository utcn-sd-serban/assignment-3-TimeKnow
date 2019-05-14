import clientModel from '../auth/ClientModel'

export default class NavigationManagement {

    static gotoRegistration() {
        window.location.assign("#/register");
    }

    static gotoLogin() {
        window.location.assign("#/login");
    }

    static gotoPostQuestion() {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        window.location.assign("#/questions/create");
    }

    static gotoHome() {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        window.location.assign("#/");
    }

    static gotoDashboard() {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        window.location.assign("#/dashboard");
    }

    static gotoEditPage(id) {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        const url = "#/dashboard/edit/" + id;
        window.location.assign(url);
    }

    static gotoPost(id) {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        const url = "#/questions/list/" + id;
        window.location.assign(url);
    }

    static gotoSearchQuery(searchType, term) {
        if (!clientModel.isLoggedIn()) {
            NavigationManagement.gotoLogin();
            return;
        }
        const url = "#/questions/query/" + searchType + "/" + term;
        window.location.assign(url);
    }

}
