import Datatable from "@/components/datatable";
import InnerSidebarMenuUser from "@/components/inner-sidebar-menu-user";
import InputSearchDatatable from "@/components/input-search-datatable";
import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { ActivityLogType, QueryResultType, SharedData, UserType } from "@/types";
import { usePage } from "@inertiajs/react";
import { Button, Descriptions, DescriptionsProps, Dropdown, Modal, TableProps, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LuChevronDown, LuListMinus } from "react-icons/lu";
import { UAParser } from "ua-parser-js";

type IndexType = {
  user: UserType;
  queryResult: QueryResultType;
};

Index.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Index({ user, queryResult }: IndexType) {
  const { locale } = usePage<SharedData>().props;
  const [isShowModalDetail, setIsShowModalDetail] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ActivityLogType | null>(null);
  const agent = UAParser(selectedData?.agent);

  const columns = [
    {
      title: __(locale, "lang.log_name"),
      dataIndex: "log_name",
      key: "log_name",
    },
    {
      title: __(locale, "lang.event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: __(locale, "lang.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: __(locale, "lang.causer"),
      dataIndex: "causer",
      key: "causer",
      render: (causer: { name: string }) => causer?.name ?? "-",
    },
    {
      title: __(locale, "lang.method"),
      dataIndex: "method",
      key: "method",
    },
    {
      title: __(locale, "lang.ip"),
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: __(locale, "lang.agent"),
      dataIndex: "agent",
      key: "agent",
      render: (agent: string) => {
        const { browser, os } = UAParser(agent);
        return (
          <Typography.Text style={{ margin: 0 }}>
            {os.name} - {browser.name}
          </Typography.Text>
        );
      },
    },
    {
      title: __(locale, "lang.occurs_in"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => dayjs(created_at).locale(locale).format("dddd, DD MMM YYYY | HH:mm:ss"),
    },

    {
      title: __(locale, "lang.action"),
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      width: 1,
      render: (_: string, record: ActivityLogType) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "detail",
                label: __(locale, "lang.detail"),
                icon: <LuListMinus size={14} />,
                onClick: () => {
                  setSelectedData(record);
                  setIsShowModalDetail(true);
                },
              },
            ],
          }}
        >
          <Button icon={<LuChevronDown size={16} style={{ marginBottom: -2 }} />} />
        </Dropdown>
      ),
    },
  ];

  const items = [
    {
      key: "log_name",
      label: __(locale, "lang.log_name"),
      children: selectedData?.log_name,
    },
    {
      key: "event",
      label: __(locale, "lang.event"),
      children: selectedData?.event,
    },
    {
      key: "description",
      label: __(locale, "lang.description"),
      children: selectedData?.description,
    },
    {
      key: "method",
      label: __(locale, "lang.method"),
      children: selectedData?.method,
    },
    {
      key: "ip_address",
      label: __(locale, "lang.ip_address"),
      children: selectedData?.ip,
    },
    {
      key: "url",
      label: __(locale, "lang.url"),
      children: (
        <Typography.Paragraph copyable style={{ margin: 0 }}>
          {selectedData?.url}
        </Typography.Paragraph>
      ),
    },
    {
      key: "agent",
      label: __(locale, "lang.agent"),
      children: (
        <Typography.Text style={{ margin: 0 }}>
          {agent.os.name} - {agent.browser.name}
        </Typography.Text>
      ),
    },
    {
      key: "subject",
      label: __(locale, "lang.subject"),
      children: selectedData?.subject ? (
        <Typography.Paragraph>
          <pre>{JSON.stringify(selectedData?.subject, null, 2)}</pre>
        </Typography.Paragraph>
      ) : (
        "-"
      ),
    },
    {
      key: "subject_type",
      label: __(locale, "lang.subject_type"),
      children: selectedData?.subject_type ?? "-",
    },
    {
      key: "causer",
      label: __(locale, "lang.causer"),
      children: selectedData?.causer?.name,
    },
    {
      key: "causer_type",
      label: __(locale, "lang.causer_type"),
      children: selectedData?.causer_type,
    },
    {
      key: "properties",
      label: __(locale, "lang.properties"),
      children: selectedData?.properties && !Array.isArray(selectedData?.properties) && (
        <div>
          <span>{__(locale, "lang.old")} :</span>
          <Typography.Paragraph>
            <pre>{JSON.stringify(selectedData.properties.old, null, 2)}</pre>
          </Typography.Paragraph>
          <span>{__(locale, "lang.new")} :</span>
          <Typography.Paragraph>
            <pre>{JSON.stringify(selectedData.properties.attributes, null, 2)}</pre>
          </Typography.Paragraph>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title={`${__(locale, "lang.activity_logs")} | ${user.name}`}
      activeMenu="users"
      breadcrumb={[
        {
          title: __(locale, "lang.users"),
          url: route("users.index"),
        },
        {
          title: user.name,
          url: route("users.show", { user: user.id }),
        },
        {
          title: __(locale, "lang.activity_logs"),
        },
      ]}
      innerSidebarMenu={InnerSidebarMenuUser(user)}
      innerSidebarActiveMenu="activity-logs"
      extra={
        <InputSearchDatatable queryResult={queryResult} route={route("users.activity-logs.index", { user: user.id })} />
      }
    >
      <Datatable
        queryResult={queryResult}
        route={route("users.activity-logs.index", { user: user.id })}
        columns={columns as TableProps["columns"]}
      />

      <Modal
        title={__(locale, "lang.detail")}
        style={{ maxWidth: "56rem" }}
        width="100%"
        open={isShowModalDetail}
        maskClosable={false}
        onOk={() => setIsShowModalDetail(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={() => setIsShowModalDetail(false)}
      >
        <Descriptions
          bordered
          items={items as DescriptionsProps["items"]}
          size="small"
          column={1}
          styles={{ label: { width: "70px" }, content: { width: "80%" } }}
        />
      </Modal>
    </DashboardLayout>
  );
}
