import { can } from "@/lib/permissions";
import { __ } from "@/lib/utils";
import { SharedData, UserType } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { LuHistory, LuListMinus, LuMonitorSmartphone } from "react-icons/lu";

export default function InnerSidebarMenuUser(user: UserType) {
  const {
    auth: { user: authUser },
    locale,
    permissions,
  } = usePage<SharedData>().props;

  return [
    authUser.id === user.id
      ? {
          key: "detail",
          label: <Link href={route("users.show", { user: user.id })}>{__(locale, "lang.detail")}</Link>,
          icon: <LuListMinus size={16} />,
        }
      : can(permissions, "Users.Detail") && {
          key: "detail",
          label: <Link href={route("users.show", { user: user.id })}>{__(locale, "lang.detail")}</Link>,
          icon: <LuListMinus size={16} />,
        },
    can(permissions, "Users.ActivityLogs.Index") && {
      key: "activity-logs",
      label: (
        <Link href={route("users.activity-logs.index", { user: user.id })}>{__(locale, "lang.activity_logs")}</Link>
      ),
      icon: <LuHistory size={16} />,
    },
    can(permissions, "Users.DeviceSessions.Index") && {
      key: "device-sessions",
      label: (
        <Link href={route("users.device-sessions.index", { user: user.id })}>{__(locale, "lang.device_sessions")}</Link>
      ),
      icon: <LuMonitorSmartphone size={16} />,
    },
  ].filter((item): item is Exclude<typeof item, false | null | undefined> => Boolean(item));
}
