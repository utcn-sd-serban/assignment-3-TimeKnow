import React from "react";

const EditPost = ({postContent, onPropertyChangeEvent, onActionEvent}) =>(
    <section className="section">
        <div className="container">
            <div className="columns is-mobile is-centered is-vcentered">
                <div className="column is-half">
                    <div className="control">
                        <label className="label">Description: </label>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <textarea className="textarea" onChange={(e)=>onPropertyChangeEvent(e.target.value)}
                                     value={postContent} placeholder="Include details about your goals and problem"/>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success" onClick={()=>onActionEvent(postContent.id)}>
                                Done
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default EditPost;