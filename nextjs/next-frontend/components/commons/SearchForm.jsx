import React, { useState } from 'react';


export function SearchForm({category, search}) {
    const [searchForm, setSearchForm] = useState({"type":"title"});

    const handleChangeForm = (e) => {
            const { name, value } = e.target;
            setSearchForm({ ...searchForm, [name]: value});
    }

    const handleSearch = () => {
        search(searchForm);
    }

    return (
        <div>
            <select name="type"
                    style={{width:"15%", marginRight:"5px"}}
                    onChange={handleChangeForm}>
                {category && category.map(item => 
                    <option value={item.value} key={item.name}>{item.name}</option>
                )}
            </select>
            <input  type="text" 
                    name="keyword"
                    style={{width:"40%", marginRight:"5px"}}
                    onChange={handleChangeForm}/>
            <button onClick={handleSearch}>검색하기</button>
        </div>
    );
}

