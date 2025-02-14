import React, { useState } from "react";
import { Input, Button, Modal } from "antd";
import api from "../../../../axios_config";

const ChangePasswordModal = ({ lpuId, idsList }) => {
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    console.log(newPassword);
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)} style={{ height: "25px" }}>
        Сменить пароль
      </Button>
      <Modal
        open={openModal}
        title="Смена пароля для ецп в бд"
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
      >
        <Input onChange={(e) => setNewPassword(e.target.value)} />
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
