import React, { Component } from "react";
import NavigationManagement from '../../navigation/NavigationManagement'
import Navbar from "./Navbar";

export default class SmartForm extends Component {

    constructor(props){
        super(props);
        this.onGotoRegisterEvent = NavigationManagement.gotoRegistration;
        this.onGotoPostEvent = NavigationManagement.gotoPostQuestion;
        this.onGotoLoginEvent = NavigationManagement.gotoLogin;
        this.onGotoHomeEvent = NavigationManagement.gotoHome;
        this.onGotoDashboardEvent = NavigationManagement.gotoDashboard;
    }

    render() {
        return (
            <Navbar
                onGotoRegisterEvent={this.onGotoRegisterEvent}
                onGotoPostEvent={this.onGotoPostEvent}
                onGotoLoginEvent={this.onGotoLoginEvent}
                onGotoDashboardEvent={this.onGotoDashboardEvent}
                onGotoHomeEvent={this.onGotoHomeEvent}
            />
        )
    }
}