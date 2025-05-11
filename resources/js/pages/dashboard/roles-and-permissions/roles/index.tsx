import ColumnCreatedAtUpdatedAt from "@/components/column-created-at-updated-at";
import Datatable from "@/components/datatable";
import InputSearchDatatable from "@/components/input-search-datatable";
import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __, getDefaultSortOrder } from "@/lib/utils";
import { PermissionType, QueryResultType, RoleType, SharedData } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { App, Button, Dropdown, TableProps, Typography } from "antd";
import { MenuItemType } from "antd/lib/menu/interface";
import { LuChevronDown, LuListMinus, LuPencilLine, LuPlus, LuTrash2 } from "react-icons/lu";

type IndexType = {
  queryResult: QueryResultType;
  pemissionsTotal: number;
};

Index.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Index({ queryResult, pemissionsTotal }: IndexType) {
  const { locale } = usePage<SharedData>().props;
  const { modal, message } = App.useApp();

  const onDelete = (id: string) => {
    const modalConfirm = modal.confirm({
      title: __(locale, "modal_confirm.title"),
      content: __(locale, "modal_confirm.desc"),
      okButtonProps: { danger: true },
      okText: __(locale, "lang.delete"),
      cancelButtonProps: { disabled: false },
      onOk: async () => {
        return new Promise((resolve) => {
          router.delete(route("roles.destroy", { role: id }), {
            onStart: () => {
              modalConfirm.update({ cancelButtonProps: { disabled: true } });
            },
            onSuccess: () => {
              message.destroy();
              message.success(__(locale, "message.success"));
            },
            onError: () => {
              message.destroy();
              message.error(__(locale, "message.error_server"));
            },
            onFinish: resolve,
          });
        });
      },
    });
  };

  const columns = [
    {
      title: __(locale, "lang.name"),
      key: "name",
      dataIndex: "name",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "name"),
    },
    {
      title: __(locale, "lang.description"),
      key: "description",
      dataIndex: "description",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(queryResult, "description"),
    },
    {
      title: __(locale, "lang.permissions"),
      key: "permissions",
      dataIndex: "permissions",
      render: (permissions: PermissionType[]) => (
        <Typography.Text>
          {permissions.length}/{pemissionsTotal} {__(locale, "lang.permissions")}
        </Typography.Text>
      ),
    },
    ...ColumnCreatedAtUpdatedAt(queryResult),
    {
      title: __(locale, "lang.action"),
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      width: 1,
      render: (id: string, record: RoleType) => {
        const isSuperAdmin = record.name === "SuperAdmin";

        return (
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: "detail",
                  label: <Link href={route("roles.show", { role: id })}>{__(locale, "lang.detail")}</Link>,
                  icon: <LuListMinus size={14} />,
                },
                {
                  key: "edit",
                  label: <Link href={route("roles.edit", { role: id })}>{__(locale, "lang.edit")}</Link>,
                  icon: <LuPencilLine size={14} />,
                  disabled: isSuperAdmin,
                },
                {
                  type: "divider",
                },
                {
                  key: "delete",
                  label: __(locale, "lang.delete"),
                  icon: <LuTrash2 size={14} />,
                  danger: true,
                  disabled: isSuperAdmin,
                  onClick: () => onDelete(id),
                },
              ].filter(Boolean) as MenuItemType[],
            }}
          >
            <Button icon={<LuChevronDown size={16} style={{ marginBottom: -2 }} />} />
          </Dropdown>
        );
      },
    },
  ] as TableProps["columns"];

  return (
    <DashboardLayout
      title={__(locale, "lang.roles")}
      activeMenu="roles"
      breadcrumb={[
        {
          title: __(locale, "lang.roles"),
        },
      ]}
      extra={
        <>
          <Link href={route("roles.create")}>
            <Button type="primary" icon={<LuPlus />}>
              {__(locale, "lang.create")}
            </Button>
          </Link>

          <InputSearchDatatable queryResult={queryResult} route={route("roles.index")} />
        </>
      }
    >
      <Datatable queryResult={queryResult} route={route("roles.index")} columns={columns} />
    </DashboardLayout>
  );
}
