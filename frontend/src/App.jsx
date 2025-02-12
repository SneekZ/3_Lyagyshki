import Router from './Router'
import { Layout, theme, Tooltip } from 'antd'
import React, { useState } from 'react';
function App() {

  const { Header, Sider, Content } = Layout;
  const [hoveredHeader, setHoveredHeader] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [pretty, setPretty] = useState(false);

  return (
    <Layout className={pretty ? "header_container_pretty" : "header_container"}>
    <Header
          className="header"
          style={{
            margin: "24px 16px",
            padding: 0,
            background: "transparent"
          }}
        >
          <div
            onMouseEnter={() => setHoveredHeader(true)}
            onMouseLeave={() => setHoveredHeader(false)}
            onClick={() => setPretty(!pretty)}
            >
              <Tooltip title="Сменить режим отображения" color="grey">
                <h className={pretty ? "title_pretty" : "title"} style={{ color: "#ffffff" }}>ТРИ ЛЯГУШКИ</h>
              </Tooltip>
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
          className={pretty ? "content_pretty sofia-sans-semi-condensed" : "content sofia-sans-semi-condensed"}
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
