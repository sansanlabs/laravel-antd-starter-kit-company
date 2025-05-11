import { __, handleTableChange } from "@/lib/utils";
import { QueryResultType, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Table, TableProps } from "antd";

import SortIcon from "./sort-icon";

type DatatableType = {
  queryResult: QueryResultType;
  route: string;
  columns: TableProps["columns"];
};

export default function Datatable({ queryResult, route, columns = [] }: DatatableType) {
  const { locale } = usePage<SharedData>().props;

  const columnsFiltered: TableProps["columns"] = columns
    .filter((item): item is Exclude<typeof item, false | null | undefined> => Boolean(item))
    .map((column) => {
      if (column.sorter) {
        return { ...column, sortIcon: ({ sortOrder }: { sortOrder: string }) => <SortIcon sortOrder={sortOrder} /> };
      }
      return column;
    }) as TableProps["columns"];

  return (
    <Table
      bordered
      rowKey="id"
      style={{
        marginBottom: -16,
      }}
      onChange={(pagination, filter, sorter) => handleTableChange(queryResult, route, pagination, sorter)}
      size="small"
      scroll={{ x: "max-content" }}
      columns={columnsFiltered}
      dataSource={queryResult.data}
      pagination={{
        size: "default",
        current: queryResult.page,
        total: queryResult.total,
        pageSize: queryResult.size,
        responsive: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          __(locale, "lang.total_data_table", {
            from: range[0].toString(),
            to: range[1].toString(),
            total: total.toString(),
          }),
      }}
    />
  );
}
