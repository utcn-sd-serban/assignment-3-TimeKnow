import React from "react";

const AdminDashboard = ({tableHeader, tableContent, onActionEvent}) => (
    <section className="section">
        <div className="columns is-centered">
            <table className="table is-striped is-hoverable">
                <thead className="content-grey">
                <tr>
                    {tableHeader.map((header, index) => (
                        <th key={index} className="has-text-centered">
                            <abbr title={header}>
                                <p className="generic-text-colorful">{header}</p>
                            </abbr>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tableContent.map(content => (
                    <tr key={content.id}>
                        <td className="has-text-centered">{content.id}</td>
                        <td className="has-text-centered">{content.username}</td>
                        <td className="has-text-centered">{content.email}</td>
                        <td className="has-text-centered">{content.permission}</td>
                        <td className="has-text-centered">{content.banned.toString()}</td>
                        <td className="has-text-centered">
                            <button className="button is-info" onClick={() => onActionEvent(content.id, true)}>Ban
                            </button>
                        </td>
                        <td className="has-text-centered">
                            <button className="button is-info" onClick={() => onActionEvent(content.id, false)}>UnBan
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </section>
);

export default AdminDashboard;