import React from "react";

const QuestionPost = ({post, onUpVoteEvent, onDownVoteEvent}) =>(
    <section className="section hero is-dark">
        <div className="columns is-centered">
            <div className="column is-two-thirds">
                <article className="media">
                    <div className="media-content">
                        <div className="content">
                            <div>
                                <h1 className="title">
                                    <strong>{post.title}</strong>
                                </h1>
                                <h5 className="subtitle is-5">
                                    {post.author.username} - {post.author.score}
                                </h5>
                                <h6 className="subtitle is-6">
                                    {post.date}
                                </h6>
                                <h6 className="subtitle is-6">
                                    {post.upvotes - post.downvotes}
                                </h6>
                                <br/>
                                <article className="media">
                                    {post.body}
                                </article>
                                <br/>
                                <span>
                                    <div className="button is-link" onClick={()=>(onUpVoteEvent(post.id))}>Upvote</div>
                                    <div className="button is-link margin-left-1"  onClick={()=>(onDownVoteEvent(post.id))}>Downvote</div>
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
);

export default QuestionPost;