import React, { useState, useEffect } from 'react';
import { Button, Modal, Popconfirm, Flex, Skeleton } from 'antd';
import api from '../../../axios_config';
import CopyTextField from '../../Utils/CopyField';
import useMessage from 'antd/es/message/useMessage';

const ModalNameClick = ({ modalOpen, setModalOpen, activeSign }) => {
  const showMessage = useMessage();

  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingFind, setLoadingFind] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [result, setResult] = useState("");
  const [password, setPassword] = useState("");
  const [ids, setIds] = useState("");

  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    if (modalOpen) {
      check();
      findIds();
    }
  }, [modalOpen])

  useEffect(() => {
    if (loadingCheck || loadingFind) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingCheck, loadingFind])

  const check = async () => {
    setLoadingCheck(true);
    try {
          const response = await api.get(`/${activeSign.lpu_id}/signs/check/snils/${activeSign.snils}`)
          if (response.data.ok) {
              setResult("Работает")
              setPassword(response.data.data)
          } else {
              setResult(response.data.data)
          }
      } catch (error) {
        if (error.response) {
            showMessage(error.response.data.detail)
        } else if (error.request) {
            showMessage("Ошибка сети. Проверьте подключение к интернету")
        } else {
            showMessage("Неизвестная ошибка: " + error.message)
        }
      } finally {
        setLoadingCheck(false);
      }
  }

  const findIds = async () => {
    setLoadingFind(true);
    try {
      const response = await api.get(`/${activeSign.lpu_id}/persons/snils/${activeSign.snils}`);
      if (response.data.data) {
        setIds(response.data.data.join(", "))
      }
    } catch (error) {
      if (error.response) {
        showMessage(error.response.data.detail)
      } else if (error.request) {
        showMessage("Ошибка сети. Проверьте подключение к интернету")
      } else {
        showMessage("Неизвестная ошибка: " + error.message)
      }
    } finally {
      setLoadingFind(false);
    }
  }

  const handleDelete = () => {
    setLoadingDelete(true)
    setPopupOpen(false)
    const del = async () => {
        try {
            const response = await api.delete(`/${activeSign.lpu_id}/signs/delete`, {
                data: {
                    sha: activeSign.sha
                }
            })
            setResult("Подпись удалена успешно")
        } catch (error) {
          if (error.response) {
              showMessage(error.response.data.detail)
          } else if (error.request) {
              showMessage("Ошибка сети. Проверьте подключение к интернету")
          } else {
              showMessage("Неизвестная ошибка: " + error.message)
          }
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
        loading={loading}
        open={modalOpen}
        title={activeSign.name}
        onCancel={handleClose}
        footer={[
            <Button type="primary" onClick={() => {
              check();
              findIds();
            }}>
              Проверить подпись
            </Button>,
            <Popconfirm
              title="Удаление подписи"
              description="Точно удаляем?"
              open={popupOpen}
              onConfirm={handleDelete}
              onCancel={() => { setPopupOpen(false) }}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="primary" loading={loadingDelete} danger onClick={() => { setPopupOpen(true) }}>
                  Удалить подпись
              </Button>
            </Popconfirm>,
            <Button type="default" onClick={handleClose}>
                Назад
            </Button>,
        ]}
      >
        <br/>
        <Flex vertical="true" gap="14px">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
            <span>ID в бд: </span>
            <CopyTextField inputText={ids}/>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
            <span>СНИЛС: </span>
            <CopyTextField inputText={activeSign.snils}/>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
            <span>SHA Отпечаток: </span>
            <CopyTextField inputText={activeSign.sha}/>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
            <span style={{display: "flex", alignItems: "center", padding: "2px"}}>Результат: {result}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "2px" }}>
            <span>Пароль: </span>
            <CopyTextField inputText={password}/>
          </div>
        </Flex>
      </Modal>
    </>
  );
};
export default ModalNameClick;