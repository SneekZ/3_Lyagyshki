import React, { useState, useEffect } from "react";
import { Flex } from 'antd';
import LpuSelector from "./components/LpuSelector";
import ButtonLoadSigns from "./components/ButtonLoadSigns";
import SignsTable from "./components/SignsTable";
import ModalNameClick from "./components/ModalNameClick";

const Signs = () => {

    const [lpuId, setLpuId] = useState(0)
    const [signs, setSigns] = useState(undefined)
    const [activeSign, setActiveSign] = useState({
        lpu_id: 0,
        name: "Имя",
        snils: "Снилс",
        sha: "SHA1 Отпечаток"
    })
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <Flex className="main_app_container" vertical={true}>
            <Flex className="row_selector" gap="middle">
                <LpuSelector lpuId={lpuId} setLpuId={setLpuId}/>
                <ButtonLoadSigns lpuId={lpuId} setSigns={setSigns}/>
            </Flex>
            <Flex class_name="row_table">
                <SignsTable signs={signs} setModalOpen={setModalOpen} setActiveSign={setActiveSign}/>
                <ModalNameClick modalOpen={modalOpen} setModalOpen={setModalOpen} activeSign={activeSign}/>
            </Flex>
        </Flex>
        )
    }

export default Signs;