"use client";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Flex } from "antd";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

// Define the types for invoiceData
interface InvoiceData {
  id: string;
  status: string;
  external_id: string;
  customer: { given_names: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  amount: number;
  currency: string;
  payment_method: string;
  payment_channel: string;
  created: string;
  expiry_date: string;
  merchant_profile_picture_url: string;
  merchant_name: string;
}

function GetInvoiceComponent() {
  const targetRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ invoiceId: string }>();
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: "",
    status: "",
    external_id: "",
    customer: { given_names: "", email: "" },
    items: [],
    amount: 0,
    currency: "",
    payment_method: "-",
    payment_channel: "-",
    created: "",
    expiry_date: "",
    merchant_profile_picture_url: "",
    merchant_name: "",
  });

  useEffect(() => {
    setLoading(true);
    getInvoice();
  }, [params.invoiceId]);

  const getInvoice = async () => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      const basicAuthHeader = `Basic ${btoa(secretKey + ":")}`;
      const endpoint = `https://api.xendit.co/v2/invoices/?external_id=${params.invoiceId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: basicAuthHeader,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data[0]) {
        console.log("invoice data", response.data[0] && response.data);
        setInvoiceData(response.data[0]);
      } else {
        console.log("No invoice data found");
      }
      setLoading(false);
    } catch (error) {
      console.log("error fetching data", error);
      setLoading(false);
    }
  };
  const options: any = {
    filename: invoiceData.external_id + ".pdf",
    // default is `save   `
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.NONE,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/png",
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  const renderItems = () => {
    console.log("invoiceData.items:", invoiceData.items);
    return (
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ backgroundColor: "#007E85", color: "white" }}>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Nama Kendaraan
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Harga</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hari</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.price)}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.quantity * item.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return <p>Sedang Menyiapkan invoice...</p>;
  }

  return (
    <Flex vertical gap={10} style={{ padding: "2rem" }}>
      {loading ? (
        <div>Sedang Menyiapkan invoice...</div>
      ) : (
        <>
          <Flex
            justify="space-between"
            style={{ marginTop: "2rem", width: "100%" }}
          >
            <Link href="/dashboard/reservation">
              <Button
                onClick={() => setLoading(true)}
                loading={loading}
                size="middle"
                shape="round"
                type="primary"
                style={{
                  width: "100%",
                  marginInline: "1rem",
                  backgroundColor: "#007E85",
                }}
                icon={<ArrowLeftOutlined />}
              >
                Kembali
              </Button>
            </Link>
            <Button
              onClick={() => {
                setLoading(true);
                generatePDF(targetRef, options)
                  .then(() => setLoading(false))
                  .catch(() => setLoading(false));
              }}
              disabled={loading}
            >
              {loading ? "Sedang Menyiapkan Pdf..." : "Download PDF"}
            </Button>
          </Flex>
          <Divider style={{ margin: 5 }} />
          <div style={{ border: "3px solid #ddd" }}>
            <div ref={targetRef}>
              <Flex vertical justify="center" style={{ paddingInline: "2rem" }}>
                <div
                  className="top-line"
                  style={{
                    backgroundColor: "#007E85",
                    width: "600px",
                    height: "10px",
                    borderRadius: "0 0  10px 10px",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "auto", // center horizontally
                    marginRight: "auto", // center horizontally
                  }}
                ></div>
                <Flex vertical>
                  <p
                    style={{
                      fontSize: "2.4rem",
                      marginTop: "2rem",
                      marginBottom: 0,
                    }}
                  >
                    INVOICE
                  </p>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      marginBlock: 6,
                      color: "#4B4B4b",
                    }}
                  >
                    Invoice ID : {invoiceData.id}
                  </p>

                  <p
                    style={{
                      fontSize: "1.1rem",
                      marginBlock: 6,
                      color: "#4B4B4b",
                    }}
                  >
                    Invoice Date :{" "}
                    {new Date(invoiceData.created).toLocaleDateString()}
                  </p>
                </Flex>

                <Divider
                  style={{ border: "1px solid #8E8E8E", marginBlock: "0.8rem" }}
                />
                <Flex justify="space-between">
                  <Flex vertical flex={4}>
                    {" "}
                    <p
                      style={{
                        color: "#9E9E9E",
                        marginBottom: " 15px",
                        fontSize: "1rem",
                      }}
                    >
                      Nama Customer: {""}
                      <span style={{ fontSize: "1.1rem", color: "black" }}>
                        {invoiceData.customer.given_names}
                      </span>
                    </p>
                    <p
                      style={{
                        color: "#9E9E9E",
                        marginBottom: "15px",
                        fontSize: "1rem",
                      }}
                    >
                      Refrence ID:{" "}
                      <span style={{ fontSize: "1.1rem", color: "black" }}>
                        {invoiceData.external_id}
                      </span>
                    </p>
                  </Flex>
                  <Flex vertical flex={1} align="flex-end">
                    <h4 style={{ fontWeight: "normal ", color: "#4B4B4b" }}>
                      Status:{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: (() => {
                            switch (invoiceData.status) {
                              case "EXPIRED":
                                return "#6A6A6A"; // abu
                              case "PENDING":
                                return "yellow"; // kuning
                              case "PAID":
                              case "SETTLED":
                                return "#4BB261"; // hijau
                              default:
                                return "red"; // merah untuk status lainnya
                            }
                          })(),
                        }}
                      >
                        {invoiceData.status === "SETTLED"
                          ? "PAID"
                          : invoiceData.status}
                      </span>
                    </h4>

                    <p
                      style={{
                        color: "#9E9E9E",
                        marginBottom: "15px",
                        marginTop: "10px",
                        fontSize: "1rem",
                        textAlign: "right",
                      }}
                    >
                      Metode Pembayaran:{" "}
                      <span style={{ fontSize: "1.1rem", color: "black" }}>
                        {invoiceData.payment_method}
                      </span>
                    </p>
                    <p
                      style={{
                        textAlign: "right",
                        color: "#9E9E9E",
                        marginBottom: "15px",
                        fontSize: "1rem",
                      }}
                    >
                      Pembayaran via:{" "}
                      <span style={{ fontSize: "1.1rem", color: "black" }}>
                        {invoiceData.payment_channel}
                      </span>
                    </p>
                  </Flex>
                </Flex>

                <Flex vertical>
                  <div>{renderItems()}</div>
                </Flex>
                <Flex vertical align="end" style={{ marginTop: "0.5rem" }}>
                  <p
                    style={{
                      color: "#9E9E9E",
                      fontSize: "1rem",
                    }}
                  >
                    Biaya Admin:{" "}
                  </p>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "1rem",
                    }}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(5000)}
                  </span>
                </Flex>
                <Flex vertical align="end">
                  <p
                    style={{
                      color: "#9E9E9E",

                      marginTop: "1.2rem",
                      fontSize: "1rem",
                    }}
                  >
                    Total Pembayaran:
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      margin: "4px",
                      marginTop: "2px",
                      fontSize: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bolder",
                        color: "black",
                        fontSize: "1.5rem",
                      }}
                    >
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(invoiceData.amount)}
                    </span>
                  </p>
                </Flex>
              </Flex>
            </div>
          </div>
        </>
      )}
    </Flex>
  );
}
export default GetInvoiceComponent;
