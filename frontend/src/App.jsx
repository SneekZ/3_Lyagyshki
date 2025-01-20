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
            background: "transparent",
          }}
        >
          <div 
            onMouseEnter={() => setHoveredHeader(true)}
            onMouseLeave={() => setHoveredHeader(false)}
            onClick={() => setPretty(!pretty)}
            >
              <Tooltip title="Сменить режим отображения" color="grey">
                <h className={pretty ? "title_pretty" : "title"}>ТРИ ЛЯГУШКИ</h>
              </Tooltip>
          </div>
        </Header>
        <Content
          className={pretty ? "content_pretty" : "content"}
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
