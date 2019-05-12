import React from "react";



const SearchBar = ({suggestions, propertyContentMapper, onPropertyChangeEvent, onSearchEvent}) =>(
    <section className="section content-grey content-min-25">
        <div className="container">
            <div className="columns is-mobile is-centered is-vcentered">
                <div className="column is-three-quarters">
                    <div className="field has-addons">
                        <p className="control">
                            <span className="select is-large">
                                <select onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.searchType, e.target.value)}>
                                    <option>By Title</option>
                                    <option>By Tag</option>
                                </select>
                            </span>
                        </p>
                        <div className="control has-icons-left is-expanded">
                            <form>
                            <input className="input is-large is-fullwidth" type="text" autoComplete="Yes"
                                   placeholder="Search..." list="Suggestions"
                                   onChange={(e)=>onPropertyChangeEvent(propertyContentMapper.currentSearch, e.target.value)}
                            />
                            <datalist id="Suggestions">
                                {
                                    suggestions.map((suggestion, index)=>(
                                        <option key={index} value={suggestion}/>
                                    ))
                                }
                            </datalist>
                            </form>
                            <span className="icon is-small is-left">
                                <i className="fas fa-search"/>
                                </span>
                        </div>
                        <div className="control">
                            <div className="button is-info is-large" onClick={onSearchEvent}>Search</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default SearchBar;