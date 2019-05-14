import React, {Component} from "react";
import userModel from '../../model/UserModel'
import userManagementPresenter from "../../presenter/UserManagementPresenter"
import AdminDashboard from "./AdminDashboard";


const mapModelStateToComponentState = modelState => ({
    userList: modelState.userList
});

const headerList = ["Id", "Username", "Email", "Status", "Banned", "Action1", "Action2"];

export default class SmartCreatePostForm extends Component {

    constructor(props) {
        super(props);
        this.onActionEvent = userManagementPresenter.handleUserBanStatus;
        this.state = mapModelStateToComponentState(userModel.state);
        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState));
        userModel.addListener("change", this.listener);
    }

    componentWillMount() {
        userManagementPresenter.importFromAPI()
    }

    componentWillUnmount() {
        userModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <AdminDashboard
                tableHeader={headerList}
                tableContent={this.state.userList}
                onActionEvent={this.onActionEvent}
            />
        )
    }
}