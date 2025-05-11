import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { RoleType, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Flex, Input, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LuInfo, LuSearch } from "react-icons/lu";

type IndexType = {
  allPermissions: {
    name: string;
    options: {
      id: string;
      name: string;
      description: string;
      roles: RoleType[];
    }[];
  }[];
  totalRoles: number;
};

Index.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Index({ allPermissions, totalRoles }: IndexType) {
  const { locale } = usePage<SharedData>().props;

  const [keyword, setKeyword] = useState("");

  const permissionsDataSource = allPermissions
    .map((permission) => {
      const filteredOptions = permission.options.filter(
        (option) => option.name.toLowerCase().includes(keyword) || option.description.toLowerCase().includes(keyword)
      );

      if (filteredOptions.length > 0) {
        return {
          ...permission,
          options: filteredOptions,
        };
      }

      return null;
    })
    .filter(Boolean) as IndexType["allPermissions"];

  return (
    <DashboardLayout
      title={__(locale, "lang.permissions")}
      activeMenu="permissions"
      breadcrumb={[
        {
          title: __(locale, "lang.roles_and_permissions"),
        },
        {
          title: __(locale, "lang.permissions"),
        },
      ]}
      extra={
        <Input
          allowClear
          prefix={<LuSearch />}
          placeholder={__(locale, "lang.search_here")}
          onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const keyword = e.currentTarget.value.trim();
            const lowerKeyword = keyword.toLowerCase();
            setKeyword(lowerKeyword);
          }}
          onClear={() => setKeyword("")}
        />
      }
    >
      <Table
        bordered
        size="small"
        rowKey="name"
        columns={[
          {
            title: __(locale, "lang.name"),
            dataIndex: "name",
            key: "name",
            onCell: ({ children }) => ({ colSpan: children?.length ? 5 : 1 }),
          },
          {
            title: __(locale, "lang.description"),
            dataIndex: "description",
            key: "description",
            onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
          },
          {
            title: __(locale, "lang.roles"),
            dataIndex: "roles",
            key: "roles",
            onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
            render: (roles) =>
              roles && (
                <Flex align="center" gap={8}>
                  {`${roles.length}/${totalRoles} ${__(locale, "lang.roles")}`}{" "}
                  <Tooltip
                    title={
                      <>
                        {roles.map((item: RoleType) => (
                          <p key={item.id} style={{ margin: 0 }}>
                            - {item.name}
                          </p>
                        ))}
                      </>
                    }
                  >
                    <LuInfo size={16} />
                  </Tooltip>
                </Flex>
              ),
          },
          {
            title: __(locale, "lang.created_at"),
            dataIndex: "created_at",
            key: "created_at",
            onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
            render: (created_at) =>
              created_at && dayjs(created_at).locale(locale).format("dddd, DD MMM YYYY | HH:mm:ss"),
          },
          {
            title: __(locale, "lang.updated_at"),
            dataIndex: "updated_at",
            key: "updated_at",
            onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
            render: (updated_at) =>
              updated_at && dayjs(updated_at).locale(locale).format("dddd, DD MMM YYYY | HH:mm:ss"),
          },
        ]}
        scroll={{ x: "max-content" }}
        showHeader={false}
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
    </DashboardLayout>
  );
}
