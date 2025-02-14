import React, { useState } from "react";
import { Input, Button, Modal, ConfigProvider, theme } from "antd";
import Cookies from "js-cookie";

const Login = () => {
  const [openModal, setOpenModal] = useState(true);
  const [user, setUser] = useState("");

  const handleOk = () => {
    if (user) {
      Cookies.set("user", user);
      setOpenModal(false);
    }
  };

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Modal
          open={openModal}
          title="Введите имя пользователя"
          footer={[<Button onClick={handleOk}>Войти</Button>]}
        >
          <div style={{ margin: "40px" }}>
            <Input
              status={user.length > 0 ? "" : "error"}
              onChange={(e) => setUser(e.target.value)}
              onPressEnter={handleOk}
            />
          </div>
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default Login;
