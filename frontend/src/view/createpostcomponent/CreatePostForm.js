import React from "react";

const CreatePostForm = ({propertyContentMapper, onPropertyChangeEvent, onPropertyTagsChangeEvent, onActionEvent}) =>(
    <section className="section content-grey">
        <div className="container">
            <div className="columns is-mobile is-centered is-vcentered">
                <div className="column is-half">
                    <div className="field">
                        <div className="control">
                            <label className="label generic-text">Your Question Title:</label>
                        </div>
                        <div className="control has-icons-left">
                            <input className="input" type="text" data-cy="form_question-title" onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.title, e.target.value)}
                                   placeholder="What's your programming question? Be specific." />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-heading"/>
                                </span>
                        </div>
                    </div>
                    <div className="control">
                        <label className="label generic-text">Description: </label>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <textarea className="textarea" onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.body, e.target.value)}
                                      placeholder="Include details about your goals and problem" data-cy="form_question-body"/>
                        </p>
                    </div>
                    <div className="control">
                        <label className="label generic-text">Tags: </label>
                    </div>
                    <div className="field">
                        <p className="control has-icons-left">
                            <input className="input" type="Text" onChange={(e)=>onPropertyTagsChangeEvent(e.target.value)}
                                   placeholder="Tags help the right people find and answer your question." data-cy="form_question-tags"/>
                            <span className="icon is-small is-left">
                                <i className="fas fa-tags"/>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success" data-cy="form_post_createbutton" onClick={onActionEvent} >
                                Post
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default CreatePostForm;