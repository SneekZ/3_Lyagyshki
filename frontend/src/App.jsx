import Router from './Router'
import { Layout, theme, Flex, Button, ConfigProvider } from 'antd'
import React, { useState } from 'react';


function App() {

  // const navigate = useNavigate();

  const { Header, Sider, Content } = Layout;
  const [hoveredHeader, setHoveredHeader] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="header_container">
      <Header
          className="header"
          style={{
            margin: "24px 16px",
            padding: 0,
            background: "transparent"
          }}
        >
            <div className='title_container'>
              <Flex justify='center' gap='8px'>
                <h className="title_tri" style={{ color: "#ffffff" }}>ТРИ</h>
                <h className="title_frogs" style={{ color: "#ffffff" }}>ЛЯГУШКИ</h>
              </Flex>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm
                }}
              >
                <Flex justify='center' className='title_button' gap="18px">
                    <Button href={`${window.location.origin}/signs`}>Подписи</Button>
                    <Button href={`${window.location.origin}/database`}>Список ЛПУ</Button>
                </Flex>
              </ConfigProvider>
            </div>
          <span style={{
              color: "white",
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              marginTop: "-15px"
            }}
            >
              <a style={{ color: "#ffffff" }} href="http://192.168.0.149:5173/lpu" target="_blank" rel="noopener" >НеМониторинг</a>
            </span>
        </Header>
        <Content
          className="content sofia-sans-semi-condensed"
          style={{
            margin: "24px 24px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Router/>
        </Content>
      </Layout>
  )
}

export default App
