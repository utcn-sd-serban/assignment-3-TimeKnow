import React from "react";

const Dashboard = ({postList, onEditEvent, onDeleteEvent}) =>(
    <section className="section hero is-dark">
        <div className="container">
            <div className="columns is-multiline is-mobile">
                { postList.map((post, index)=>(
                    <div className="column is-one-quarter" key={index} data-cy="dashboard_card">
                        <div className="card">
                            <header className="card-header content-dark has-text-centered">

                            </header>
                            <div className="card-content content-white">
                                <div className="content generic-text-dark" data-cy="dashboard_card_body">
                                    {post.body}
                                </div>
                                <footer className="card-footer ">
                                    <div className="card-footer-item link-hoverable " data-cy="dashboard_card_edit_button" onClick={()=>onEditEvent(post.id)}>Edit</div>
                                    <div className="card-footer-item link-hoverable" data-cy="dashboard_card_delete_button" onClick={()=>onDeleteEvent(post.id)}>Delete</div>
                                </footer>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Dashboard;