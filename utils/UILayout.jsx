import Layout, { Header } from 'antd/es/layout/layout';
import { Container } from 'react-bootstrap';
import AnimatedFrame from './animation_page';

const { Content } = Layout;

const UILayout = (props) => {
  return (
    <AnimatedFrame>
      <Layout>
        <Header className="header mt-5">
          <h2>{props.title}</h2>
        </Header>
        <Content style={{ margin: '14px', background: '#fff' }}>
          <div
            className="site-layout-background"
            style={{ padding: 16, minHeight: 360 }}
          >
            <Container fluid className="min-vh-100">
              {props.children}
            </Container>
          </div>
        </Content>
      </Layout>
    </AnimatedFrame>
  );
};

export default UILayout;
