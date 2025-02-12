import React, { useState } from "react";
import { Button, ConfigProvider, theme } from "antd";
import api from './../../../axios_config'
import { useMessage } from "../../Utils/MessageContext";

const ButtonLoadSigns = ({ lpuId, setSigns }) => {

    const showMessage = useMessage();

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/${lpuId}/signs`)
            setSigns(response.data.data)
        } catch (error) {
            if (error.response) {
                showMessage(error.response.data.detail)
            } else if (error.request) {
                showMessage("Ошибка сети. Проверьте подключение к интернету")
            } else {
                showMessage("Неизвестная ошибка: " + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleClick = () => {
        loadData()
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            <Button
                className="default_button"
                onClick={handleClick}
                loading={ loading }
                >
                    Загрузить данные
            </Button>
        </ConfigProvider>
    )
}

export default ButtonLoadSigns;