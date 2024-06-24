"use client";

import React, { useEffect, useState } from "react";
import { Button, Row, Col, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const disableSidebar = ["/home/register"];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavbarVisible(prevScrollY > currentScrollY || currentScrollY < 10);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      {!isMobile && (
        <div
          style={{
            padding: "1rem 3rem",
            position: "fixed",
            top: isNavbarVisible ? 0 : "-100px",
            left: 0,
            right: 0,
            zIndex: 999,
            transition: "top 0.3s ease, background-color 0.5s ease",
            backgroundColor: scrollY > 0 ? "rgba(0, 0, 0, 0.1)" : "white",
            backdropFilter: scrollY > 0 ? "blur(10px)" : "none",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Row align="middle" gutter={20}>
                <Col>
                  <Image src="/logo.png" alt="logo" width={140} height={140} />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row align="middle" gutter={20} style={{ fontWeight: 500 }}>
                <Col>
                  <Link href="/home" passHref>
                    <p
                      style={{
                        color: pathname === "/home" ? "#007E85" : "black",
                      }}
                    >
                      Beranda
                    </p>
                  </Link>
                </Col>
                <Col>
                  <Link href="/home/tentangKami" passHref>
                    <p
                      style={{
                        color:
                          pathname === "/home/tentangKami"
                            ? "#007E85"
                            : "black",
                      }}
                    >
                      Tentang Kami
                    </p>
                  </Link>
                </Col>
                <Col>
                  <Link href="/home/fitur" passHref>
                    <p
                      style={{
                        color: pathname === "/home/fitur" ? "#007E85" : "black",
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
                        color:
                          pathname === "/home/pricing" ? "#007E85" : "black",
                      }}
                    >
                      Harga
                    </p>
                  </Link>
                </Col>
                <Col>
                  <Link href="/home/Kontak" passHref>
                    <p
                      style={{
                        color:
                          pathname === "/home/Kontak" ? "#007E85" : "black",
                      }}
                    >
                      Kontak
                    </p>
                  </Link>
                </Col>
                <Col>
                  <Link href={"/home/pricing"}>
                    <Button
                      style={{
                        backgroundColor: "#007E85",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Daftar
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
      {isMobile && (
        <div
          style={{
            padding: "1rem",
            position: "fixed",
            top: isNavbarVisible ? 0 : "-100px",
            left: 0,
            right: 0,
            zIndex: 999,
            transition: "top 0.3s ease, background-color 0.5s ease",
            backgroundColor: scrollY > 0 ? "rgba(0, 0, 0, 0.1)" : "white",
            backdropFilter: scrollY > 0 ? "blur(10px)" : "none",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Image src="/logo.png" alt="logo" width={140} height={140} />
            </Col>
            <Col>
              <Button icon={<MenuOutlined />} onClick={showDrawer} />
            </Col>
          </Row>
        </div>
      )}
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
      >
        <Menu>
          <Menu.Item key="home">
            <Link href="/home">
              <p style={{ color: pathname === "/home" ? "#007E85" : "black" }}>
                Beranda
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="tentangKami">
            <Link href="/home/tentangKami">
              <p
                style={{
                  color: pathname === "/home/tentangKami" ? "#007E85" : "black",
                }}
              >
                Tentang Kami
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="fitur">
            <Link href="/home/fitur">
              <p
                style={{
                  color: pathname === "/home/fitur" ? "#007E85" : "black",
                }}
              >
                Fitur
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="pricing">
            <Link href="/home/pricing">
              <p
                style={{
                  color: pathname === "/home/pricing" ? "#007E85" : "black",
                }}
              >
                Harga
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="kontak">
            <Link href="/home/Kontak">
              <p
                style={{
                  color: pathname === "/home/Kontak" ? "#007E85" : "black",
                }}
              >
                Kontak
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="daftar">
            <Button
              style={{
                backgroundColor: "#1D2130",
                color: "white",
                border: "none",
                width: "100%",
              }}
            >
              Daftar
            </Button>
          </Menu.Item>
        </Menu>
      </Drawer>
      <div style={{ marginTop: 100, padding: 0 }}>{children}</div>
    </>
  );
};

export default Navbar;
