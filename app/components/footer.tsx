"use client";
import { Button, Divider, Flex } from "antd";
import Link from "next/link";
import React, { useState } from "react";

function FooterSection() {
  const [loading, setLoading] = useState(false);

  return (
    <Flex
      wrap="wrap"
      vertical
      style={{
        padding: "2rem",
        backgroundColor: "#007E85",
        zIndex: 2,
        marginTop: " 6rem",
      }}
    >
      <Flex wrap="wrap" justify="space-between">
        <Flex
          wrap="wrap"
          vertical
          gap={20}
          style={{ color: "white", fontWeight: " bold" }}
        >
          <img
            style={{ width: "200px", height: "auto" }}
            src="/image/appointMed.png"
            alt=""
          />
          <p>
            Jl. Tukad Batanghari <br />
            No.55 Denpasar - Bali
          </p>
          <Flex gap={20}>
            <p>Ikuti Kami</p>
            <Link href={"https://www.instagram.com/"}>
              <img src="/icons/ig.svg" alt="logo instagram" />
            </Link>

            <Link href="https://www.facebook.com/">
              <img src="/icons/fb.svg" alt="logo fb" />
            </Link>
            <Link href="https://www.linkedin.com/">
              <img src="/icons/linkedin.svg" alt="logo linkedin" />
            </Link>
          </Flex>
        </Flex>

        <Flex vertical style={{ color: "white" }}>
          <p>Quick Link</p>
          <Divider style={{ borderColor: "white" }} />
          <Link style={{ color: "white" }} href={"/home/tentangKami"}>
            Tentang Kami
          </Link>
          <Link style={{ color: "white" }} href={"/home/fitur"}>
            Fitur
          </Link>
          <Link style={{ color: "white" }} href={"/home/pricing"}>
            Harga
          </Link>
          <Link style={{ color: "white" }} href={"/home/Kontak"}>
            Kontak
          </Link>
        </Flex>
        <Flex
          gap={20}
          vertical
          style={{ color: "white", fontWeight: " bold", marginTop: "5px" }}
        >
          <Flex gap={5} vertical>
            <p style={{ fontSize: "10px" }}>Whatsapp kami sekarang!</p>
            <Flex gap={10}>
              <img
                src="/icons/whatsapp.svg"
                alt=""
                style={{ color: "white" }}
              />
              <p>+62 81337373155</p>
            </Flex>
          </Flex>
          <Flex gap={5} vertical>
            <p style={{ fontSize: "10px" }}>Email kami kapan saja</p>
            <Flex gap={10}>
              <img src="/icons/gmail.svg" alt="" style={{ color: "white" }} />
              <p>kodingakademi.id</p>
            </Flex>
          </Flex>
          <Link href={"/home/Kontak"} onClick={() => setLoading(true)}>
            <Button
              loading={loading}
              icon={<img src="/icons/chat.svg" alt="" width={25} />}
              size="large"
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "white",
                color: "#007E85",
                width: "100%",
                textAlign: "center",
                border: "none",
              }}
            >
              Hubungi Kami
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Flex
        style={{ color: "white", fontSize: "12px" }}
        vertical
        justify="center"
        align="center"
      >
        <Divider style={{ borderColor: "white" }} />
        <p>KODING AKADEMI 2024. ALL RIGHTS RESERVED</p>
      </Flex>
    </Flex>
  );
}

export default FooterSection;
