import React from "react";

const PostResponder = ({propertyContentMapper, onChangeResponseTextEvent, onPostResponseEvent}) =>(
    <section className="section hero content-dark">
        <div className="columns is-centered">
            <div className="column is-12">
                <div className="media-content">
                    <div className="field">
                        <p className="control">
                            <textarea className="textarea" placeholder="Post an answer..."
                                      onChange={(e)=>(onChangeResponseTextEvent(propertyContentMapper.body, e.target.value))}/>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button" onClick={onPostResponseEvent}>Post Answer</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default PostResponder;