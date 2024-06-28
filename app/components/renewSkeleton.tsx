import React from "react";
import { Skeleton, Card, Button } from "antd";
import FooterSection from "@/app/components/footer";
import { CheckOutlined } from "@ant-design/icons";

const SkeletonCard = () => (
  <Card
    style={{
      margin: "1rem",
      padding: "2rem",
      width: "320px",
      borderRadius: "15px",
      WebkitBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
      MozBoxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
      boxShadow: "-39px 16px 79px -1px rgba(0,0,0,0.14)",
    }}
  >
    <Skeleton loading={true} active>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton.Input style={{ width: 120 }} active />
          <Skeleton.Input style={{ width: 80 }} active />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <Skeleton.Input style={{ width: 100 }} active />
          <p style={{ color: "gray" }}>/bulan</p>
        </div>
        <Skeleton.Input style={{ width: "100%", marginTop: "20px" }} active />
        <ul style={{ marginTop: "0.2rem" }}>
          {[...Array(3)].map((_, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "0.6rem",
              }}
            >
              <CheckOutlined style={{ marginRight: "5px", color: "#6B7CFF" }} />
              <Skeleton.Input style={{ width: 150 }} active />
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: "100%" }}>
        <Skeleton.Button
          block
          size="large"
          style={{ backgroundColor: "#6B7CFF", color: "white" }}
          active
        />
      </div>
    </Skeleton>
  </Card>
);

const RenewSkeleton = () => (
  <>
    <img
      src="/logo.png"
      alt="Logo"
      width={150}
      height={150}
      style={{ marginTop: "1rem", marginLeft: "1rem" }}
    />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <h1 style={{ fontSize: "25px", color: "#6B7CFF", fontWeight: "bold" }}>
        <Skeleton.Input style={{ width: 300 }} active />
      </h1>
      <div
        style={{
          fontSize: "15px",
          textAlign: "center",
          width: "50%",
          marginBlock: "1rem",
        }}
      >
        <Skeleton.Input style={{ width: 500 }} active />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
    <FooterSection />
  </>
);

export default RenewSkeleton;
