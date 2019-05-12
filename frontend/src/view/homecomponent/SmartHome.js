import React, { Component } from "react";
import SmartSearchBar from './SmartSearchBar'
import HomeContent from "./HomeContent";
import NavigationManagement from "../../navigation/NavigationManagement";

export default class SmartHome extends Component {
    constructor(props) {
        super(props);
        NavigationManagement.gotoHome();
    }

    render() {
        return (
            <div>
                <SmartSearchBar/>
                <HomeContent/>
            </div>
        )
    }
}