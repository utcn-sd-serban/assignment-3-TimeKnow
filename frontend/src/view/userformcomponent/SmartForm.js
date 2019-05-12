import React, { Component } from "react";
import Form from "./Form";
import userModel from '../../model/UserModel'
import userManagementPresenter from '../../presenter/UserManagementPresenter'

const mapModelStateToComponentState = (modelState, props) => ({
    username: modelState.newUser.username,
    email: modelState.newUser.email,
    password: modelState.newUser.password,
    formType : props.formType
});

const formTypeRegistration = "Registration";

export default class SmartForm extends Component {

    constructor(props){
        super(props);
        this.state = mapModelStateToComponentState(userModel.state, this.props);
        this.propertyContentMapper =  userModel.propertyContentMapper;
        this.onChange = userManagementPresenter.onChange;
        this.onAction = (this.formType===formTypeRegistration)?userManagementPresenter.onCreate:userManagementPresenter.onLogin;
        this.listener = modelState => this.setState(mapModelStateToComponentState(modelState, this.props));
        userModel.addListener("change", this.listener);
    }

    componentDidUpdate(prev) {
        if (prev.formType !== this.props.formType) {
            this.setState(mapModelStateToComponentState(userModel.state, this.props));
        }
    }

    componentWillUnmount() {
        userModel.removeListener("change", this.listener);
    }

    render() {
        return (
            <Form
                type={this.state.formType}
                username={this.state.user}
                password={this.state.password}
                email={this.state.email}
                propertyContentMapper={this.propertyContentMapper}
                onPropertyChangeEvent={this.onChange}
                onActionEvent={this.onAction}
            />
        )
    }
}