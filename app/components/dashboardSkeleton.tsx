import React from "react";
import { Skeleton, Card, Col, Row } from "antd";

function DashboardSkeleton() {
  return (
    <div>
      <Skeleton
        active
        title={{ width: "40%" }}
        paragraph={false}
        style={{ marginBottom: "25px" }}
      />

      <Row gutter={16}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: "40px" }}>
        <Col span={24}>
          <Card
            bordered={true}
            style={{
              marginBottom: 20,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <Skeleton.Input style={{ width: "100%", height: 300 }} active />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardSkeleton;
