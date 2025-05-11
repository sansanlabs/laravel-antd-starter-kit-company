import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { __ } from "@/lib/utils";
import { RoleType, SharedData, UserType } from "@/types";
import { usePage } from "@inertiajs/react";
import { Flex } from "antd";

import FormUser from "./partials/form-user";

type EditType = {
  user: UserType;
  roles: RoleType[];
};

Edit.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Edit({ user, roles }: EditType) {
  const { locale } = usePage<SharedData>().props;

  return (
    <DashboardLayout
      title={`${__(locale, "lang.edit")} | ${user.name}`}
      activeMenu="users"
      breadcrumb={[
        {
          title: __(locale, "lang.users"),
          url: route("users.index"),
        },
        {
          title: user.name,
          url: route("users.show", { user: user.id }),
        },
        {
          title: __(locale, "lang.edit"),
        },
      ]}
    >
      <Flex vertical gap={16} style={{ maxWidth: "48rem" }}>
        <FormUser user={user} roles={roles} />
      </Flex>
    </DashboardLayout>
  );
}
