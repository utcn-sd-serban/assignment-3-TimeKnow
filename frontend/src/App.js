import {HashRouter, Switch, Route} from "react-router-dom";
import React, {Component} from 'react';
import SmartForm from "./view/userformcomponent/SmartForm";
import SmartHome from "./view/homecomponent/SmartHome";
import SmartTable from "./view/querytablecomponent/SmartTable";
import SmartNavbar from "./view/navbarcomponent/SmartNavbar";
import SmartCreatePostForm from "./view/createpostcomponent/SmartCreatePostForm";
import SmartPost from "./view/postcomponent/SmartPost";
import SmartDashboard from "./view/dashboardcomponent/SmartDashboard";
import SmartEditPost from "./view/editpostcomponent/SmartEditPost";
import './App.css'
import SmartAdminDashboard from "./view/admindashboardcomponent/SmartAdminDashboard";
import NavigationManagement from "./navigation/NavigationManagement";

class App extends Component {

    constructor(props) {
        super(props);
        NavigationManagement.gotoHome();
    }

    render() {
        return (
            <div className="App">
                <SmartNavbar/>
                <HashRouter>
                    <Switch>
                        <Route exact={true} render={(props) => (<SmartHome {...props}/>)} path={"/"}/>
                        <Route exact={true} render={(props) => (<SmartAdminDashboard {...props}/>)} path={"/admin"}/>
                        <Route exact={true} render={(props) => (<SmartForm  {...props} formType={"Login"}/>)}
                               path={"/login"}/>
                        <Route exact={true} render={(props) => (<SmartForm  {...props} formType={"Registration"}/>)}
                               path={"/register"}/>
                        <Route exact={true} component={SmartTable} path={"/questions/query/:searchType/:term"}/>
                        <Route exact={true} component={SmartCreatePostForm} path={"/questions/create"}/>
                        <Route exact={true} component={SmartPost} path={"/questions/list/:postId"}/>
                        <Route exact={true} component={SmartEditPost} path={"/dashboard/edit/:postId"}/>
                        <Route exact={true} component={SmartDashboard} path={"/dashboard"}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

export default App;
