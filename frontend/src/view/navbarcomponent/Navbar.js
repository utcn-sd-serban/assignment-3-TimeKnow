import React from "react";

const Navbar = ({onGotoRegisterEvent, onGotoPostEvent, onGotoLoginEvent, onGotoDashboardEvent, onGotoHomeEvent}) =>(
        <nav className="navbar content-dark" role="navigation" aria-label="main navigation">
            <div className="navbar-menu force-display-block">
                <div className="navbar-start">
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoHomeEvent())} data-cy="navbar_gotoHome">
                        StackUnderflow
                    </div>
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoPostEvent())} data-cy="navbar_gotoQuestions">
                        Ask Question
                    </div>
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoDashboardEvent())} data-cy="navbar_gotoDashboard">
                        Dashboard
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">

                            <div className="button is-info" onClick={(e)=>(onGotoRegisterEvent())} data-cy="navbar_gotoSignUp">
                                Sign up
                            </div>
                            <div className="button is-info" onClick={(e)=>(onGotoLoginEvent())} data-cy="navbar_gotoLogin">
                                Log in
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );

export default Navbar;