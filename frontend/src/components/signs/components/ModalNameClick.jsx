import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import api from '../../../axios_config';

const ModalNameClick = ({ modalOpen, setModalOpen, activeSign }) => {
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [result, setResult] = useState("");
  const [password, setPassword] = useState("");

  const handleCheck = () => {
    setLoadingCheck(true)
    const check = async () => {
        try {
            const response = await api.get(`/${activeSign.lpu_id}/signs/check/snils/${activeSign.snils}`)
            if (response.data.ok) {
                setResult("Работает")
                setPassword(response.data.data)
            } else {
                setResult(response.data.data)
            }
        } catch (error) {
            alert(error.response.data.detail)
        } finally {
            setLoadingCheck(false)
        }
    }
    check();
  }

  const handleDelete = () => {
    setLoadingDelete(true)
    const del = async () => {
        try {
            const response = await api.delete(`/${activeSign.lpu_id}/signs/delete`, {
                data: {
                    sha: activeSign.sha
                }
            })
            setResult("Подпись удалена успешно")
        } catch (error) {
            alert(error.response.data.detail)
        } finally {
            setLoadingDelete(false)
        }
    }
    del()
  }

  const handleClose = () => {
    setResult("")
    setPassword("")
    setModalOpen(false)
  }
  return (
    <>
      <Modal
        open={modalOpen}
        title={activeSign.name}
        onCancel={handleClose}
        footer={[
            <Button type="primary" loading={loadingCheck} onClick={handleCheck}>
                Проверить подпись
            </Button>,
            <Button type="primary" loading={loadingDelete} danger onClick={handleDelete}>
                Удалить подпись
            </Button>,
            <Button type="default" onClick={handleClose}>
                Назад
            </Button>,
        ]}
      >
        <p>СНИЛС: {activeSign.snils}</p>
        <p>SHA1 Отпечаток: {activeSign.sha}</p>
        <p>Результат: {result}</p>
        <p>Пароль: {password}</p>
      </Modal>
    </>
  );
};
export default ModalNameClick;