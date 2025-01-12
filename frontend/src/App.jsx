import Router from './Router'
import { Layout, theme} from 'antd'
function App() {

  const { Header, Sider, Content } = Layout;

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
            background: "#2a2b32",
          }}
        >
          <div onClick={() => {console.log(1)}} onMouseOver={() => {console.log(2)}}>
            <h className="title">ТРИ ЛЯГУШКИ</h>
          </div>
        </Header>
        <Content
          className="content"
          style={{
            margin: "24px 24px",
            padding: 24,
            minHeight: 280,
            background: "#2a2b32",
          }}
        >
          <Router/>
        </Content>
      </Layout>
  )
}

export default App
