import React from "react";

const QuestionAnswers = ({answerstList, onUpVoteEvent, onDownVoteEvent}) =>(
    <section className="section hero is-light" data-cy="answers_container">
        <div className="columns is-centered">
            <div className="column is-two-thirds">
                {answerstList.map(post=>(
                <article className="media" key={post.id} >
                    <div className="media-content">
                        <div className="content" >
                            <div>
                                <strong>{post.author.username}-{post.author.score}</strong>
                                <p>{post.upvotes - post.downvotes}</p>
                                <br/>
                                <p>{post.body}</p>
                                    <br/>
                                <small>
                                    <div className="button is-link" onClick={()=>(onUpVoteEvent(post.id))}>Upvote</div>
                                    <div className="button is-link margin-left-1" onClick={()=>(onDownVoteEvent(post.id))}>Downvote</div>
                                </small>
                            </div>
                        </div>
                    </div>
                </article>
                ))}
            </div>
        </div>
    </section>
);

export default QuestionAnswers;