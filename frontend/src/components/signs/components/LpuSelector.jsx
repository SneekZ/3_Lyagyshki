import React, { useState, useEffect } from "react";
import { Select, ConfigProvider, theme } from 'antd';
import api from '../../../axios_config';
import { useMessage } from "../../Utils/MessageContext";

const LpuSelector = ({lpuId, setLpuId}) => {

    const [lpuData, setLpuData] = useState([{}])

    const showMessage = useMessage();

    const fetchData = async (signal) => {
        try {
            const response = await api.get('/lpu', {signal})
            return response.data
        } catch (error) {
            if (error.response) {
                showMessage(error.response.data.detail || "Ошибка на сервере")
            } else if (error.request) {
                showMessage("Ошибка сети. Проверьте подключение к интернету")
            } else {
                showMessage("Неизвестная ошибка: " + error.message)
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getData = async (signal) => {
            const response = await fetchData(signal)
            setLpuData(response.data)
        }
        getData(signal)

        return () => {
            controller.abort();
        }
    }, [])

    const handleChange = (value) => {
        setLpuId(value)
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
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
                autoFocus
            />
        </ConfigProvider>
        )
    }

export default LpuSelector;