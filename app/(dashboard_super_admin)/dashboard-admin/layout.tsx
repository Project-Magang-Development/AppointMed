"use client";

import React, { useEffect, useState } from "react";
import {
  BankOutlined,
  BookOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  message,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCompanyName, useMerchantName } from "../../hooks/useLogin";
import Image from "next/image";
import Cookies from "js-cookie";
import { login } from "@/app/services/authServices";
import { useRedirectBasedOnToken } from "@/app/hooks/useRedirectBasedOnToken";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

// Inisialisasi ikon untuk keadaan default dan keadaan aktif
const dashboardIconDefault = <img src="/icons/dashboard.svg" alt="Dashboard" />;
const dashboardIconActive = (
  <img src="/icons/dashboard-active.svg" alt="Dashboard" />
);
const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeItem, setActiveItem] = useState("");
  const siderWidthCollapsed = 80;
  const siderWidthExpanded = 200;
  const router = useRouter();
  const pathname = usePathname();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Set activeItem berdasarkan pathname saat halaman dimuat atau berubah
    setActiveItem(pathname);
  }, [pathname]);
  const disableSidebar = [
    "/dashboard-admin/login",
    "/dashboard-admin/register",
  ];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  const disableCompanyName = [
    "/dashboard-admin/merchant",
    "/dashboard-admin/package",
  ];
  const shouldHideCompanyName = disableCompanyName.some((route) =>
    pathname.includes(route)
  );

  useEffect(() => {
    if (!login) {
      if (!Cookies.get("tokenAdmin")) {
        router.push("/dashboard-admin/login");
      }
    }
  }, [router]);

  const fetchDataWithLastChecked = async (
    endpoint: string,
    lastCheckedKey: string,
    setStateCallback: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const token = localStorage.getItem("token");
    const lastChecked = localStorage.getItem(lastCheckedKey) || "";

    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    try {
      const query = lastChecked ? `?lastChecked=${lastChecked}` : "";
      const response = await fetch(`${endpoint}${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      setStateCallback(data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useRedirectBasedOnToken();

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  const handleClick = (key: any) => {
    setActiveItem(key);
  };
  const items: MenuItem[] = [
    {
      key: "/dashboard-admin",
      icon:
        activeItem === "/dashboard-admin"
          ? dashboardIconActive
          : dashboardIconDefault,
      label: (
        <Link
          href="/dashboard-admin"
          onClick={() => handleClick("/dashboard-admin")}
        >
          Dashboard
        </Link>
      ),
    },
    {
      key: "/dashboard-admin/merchant",
      icon: <UserOutlined />,
      label: <Link href="/dashboard-admin/merchant">Pelanggan</Link>,
    },
    {
      key: "/dashboard-admin/package",
      icon: <DatabaseOutlined />,
      label: <Link href="/dashboard-admin/package">Paket</Link>,
    },
  ];

  const determineSelectedKeys = (pathname: any, items: any) => {
    return items
      .filter((item: any) => {
        const routeParts = pathname.split("/").filter((part: any) => part);
        const itemKeyParts = item.key.split("/").filter((part: any) => part);
        return (
          routeParts.length === itemKeyParts.length &&
          routeParts.every(
            (part: any, index: any) => part === itemKeyParts[index]
          )
        );
      })
      .map((item: any) => item.key);
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "logout",
          label: "Keluar",
          icon: <LogoutOutlined />,
          onClick: () => {
            Cookies.remove("tokenAdmin");
            message.success("Logout successful!");
            window.location.href = "/dashboard-admin/login";
          },
        },
      ]}
    />
  );
  // Hitung selectedKeys setelah items didefinisikan
  const selectedKeys = determineSelectedKeys(pathname, items);

  // Tambahkan properti style ke dalam items
  const initialItems = items.map((item: any) => ({
    ...item,
    style: { color: selectedKeys.includes(item.key) ? "black" : "white" },
  }));

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={siderWidthExpanded}
        collapsedWidth={siderWidthCollapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          zIndex: 999,
          backgroundColor: "#007E85",
          color: "black",
          boxShadow: "8px 0 10px -5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className="logo"
          style={{ margin: "35px 10px", textAlign: "center", color: "white" }}
        >
          {collapsed ? (
            <span>
              <img src="image/appointMed2.png" alt="" />
            </span>
          ) : (
            <Image
              src="/image/appointMed.png"
              alt="Company Logo"
              width={200}
              height={200}
            />
          )}
        </div>
        <Menu
          style={{ backgroundColor: "transparent" }}
          mode="inline"
          items={initialItems}
          selectedKeys={selectedKeys}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? siderWidthCollapsed : siderWidthExpanded,
          transition: "margin 0.2s",
          backgroundColor: "white",
        }}
      >
        <Content
          style={{
            margin: "100px 32px 0",
            overflow: "initial",
          }}
        >
          <Flex
            align="center"
            justify="space-between"
            style={{
              paddingBlock: "1rem",
              paddingInline: "3rem",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 998,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Flex
              style={{
                display: "flex",
                listStyleType: "none",
                padding: 0,
                margin: 0,
                gap: 20,
              }}
              // eslint-disable-next-line react/no-children-prop
              children={undefined}
            ></Flex>
            <Flex justify="center" align="center" gap={20}>
              <Dropdown overlay={userMenu}>
                <a
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <Flex
                    gap={20}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 20,
                    }}
                  >
                    <Avatar icon={<UserOutlined />} style={{}} />
                    <div style={{ color: "black", textAlign: "right" }}>
                      <div style={{ fontSize: "smaller" }}>Admin</div>
                    </div>
                  </Flex>
                </a>
              </Dropdown>
            </Flex>
          </Flex>
          {!shouldHideCompanyName && (
            <>
              <Breadcrumb style={{ fontSize: "25px", fontWeight: "bold" }}>
                <Breadcrumb.Item>Selamat Datang Super Admin</Breadcrumb.Item>
              </Breadcrumb>
              <Divider />
            </>
          )}
          {shouldHideCompanyName ? (
            <div
              style={{
                padding: 24,
                backgroundColor: "#FFF",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {children}
            </div>
          ) : (
            <div style={{ padding: 24 }}>{children}</div>
          )}
        </Content>
        <Footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "#FFF",
            boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.1)",
            height: "45px",
          }}
        >
          AppointMed ©{new Date().getFullYear()} Powered by AppointMed
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
