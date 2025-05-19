import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Button, Dropdown, Menu, MenuProps } from "antd";
import { useResponsive } from "antd-style";

type DashboardInnerSidebarType = {
  innerSidebarMenu?: MenuItemList[];
  innerSidebarActiveMenu?: string;
};

type MenuItemList = Required<MenuProps>["items"][number];

export default function DashboardInnerSidebar({
  innerSidebarMenu,
  innerSidebarActiveMenu = "",
}: DashboardInnerSidebarType) {
  const { mobile } = useResponsive();
  const { locale } = usePage<SharedData>().props;

  return (
    <>
      {mobile && innerSidebarMenu && (
        <div
          style={{
            minHeight: 0,
            height: 38,
            position: "sticky",
            top: 80,
            zIndex: 20,
            display: "flex",
            overflow: "auto",
            paddingInline: 16,
            marginBottom: 16,
          }}
        >
          <Dropdown
            menu={{
              selectable: true,
              selectedKeys: [innerSidebarActiveMenu],
              items: innerSidebarMenu,
            }}
          >
            <Button block type="primary">
              {__(locale, "lang.menu")}
            </Button>
          </Dropdown>
        </div>
      )}

      {!mobile && innerSidebarMenu && (
        <div
          style={{
            minHeight: 0,
            position: "sticky",
            top: 83,
            display: "flex",
            overflow: "auto",
          }}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={[innerSidebarActiveMenu]}
            items={innerSidebarMenu}
            style={{
              width: 250,
              border: "none",
            }}
          />
        </div>
      )}
    </>
  );
}
