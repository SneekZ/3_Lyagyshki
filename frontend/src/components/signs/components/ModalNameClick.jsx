import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalNameClick = ({ modalOpen, setModalOpen, activeSign }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setModalOpen(false)
  }
  return (
    <>
      <Modal
        open={modalOpen}
        title={activeSign.name}
        footer={[
          <Button key="submit" type="default" loading={loading} onClick={handleClose}>
            Назад
          </Button>,
        ]}
      >
        <p>СНИЛС: {activeSign.snils}</p>
        <p>SHA1 Отпечаток: {activeSign.sha}</p>
      </Modal>
    </>
  );
};
export default ModalNameClick;