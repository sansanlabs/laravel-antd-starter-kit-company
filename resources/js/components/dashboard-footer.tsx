import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { ConfigProvider, Layout, Typography } from "antd";
import { useTheme } from "antd-style";
import { useEffect, useState } from "react";

export default function DashboardFooter() {
  const { companyName, appName, locale } = usePage<SharedData>().props;
  const { colorBorder } = useTheme();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: { lineHeight: 1.3 },
      }}
    >
      <Layout.Footer
        style={{
          height: 67,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${colorBorder}`,
        }}
      >
        <Typography.Paragraph
          type="secondary"
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          &copy; {__(locale, "lang.copyright")} {year} {appName}.
          <br />
          {companyName}. {__(locale, "lang.all_rights_reserved")}.
          <br />
        </Typography.Paragraph>
      </Layout.Footer>
    </ConfigProvider>
  );
}
