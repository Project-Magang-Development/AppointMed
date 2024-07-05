"use client";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Card, Col, Row, Typography, Pagination, Alert } from "antd";
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
      <Title level={3}>Riwayat Penarikan Merchant {merchantName}</Title>
      {showDetail.length === 0 ? (
        <Alert message="Tidak Ada Data Penarikan" type="info" />
      ) : (
        <div>
          <Row gutter={[16, 16]} justify="center">
            {Array.isArray(paginatedData) &&
              paginatedData.map((detail: any) => (
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
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Title level={4}>
              Total Penarikan: Rp {totalAmount.toLocaleString()}
            </Title>
          </div>
        </div>
      )}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={showDetail.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
}
