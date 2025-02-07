import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag, ConfigProvider, theme} from "antd";
import { createStyles } from 'antd-style'


const SignsTable = ( {signs, setModalOpen, setActiveSign } ) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  function handleNameClick(lpu_id, name, snils, sha) {
    const activeSign = {
      lpu_id: lpu_id,
      name: name,
      snils: snils,
      sha: sha
    }    
    setActiveSign(activeSign)
    setModalOpen(true)
  }

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        className="flex-auto"
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });
  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `,
    };
  });
  const { styles } = useStyle();
  const columns = [
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (_, { name, snils, lpu_id, sha }) => {
        return <a onClick={() => handleNameClick(lpu_id, name, snils, sha)}>{name}</a>;
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "СНИЛС",
      dataIndex: "snils",
      key: "snils",
      width: "20%",
      ...getColumnSearchProps("snils"),
    },
    {
      title: "Истекла",
      dataIndex: "expired",
      key: "expired",
      width: "15%",
      render: (_, { expired }) => {
        let color = expired ? "red" : "green";
        let expired_text = expired ? "Истекла" : "Активна";
        if (expired == null) {
          return;
        }
        return (
          <Tag color={color} key={expired_text}>
            {expired_text.toUpperCase()}
          </Tag>
        );
      },
      ...getColumnSearchProps("expired"),
    },
    {
      title: "Проверка дублирования",
      dataIndex: "double",
      key: "double",
      width: "15%",
      render: (_, { double, is_new }) => {
        if (!double) {
          return;
        }
        let color = is_new ? "green" : "red";
        let double_text = is_new ? "Новая" : "Старая";
        return (
          <Tag color={color} key={double_text}>
            {double_text.toUpperCase()}
          </Tag>
        );
      },
      ...getColumnSearchProps("double"),
    },
    {
      title: "Должность",
      dataIndex: "t",
      key: "t",
      width: "20%",
      ...getColumnSearchProps("t"),
    },
  ];
  return (
    <div>
      <br/>
      <ConfigProvider
        theme={{
          token: {
          }
        }}
      >
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={signs || [{}]}
          pagination={{ pageSize: 500 }}
          scroll={{ 
            x: "max-content",
            y: 55 * 9.55,
          }}
          style={{ maxWidth: "198vh" }}
          locale={{ emptyText: "Данные не найдены" }}
        />
      </ConfigProvider>
    </div>
  );
};
export default SignsTable;