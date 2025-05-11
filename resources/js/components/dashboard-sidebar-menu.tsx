import { can, canAny } from "@/lib/permissions";
import { __, findParentPath } from "@/lib/utils";
import { MenuItem, SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ConfigProvider, Flex, Menu, MenuProps } from "antd";
import {
  LuBadgeCheck,
  LuChartPie,
  LuHistory,
  LuKey,
  LuMinus,
  LuMonitorCheck,
  LuPlus,
  LuUsersRound,
} from "react-icons/lu";

type DashboardSidebarMenuType = {
  activeMenu: string;
  isSidebarPanelCollapsed: boolean;
};

type MenuItemList = Required<MenuProps>["items"][number];

export default function DashboardSidebarMenu({ activeMenu, isSidebarPanelCollapsed }: DashboardSidebarMenuType) {
  const { locale, permissions } = usePage<SharedData>().props;

  const items: MenuItemList[] = [
    can(permissions, "Dashboard.Index") && {
      key: "dashboard",
      label: <Link href={route("dashboard.index")}>{__(locale, "lang.dashboard")}</Link>,
      icon: <LuChartPie size={16} />,
    },
    can(permissions, "Users.Index") && {
      key: "users",
      label: <Link href={route("users.index")}>{__(locale, "lang.users")}</Link>,
      icon: <LuUsersRound size={16} />,
    },
    can(permissions, "UserActivityLogs.Index") && {
      key: "user-activity-logs",
      label: <Link href={route("user-activity-logs.index")}>{__(locale, "lang.user_activity_logs")}</Link>,
      icon: <LuHistory size={16} />,
    },
    canAny(permissions, ["Roles.Index", "Permissions.Index"]) && {
      key: "roles-and-permissions",
      label: __(locale, "lang.roles_and_permissions"),
      icon: <LuMonitorCheck size={16} />,
      children: [
        can(permissions, "Roles.Index") && {
          key: "roles",
          label: <Link href={route("roles.index")}>{__(locale, "lang.roles")}</Link>,
          icon: <LuBadgeCheck size={16} />,
        },
        can(permissions, "Permissions.Index") && {
          key: "permissions",
          label: <Link href={route("permissions.index")}>{__(locale, "lang.permissions")}</Link>,
          icon: <LuKey size={16} />,
        },
      ],
    },
    can(permissions, "LaravelTelescope.Index") && {
      type: "divider",
    },
    can(permissions, "LaravelTelescope.Index") && {
      key: "laravel-telescope",
      label: (
        <a href="/dashboard/laravel-telescope" target="_blank">
          {__(locale, "lang.laravel_telescope")}
        </a>
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" style={{ width: 14 }} fill="currentColor">
          <path d="M0 40a39.87 39.87 0 0 1 11.72-28.28A40 40 0 1 1 0 40zm34 10a4 4 0 0 1-4-4v-2a2 2 0 1 0-4 0v2a4 4 0 0 1-4 4h-2a2 2 0 1 0 0 4h2a4 4 0 0 1 4 4v2a2 2 0 1 0 4 0v-2a4 4 0 0 1 4-4h2a2 2 0 1 0 0-4h-2zm24-24a6 6 0 0 1-6-6v-3a3 3 0 0 0-6 0v3a6 6 0 0 1-6 6h-3a3 3 0 0 0 0 6h3a6 6 0 0 1 6 6v3a3 3 0 0 0 6 0v-3a6 6 0 0 1 6-6h3a3 3 0 0 0 0-6h-3zm-4 36a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 28a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
        </svg>
      ),
    },
  ].filter(Boolean) as MenuItemList[];

  return (
    <Flex flex="1 1 0%" style={{ minHeight: 0, overflow: "auto" }}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              zIndexPopup: -1,
            },
          },
        }}
      >
        <Menu
          style={{
            overflow: "auto",
            border: "none",
          }}
          mode="inline"
          items={items}
          theme="dark"
          defaultOpenKeys={isSidebarPanelCollapsed ? [] : findParentPath(items as MenuItem[], activeMenu)}
          defaultSelectedKeys={[activeMenu]}
          expandIcon={({ isOpen }) => (
            <div style={{ position: "absolute", right: 14 }}>
              {isOpen ? <LuMinus size={14} /> : <LuPlus size={14} />}
            </div>
          )}
        />
      </ConfigProvider>
    </Flex>
  );
}
