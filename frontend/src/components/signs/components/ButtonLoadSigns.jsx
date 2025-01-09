import React from "react";
import { Button, Input, Space, Table, Tag, Modal } from "antd";
import api from './../../../axios_config'

const ButtonLoadSigns = ({ lpuId, setSigns }) => {
    const loadData = async () => {
        try {
            const response = await api.get(`/${lpuId}/signs`)
            setSigns(response.data)
        } catch (error) {
            alert(error.response.data.detail)
        }
    }

    const handleClick = () => {
        loadData()
    }

    return (
        <Button className="default_button" onClick={handleClick}>Загрузить данные</Button>
    )
}

export default ButtonLoadSigns;