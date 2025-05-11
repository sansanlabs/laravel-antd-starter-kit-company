import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Button, Flex, Layout, Result } from "antd";

type ErrorType = {
  status: number;
};

Error.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Error({ status }: ErrorType) {
  const {
    auth: { user: authUser },
    locale,
  } = usePage<SharedData>().props;

  const title = {
    500: __(locale, "error_500_title"),
    503: __(locale, "error_503_title"),
    403: __(locale, "error_403_title"),
    404: __(locale, "error_404_title"),
  }[status];

  const description = {
    500: __(locale, "error_500_desc"),
    503: __(locale, "error_503_desc"),
    403: __(locale, "error_403_desc"),
    404: __(locale, "error_404_desc"),
  }[status];

  const ErrorContent = () => (
    <Flex flex={1} justify="center" align="center">
      <Result
        status={status === 403 ? 403 : status === 404 ? 404 : 500}
        title={title}
        subTitle={description}
        extra={
          <Flex vertical gap={8}>
            <a href={authUser ? route("dashboard.index") : "/"}>
              <Button type="primary">{__(locale, "lang.back_to_home")}</Button>
            </a>

            {status === 403 && !authUser && (
              <a href={route("microsoft.redirect")}>
                <Button type="dashed">{__(locale, "lang.login_with_a_different_account")}</Button>
              </a>
            )}
          </Flex>
        }
      />
    </Flex>
  );

  if (status === 403 && authUser) {
    return (
      <DashboardLayout
        title={title ?? ""}
        breadcrumb={[
          {
            title: title ?? "",
          },
        ]}
        activeMenu=""
      >
        <ErrorContent />
      </DashboardLayout>
    );
  }

  return (
    <Layout style={{ minHeight: "100dvh" }}>
      <Head title={title} />
      <ErrorContent />
    </Layout>
  );
}
