"use client";
import React, { useEffect, useState } from "react";
import { Collapse, Flex, theme } from "antd";
import { RightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const accordionData = [
  {
    header: "Bagaimana cara memulai AppointMe?",
    content:
      "Untuk mulai berlangganan layanan AppointMed, cukup klik tombol “Daftar” pada halaman beranda ataupun di halaman harga kami. Anda juga dapat menikmati layanan kami secara gratis melalui “Uji Coba Gratis”",
  },
  {
    header: "Apa fitur utama yang ditawarkan AppointMe?",
    content:
      "Fitur utama yang kami tawarkan ada pada sistem booking serta dashboard pengelolaan data rental yang mempermudah bisnis rental Anda, selengkapnya dapat dilihat pada halaman Fitur.",
  },
  {
    header: "Paket berlangganan apa yang ditawarkan AppointMe?",
    content:
      "Kami memiliki 3 paket dengan harga yang berbeda sesuai kebutuhan Anda, selain itu kami juga menawarkan “Uji Coba Gratis” untuk anda yang berminat dan ingin mempelajari lebih lanjut. Selengkapnya bisa dicek pada halaman Harga.",
  },
  {
    header: "Apakah dapat membatalkan langganan kapan saja?",
    content:
      "Ya, Anda dapat membatalkan langganan SaaS rental kami kapan saja sesuai kebutuhan Anda. Kami tidak mengharuskan Anda untuk berkomitmen dalam jangka waktu tertentu, sehingga Anda bebas untuk membatalkan langganan kapan pun Anda mau.",
  },
];

const Accordion = () => {
  const { token } = theme.useToken();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // atau loading indicator
  }

  const panelStyle: React.CSSProperties = {
    marginBottom: 14,
    background: "#F5F5F5",
    borderRadius: token.borderRadiusLG,
    border: "none",
    fontWeight: "bold",
    padding: "12px",
    width: "100%",
    transition: "ease 0.6s",
  };

  const contentStyle: React.CSSProperties = {
    fontWeight: "normal",
  };

  return (
    <Collapse
      size="large"
      expandIconPosition="end"
      bordered={false}
      accordion
      expandIcon={({ isActive }) => (
        <div>
          <img
            loading="lazy"
            style={{
              width: "20px",
              minWidth: "20px",
              transform: isActive ? "rotate(180deg)" : "rotate(0deg)", // Rotasi 180 derajat saat panel aktif
              transition: "transform 0.3s", // Animasi transisi
            }}
            src="icons/arrow-up.svg"
            alt=""
          />
        </div>
      )}
      style={{
        border: "none",
        width: "auto",
      }}
    >
      {accordionData.map((item, index) => (
        <Panel header={item.header} key={index} style={panelStyle}>
          <p style={contentStyle}>{item.content}</p>
        </Panel>
      ))}
    </Collapse>
  );
};

export default Accordion;
