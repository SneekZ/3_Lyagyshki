import React, { useState } from "react";
import { Button, Modal, Input, Flex } from "antd"
import * as XLSX from "xlsx"
import api from './../../../axios_config'

const ButtonCheckSigns = ({ lpuId }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [inputText, setInputText] = useState("")

    const [loading, setLoading] = useState(false)

    const [data, setData] = useState([{}])

    const [result, setResult] = useState("")
    
    const handleCheck = () => {
        const regex = /\d+/gm
        const parsed_text = [...inputText.match(regex)]

        setLoading(true)
        setResult("")
        const install = async () => {
            try {
                const response = await api.post(`/${lpuId}/signs/check/id/list`, {
                    data: parsed_text
                })
                setData(response.data.data)
                setResult("Успешно")
            } catch (error) {
                setResult(error.response.data.detail)
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
        setModalOpen(false)
    }

    const handleDownload = () => {
        console.log(data)
        const ws = XLSX.utils.json_to_sheet(data)

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Результат проверки")

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformatsapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "data.xlsx"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="default_button">
            <Button className="default_button" onClick={handleClick}>Проверить список подписей</Button>
            <Modal
            open={modalOpen}
            title="Проверка спиcка id"
            onCancel={handleClose}
            onPressEnter={handleCheck}
            footer={[
                <Button type="primary" loading={loading} onClick={handleCheck}>
                   Проверить 
                </Button>,
                <Button type="default" onClick={handleClose}>
                    Назад
                </Button>,
            ]}
            >
            <Input placeholder="Введите список подписей" onChange={(e) => {setInputText(e.target.value)}} onPressEnter={handleCheck} allowClear/>
            <Flex justify="space-between" align="center">
                <p>Результат: {result}</p>
                <Button style={{ marginTop: "1%" }} type="default" disabled={(result == "Успешно") ? false : true} onClick={handleDownload}>Скачать</Button>
            </Flex>
            </Modal>
        </div>
    )
}

export default ButtonCheckSigns;