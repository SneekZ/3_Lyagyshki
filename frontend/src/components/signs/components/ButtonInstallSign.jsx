import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Switch, Flex } from "antd";
import api from './../../../axios_config'

const ButtonInstallSigns = ({ lpuId }) => {
    const [modalOpen, setModalOpen] = useState(false)
    
    const [installedSnils, setInstalledSnils] = useState("")
    const [installedSha, setInstalledSha] = useState("")
    const [result, setResult] = useState("")

    const [containerName, setContainerName] = useState("")
    const [loading, setLoading] = useState(false)

    const [switched, setSwitched] = useState(false)
    const [switchText, setSwitchText] = useState("Установка по названию контейнера")

    const [err, setErr] = useState("")

    const onSwitch = (checked) => {
        setSwitched(checked)
    }

    useEffect(() => {
        if (switched) {
            setSwitchText("Установка по названию подписи")
        } else {
            setSwitchText("Установка по названию контейнера")
        }
    }, [switched])
    
    const handleInstall = () => {
        setLoading(true)
        const install = async () => {
            try {
                const route = switched ? "name" : "container"

                const response = await api.post(`/${lpuId}/signs/install/${route}`, {
                    container_name: containerName
                })

                setInstalledSnils(response.data.snils)
                setInstalledSha(response.data.sha)
                setResult("Успешно установлена")
                setErr("")
            } catch (error) {
                setInstalledSha("")
                setInstalledSnils("")
                setResult("")
                setErr(error.response.data.detail)
            } finally {
                setLoading(false)
            }
        }
        install()
    }

    const handleClick = () => {
        setModalOpen(true)
    }

    const handleClose = () => {
        // setInstalledSha("")
        // setInstalledSnils("")
        // setResult("")
        setModalOpen(false)
    }

    return (
        <div className="default_button">
            <Button className="default_button" onClick={handleClick}>Установить подпись</Button>
            <Modal
            open={modalOpen}
            title="Установка подписи"
            onCancel={handleClose}
            footer={[
                <Button type="primary" loading={loading} onClick={handleInstall}>
                    Установить подпись
                </Button>,
                <Button type="default" onClick={handleClose}>
                    Назад
                </Button>,
            ]}
            >
            <p>Результат: {result}</p>
            <p>СНИЛС: {installedSnils}</p>
            <p>SHA1 Отпечаток: {installedSha}</p>
            <p>Ошибка: {err}</p>
            <Flex gap="middle">
                <Switch onChange={onSwitch}/>
                <div>{switchText}</div>
            </Flex>
            <br/>
            <Input placeholder={switchText} onChange={(e) => {setContainerName(e.target.value)}} onPressEnter={handleInstall} allowClear/>
            </Modal>
        </div>
    )
}

export default ButtonInstallSigns;