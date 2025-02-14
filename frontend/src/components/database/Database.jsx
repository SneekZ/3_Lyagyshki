import React, { useState, useEffect } from "react";
import { Flex, Button, ConfigProvider, theme } from "antd";
import LpuTable from "./components/LpuTable";
import LpuFilterInput from "./components/LpuFilterInput";
import ModalAddLpu from "./components/ModalAddLpu";
import api from "../../axios_config";

const Database = () => {
  const [lpuList, setLpuList] = useState([{}]);
  const [fullLpuList, setFullLpuList] = useState([{}]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLpuList = async (signal) => {
    setLoading(true);

    try {
      const response = await api.get("/lpu", { signal });
      setLpuList(response.data.data);
      setFullLpuList(response.data.data);
    } catch (error) {
      if (error.response) {
        showMessage(error.response.data.detail);
      } else if (error.request) {
        showMessage("Ошибка сети. Проверьте подключение к интернету");
      } else {
        showMessage("Неизвестная ошибка: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchLpuList(signal);

    return () => {
      controller.abort();
    };
  }, [modalOpen]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Flex
        gap="12px"
        style={{
          marginBottom: "12px",
        }}
      >
        <LpuFilterInput
          setLpuList={setLpuList}
          loading={loading}
          fullLpuList={fullLpuList}
          style={{ height: "50px", flex: 0.85 }}
        />
        <Button
          style={{ height: "50px", flex: 0.15 }}
          onClick={() => setModalOpen(true)}
        >
          Добавить ЛПУ
        </Button>
        <ModalAddLpu modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Flex>
      <LpuTable lpuList={lpuList} loading={loading} />
    </ConfigProvider>
  );
};

export default Database;
