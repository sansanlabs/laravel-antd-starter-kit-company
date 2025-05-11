import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Breadcrumb, BreadcrumbProps, Button, Divider, Flex, Layout } from "antd";
import { useResponsive, useTheme } from "antd-style";
import { LuEllipsis, LuHouse, LuPanelLeft } from "react-icons/lu";

import ButtonRefresh from "./button-refresh";

type DashboardHeaderType = {
  isSidebarDrawerOpen: boolean;
  setIsSidebarDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarPanelCollapsed: boolean;
  setIsSidebarPanelCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  breadcrumb: { title: string; url?: string | false }[];
};

export default function DashboardHeader({
  isSidebarDrawerOpen,
  setIsSidebarDrawerOpen,
  isSidebarPanelCollapsed,
  setIsSidebarPanelCollapsed,
  breadcrumb = [],
}: DashboardHeaderType) {
  const { locale } = usePage<SharedData>().props;
  const { colorBorder } = useTheme();
  const { mobile } = useResponsive();

  const lastBreadcrumb = breadcrumb.at(-1);

  const items = [
    !mobile && {
      key: "home",
      title: (
        <Link href={route("dashboard.index")}>
          <LuHouse style={{ marginTop: 4 }} />
        </Link>
      ),
    },
    ...(mobile
      ? [
          {
            key: "ellipsis",
            title: <LuEllipsis style={{ marginTop: 4 }} />,
            menu: {
              items: [
                {
                  key: "dashboard",
                  title: <Link href={route("dashboard.index")}>{__(locale, "lang.dashboard")}</Link>,
                },
                ...breadcrumb.slice(0, -1).map((item, index) => ({
                  key: `breadcrumb-${index}`,
                  title: item.url ? <Link href={item.url}>{item.title}</Link> : item.title,
                })),
              ],
            },
          },
        ]
      : []),
    ...(!mobile
      ? breadcrumb.slice(0, -1).map((item, index) => ({
          key: `breadcrumb-${index}`,
          title: item.url ? <Link href={item.url}>{item.title}</Link> : item.title,
        }))
      : []),
    lastBreadcrumb && {
      key: "last",
      title: lastBreadcrumb.title ?? "",
    },
  ].filter(Boolean);

  return (
    <Layout.Header
      style={{
        height: 67,
        position: "sticky",
        top: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: `1px solid ${colorBorder}`,
        zIndex: 20,
      }}
    >
      <Flex align="center" gap={8}>
        <Button
          onClick={() => {
            if (mobile) {
              setIsSidebarDrawerOpen(!isSidebarDrawerOpen);
            } else {
              setIsSidebarPanelCollapsed(!isSidebarPanelCollapsed);
              localStorage.setItem("isSidebarPanelCollapsed", (!isSidebarPanelCollapsed).toString());
            }
          }}
          icon={<LuPanelLeft />}
        />

        <ButtonRefresh />
      </Flex>
      <Divider type="vertical" style={{ margin: 0, marginTop: 1, height: 32 }} />

      <Breadcrumb style={{ paddingTop: 3, width: "100%" }} items={items as BreadcrumbProps["items"]} />
    </Layout.Header>
  );
}
