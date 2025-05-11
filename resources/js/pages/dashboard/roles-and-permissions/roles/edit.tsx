import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { RoleType, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Flex } from "antd";

import FormRole from "./partials/form-role";

type EditType = {
  role: RoleType;
  allPermissions: {
    name: "string";
    options: {
      id: string;
      name: string;
      description: string;
    }[];
  }[];
  selectedCollapseIds: string[];
};

Edit.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Edit({ role, allPermissions, selectedCollapseIds }: EditType) {
  const { locale } = usePage<SharedData>().props;

  return (
    <DashboardLayout
      title={`${__(locale, "lang.edit")} | ${role.name}`}
      breadcrumb={[
        {
          title: __(locale, "lang.roles"),
          url: route("roles.index"),
        },
        {
          title: role.name,
          url: route("roles.show", { role: role.id }),
        },
        {
          title: __(locale, "lang.edit"),
        },
      ]}
      activeMenu="roles"
    >
      <Flex vertical gap={16} style={{ maxWidth: "48rem" }}>
        <FormRole role={role} permissions={allPermissions} selectedCollapseIds={selectedCollapseIds} />
      </Flex>
    </DashboardLayout>
  );
}
