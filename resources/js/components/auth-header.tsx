import { Link } from "@inertiajs/react";
import { Flex, Layout, Typography } from "antd";
import { useTheme } from "antd-style";

import LogoIpsumFull from "../../../public/assets/images/logo-os-selnajaya.png";

const appName = import.meta.env.VITE_APP_NAME;

export default function AuthHeader() {
  const { colorBorder } = useTheme();

  return (
    <Layout.Header
      style={{
        height: "max-content",
        marginBottom: 20,
        paddingBottom: 20,
        width: "100%",
        borderBottom: `1px solid ${colorBorder}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/">
        <Flex vertical>
          <img src={LogoIpsumFull} alt="" style={{ height: 40, width: "auto" }} />
          <Typography.Title
            level={4}
            style={{
              textAlign: "center",
              margin: 0,
            }}
          >
            {appName}
          </Typography.Title>
        </Flex>
      </Link>
    </Layout.Header>
  );
}
