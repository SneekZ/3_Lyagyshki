import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import api from './../../../axios_config'

const ButtonInstallSigns = ({ lpuId }) => {
    const [modalOpen, setModalOpen] = useState(false)
    
    const [installedSnils, setInstalledSnils] = useState("")
    const [installedSha, setInstalledSha] = useState("")
    const [result, setResult] = useState("")

    const [containerName, setContainerName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleInstall = () => {
        setLoading(true)
        const install = async () => {
            try {
                const response = await api.post(`/${lpuId}/signs/install`, {
                    container_name: containerName
                })
                setInstalledSnils(response.data.snils)
                setInstalledSha(response.data.sha)
                setResult("Успешно установлена")
            } catch (error) {
                alert(error.response.data.detail)
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
            title="Установка подписи по имени контейнера"
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
            <p>СНИЛС: {installedSnils}</p>
            <p>SHA1 Отпечаток: {installedSha}</p>
            <p>Результат: {result}</p>
            <Input placeholder="Имя контейнера" onChange={(e) => {setContainerName(e.target.value)}} allowClear/>
            </Modal>
        </div>
    )
}

export default ButtonInstallSigns;