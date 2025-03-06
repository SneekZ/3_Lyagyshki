import { Table, ConfigProvider } from "antd";

const LpuTable = ({ lpuList, loading }) => {
  const { Column, ColumnGroup } = Table;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#2a2a2a",
          colorText: "#ffffff",
          colorBgBase: "#2a2a2a",
          colorBorderSecondary: "#2a2a2a",
          headerColor: "#2a2a2a",
        },
      }}
    >
      <Table
        loading={loading}
        dataSource={lpuList}
        pagination={{ pageSize: 5000, position: ["none", "none"] }}
        scroll={{
          x: "max-content",
          y: 55 * 9.5,
        }}
      >
        <Column title="Название" dataIndex="name" key="name" />
        <ColumnGroup title="Сервер сервисов ЛПУ">
          <Column title="Хост" dataIndex="host" key="host" />
          <Column title="Порт" dataIndex="port" key="port" />
          <Column title="Юзер" dataIndex="user" key="user" />
          <Column title="Пароль" dataIndex="password" key="password" />
        </ColumnGroup>
        <ColumnGroup title="База данных ЛПУ">
          <Column title="Хост" dataIndex="dbhost" key="dbhost" />
          <Column title="Порт" dataIndex="dbport" key="dbport" />
          <Column title="Юзер" dataIndex="dbuser" key="dbuser" />
          <Column title="Пароль" dataIndex="dbpassword" key="dbpassword" />
        </ColumnGroup>
        <Column title="Схема бд" dataIndex="database" key="database" />
        <Column title="Путь до контейнеров" dataIndex="path" key="path" />
      </Table>
    </ConfigProvider>
  );
};

export default LpuTable;
