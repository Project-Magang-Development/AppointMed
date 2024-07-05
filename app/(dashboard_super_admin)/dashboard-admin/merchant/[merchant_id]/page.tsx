"use client";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Card, Col, Row, Typography, Pagination, Alert, Flex } from "antd";
import moment from "moment";
import "moment/locale/id";
import { useState } from "react";
import TableSkeleton from "@/app/components/tableSkeleton";

const { Title, Text } = Typography;

moment.locale("id");

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("tokenAdmin")}`,
    },
  }).then((res) => res.json());

export default function HistoryExpanse() {
  const query = useParams();
  const { merchant_id } = query;
  const { data: showDetail, error } = useSWR(
    `/api/expense/showDetail/${merchant_id}`,
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (error) {
    return <Alert message="Error loading data" type="error" />;
  }

  if (!showDetail) {
    return <TableSkeleton />;
  }

  const merchantName =
    Array.isArray(showDetail) && showDetail.length > 0
      ? showDetail[0].merchant.merchant_name
      : "";

  const paginatedData = showDetail.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalAmount = showDetail.reduce(
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
            History Penarikan {merchantName}
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
        {showDetail.length === 0 ? (
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
          total={showDetail.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </Flex>
    </div>
  );
}
