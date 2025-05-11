import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { RoleType, SharedData } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { App, Button, Descriptions, Flex, Input, Table } from "antd";
import { useResponsive } from "antd-style";
import { useState } from "react";
import { LuPencilLine, LuSearch, LuTrash2 } from "react-icons/lu";

type ShowType = {
  role: RoleType;
  allPermissions: {
    name: "string";
    options: {
      id: string;
      name: string;
      description: string;
    }[];
  }[];
  permissionTotal: number;
  selectedCollapseIds: string[];
};

Show.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Show({ role, allPermissions, permissionTotal, selectedCollapseIds }: ShowType) {
  const { locale } = usePage<SharedData>().props;
  const { modal, message } = App.useApp();
  const { mobile } = useResponsive();

  const [permissionsDataSource, setPermissionsDataSource] = useState(allPermissions);

  const onDelete = () => {
    const modalConfirm = modal.confirm({
      title: __(locale, "modal_confirm.title"),
      content: __(locale, "modal_confirm.desc"),
      okButtonProps: { danger: true },
      okText: __(locale, "lang.delete"),
      cancelButtonProps: { disabled: false },
      onOk: async () => {
        return new Promise((resolve) => {
          router.delete(route("roles.destroy", { role: role.id }), {
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

  return (
    <DashboardLayout
      title={`${__(locale, "lang.detail")} | ${role.name}`}
      breadcrumb={[
        {
          title: __(locale, "lang.roles"),
          url: route("roles.index"),
        },
        {
          title: role.name,
          url: route("roles.show", { role: role.id }),
        },
        {
          title: __(locale, "lang.detail"),
        },
      ]}
      activeMenu="roles"
      extra={
        <>
          {role.name === "SuperAdmin" ? (
            <Button type="primary" icon={<LuPencilLine />} disabled={role.name === "SuperAdmin"}>
              {__(locale, "lang.edit")}
            </Button>
          ) : (
            <Link href={route("roles.edit", { role: role.id })}>
              <Button type="primary" icon={<LuPencilLine />}>
                {__(locale, "lang.edit")}
              </Button>
            </Link>
          )}

          <Button danger type="primary" icon={<LuTrash2 />} onClick={onDelete} disabled={role.name === "SuperAdmin"}>
            {__(locale, "lang.delete")}
          </Button>
        </>
      }
    >
      <Flex vertical style={{ maxWidth: "48rem" }} gap={16}>
        <Descriptions
          bordered
          size="small"
          column={1}
          layout={mobile ? "vertical" : "horizontal"}
          styles={{ label: { width: mobile ? "100%" : "33.33%" } }}
          items={[
            {
              key: "name",
              label: __(locale, "lang.name"),
              children: role.name,
            },
            {
              key: "permissions",
              label: __(locale, "lang.permissions"),
              children: `${role.permissions.length}/${permissionTotal} ${__(locale, "lang.permissions")}`,
            },
          ]
            .filter(Boolean)
            .map((item) => ({
              ...item,
              label: mobile ? `${item.label} :` : item.label,
            }))}
        />

        <div>
          <Input
            allowClear
            prefix={<LuSearch />}
            placeholder={__(locale, "lang.search_here")}
            onChange={(e) => {
              const keyword = e.currentTarget.value.trim();

              const lowerKeyword = keyword.toLowerCase();

              const permissionFiltered = allPermissions
                .map((permission) => {
                  const filteredOptions = permission.options.filter(
                    (option) =>
                      option.name.toLowerCase().includes(lowerKeyword) ||
                      option.description.toLowerCase().includes(lowerKeyword)
                  );

                  if (filteredOptions.length > 0) {
                    return {
                      ...permission,
                      options: filteredOptions,
                    };
                  }

                  return null;
                })
                .filter(Boolean);

              setPermissionsDataSource(permissionFiltered as ShowType["allPermissions"]);
            }}
          />

          <Table
            bordered
            size="small"
            rowKey="name"
            columns={[
              {
                title: __(locale, "lang.name"),
                dataIndex: "name",
                key: "name",
                onCell: ({ children }) => ({ colSpan: children?.length ? 2 : 1 }),
              },
              {
                title: __(locale, "lang.description"),
                dataIndex: "description",
                key: "description",
                onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
              },
            ]}
            scroll={{ x: "max-content" }}
            showHeader={false}
            rowSelection={{
              checkStrictly: false,
              selectedRowKeys: selectedCollapseIds,
            }}
            expandable={{
              expandRowByClick: true,
              defaultExpandAllRows: true,
            }}
            dataSource={permissionsDataSource.map((permission) => ({
              name: permission.name,
              children: permission.options,
            }))}
            pagination={false}
          />
        </div>
      </Flex>
    </DashboardLayout>
  );
}
