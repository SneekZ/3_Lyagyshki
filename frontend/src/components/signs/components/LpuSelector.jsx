import React, { useState, useEffect } from "react";
import { Select } from 'antd';
import api from '../../../axios_config';

const LpuSelector = ({lpuId, setLpuId}) => {

    const [lpuData, setLpuData] = useState([{}])

    const fetchData = async () => {
        try {
            const response = await api.get('/lpu')
            return response.data
        } catch (error) {
            alert(error.response.data.detail)
        }
    }

    useEffect(() => {
        const getData = async () => {
            const response = await fetchData()
            setLpuData(response.data)
        }
        getData()
    }, [])

    const handleChange = (value) => {
        setLpuId(value)
    }

    return (
            <Select
            onChange={handleChange}
            className="lpu_selector"
            showSearch
            placeholder="Выбери ЛПУ"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={lpuData}
            />
        )
    }

export default LpuSelector;