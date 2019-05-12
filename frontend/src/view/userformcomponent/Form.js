import React from "react";


const formTypeRegistration = "Registration";

const Form = ({type, propertyContentMapper, username, email, password, onPropertyChangeEvent, onActionEvent})=>(
    <section className="section content-grey">
    <div className="container">
        <div className="columns is-mobile is-centered is-vcentered">
            <div className="column is-half">
                {(type === formTypeRegistration)?
                    <div className="field">
                        <p className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="Email" value={email}
                                   onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.email, e.target.value)}/>
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"/>
                                </span>
                        </p>
                    </div>
                    : ""
                }
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                        <input className="input" type="text" placeholder="Username" value={username}
                               onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.username, e.target.value)}/>
                        <span className="icon is-small is-left">
                                <i className="fas fa-users"/>
                                </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input className="input" type="password" placeholder="Password" value={password}
                               onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.password, e.target.value)}/>
                        <span className="icon is-small is-left"><i className="fas fa-lock"/></span>
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-success" onClick={onActionEvent}>
                            {(type !== formTypeRegistration)?"Login":"Register"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
    </section>
);

export default Form;