import AuthFooter from "@/components/auth-footer";
import AuthHeader from "@/components/auth-header";
import useLocale from "@/hooks/use-locale";
import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Layout as AntdLayout, App, Button, Col, Dropdown, Flex, Row, Typography } from "antd";
import { LuChevronDown } from "react-icons/lu";

import AuthBg from "../../../public/assets/images/auth-bg.jpg";

type AuthLayoutType = {
  children: React.ReactNode;
  title: string;
  titlePage: string;
  descriptionPage: string;
};

export default function AuthLayout({ children, title, titlePage, descriptionPage }: AuthLayoutType) {
  const { locale } = usePage<SharedData>().props;
  const { setLocale } = useLocale();
  const { message } = App.useApp();

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

  return (
    <>
      <Head title={title} />
      <AntdLayout
        style={{
          minHeight: "100dvh",
        }}
      >
        <Col style={{ position: "absolute", top: 14, right: 14 }}>
          <Dropdown
            trigger={["click"]}
            menu={{
              selectable: true,
              selectedKeys: [locale],
              items: [
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
                  icon: <span style={{ fontFamily: "monospace" }}>JP</span>,
                },
              ],
              onClick: ({ key }) => onChangeLanguage(key),
            }}
          >
            <Button icon={<LuChevronDown />} iconPosition="end">
              {locale === "id" ? "Bahasa Indonesia" : locale === "ja" ? "日本語" : "English"}
              <span style={{ fontFamily: "monospace", textTransform: "uppercase" }}>{locale}</span>
            </Button>
          </Dropdown>
        </Col>

        <Row>
          <Col
            xs={0}
            md={12}
            style={{
              height: "100dvh",
              background: `url('${AuthBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "sticky",
              top: 0,
              padding: 16,
            }}
          />

          <Col
            xs={24}
            md={12}
            style={{
              width: "100%",
              minHeight: "100dvh",
              maxWidth: "23rem",
              marginInline: "auto",
              gap: 16,
              paddingInline: 16,
            }}
          >
            <Flex vertical flex={1} justify="center" style={{ width: "100%", height: "100%" }}>
              <AuthHeader />

              <Typography.Title level={4} style={{ margin: 0 }}>
                {titlePage}
              </Typography.Title>
              <Typography.Paragraph>{descriptionPage}</Typography.Paragraph>

              {children}

              <AuthFooter />
            </Flex>
          </Col>
        </Row>
      </AntdLayout>
    </>
  );
}
