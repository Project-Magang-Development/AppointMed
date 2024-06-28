"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Form,
  Input,
  Flex,
  Modal,
  Upload,
  DatePicker,
  Divider,
  Tooltip,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  ScheduleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import TableSkeleton from "@/app/components/tableSkeleton";
import useSWR, { mutate } from "swr";
import { useMemo } from "react";
import Cookies from "js-cookie";

const { RangePicker } = DatePicker;

interface Doctor {
  doctor_id: string;
  name: string;
  specialist: string;
  price: number;
  experiences: string;
  no_phone: string;
  no_sip: string;
  practiceDays: string;
  imageUrl: string;
  email: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  }).then((res) => res.json());

const DetailModal = ({
  visible,
  onClose,
  doctor,
}: {
  visible: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}) => {
  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "detail",
    },
  ];

  const data = doctor
    ? [
        {
          key: "1",
          field: "Nama",
          detail: doctor.name,
        },
        {
          key: "2",
          field: "Spesialis",
          detail: doctor.specialist,
        },
        {
          key: "3",
          field: "Hari Praktek",
          detail: doctor.practiceDays,
        },
        {
          key: "4",
          field: "Harga",
          detail: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(doctor.price),
        },
        {
          key: "5",
          field: "Pengalaman",
          detail: doctor.experiences,
        },
        {
          key: "6",
          field: "Email",
          detail: doctor.email,
        },

        {
          key: "7",
          field: "No. Telepon",
          detail: doctor.no_phone,
        },
        {
          key: "8",
          field: "No. SIP",
          detail: doctor.no_sip,
        },
      ]
    : [];

  return (
    <Modal
      title="Detail Dokter"
      visible={visible}
      footer={null}
      onCancel={onClose}
    >
      {doctor && (
        <div>
          <Image
            src={doctor.imageUrl}
            alt="Doctor"
            width={200}
            height={200}
            unoptimized={true}
            layout="responsive"
            style={{ marginBottom: "20px" }}
          />
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            showHeader={false}
            bordered
            rowKey="key"
          />
        </div>
      )}
    </Modal>
  );
};

export default function AdminDcotorDashboard() {
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();
  const [hoverDelete, setHoverDelete] = useState(false);
  const searchParams = useSearchParams();
  const { data: doctor, error, mutate } = useSWR("/api/doctor/show", fetcher);

  const handleDelete = async (doctorId: string) => {
    Modal.confirm({
      title: "Konfirmasi Penghapusan",
      content: "Kamu yakin menghapus data ini?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/doctor/delete/${doctorId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
          if (!response.ok) throw new Error("Deletion failed");

          mutate(
            Array.isArray(doctor)
              ? doctor.filter((d: Doctor) => d.doctor_id !== doctorId)
              : [],
            false
          );
          notification.success({
            message: "Data Dokter Berhasil Dihapus",
          });
        } catch (error) {
          notification.error({
            message: "Deletion failed",
            description: (error as Error).message,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    if (editingDoctor && editingDoctor.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: editingDoctor.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [editingDoctor]);

  const handleFileChange = (info: UploadChangeParam) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);

    if (newFileList[0] && newFileList[0].originFileObj) {
      convertFileToBase64(newFileList[0].originFileObj, (base64) => {
        const fileInBase64 = base64 as string;

        setFileList([
          {
            uid: "-1",
            name: newFileList[0].name,
            status: "done",
            url: fileInBase64,
          },
        ]);
      });
    } else {
      setFileList([]);
    }
  };

  const handleEdit = (doctor_id: string) => {
    const doctorToEdit = doctor.find(
      (doctor: any) => doctor.doctor_id === doctor_id
    );
    if (doctorToEdit) {
      setEditingDoctor(doctorToEdit);
      form.setFieldsValue({
        ...doctorToEdit,
        imageUrl: doctorToEdit.imageUrl ? [{ url: doctorToEdit.imageUrl }] : [],
      });
      setIsModalVisible(true);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    let response;
    try {
      const values = await form.validateFields();
      const imageUrl = fileList.length > 0 ? fileList[0].url : "";
      const payload = {
        name: values.name,
        specialist: values.specialist,
        practice_days: values.practiceDays,
        price: parseInt(values.price),
        email: values.email,
        experiences: values.experiences,
        no_phone: values.no_phone,
        no_sip: values.no_sip,
        imageUrl,
      };
      setLoading(true);

      const token = Cookies.get("token");

      if (editingDoctor) {
        response = await fetch(
          `/api/doctor/update/${editingDoctor.doctor_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch("/api/doctor/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          notification.error({
            message: "Gagal",
            description: "Limit Tambah Dokter Sudah Habis",
          });
        } else {
          throw new Error(errorData.message || "Failed to process vehicle");
        }
      } else {
        notification.success({
          message: "Sukses",
          description: editingDoctor
            ? "Data Dokter Berhasil Di Update."
            : "Data Dokter Berhasil Di Tambah.",
        });
        mutate();
        form.resetFields();
        setIsModalVisible(false);
        setEditingDoctor(null);
        setFileList([]);
      }
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: editingDoctor
          ? "Data Dokter Gagal Di Update."
          : "Data Dokter Gagal Di Tambah.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingDoctor(null);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleViewDetail = (doctor_id: string) => {
    const doctorToView = Array.isArray(doctor)
      ? doctor.find((doctor: Doctor) => doctor.doctor_id === doctor_id)
      : null;
    setSelectedDoctor(doctorToView || null);
    setIsDetailModalVisible(true);
  };

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const convertFileToBase64 = (
    file: Blob,
    callback: (result: string | ArrayBuffer | null) => void
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  };

  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctor)) return [];
    return doctor.filter((doctor: Doctor) =>
      doctor.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [doctor, searchText]);

  function formatPracticeDays(days: any) {
    const weekdays = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];

    const dayArray = days.split(",").map((day: any) => day.trim());

    const startIndex = weekdays.indexOf(dayArray[0]);
    const endIndex = weekdays.indexOf(dayArray[dayArray.length - 1]);

    const isConsecutive = dayArray.every((day: any, index: any) => {
      return weekdays.indexOf(day) === startIndex + index;
    });

    if (isConsecutive && endIndex - startIndex + 1 === dayArray.length) {
      return `${weekdays[startIndex]}-${weekdays[endIndex]}`;
    } else {
      return days;
    }
  }

  const handleScheduleAll = () => {
    router.push("/dashboard/doctor/calendar/all");
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: any) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => (
        <Image
          src={imageUrl}
          alt="doctor"
          width={100}
          height={60}
          unoptimized={true}
        />
      ),
    },
    {
      title: "Nama Dokter",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Bidang Spesialist",
      dataIndex: "specialist",
      key: "specialist",
    },
    {
      title: "No Telpon",
      dataIndex: "no_phone",
      key: "no_phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Jadwal Praktek",
      dataIndex: "practiceDays",
      key: "practiceDays",
      render: (practiceDays: any) => formatPracticeDays(practiceDays),
    },
    {
      title: "Harga",
      dataIndex: "price",
      key: "price",
      render: (data: any) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(data);
        return formattedPrice;
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.doctor_id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.doctor_id)}
              onMouseEnter={() => setHoverDelete(true)}
              onMouseLeave={() => setHoverDelete(false)}
              danger
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
          <Tooltip title="Detail">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => handleViewDetail(record.doctor_id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!doctor) return <TableSkeleton />;

  if (loading) return <TableSkeleton />;

  return (
    <div style={{ background: "#FFF", padding: "16px" }}>
      <div>
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Data Dokter
        </Title>
        <Divider />
        <Flex justify="space-between">
          <Flex justify="start" gap={20}>
            <Button
              icon={<PlusOutlined />}
              style={{ color: "#FFF", backgroundColor: "#007E85" }}
              onClick={showModal}
            >
              Tambah Data Dokter
            </Button>
            <Button
              icon={<ScheduleOutlined />}
              style={{ color: "#FFF", backgroundColor: "#007E85" }}
              onClick={handleScheduleAll}
            >
              Jadwal Dokter
            </Button>
          </Flex>
          <Input
            placeholder="Cari Dokter..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: "50%" }}
          />
        </Flex>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <Table
            columns={columns}
            dataSource={filteredDoctors.map((doctor: any, index: any) => ({
              ...doctor,
              index,
              key: doctor.doctor_id,
            }))}
            pagination={pagination}
            loading={loading}
            style={{ marginTop: "32px" }}
          />
        </div>
        <Modal
          title={editingDoctor ? "Edit Dokter" : "Tambah Dokter"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={loading}
        >
          <Form
            form={form}
            name="addDoctorForm"
            initialValues={{ remember: true }}
            onFinish={handleOk}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input placeholder="Masukan Nama" />
            </Form.Item>
            <Form.Item
              name="specialist"
              rules={[
                { required: true, message: "Please input the specialist!" },
              ]}
            >
              <Input placeholder="Masukan Spesialis" />
            </Form.Item>
            <Form.Item
              name="price"
              rules={[{ required: true, message: "Please input the price!" }]}
            >
              <Input placeholder="Masukan Harga" />
            </Form.Item>
            <Form.Item
              name="experiences"
              rules={[
                { required: true, message: "Please input the experience!" },
              ]}
            >
              <Input placeholder="Masukan Pengalaman" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input placeholder="Masukan Email Dokter" />
            </Form.Item>
            <Form.Item
              name="no_phone"
              rules={[
                { required: true, message: "Please input the phone number!" },
              ]}
            >
              <Input placeholder="Masukan No. Telepon" />
            </Form.Item>
            <Form.Item
              name="no_sip"
              rules={[
                { required: true, message: "Please input the SIP number!" },
              ]}
            >
              <Input placeholder="Masukan No. SIP" />
            </Form.Item>
            <Form.Item name="practiceDays">
              <Input placeholder="Masukan Hari Praktik" />
            </Form.Item>
            <Form.Item
              name="imageUrl"
              valuePropName="fileList"
              getValueFromEvent={({ fileList: newFileList }) => {
                if (newFileList.length > 1) {
                  const lastFile = newFileList[newFileList.length - 1];
                  return [lastFile].map((file) => ({
                    ...file,
                    url: file.originFileObj
                      ? URL.createObjectURL(file.originFileObj)
                      : file.url,
                  }));
                }
                return newFileList.map((file: any) => ({
                  ...file,
                  url: file.originFileObj
                    ? URL.createObjectURL(file.originFileObj)
                    : file.url,
                }));
              }}
            >
              <Upload.Dragger
                name="files"
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                showUploadList={false}
              >
                {fileList.length > 0 ? (
                  fileList.map((file) => (
                    <div
                      key={file.uid}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        marginBottom: "16px",
                      }}
                    >
                      <Image
                        src={file.url ?? (file.thumbUrl || "")}
                        alt={file.name}
                        layout="fill"
                        objectFit="contain"
                      />
                      {file.status === "uploading" && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: "rgba(255,255,255,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>Loading...</div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Klik atau drag file ke area ini untuk upload
                    </p>
                    <p className="ant-upload-hint">
                      Support untuk single upload.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </Form.Item>
          </Form>
        </Modal>
        <DetailModal
          visible={isDetailModalVisible}
          onClose={() => setIsDetailModalVisible(false)}
          doctor={selectedDoctor}
        />
      </div>
    </div>
  );
}
