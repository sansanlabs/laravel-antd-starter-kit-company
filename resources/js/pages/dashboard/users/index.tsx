import ColumnCreatedAtUpdatedAt from "@/components/column-created-at-updated-at";
import Datatable from "@/components/datatable";
import InputSearchDatatable from "@/components/input-search-datatable";
import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { can, canAny } from "@/lib/permissions";
import { __, getDefaultSortOrder } from "@/lib/utils";
import { QueryResultType, RoleType, SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Button, Dropdown, Flex, Image, MenuProps, TableProps, Tag, Typography } from "antd";
import { LuChevronDown, LuEye, LuHistory, LuListMinus, LuMonitorSmartphone, LuPencilLine } from "react-icons/lu";

type IndexType = {
  queryResult: QueryResultType;
};

Index.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Index({ queryResult }: IndexType) {
  const { locale, permissions } = usePage<SharedData>().props;

  const columns = [
    {
      title: __(locale, "lang.photo"),
      key: "photo",
      dataIndex: "id",
      align: "center",
      width: 1,
      render: (id: string) => {
        return (
          <Flex justify="center" align="center" style={{ width: "100%", height: 10 }}>
            <Flex justify="center" align="center" style={{ overflow: "hidden" }}>
              <Image
                src={route("users.user-avatar", { user: id })}
                width={40}
                preview={{
                  mask: <LuEye />,
                }}
              />
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: __(locale, "lang.name"),
      key: "name",
      dataIndex: "name",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "name"),
    },
    {
      title: __(locale, "lang.email"),
      key: "email",
      dataIndex: "email",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "email"),
      render: (email: string) => <Typography.Text copyable>{email}</Typography.Text>,
    },
    {
      title: __(locale, "lang.roles"),
      key: "roles",
      dataIndex: "roles",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "roles"),
      render: (roles: RoleType[]) =>
        roles.length > 0 ? roles.map((role) => <Tag key={role.id}>{role.name}</Tag>) : "-",
    },
    ...ColumnCreatedAtUpdatedAt(queryResult),
    canAny(permissions, [
      "Users.Detail",
      "Users.Edit",
      "Users.ActivityLogs.Index",
      "Users.DeviceSessions.Index",
      "Users.TwoFactorAuth.Index",
    ]) && {
      title: __(locale, "lang.action"),
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      width: 1,
      render: (id: string) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              can(permissions, "Users.Detail") && {
                key: "detail",
                label: <Link href={route("users.show", { user: id })}>{__(locale, "lang.detail")}</Link>,
                icon: <LuListMinus size={14} />,
              },
              can(permissions, "Users.Edit") && {
                key: "edit",
                label: <Link href={route("users.edit", { user: id })}>{__(locale, "lang.edit")}</Link>,
                icon: <LuPencilLine size={14} />,
              },
              can(permissions, "Users.ActivityLogs.Index") && {
                key: "activity-logs",
                label: (
                  <Link href={route("users.activity-logs.index", { user: id })}>
                    {__(locale, "lang.activity_logs")}
                  </Link>
                ),
                icon: <LuHistory size={14} />,
              },
              can(permissions, "Users.DeviceSessions.Index") && {
                key: "device-sessions",
                label: (
                  <Link href={route("users.device-sessions.index", { user: id })}>
                    {__(locale, "lang.device_sessions")}
                  </Link>
                ),
                icon: <LuMonitorSmartphone size={14} />,
              },
            ].filter(Boolean) as MenuProps["items"],
          }}
        >
          <Button icon={<LuChevronDown size={16} style={{ marginBottom: -2 }} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <DashboardLayout
      title={__(locale, "lang.users")}
      activeMenu="users"
      breadcrumb={[
        {
          title: __(locale, "lang.users"),
        },
      ]}
      extra={
        <>
          <InputSearchDatatable queryResult={queryResult} route={route("users.index")} />
        </>
      }
    >
      <Datatable queryResult={queryResult} route={route("users.index")} columns={columns as TableProps["columns"]} />
    </DashboardLayout>
  );
}
