import React from 'react';
import { Button, notification } from 'antd';


const Notification = ({ description }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: 'Ошибка!',
      description: description || "Описание ошибки отсутствует",
      showProgress: true,
      pauseOnHover: true,
    });
  };
  return (
    <>
      {contextHolder}
        <Button type="primary" onClick={openNotification}>
          Pause on hover
        </Button>
    </>
  );
};
export default Notification;