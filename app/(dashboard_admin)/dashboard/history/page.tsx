"use client";

import useSWR from "swr";
import Cookies from "js-cookie";
import { Alert, Card, Col, Flex, Pagination, Row, Typography } from "antd";
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

  if (!showDetail.history || showDetail.history.length === 0) {
    return <Alert message="Tidak Ada Data Penarikan" type="info" />;
  }

  const paginatedData = showDetail.history.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalAmount = showDetail.history.reduce(
    (sum: any, detail: any) => sum + detail.amount,
    0
  );

  return (
    <div>
      <Flex vertical>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "20px" }}
        >
          <Title style={{ margin: 0 }} level={4}>
            History Penarikan
          </Title>
          <Flex vertical align="end">
            <Title level={5} style={{ margin: 0, color: "#C1C2CD" }}>
              Total penarikan
            </Title>
            <Title style={{ margin: 0 }} level={4}>
              Rp {totalAmount.toLocaleString()}
            </Title>
          </Flex>
        </Flex>

        {showDetail.history.length === 0 ? (
          <Alert message="Tidak Ada Data Penarikan" type="info" />
        ) : (
          <Row gutter={[16, 16]} justify="center">
            {Array.isArray(paginatedData) &&
              paginatedData.map((detail) => (
                <Col span={24} key={detail.id}>
                  <Card
                    style={{
                      borderRadius: "10px",

                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Flex justify="space-between" align="center" wrap="wrap">
                      <Flex vertical>
                        <Title style={{ marginBottom: 0 }} level={4}>
                          Rp {detail.amount.toLocaleString()}
                        </Title>
                        <Text style={{ color: "#A5A6B0" }}>
                          Ditarik:{" "}
                          {moment(detail.created_at).format(
                            "HH:mm, DD MMMM YYYY"
                          )}
                        </Text>
                      </Flex>
                      <span
                        style={{
                          backgroundColor:
                            detail.payout.status === "SUCCEEDED"
                              ? "#A3E4DB"
                              : detail.payout.status === "FAILED"
                              ? "#EF3826"
                              : detail.payout.status === "REVERSED"
                              ? "#EF3826"
                              : "",

                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color:
                              detail.payout.status === "SUCCEEDED"
                                ? "#00B69B"
                                : detail.payout.status === "FAILED"
                                ? "#EF3826"
                                : detail.payout.status === "REVERSED"
                                ? "#202224"
                                : "",
                          }}
                        >
                          {" "}
                          {detail.payout.status}
                        </Text>
                      </span>
                    </Flex>
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
      </Flex>
    </div>
  );
}
