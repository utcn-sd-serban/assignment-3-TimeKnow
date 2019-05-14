import React from "react";



const Table = ({tableHeader, tableContent, onContentSelected}) =>(
    <section className="section">
        <div className="columns is-centered">
            <table className="table is-striped is-hoverable">
                <thead className="content-grey">
                <tr>
                    {tableHeader.map((header, index)=>(
                        <th key={index} className="has-text-centered"><abbr title={header}><p className="generic-text-colorful">{header}</p></abbr></th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tableContent.map(content=>(
                    <tr key={content.id}>
                        <td className="has-text-centered"><div className="link-hoverable" onClick={()=>(onContentSelected(content.id))}>{content.title}</div></td>
                        <td className="has-text-centered">{content.body}</td>
                        <td className="has-text-centered">{content.upvotes}</td>
                        <td className="has-text-centered">{content.downvotes}</td>
                        <td className="has-text-centered">{content.author.username}</td>
                    </tr>
                ))}
                </tbody>
        </table>
        </div>
    </section>
);

export default Table;