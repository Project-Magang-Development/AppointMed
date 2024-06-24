"use client";

import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  Badge,
  Breadcrumb,
  Card,
  Divider,
  Flex,
  Layout,
  Menu,
  Modal,
  Space,
  Spin,
  message,
  theme,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useApiKey,
  useCompanyName,
  useMerchantName,
} from "../../hooks/useLogin";
import Image from "next/image";
import dynamic from "next/dynamic";
import LayoutSkeleton from "@/app/components/layoutSkeleton";
import Cookies from "js-cookie";
import Paragraph from "antd/es/typography/Paragraph";
import { styleText } from "util";

const BookOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.BookOutlined)
);
const TruckOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.TruckOutlined)
);
const UserOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.UserOutlined)
);
const LogoutOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.LogoutOutlined)
);

const BankOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.BankOutlined)
);

const DashboardOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.DashboardOutlined)
);

const OrderedListOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.OrderedListOutlined)
);

const KeyOutlined = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.KeyOutlined)
);

const FileMarkdownTwoTone = dynamic(() =>
  import("@ant-design/icons").then((icon) => icon.FileMarkdownTwoTone)
);

const Avatar = dynamic(() => import("antd").then((mod) => mod.Avatar), {
  ssr: false,
  loading: () => <Spin size="small" />,
});

const Dropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
  loading: () => <Spin size="small" />,
});
const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const siderWidthCollapsed = 80;
  const siderWidthExpanded = 200;
  const router = useRouter();
  const pathname = usePathname();
  const companyName = useCompanyName();
  const merchantName = useMerchantName();
  const apiKey = useApiKey();
  const [loading, setLoading] = useState(true);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newBookingsCount, setNewBookingsCount] = useState(0);
  const [selectedContent, setSelectedContent] = useState<string>("");

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const disableSidebar = ["/dashboard/login"];
  const shouldHideSidebar = disableSidebar.includes(pathname);

  const disableCompanyName = [
    "/dashboard/doctor",
    "/dashboard/queue",
    "/dashboard/reservation",
  ];
  const shouldHideCompanyName = disableCompanyName.some((route) =>
    pathname.includes(route)
  );

  // const fetchDataWithLastChecked = async (
  //   endpoint: string,
  //   lastCheckedKey: string,
  //   setStateCallback: React.Dispatch<React.SetStateAction<number>>
  // ) => {
  //   const token = Cookies.get("token");
  //   const lastChecked = localStorage.getItem(lastCheckedKey) || "";

  //   if (!token) {
  //     console.error("Authentication token not found.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const query = lastChecked ? `?lastChecked=${lastChecked}` : "";
  //     const response = await fetch(`${endpoint}${query}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch data. Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setStateCallback(data.count);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDataWithLastChecked(
  //     "/api/order/count",
  //     "lastCheckedOrderTime",
  //     setNewOrdersCount
  //   );
  //   fetchDataWithLastChecked(
  //     "/api/booking/count",
  //     "lastCheckedBookingTime",
  //     setNewBookingsCount
  //   );

  //   const intervalId = setInterval(() => {
  //     fetchDataWithLastChecked(
  //       "/api/order/count",
  //       "lastCheckedOrderTime",
  //       setNewOrdersCount
  //     );
  //     fetchDataWithLastChecked(
  //       "/api/booking/count",
  //       "lastCheckedBookingTime",
  //       setNewBookingsCount
  //     );
  //   }, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // const handleOrderClick = () => {
  //   localStorage.setItem("lastCheckedOrderTime", Date.now().toString());
  //   setNewOrdersCount(0);
  //   router.push("/dashboard/order");
  // };

  // const handleBookingClick = () => {
  //   localStorage.setItem("lastCheckedBookingTime", Date.now().toString());
  //   setNewBookingsCount(0);
  //   router.push("/dashboard/booking");
  // };

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  const determineSelectedKeys = (pathname: any, items: any) => {
    if (
      pathname.includes("/dashboard/calendar/[doctor_id]") &&
      pathname.split("/").length === 4
    ) {
      return ["/dashboard/doctor"];
    }

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

  // Definisikan items tanpa properti style
  const initialItems: MenuItem[] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "/dashboard/doctor",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/doctor">Dokter</Link>,
    },
    {
      key: "/dashboard/reservation",
      icon: <OrderedListOutlined />,
      label: <Link href="/dashboard/reservation">Reservasi</Link>,
    },
    {
      key: "/dashboard/queue",
      icon: <BookOutlined />,
      label: <Link href="/dashboard/queue">Antrian</Link>,
    },
  ];

  // Hitung selectedKeys setelah items didefinisikan
  const selectedKeys = determineSelectedKeys(pathname, initialItems);

  // Tambahkan properti style ke dalam items
  const items = initialItems.map((item: any) => ({
    ...item,
    style: { color: selectedKeys.includes(item.key) ? "black" : "white" },
  }));
  const confirmLogout = () => {
    Modal.confirm({
      title: "Konfirmasi Keluar",
      content: "Apakah Anda yakin ingin keluar?",
      okText: "Ya",
      cancelText: "Tidak",
      onOk: () => {
        Cookies.remove("token");
        message.success("Logout successful!");
        window.location.href = "/dashboard/login";
      },
    });
  };

  const showApiKey = (apiKey: string) => {
    Modal.info({
      title: "API Key",
      content: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Paragraph copyable={{ text: apiKey }} style={{ fontSize: "16px" }}>
            {apiKey}
          </Paragraph>
        </Space>
      ),
      width: 600,
    });
  };

  const showDocumentation = () => {
    setSelectedContent("dokumentasi");
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "apiKey",
          label: "API Key",
          icon: <KeyOutlined />,
          onClick: () => showApiKey(apiKey),
        },
        {
          key: "dokumentasi",
          label: "Dokumentasi",
          icon: <FileMarkdownTwoTone />,
          onClick: () => showDocumentation(),
        },
        {
          key: "logout",
          label: "Keluar",
          icon: <LogoutOutlined />,
          onClick: confirmLogout,
        },
      ]}
    />
  );

  // if (loading) {
  //   return <LayoutSkeleton />;
  // }

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
              <img src="/image/appointMed2.png" alt="" />
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
          style={{
            backgroundColor: "transparent",
          }}
          items={items}
          mode="inline"
          selectedKeys={selectedKeys}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? siderWidthCollapsed : siderWidthExpanded,
          transition: "margin 0.2s",
          backgroundColor: "#F1F5F9",
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
                      <div style={{ color: "black" }}>{merchantName}</div>
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
                <Breadcrumb.Item>Selamat Datang {companyName}</Breadcrumb.Item>
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
            marginTop: "50px",
          }}
        >
          AppointMed ©{new Date().getFullYear()}
        </Footer>
      </Layout>
      <Modal
        title="Dokumentasi"
        visible={selectedContent !== ""}
        onCancel={() => setSelectedContent("")}
        footer={null}
      >
        {selectedContent === "dokumentasi" && (
          <>
            <Card hoverable onClick={() => setSelectedContent("react")}>
              <h1>Dokumentasi Penggunaan Dengan React</h1>
            </Card>
            <Card
              hoverable
              onClick={() => setSelectedContent("html")}
              style={{ marginTop: "1rem" }}
            >
              <h1>Dokumentasi Penggunaan Dengan HTML</h1>
            </Card>
          </>
        )}

        {selectedContent === "react" && (
          <ul>
            <li>Langkah 1: Import React dari react</li>
            <li>Langkah 2: Buat komponen</li>
            <li>Langkah 3: Gunakan komponen dalam aplikasi Anda</li>
            {/* Tambahkan item lain yang relevan */}
          </ul>
        )}

        {selectedContent === "html" && (
          <ul>
            <li>Langkah 1: Buat file HTML</li>
            <li>Langkah 2: Tambahkan elemen HTML</li>
            <li>Langkah 3: Gaya dengan CSS</li>
            {/* Tambahkan item lain yang relevan */}
          </ul>
        )}
      </Modal>
    </Layout>
  );
};

export default Sidebar;
