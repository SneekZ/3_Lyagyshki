import React, {useState, useEffect} from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { useMessage } from '../../Utils/MessageContext';


const LpuTable = ({ lpuList, loading }) => {
    const showMessage = useMessage();

    const { Column, ColumnGroup } = Table;

    return (
        <ConfigProvider
            theme={{
            token: {
                colorBgContainer: "#2a2b32",
                colorText: "#ffffff",
                colorBgBase: "#2a2b32",
                colorBorderSecondary: "#2a2b32",
                headerColor: "#2a2b32"
            }
            }}
        >
            <Table
                loading={loading}
                dataSource={lpuList}
                pagination={{ pageSize: 5000, position: ['none', 'none'] }}
                scroll={{ 
                    x: "max-content",
                    y: 55 * 10,
                }}
            >
                <Column title="Название" dataIndex="name" key="name" />
                <ColumnGroup title="Сервер сервисов ЛПУ">
                    <Column title="Хост" dataIndex="host" key="host" />
                    <Column title="Порт" dataIndex="port" key="port" />
                    <Column title="Юзер" dataIndex="user" key="user" />
                    <Column title="Пароль" dataIndex="password" key="password" />
                </ColumnGroup>
                <ColumnGroup title="База данных ЛПУ">
                    <Column title="Хост" dataIndex="dbhost" key="dbhost" />
                    <Column title="Порт" dataIndex="dbport" key="dbport" />
                    <Column title="Юзер" dataIndex="dbuser" key="dbuser" />
                    <Column title="Пароль" dataIndex="dbpassword" key="dbpassword" />
                </ColumnGroup>
                <Column title="Схема бд" dataIndex="database" key="database" />
                <Column title="Путь до контейнеров" dataIndex="path" key="path" />
            </Table>
        </ConfigProvider>
    )
}

export default LpuTable;