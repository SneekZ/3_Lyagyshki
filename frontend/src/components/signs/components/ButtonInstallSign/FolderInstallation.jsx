import React, { useState, useEffect } from "react";
import { Button, Modal, Row, Col, Card, Checkbox, Input, Collapse } from "antd";
import api from './../../../../axios_config';
import { useMessage } from "../../../Utils/MessageContext";

const FolderInstallation = ({ lpuId }) => {
    const [containerList, setContainerList] = useState([]);
    const [choosenContainerList, setChoosenContainerList] = useState([]);
    const [openSelectModal, setOpenSelectedModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [modalWidth, setModalWidth] = useState(600);
    const [installingSigns, setInstallingSigns] = useState(false);

    const showMessage = useMessage();

    const fetchContainerList = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/${lpuId}/container`);
            setContainerList(response.data.data);
        } catch (error) {
            if (error.response) {
                setFetchError(error.response.data.detail || "Ошибка на сервере");
            } else if (error.request) {
                setFetchError("Ошибка сети. Проверьте подключение к интернету");
            } else {
                setFetchError("Неизвестная ошибка: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cardWidth = 160; 
        const gutter = 16 * 5; 
        setModalWidth(6 * cardWidth + gutter);
    }, []);

    const handleInstall = () => {
        if (choosenContainerList.length == 0) {
            showMessage("Выберите контейнеры для установки!")
        } else {
            setInstallingSigns(true);
        }
    };
    
    const handleClose = () => {
        setOpenSelectedModal(false);
    };

    useEffect(() => {
        if (openSelectModal) {
            fetchContainerList();
        } else {
            setInstallingSigns(false);
        }
    }, [openSelectModal]);

    useEffect(() => {
        if (fetchError !== "") {
            showMessage(fetchError);
        }
    }, [fetchError, showMessage]);

    return (
        <>
            <Button className="default_button" onClick={() => setOpenSelectedModal(true)}>
                Выбрать подписи для установки
            </Button>
            {installingSigns ? (
                <InstallingSigns
                    lpuId={lpuId}
                    selectedData={choosenContainerList}
                    openModal={openSelectModal}
                    setOpenModal={setOpenSelectedModal}
                    setInstallingSigns={setInstallingSigns}
                />
            ) : (
                <>
                    <Modal className="scroll-container"
                    open={openSelectModal}
                    loading={loading}
                    title="Список подписей на сервере"
                    onCancel={handleClose}
                    centered
                    width={`${modalWidth}px`} 
                    styles={{ body: { height: "400px", overflowY: "auto" } }}
                    footer={[
                        <Button type="link" onClick={() => setChoosenContainerList([])}>
                            Выбрано: {choosenContainerList.length}
                        </Button>,
                        <Button type="primary" key="install" onClick={handleInstall}>
                            Установить подпись
                        </Button>,
                        <Button type="default" key="back" onClick={handleClose}>
                            Назад
                        </Button>,
                    ]}
                >
                    <CardGrid
                        selectedData={choosenContainerList}
                        setSelectedData={setChoosenContainerList}
                        inputData={containerList}
                        loading={loading}
                    />
                </Modal>
            </>
            )}
        </>
    );
};

const CardGrid = ({ inputData, selectedData, setSelectedData, loading }) => {
    const [searchQuery, setSearchQuery] = useState(""); 

    const filteredData = inputData.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    const onChange = (checked, name) => {
        setSelectedData((prev) =>
            checked ? [...prev, name] : prev.filter((item) => item !== name)
        );
    };

    return (
        <>
            <Input.Search
                placeholder="Поиск по названию..."
                allowClear
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: "16px" }}
            />

            <div className="scroll-container" style={{ maxHeight: "320px", overflowY: "auto", paddingRight: "8px" }}>
                <Row gutter={[16, 16]} justify="start">
                        {filteredData.map((item) => (
                            <Col key={item} xs={24} sm={12} md={8} lg={4} xl={4}>
                                <Card bordered={false} loading={loading}>
                                    <Checkbox
                                        checked={selectedData.includes(item)}
                                        onChange={(e) => onChange(e.target.checked, item)}
                                    >
                                        {item}
                                    </Checkbox>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </div>
        </>
    );
};

const InstallingSigns = ({ lpuId, selectedData, openModal, setOpenModal, setInstallingSigns }) => {
    return (
        <Modal
        title="Установка подписей"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={[
            <Button type="default" key="back" onClick={() => {
                setOpenModal(false);
                setInstallingSigns(false);
            }}>
                Назад
            </Button>,
        ]}
        >
            <div className="scroll-container" style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "8px" }}>
                {selectedData.map((item) => (
                    <InstallingSignCollapse key={item} lpuId={lpuId} name={item} />
                ))}
            </div>
        </Modal>
    )
}

const InstallingSignCollapse = ({ lpuId, name }) => {
    const [snils, setSnils] = useState("");
    const [sha, setSha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState(null);

    const result = (
        <>
            <p>СНИЛС: {snils}</p>
            <p>Отпечаток: {sha}</p>
            <p>Ошибка: {error}</p>
        </>
    )

    const install = async (signal) => {
        setLoading(true);
        try {
            const response = await api.post(`/${lpuId}/container/install/container`, {
                container_name: name
            }, { signal })

            setSnils(response.data.snils)
            setSha(response.data.sha)
            setError("")
        } catch (error) {
            setSha("")
            setSnils("")
            setError(error.response.data.detail)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        install(signal);

        return () => {
            controller.abort();
        }
    }, [])

    useEffect(() => {
        if (loading) {
            setColor(null);
        } else if (snils != "") {
            setColor("#ccffcc")
        } else if (error != "") {
            setColor("#ffcccc")
        } else {
            setColor(null);
        }
    }, [snils, error, loading])

    const item = [{
        key: '1',
        label: name,
        children: result,
        style: { 
            backgroundColor: color,
            color: "white",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "4px"
        }
    }]

    return (
        <Collapse
            items={item}
            bordered={false}
            loading={loading}
        />
    )
}

export default FolderInstallation;
