import userModel from '../model/UserModel'
import NavigationManagement from '../navigation/NavigationManagement'

class UserManagementPresenter {

    importFromAPI() {
        userModel.importFromAPI();
    }

    onCreate() {
        userModel.registerUser(userModel.state.newUser.email, userModel.state.newUser.username, userModel.state.newUser.password);
        userModel.clearNewUser();
        NavigationManagement.gotoLogin();
    }

    onLogin() {
        userModel.loginUser(userModel.state.newUser.username, userModel.state.newUser.password)
        NavigationManagement.gotoHome();
    }

    onChange(property, value) {
        userModel.changeProperty(property, value);
    }

    handleUserBanStatus(id, newStatus) {
        userModel.handleUserBanStatus(parseInt(id), newStatus);
    }

}

const userManagementPresenter = new UserManagementPresenter();

export default userManagementPresenter;