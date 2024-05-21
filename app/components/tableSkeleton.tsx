import React from "react";
import { Table, Skeleton } from "antd";

function TableSkeleton() {
  const columns = [
    {
      title: <Skeleton.Input style={{ width: 80 }} active size="small" />,
      render: () => (
        <Skeleton.Input style={{ width: 100 }} active size="small" />
      ),
    },
    {
      title: <Skeleton.Input style={{ width: 40 }} active size="small" />,
      render: () => (
        <Skeleton.Input style={{ width: 50 }} active size="small" />
      ),
    },
    {
      title: <Skeleton.Input style={{ width: 120 }} active size="small" />,
      render: () => (
        <Skeleton.Input style={{ width: 150 }} active size="small" />
      ),
    },
  ];

  const data = Array.from({ length: 5 }).map((_, index) => ({
    key: index,
    name: {},
    age: {},
    address: {},
  }));

  return (
    <div>
      <Skeleton.Input
        style={{ width: "100%", height: 30, marginBottom: 20 }}
        active
      />
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}

export default TableSkeleton;
