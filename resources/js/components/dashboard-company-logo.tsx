import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { Button, Flex, Typography } from "antd";

import LogoOS from "../../../public/assets/images/logo-os.png";

export default function DashboardCompanyLogo() {
  const { companyName, appName } = usePage<SharedData>().props;

  return (
    <div style={{ margin: 0, height: 66 }}>
      <Link href="/">
        <Button type="text" style={{ height: "100%", width: "100%", paddingInline: 13 }}>
          <Flex flex={1} gap="small" align="center" style={{ minWidth: 0 }}>
            <img src={LogoOS} alt="" style={{ height: 40 }} />
            <Flex vertical flex={1}>
              <Typography.Text strong style={{ textAlign: "start" }}>
                {companyName}
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
                {appName}
              </Typography.Text>
            </Flex>
          </Flex>
        </Button>
      </Link>
    </div>
  );
}
