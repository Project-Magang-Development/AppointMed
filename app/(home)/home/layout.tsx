"use client";

import React, { useEffect, useState } from "react";
import { Button, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import useRouter

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  const disableSidebar = ["/home/register"];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        style={{
          padding: "1rem 3rem",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          transition: "background-color 0.5s ease",
          backgroundColor: scrollY > 0 ? "rgba(0, 0, 0, 0.1)" : "transparent",
          backdropFilter: scrollY > 0 ? "blur(10px)" : "none",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Row align="middle" gutter={20}>
              <Col>
                <Image src="/logo.png" alt="logo" width={200} height={200} />
              </Col>
            </Row>
          </Col>

          <Col>
            <Row align="middle" gutter={20}>
              <Col>
                <Link href="/home" passHref>
                  <p
                    style={{
                      color: pathname === "/home" ? "#6B7CFF" : "black", // Change this line.pathname === "/" ? "#6B7CFF" : "black",
                    }}
                  >
                    Beranda
                  </p>
                </Link>
              </Col>
              <Col>
                <Link href="/" passHref>
                  <p
                    style={{
                      color: pathname === "/" ? "#6B7CFF" : "black", // Change this line.pathname === "/" ? "#6B7CFF" : "black",
                    }}
                  >
                    Tentang Kami
                  </p>
                </Link>
              </Col>
              <Col>
                <Link href="/" passHref>
                  <p
                    style={{
                      color: pathname === "/" ? "#6B7CFF" : "black", // Change this line.pathname === "/" ? "#6B7CFF" : "black",
                    }}
                  >
                    Fitur
                  </p>
                </Link>
              </Col>
              <Col>
                <Link href="/home/pricing" passHref>
                  <p
                    style={{
                      color: pathname === "/home/pricing" ? "#6B7CFF" : "black", // Change this line.pathname === "/" ? "#6B7CFF" : "black",
                    }}
                  >
                    Harga
                  </p>
                </Link>
              </Col>
              <Col>
                <Link href="/" passHref>
                  <p
                    style={{
                      color: pathname === "/" ? "#6B7CFF" : "black", // Change this line.pathname === "/" ? "#6B7CFF" : "black",
                    }}
                  >
                    Kontak
                  </p>
                </Link>
              </Col>
              <Col>
                <Button type="primary">Daftar</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 100, padding: 24 }}>{children}</div>
    </>
  );
};

export default Navbar;
