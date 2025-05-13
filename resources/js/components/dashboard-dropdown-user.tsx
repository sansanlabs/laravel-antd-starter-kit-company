import useLocale from "@/hooks/use-locale";
import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { App, Avatar, Button, Divider, Dropdown, Flex, Typography } from "antd";
import { ThemeMode, useThemeMode } from "antd-style";
import {
  LuChevronsUpDown,
  LuLanguages,
  LuLogOut,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuSun,
  LuUserRound,
} from "react-icons/lu";

export default function DashbordDropdownUser() {
  const {
    auth: { user: authUser },
    locale,
  } = usePage<SharedData>().props;
  const { modal, message } = App.useApp();
  const { themeMode, setThemeMode } = useThemeMode();
  const { setLocale } = useLocale();

  const onLogout = () => {
    const modalConfirm = modal.confirm({
      title: __(locale, "modal_confirm.title"),
      content: __(locale, "modal_confirm.desc"),
      okText: __(locale, "auth.logout"),
      okButtonProps: { danger: true },
      cancelButtonProps: { disabled: false },
      onOk: () => {
        modalConfirm.update({
          cancelButtonProps: { disabled: true },
        });

        return new Promise((resolve) => {
          router.post(
            route("logout"),
            {},
            {
              onSuccess: () => {
                message.success(__(locale, "message.success"));
              },
              onError: () => {
                message.error(__(locale, "message.error_server"));
              },
              onFinish: resolve,
            }
          );
        });
      },
    });
  };

  const onChangeLanguage = (key: string) => {
    router.put(
      route("localization.update", { locale: key }),
      {},
      {
        onStart: () => {
          message.destroy();
          message.loading(__(locale, "message.processing"), 0);
        },
        onSuccess: ({ props }) => {
          const { locale } = props as unknown as SharedData;
          localStorage.setItem("locale", locale);
          setLocale(locale);
          message.destroy();
          message.success(__(locale, "message.success"));
        },
        onError: () => {
          message.destroy();
          message.error(__(locale, "message.error_server"));
        },
      }
    );
  };

  const Detail = () => {
    return (
      <Flex flex={1} gap="small" align="center" style={{ minWidth: 0 }}>
        <Avatar shape="square" size="large" src={route("users.auth-avatar")} />
        <Flex vertical flex={1} style={{ minWidth: 0 }}>
          <Typography.Text strong style={{ textAlign: "start" }}>
            {authUser.name}
          </Typography.Text>
          <Typography.Text
            style={{
              textAlign: "start",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 12,
            }}
          >
            {authUser.email}
          </Typography.Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <div style={{ margin: 0, height: 66 }}>
      <Dropdown
        trigger={["click"]}
        menu={{
          selectable: true,
          multiple: true,
          selectedKeys: [locale, themeMode],
          items: [
            {
              key: "detail",
              label: (
                <div style={{ padding: "5px 4px", cursor: "default" }}>
                  <Flex vertical>
                    <Detail />

                    <Divider style={{ marginBlock: 14 }} />

                    <a href={route("microsoft.redirect")}>
                      <Button type="dashed" block>
                        {__(locale, "lang.login_with_a_different_account")}
                      </Button>
                    </a>
                  </Flex>
                </div>
              ),
            },
            { type: "divider" },
            {
              key: "profile",
              label: <Link href={route("users.show", { user: authUser.id })}>{__(locale, "lang.profile")}</Link>,
              icon: <LuUserRound size={14} />,
            },
            {
              key: "language",
              label: __(locale, "lang.language"),
              icon: <LuLanguages size={14} style={{ marginTop: 4 }} />,
              children: [
                {
                  key: "en",
                  label: "English",
                  icon: <span style={{ fontFamily: "monospace" }}>EN</span>,
                },
                {
                  key: "id",
                  label: "Bahasa Indonesia",
                  icon: <span style={{ fontFamily: "monospace" }}>ID</span>,
                },
                {
                  key: "ja",
                  label: "日本語",
                  icon: <span style={{ fontFamily: "monospace" }}>JA</span>,
                },
              ],
              onClick: ({ key }) => onChangeLanguage(key),
            },
            {
              key: "theme",
              label: __(locale, "lang.theme"),
              icon: <LuPalette size={14} style={{ marginTop: 4 }} />,
              children: [
                {
                  key: "auto",
                  label: __(locale, "lang.system"),
                  icon: <LuMonitor size={14} />,
                },
                {
                  key: "light",
                  label: __(locale, "lang.light"),
                  icon: <LuSun size={14} />,
                },
                {
                  key: "dark",
                  label: __(locale, "lang.dark"),
                  icon: <LuMoon size={14} />,
                },
              ],
              onClick: ({ key }) => setThemeMode(key as ThemeMode),
            },
            { type: "divider" },
            {
              key: "logout",
              label: __(locale, "auth.logout"),
              icon: <LuLogOut size={14} />,
              danger: true,
              onClick: onLogout,
            },
          ],
        }}
      >
        <Button type="text" style={{ height: "100%", width: "100%", paddingInline: 12 }}>
          <Flex align="center" justify="space-between" style={{ width: "100%" }} gap="small">
            <Detail />
            <LuChevronsUpDown size={16} />
          </Flex>
        </Button>
      </Dropdown>
    </div>
  );
}
