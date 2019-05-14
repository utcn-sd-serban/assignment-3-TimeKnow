import React from "react";

const Navbar = ({onGotoRegisterEvent, onGotoPostEvent, onGotoLoginEvent, onGotoDashboardEvent, onGotoHomeEvent}) =>(
        <nav className="navbar content-dark" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoHomeEvent())}>
                        StackUnderflow
                    </div>
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoPostEvent())}>
                        Ask Question
                    </div>
                    <div className="navbar-item link-hoverable" onClick={(e)=>(onGotoDashboardEvent())}>
                        Dashboard
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">

                            <div className="button is-info" onClick={(e)=>(onGotoRegisterEvent())}>
                                Sign up
                            </div>
                            <div className="button is-info" onClick={(e)=>(onGotoLoginEvent())}>
                                Log in
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );

export default Navbar;