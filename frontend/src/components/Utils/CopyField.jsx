import react, { useState } from "react";
import { message } from "antd";
import { CopyToClipboard } from 'react-copy-to-clipboard';


const CopyTextField = ({ inputText }) => {
    if (inputText == "" || inputText == undefined) {
        return <></>
    }

    const [messageApi, contextHolder] = message.useMessage();
    const showMessageCopied = () => {
        messageApi.open({
            type: "success",
            content: "Текст был скопирован"
        })
    }

    
    return (
        <>
            {contextHolder}
            <CopyToClipboard text={inputText}>
                <div className="copy-text-div" onClick={showMessageCopied}>
                    <span style={{ marginRight: "6px" }}>{inputText}</span>
                    <span class="copy-icon">📋</span>
                </div>
            </CopyToClipboard>
        </>
    )
}

export default CopyTextField;