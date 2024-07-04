"use client";

import Cookies from "js-cookie";
import useSWR from "swr";
import Title from "antd/es/typography/Title";
import moment from "moment";
import "moment/locale/id";
import {
  Alert,
  Button,
  Card,
  Divider,
  Pagination,
  Row,
  Col,
  Space,
  Flex,
} from "antd";
import { ArrowLeftOutlined, RiseOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import TableSkeleton from "@/app/components/tableSkeleton";
import { useRouter } from "next/navigation";

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

export default function SubscriptionPage() {
  const {
    data: subscriptionNow,
    isLoading: isLoadingNow,
    error: errorNow,
  } = useSWR(`/api/subscription/showNow`, fetcher);
  const {
    data: subscriptionDetail,
    isLoading: isLoadingDetail,
    error: errorDetail,
  } = useSWR("/api/subscription/showDetail", fetcher);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah item per halaman

  if (isLoadingDetail || isLoadingNow) {
    return <TableSkeleton />;
  }

  moment.locale("id");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subscriptionDetail.subscriptionDetail?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={3} style={{ marginBlock: 0 }}>
          Masa Berlangganan Anda Berstatus{" "}
          <span style={{ color: "#52c41a" }}>
            {subscriptionNow.subscriptionNow.status_subscriber}!
          </span>
        </Title>
        <h1 style={{ marginBlock: 0, marginTop: 2, fontSize: 16 }}>
          Langganan Anda Berlaku Sampai Dengan{" "}
          {moment(subscriptionNow.subscriptionNow.end_date).format("LL")}{" "}
        </h1>
        <Button
          icon={<RiseOutlined />}
          style={{ marginTop: 20, color: "#FFF", backgroundColor: "#007E85" }}
          onClick={() => {
            router.push("/home/renew");
          }}
        >
          Perpanjang Langganan
        </Button>
      </div>
      <Divider />
      <Title level={4} style={{ marginBlock: 0 }}>
        Riwayat Pembelian
      </Title>
      <h1 style={{ fontSize: 16, marginBottom: 20 }}>
        Lihat semua transaksi pembelian anda
      </h1>
      <div>
        {currentItems?.length > 0 ? (
          currentItems.map((item: any) => (
            <Card
              key={item.id}
              style={{
                marginBottom: 20,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 15 }}
              >
                <Title level={4} style={{ marginBlock: 0 }}>
                  {item.invoice_id}
                </Title>
                {item.package_id ===
                subscriptionNow.subscriptionNow.package_id ? (
                  <h1
                    style={{
                      border: "1px solid #52c41a",
                      color: "#237804",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Sedang Aktif
                  </h1>
                ) : (
                  <h1
                    style={{
                      border: "1px solid #d9d9d9",
                      color: "#8c8c8c",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Tidak Aktif
                  </h1>
                )}
              </Row>
              <Row justify="space-between">
                <Title level={5} style={{ marginBlock: 0 }}>
                  {item.package_name}
                </Title>
                {item.amount !== 0 && (
                  <Title level={5} style={{ marginBlock: 0, color: "#fa8c16" }}>
                    Harga Rp {item.amount.toLocaleString("id-ID")}
                  </Title>
                )}
              </Row>
              <Flex
                justify="start"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h1 style={{ fontSize: "14px", color: "#8c8c8c" }}>
                  Waktu Pembelian {moment(item.payment_date).format("LL")}
                </h1>
                <h1 style={{ fontSize: "14px", color: "#8c8c8c" }}>
                  Durasi {item.package.duration} Bulan
                </h1>
              </Flex>
            </Card>
          ))
        ) : (
          <Alert message="Tidak Ada Data Pembelian" type="info" showIcon />
        )}
      </div>

      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={subscriptionDetail.subscriptionDetail?.length}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </>
  );
}
