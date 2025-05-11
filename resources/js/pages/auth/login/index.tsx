import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import AuthLayout from "@/layouts/auth-layout";
import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Button } from "antd";

import LogoOs from "../../../../../public/assets/images/logo-os-selnajaya.png";

Login.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Login() {
  const { locale } = usePage<SharedData>().props;

  return (
    <AuthLayout
      title={__(locale, "auth.login")}
      titlePage={__(locale, "auth.login_title_page")}
      descriptionPage={__(locale, "auth.login_desc_page")}
    >
      <a href={route("microsoft.redirect")} style={{ marginBottom: 16 }}>
        <Button block color="primary" variant="outlined">
          <img src={LogoOs} alt="" style={{ height: 20 }} />
        </Button>
      </a>
    </AuthLayout>
  );
}
