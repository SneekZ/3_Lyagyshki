import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Upload, Flex } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import api from './../../../axios_config'
import { useMessage } from "../../Utils/MessageContext";
import FolderInstallation from "./ButtonInstallSign/FolderInstallation";
import CopyTextField from "../../Utils/CopyField";

const ButtonInstallSigns = ({ lpuId }) => {
    const [modalOpen, setModalOpen] = useState(false)
    
    const [installedSnils, setInstalledSnils] = useState("")
    const [installedSha, setInstalledSha] = useState("")
    const [result, setResult] = useState("")

    const [containerName, setContainerName] = useState("")
    const [loading, setLoading] = useState(false)

    const [err, setErr] = useState("")

    const showMessage = useMessage();

    const handleInstall = () => {
        setLoading(true)
        const install = async () => {
            if (containerName == "") {
                setLoading(false);
                return null;
            }
            try {
                const response = await api.post(`/${lpuId}/container/install/name`, {
                    container_name: containerName
                })

                setInstalledSnils(response.data.snils)
                setInstalledSha(response.data.sha)
                setResult("Успешно установлена")
                setErr("")
            } catch (error) {
                setInstalledSha("")
                setInstalledSnils("")
                setResult("Не удалось установить")
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

    const handleChange = (info) => {
        if (info.file.status === 'error') {
            showMessage(`${info.file.name} не удалось загрузить`);
        }
    };
    
    const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await api.post(`/${lpuId}/container/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                const percent = Math.round((event.loaded * 100) / event.total);
                onProgress({ percent });
                },
            });
            onSuccess(response.data, file);
        } catch (error) {
            if (error.response) {
                showMessage(error.response.data.detail)
            } else if (error.request) {
                showMessage("Ошибка сети. Проверьте подключение к интернету")
            } else {
                showMessage("Неизвестная ошибка: " + error.message)
            }
            onError(error);
        }
    }

    return (
        <div className="default_button">
            <Button className="default_button" onClick={handleClick}>Установить подпись</Button>
            <Modal
            open={modalOpen}
            title="Установка подписи"
            onCancel={handleClose}
            onPressEnter={handleInstall}
            footer={[
                <Button type="primary" loading={loading} onClick={handleInstall}>
                    Установить подпись
                </Button>,
                <Button type="default" onClick={handleClose}>
                    Назад
                </Button>,
            ]}
            >
            <Flex vertical="true" gap="14px">
                <div style={{marginBot: "10px"}}/>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
                    <span>СНИЛС: </span>
                    <CopyTextField inputText={installedSnils}/>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
                    <span>SHA Отпечаток: </span>
                    <CopyTextField inputText={installedSha}/>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
                    <span style={{display: "flex", alignItems: "center", padding: "2px"}}>Результат: {result}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
                    <span style={{display: "flex", alignItems: "center", padding: "2px"}}>Ошибка: {err}</span>
                </div>
                <div style={{marginBot: "10px"}}/>
            </Flex>
            <Input
                placeholder={"Установка по уникальному имени подписи"}
                onChange={(e) => {setContainerName(e.target.value)}}
                onPressEnter={handleInstall}
                style={{ marginBottom: "16px" }}
                allowClear
            />
            <FolderInstallation lpuId={lpuId}/>
            <Upload customRequest={customRequest} onChange={handleChange} style={{ marginTop: "16px", marginBot:"16px" }}>
                <Button icon={<UploadOutlined />} style={{ marginTop: "16px", width: "100%" }}>Загрузить архив (пока что только .zip)</Button>
            </Upload>
            </Modal>
        </div>
    )
}

export default ButtonInstallSigns;