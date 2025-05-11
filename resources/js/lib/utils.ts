import { MenuItem } from "@/types";
import { router } from "@inertiajs/react";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/lib/message/interface";

import en from "../../../lang/en.json";
import id from "../../../lang/id.json";
import ja from "../../../lang/ja.json";

// Find parent path for sidebar
export function findParentPath(data: MenuItem[], targetKey: string, parentPath: string[] = []): string[] {
  for (const item of data) {
    const currentPath = [...parentPath, item.key];
    if (item.key === targetKey) {
      return parentPath;
    }
    if (item.children) {
      const result: string[] = findParentPath(item.children, targetKey, currentPath);
      if (result.length) {
        return result;
      }
    }
  }
  return [];
}

// i18n or translation
function replacePlaceholders(text: string, data: Record<string, string>) {
  return text.replace(/:\w+/g, function (matched) {
    const key = matched.slice(1);
    return key in data ? data[key] : matched;
  });
}

type TranslationKeys = keyof typeof en;
export function __(locale: string, key: TranslationKeys, data: Record<string, string> = {}): string {
  const language = locale === "id" ? id : locale === "ja" ? ja : en;

  const translation = typeof language[key] === "string" ? language[key] : key;
  return replacePlaceholders(translation, data);
}

// Handle form error message
export const handleFormErrorMessages = (
  errors: Record<string, string>,
  message: MessageInstance,
  form?: FormInstance
) => {
  if (errors.error_server) {
    message.error(errors.error_server);
    return;
  }

  const errorsArray = Object.keys(errors).map((field) => ({
    name: field,
    errors: [errors[field]],
  }));

  if (!form) return;

  form.setFields(errorsArray);

  if (errorsArray.length > 0) {
    form.scrollToField(errorsArray[0].name, { behavior: "smooth", block: "center" });
  }
};

// Handle sorting and searching
function searchAndSorting(datas, route: string, params) {
  const { column, search, sort, size } = datas;
  const updatedParams = {
    ...(column && { column }),
    ...(search && { search }),
    ...(sort && { sort }),
    page: 1,
    ...(size && { size }),
    ...params,
  };

  if (!updatedParams.column) delete updatedParams.column;
  if (!updatedParams.sort) delete updatedParams.sort;
  if (!updatedParams.search) delete updatedParams.search;
  if (updatedParams.page === 1) delete updatedParams.page;
  if (updatedParams.size === 10) delete updatedParams.size;
  // updatedParams.status = ["active", "suspend"].join(",");

  router.get(route, updatedParams, {
    preserveState: true,
  });
}

export function handleSearch(datas, route, value) {
  searchAndSorting(datas, route, { search: value, page: 1 });
}

export function handleTableChange(datas, route, size, sorter) {
  const order = sorter.order ? (sorter.order === "ascend" ? "asc" : "desc") : null;
  const column = order && sorter.field;

  searchAndSorting(datas, route, {
    column: column,
    sort: order,
    page: size.current,
    size: size.pageSize,
  });
}

// Default sort order
export function getDefaultSortOrder(data, column: string) {
  return data.column === column ? (data.sort === "asc" ? "ascend" : "descend") : null;
}
