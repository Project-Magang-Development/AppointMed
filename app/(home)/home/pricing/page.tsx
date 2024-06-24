"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Spin, Alert, Flex, Button, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useSWR from "swr";
interface Package {
  package_id: number;
  package_name: string;
  package_price: number;
  package_description: string;
  package_tag: string;
  package_feature: string;
  duration: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch packages.");
  }
  return response.json();
};

const Home: React.FC = () => {
  const [loadingButton, setLoadingButton] = useState<Record<number, boolean>>(
    {}
  );

  const [features, setFeatures] = useState<string[][]>([]);
  const [sortedPackages, setSortedPackages] = useState<Package[]>([]);
  const { data: packages, error } = useSWR<Package[]>(
    "/api/showPackage",
    fetcher
  );
  const router = useRouter();

  useEffect(() => {
    if (packages) {
      // Urutkan data berdasarkan harga dari terendah ke tertinggi
      const sorted = [...packages].sort(
        (a, b) => a.package_price - b.package_price
      );
      setSortedPackages(sorted);
    }
  }, [packages]);

  useEffect(() => {
    if (packages) {
      const featureList = packages.map((pkg) =>
        pkg.package_feature ? pkg.package_feature.split(",") : []
      );
      setFeatures(featureList);
      console.log("Feature List:", featureList); // Logging the feature list
    }
  }, [packages]);

  if (error) {
    return <Alert message="Error loading packages!" type="error" showIcon />;
  }

  if (!packages) {
    return (
      <Spin size="large" tip="Loading Packages...">
        <Row gutter={16} style={{ minHeight: "200px" }} />
      </Spin>
    );
  }

  const handleCardClick = async (packageId: number) => {
    try {
      // Set loading true untuk button spesifik
      setLoadingButton((prev) => ({ ...prev, [packageId]: true }));
      await router.push(`/home/register?package=${packageId}`);
    } catch (error) {
      console.error(error);
      message.error("Terjadi kesalahan saat memilih paket");
    } finally {
      // Set loading false untuk button spesifik
      setLoadingButton((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  if (error) return <div>Error loading packages</div>;
  if (!packages) return <div>Loading packages...</div>;

  return (
    <div>
      <Flex align="center" vertical>
        <h1 style={{ fontSize: "35px", color: "#202224", fontWeight: "bold" }}>
          Pilihan Paket Untuk Anda
        </h1>
        <p
          style={{
            fontSize: "13px",
            textAlign: "center",
            width: "50%",
            marginTop: "1rem",
          }}
        >
          Temukan paket berlangganan sesuai dengan kebutuhan Anda dan dapatkan
          layanan luar biasa yang Kami tawarkan pada layanan terbaik Kami
        </p>
        <Flex
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: " auto",
          }}
        >
          {sortedPackages.map((pkg, index) => (
            <Flex
              vertical
              justify="start"
              gap={15}
              key={pkg.package_id}
              style={{
                margin: "1rem",
                padding: "0px",
                width: "270px",
                height: "auto",
                overflow: "hidden",
                minWidth: "15%",
                borderRadius: "16px",
                WebkitBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                MozBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                boxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor:
                  pkg.package_tag === "Istimewa" ? "#007E85" : "white",
                maxWidth: "100%",
                color: pkg.package_tag === "Istimewa" ? "white" : "black",
                transition: "border 0.1s", // Transisi untuk efek hover
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.outline = "2px solid #007E85"; // Ubah warna border saat hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.outline = "0px solid transparent"; // Kembalikan warna border saat tidak dihover
              }}
            >
              <Flex justify="end" style={{ width: "auto" }}>
                <Flex
                  justify="center"
                  align="center"
                  style={{
                    color: pkg.package_tag === "Istimewa" ? "black" : "white",

                    width: "100px",
                    height: "25px",
                    backgroundColor:
                      pkg.package_tag === "" || !pkg.package_tag
                        ? "transparent"
                        : pkg.package_tag === "Istimewa"
                        ? "#CDFFF9"
                        : "#007E85",
                    borderRadius: "0px 15px",
                  }}
                >
                  <p style={{ fontStyle: "Lato" }}>{pkg.package_tag}</p>
                </Flex>
              </Flex>

              <Flex style={{ paddingInline: "1.5rem" }} vertical>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                    {pkg.package_name}
                  </p>
                  <p style={{ marginTop: "0.1rem", fontSize: "15px" }}>
                    {pkg.duration} Months
                  </p>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <p style={{ fontSize: "25px", fontWeight: "bold" }}>
                    Rp {pkg.package_price.toLocaleString()}
                  </p>
                  <p
                    style={{
                      color: pkg.package_tag === "Istimewa" ? "white" : "gray",
                    }}
                  >
                    /bulan
                  </p>
                </div>
                <p
                  style={{
                    marginTop: "20px",
                    textAlign: "justify",
                    fontSize: "13px",
                  }}
                >
                  {pkg.package_description}
                </p>
                <ul style={{ marginTop: "0.2rem", fontSize: "13px" }}>
                  {features[index]?.length > 0 ? (
                    features[index].map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "0.6rem",
                        }}
                      >
                        <CheckOutlined
                          style={{
                            marginRight: "5px",

                            color:
                              pkg.package_tag === "Istimewa"
                                ? "white"
                                : "#007E85",
                          }}
                        />
                        {feature.trim()}
                      </li>
                    ))
                  ) : (
                    <li>Tidak ada fitur yang tersedia</li>
                  )}
                </ul>
              </Flex>
              <Flex
                style={{
                  width: "100%",
                  paddingInline: "2rem",
                  paddingBottom: "1.5rem",
                }}
              >
                <Button
                  onClick={() => handleCardClick(pkg.package_id)}
                  loading={loadingButton[pkg.package_id]} // Gunakan state spesifik untuk loading
                  block
                  size="large"
                  style={{
                    backgroundColor:
                      pkg.package_tag === "Istimewa" ? "white" : "#202224",
                    color: pkg.package_tag === "Istimewa" ? "#007E85" : "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Pilih Paket
                </Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </div>
  );
};

export default Home;
