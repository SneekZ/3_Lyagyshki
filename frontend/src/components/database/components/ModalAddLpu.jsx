import React, {useState, useEffect, useRef} from "react";
import { Modal, Input, Flex, message } from 'antd';
import api from '../../../axios_config';


const ModalAddLpu = ({ modalOpen, setModalOpen }) => {

    const [messageApi, contextHolder] = message.useMessage();
    const showMessage = (type, content) => {
        messageApi.open({
            type: type,
            content: content
        })
    }

    const [loading, setLoading] = useState(false);

    const refName = useRef(null);
    const refHost = useRef(null);
    const refPort = useRef(null);
    const refUser = useRef(null);
    const refPassword = useRef(null);
    const refDbHost = useRef(null);
    const refDbPort = useRef(null);
    const refDbUser = useRef(null);
    const refDbPassword = useRef(null);
    const refDatabase = useRef(null);
    const refPath = useRef(null);

    const handleOk = () => {
        setLoading(true);

        const newLpu = {
            name: refName.current.input.value,
            host: refHost.current.input.value,
            port: refPort.current.input.value ? refPort.current.input.value : refPort.current.input.placeholder,
            user: refUser.current.input.value ? refUser.current.input.value : refUser.current.input.placeholder,
            password: refPassword.current.input.value ? refPassword.current.input.value : refPassword.current.input.placeholder,
            dbhost: refDbHost.current.input.value ? refDbHost.current.input.value : refDbHost.current.input.placeholder,
            dbport: refDbPort.current.input.value ? refDbPort.current.input.value : refDbPort.current.input.placeholder,
            dbuser: refDbUser.current.input.value ? refDbUser.current.input.value : refDbUser.current.input.placeholder,
            dbpassword: refDbPassword.current.input.value ? refDbPassword.current.input.value : refDbPassword.current.input.placeholder,
            database: refDatabase.current.input.value ? refDatabase.current.input.value : refDatabase.current.input.placeholder,
            path: refPath.current.input.value ? refPath.current.input.value : refPath.current.input.placeholder,
            logger: ""
        }

        if (!newLpu.name) {
            showMessage("error", "Название обязательно для заполнения");
            setLoading(false);
            return;
        }
        if (!newLpu.host) {
            showMessage("error", "Хост сервисов обязателен для заполнения");
            setLoading(false);
            return;
        }
        if (!newLpu.dbhost) {
            showMessage("error", "Хост бд обязателен для заполнения");
            setLoading(false);
            return;
        }

        addLpu(newLpu);

        setLoading(false);
    }

    const addLpu = async (newLpu) => {
        try {
            await api.post("/lpu", newLpu);
            showMessage("success", "ЛПУ успешно добавлена");
            setModalOpen(false);
        } catch (error) {
            if (error.response) {
                showMessage("error", error.response.data.detail)
            } else if (error.request) {
                showMessage("error", "Ошибка сети. Проверьте подключение к интернету")
            } else {
                showMessage("error", "Неизвестная ошибка: " + error.message)
            }
        }
    }

    const handleClose = () => {
        setModalOpen(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Добавление ЛПУ"
                open={modalOpen}
                onOk={handleOk}
                confirmLoading={loading}
                onCancel={handleClose}
            >
                <div className="lpu_add_tip">
                    <span>
                        Поля с плейсхолдерами необязательны для заполнения, оставь их пустыми и они будут использовать своё стандартное значение
                    </span>
                    <br/>
                    <span>
                        Поля, не имеющие плейсхолдеров, являются обязательными для заполнения
                    </span>
                </div>
                <Flex vertical={true} gap="8px">
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Название</span>
                        <Input ref={refName} loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Хост сервисов</span>
                        <Input ref={refHost} loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Порт сервисов</span>
                        <Input ref={refPort} placeholder="22" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Юзер сервисов</span>
                        <Input ref={refUser} placeholder="root" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Пароль сервисов</span>
                        <Input ref={refPassword} placeholder="shedF34A" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Хост бд</span>
                        <Input ref={refDbHost} loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Порт бд</span>
                        <Input ref={refDbPort} placeholder="3306" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Юзер бд</span>
                        <Input ref={refDbUser} placeholder="dbuser" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Пароль бд</span>
                        <Input ref={refDbPassword} placeholder="dbpassword" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Схема бд</span>
                        <Input ref={refDatabase} placeholder="s11" loading={loading} allowClear/>
                    </Flex>
                    <Flex gap="8px" align="center">
                        <span style={{ whiteSpace: "nowrap", width: "150px", display: "inline-block" }}>Путь</span>
                        <Input ref={refPath} placeholder="/var/opt/cprocsp/keys/root" loading={loading} allowClear/>
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}

export default ModalAddLpu;