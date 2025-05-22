import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { can } from "@/lib/permissions";
import { __ } from "@/lib/utils";
import MenuUser from "@/pages/dashboard/users/partials/menu-user";
import { RoleType, SharedData, UserType } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Button, Descriptions, Flex, Image, Tag, Typography } from "antd";
import { useResponsive } from "antd-style";
import { LuPencilLine } from "react-icons/lu";

type ShowType = {
  user: UserType;
  roles: RoleType[];
};

Show.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Show({ user }: ShowType) {
  const { locale, permissions } = usePage<SharedData>().props;
  const { mobile } = useResponsive();

  return (
    <DashboardLayout
      title={`${__(locale, "lang.detail")} | ${user.name}`}
      activeMenu="users"
      breadcrumb={[
        {
          title: __(locale, "lang.users"),
          url: can(permissions, "Users.Index") && route("users.index"),
        },
        {
          title: user.name,
          url: route("users.show", { user: user.id }),
        },
        {
          title: __(locale, "lang.detail"),
        },
      ]}
      innerSidebarMenu={MenuUser(user)}
      innerSidebarActiveMenu="detail"
      extra={
        can(permissions, "Users.Edit") && (
          <Link href={route("users.edit", { user: user.id })}>
            <Button type="primary" icon={<LuPencilLine />}>
              {__(locale, "lang.edit")}
            </Button>
          </Link>
        )
      }
    >
      <Flex vertical gap={16} style={{ maxWidth: "48rem" }}>
        <Flex justify="center">
          <div style={{ overflow: "hidden", height: 200 }}>
            <Image src={route("users.photo", { user: user.id })} width={200} style={{ objectFit: "cover" }} />
          </div>
        </Flex>
        <Descriptions
          bordered
          size="small"
          column={1}
          layout={mobile ? "vertical" : "horizontal"}
          styles={{ label: { width: mobile ? "100%" : "33.33%" } }}
          items={[
            {
              label: __(locale, "lang.name"),
              key: "name",
              children: (
                <Typography.Text copyable style={{ margin: 0 }}>
                  {user.name}
                </Typography.Text>
              ),
            },
            {
              label: __(locale, "lang.email"),
              key: "email",
              children: (
                <Typography.Text copyable style={{ margin: 0 }}>
                  {user.email}
                </Typography.Text>
              ),
            },
            {
              label: __(locale, "lang.roles"),
              key: "roles",
              children: user.roles.length > 0 ? user.roles.map((role) => <Tag key={role.name}>{role.name}</Tag>) : "-",
            },
          ]
            .filter(Boolean)
            .map((item) => ({
              ...item,
              label: mobile ? `${item.label} :` : item.label,
            }))}
        />
      </Flex>
    </DashboardLayout>
  );
}
