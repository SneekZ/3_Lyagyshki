import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import convertToRu from '../../Utils/ConvertToRu';


const LpuFilterInput = ({ setLpuList, loading, fullLpuList, style }) => {

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (fullLpuList != [{}]) {
            if (searchText == "") {
                setLpuList(fullLpuList);
            } else {
                setLpuList(fullLpuList.filter(lpu => {
                    return lpu.name.toLowerCase().includes(searchText) || lpu.name.toLowerCase().includes(convertToRu(searchText));
                }));
            }
        }

    }, [searchText])

    return (
        <Input
            style={style}
            loading={loading}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            placeholder='Введите текст для поиска' 
        />
    )
}

export default LpuFilterInput;