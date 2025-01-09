import React, { useState, useEffect } from "react";
import { Flex } from 'antd';
import LpuSelector from "./components/LpuSelector";
import ButtonLoadSigns from "./components/ButtonLoadSigns";
import SignsTable from "./components/SignsTable";

const Signs = () => {

    const [lpuId, setLpuId] = useState(0)
    const [signs, setSigns] = useState([{}])

    return (
        <Flex className="main_app_container" vertical={true}>
            <Flex className="row_selector" gap="middle" wrap>
                <LpuSelector lpuId={lpuId} setLpuId={setLpuId}/>
                <ButtonLoadSigns lpuId={lpuId} setSigns={setSigns}/>
            </Flex>
            <Flex class_name="row_table" wrap>
                <SignsTable className="row_table" signs={signs}/>
            </Flex>
        </Flex>
        )
    }

export default Signs;