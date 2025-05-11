import { __, getDefaultSortOrder } from "@/lib/utils";
import { QueryResultType, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Flex, Typography } from "antd";
import dayjs from "dayjs";
import { LuCalendarClock, LuUserRound } from "react-icons/lu";

type RecordType = {
  created_at: string;
  creator: {
    name: string;
  };
  updated_at: string;
  editor: {
    name: string;
  };
};

export default function ColumnCreatedAtUpdatedAt(queryResult: QueryResultType) {
  const { locale } = usePage<SharedData>().props;

  const renderTimeUser = (time: string | null, user: string | null) => (
    <Flex vertical style={{ marginBlock: -4 }}>
      <Flex align="center" gap="small">
        <LuCalendarClock />
        {time ? dayjs(time).locale(locale).format("dddd, DD MMM YYYY | HH:mm:ss") : "-"}
      </Flex>
      <Flex align="center" gap="small" style={{ marginTop: -2 }}>
        <LuUserRound />
        <Typography.Text style={{ margin: 0 }}>{user ?? "-"}</Typography.Text>
      </Flex>
    </Flex>
  );

  return [
    {
      title: __(locale, "lang.created_at"),
      dataIndex: "created_at",
      key: "created_at",
      minWidth: 1,
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "created_at"),
      render: (created_at: string, record: RecordType) => renderTimeUser(created_at, record.creator?.name),
    },
    {
      title: __(locale, "lang.updated_at"),
      dataIndex: "updated_at",
      key: "updated_at",
      minWidth: 1,
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "updated_at"),
      render: (updated_at: string, record: RecordType) => {
        const isSameTime = updated_at === record.created_at;
        return renderTimeUser(isSameTime ? null : updated_at, isSameTime ? null : record.editor?.name);
      },
    },
  ];
}
