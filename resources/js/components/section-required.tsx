import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Alert, Flex, Typography } from "antd";

export default function SectionRequired() {
  const { locale } = usePage<SharedData>().props;

  return (
    <Alert
      showIcon
      type="warning"
      style={{ marginBottom: 16 }}
      message={
        <Flex align="center" style={{ fontStyle: "italic" }}>
          <Typography.Text type="danger">*</Typography.Text>
          {") "}
          {__(locale, "lang.is_required")}
        </Flex>
      }
    />
  );
}
