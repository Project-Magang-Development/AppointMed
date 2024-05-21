import React from "react";
import { Layout, Menu, Skeleton, Card, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Sider, Content, Footer } = Layout;

function LayoutSkeleton() {
  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          backgroundColor: "white",
        }}
      >
        <div style={{ margin: "16px", textAlign: "center" }}>
          <Skeleton.Avatar size={64} shape="circle" active />
        </div>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Row gutter={16}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Col key={index} span={8}>
                <Card>
                  <Skeleton active />
                </Card>
              </Col>
            ))}
          </Row>
          <Card style={{ marginTop: 24 }}>
            <Skeleton active />
          </Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Skeleton.Button
            style={{ width: 200 }}
            active
            size="small"
            shape="round"
          />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default LayoutSkeleton;
