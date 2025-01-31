import React, { createContext, useContext } from 'react';
import { message } from 'antd';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = (content) => {
        const type = 'error';
        messageApi.open({ type, content });
    };

    return (
        <MessageContext.Provider value={ showMessage }>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    return useContext(MessageContext);
};