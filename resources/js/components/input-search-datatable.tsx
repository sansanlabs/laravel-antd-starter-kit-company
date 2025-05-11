import { __, handleSearch } from "@/lib/utils";
import { QueryResultType, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { Input } from "antd";
import { LuSearch } from "react-icons/lu";

type InputSearchDatatableType = {
  queryResult: QueryResultType;
  route: string;
};

export default function InputSearchDatatable({ queryResult, route }: InputSearchDatatableType) {
  const { locale } = usePage<SharedData>().props;

  return (
    <div>
      <Input
        allowClear
        prefix={<LuSearch />}
        placeholder={__(locale, "lang.search_here")}
        defaultValue={queryResult.search ?? ""}
        onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
          const keyword = e.currentTarget.value.trim();
          const search = (queryResult.search || "").trim();

          if (search !== keyword) handleSearch(queryResult, route, keyword);
        }}
        onClear={() => handleSearch(queryResult, route, "")}
      />
    </div>
  );
}
