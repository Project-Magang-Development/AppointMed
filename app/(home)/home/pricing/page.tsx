"use client";

import React from "react";
import { Card, Col, Row, Spin, Alert } from "antd";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Package {
  package_id: number;
  package_name: string;
  package_price: number;
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
  const { data: packages, error } = useSWR<Package[]>(
    "/api/showPackage",
    fetcher
  );
  const router = useRouter();

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

  const handleCardClick = (packageId: string) => {
    router.push(`/home/register?package=${packageId}`);
  };

  return (
    <div>
      <Row gutter={16}>
        {packages.map((pkg: Package, index: number) => (
          <Col key={index} span={8}>
            <Card
              title={`${pkg.package_name} - ${pkg.duration} Months`}
              bordered={false}
              onClick={() => handleCardClick(pkg.package_id.toString())}
            >
              <p>Price: Rp {pkg.package_price.toLocaleString()}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
