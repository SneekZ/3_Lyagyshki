import React, { useState, useContext } from "react";
import { Input, Button, Modal } from "antd";
import api from "../../../../axios_config";
import { useMessage } from "../../../Utils/MessageContext";

const ChangePasswordModal = ({ lpuId, idsList }) => {
  const showMessage = useMessage();

  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    updatePassword();
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      await api.post(`/${lpuId}/password`, {
        password: newPassword,
        person_id: idsList,
      });
      showMessage("Пароль изменен успешно", "success");
    } catch (error) {
      if (error.response) {
        const errorDetail = error.response.data.detail;
        const errorMessage =
          typeof errorDetail === "string"
            ? errorDetail
            : JSON.stringify(errorDetail);
        showMessage(errorMessage);
      } else if (error.request) {
        showMessage("Ошибка сети. Проверьте подключение к интернету");
      } else {
        showMessage("Неизвестная ошибка: " + error.message);
      }
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        style={{ height: "25px" }}
        loading={loading}
      >
        Сменить пароль
      </Button>
      <Modal
        open={openModal}
        title="Смена пароля для ЭЦП в бд"
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
        loading={loading}
      >
        <Input onChange={(e) => setNewPassword(e.target.value)} />
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
