import React, { useState } from "react";
import { Button } from "antd";
import api from './../../../axios_config'

const ButtonLoadSigns = ({ lpuId, setSigns }) => {
    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/${lpuId}/signs`)
            setSigns(response.data.data)
        } catch (error) {
            alert(error.response.data.detail)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = () => {
        loadData()
    }

    return (
        <Button className="default_button" onClick={handleClick} loading={ loading }>Загрузить данные</Button>
    )
}

export default ButtonLoadSigns;