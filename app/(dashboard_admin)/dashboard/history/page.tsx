"use client";

import useSWR from "swr";
import Cookies from "js-cookie";
import { Alert, Card, Col, Pagination, Row, Typography } from "antd";
import { useState } from "react";
import moment from "moment";
import "moment/locale/id";
import TableSkeleton from "@/app/components/tableSkeleton";
moment.locale("id");

const { Title, Text } = Typography;

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

export default function History() {
  const { data: showDetail, error } = useSWR("/api/history/show", fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (error) {
    return <Alert message="Error loading data" type="error" />;
  }

  if (!showDetail) {
    return <TableSkeleton />;
  }

  const paginatedData = showDetail.history.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div>
        <Title level={3}>History Penarikan</Title>
        {showDetail.history.length === 0 ? (
          <Alert message="Tidak Ada Data Penarikan" type="info" />
        ) : (
          <Row gutter={[16, 16]} justify="center">
            {Array.isArray(paginatedData) &&
              paginatedData.map((detail) => (
                <Col span={24} key={detail.id}>
                  <Card>
                    <Title level={4}>
                      Jumlah: Rp {detail.amount.toLocaleString()}
                    </Title>
                    <Text>
                      Ditarik:{" "}
                      {moment(detail.created_at).format("HH:mm, DD MMMM YYYY")}
                    </Text>
                  </Card>
                </Col>
              ))}
          </Row>
        )}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={showDetail.history.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </div>
  );
}
