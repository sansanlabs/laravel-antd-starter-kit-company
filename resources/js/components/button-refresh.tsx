import { __ } from "@/lib/utils";
import { SharedData } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { App, Button } from "antd";
import { useState } from "react";
import { LuRotateCw } from "react-icons/lu";

export default function ButtonRefresh() {
  const { locale } = usePage<SharedData>().props;
  const { message } = App.useApp();
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  return (
    <Button
      icon={isRefreshLoading ? <LuRotateCw className="animate-spin" /> : <LuRotateCw />}
      onClick={() =>
        router.reload({
          onStart: () => {
            setIsRefreshLoading(true);
            message.destroy();
            message.loading(__(locale, "message.refreshing"), 0);
          },
          onSuccess: () => {
            setIsRefreshLoading(false);
            message.destroy();
            message.success(__(locale, "message.success"));
          },
          onError: () => {
            setIsRefreshLoading(false);
            message.destroy();
            message.error(__(locale, "message.error_server"));
          },
        })
      }
    />
  );
}
