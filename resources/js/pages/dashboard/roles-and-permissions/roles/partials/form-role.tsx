import SectionRequired from "@/components/section-required";
import { __, handleFormErrorMessages } from "@/lib/utils";
import { RoleType, SharedData } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { App, Button, Flex, Form, Input, Table } from "antd";
import { useState } from "react";
import { LuSave, LuSearch } from "react-icons/lu";

type FormRoleType = {
  role?: RoleType;
  permissions: {
    name: string;
    options: {
      id: string;
      name: string;
      description: string;
    }[];
  }[];
  selectedCollapseIds?: string[];
};

export default function FormRole({ role, permissions, selectedCollapseIds }: FormRoleType) {
  const { locale } = usePage<SharedData>().props;
  const { modal, message } = App.useApp();

  const [permissionsDataSource, setPermissionsDataSource] = useState<FormRoleType["permissions"]>(permissions);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formRole] = Form.useForm();

  const onSave = (values: { name: string; description: string; permissions: string[] }) => {
    values.permissions = selectedPermissions;

    const modalConfirm = modal.confirm({
      title: __(locale, "modal_confirm.title"),
      content: __(locale, "modal_confirm.desc"),
      cancelButtonProps: { disabled: false },
      onOk: () => {
        modalConfirm.update({
          cancelButtonProps: { disabled: true },
        });

        return new Promise((resolve) => {
          const options = {
            onSuccess: () => {
              message.destroy();
              message.success(__(locale, "message.success"));
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (errors: any) => {
              handleFormErrorMessages(errors, message, formRole);
            },
            onFinish: resolve,
          };

          if (!role) {
            return router.post(route("roles.store"), values, options);
          }
          return router.put(route("roles.update", { role: role.id }), values, options);
        });
      },
    });
  };

  return (
    <div>
      <SectionRequired />
      <Form
        layout="vertical"
        form={formRole}
        onFinish={onSave}
        onFinishFailed={({ errorFields }) => {
          formRole.scrollToField(errorFields[0].name, { behavior: "smooth", block: "center" });
        }}
        initialValues={
          role
            ? {
                name: role.name,
                description: role.description,
                permissions: role.permissions,
              }
            : {
                permissions: [],
              }
        }
      >
        <Form.Item
          label={__(locale, "lang.name")}
          name="name"
          rules={[
            { required: true, message: __(locale, "validation.required", { attribute: __(locale, "lang.name") }) },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={__(locale, "lang.description")}
          name="description"
          rules={[
            {
              required: true,
              message: __(locale, "validation.required", { attribute: __(locale, "lang.description") }),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={__(locale, "lang.permissions")} name="permissions">
          <div>
            <Input
              allowClear
              prefix={<LuSearch />}
              placeholder={__(locale, "lang.search_here")}
              onChange={(e) => {
                const keyword = e.currentTarget.value.trim();

                const lowerKeyword = keyword.toLowerCase();

                const permissionFiltered = permissions
                  .map((permission) => {
                    const filteredOptions = permission.options.filter(
                      (option) =>
                        option.name.toLowerCase().includes(lowerKeyword) ||
                        option.description.toLowerCase().includes(lowerKeyword)
                    );

                    if (filteredOptions.length > 0) {
                      return {
                        ...permission,
                        options: filteredOptions,
                      };
                    }

                    return null;
                  })
                  .filter(Boolean);

                setPermissionsDataSource(permissionFiltered as FormRoleType["permissions"]);
              }}
            />

            <Table
              bordered
              size="small"
              rowKey="name"
              columns={[
                {
                  title: __(locale, "lang.name"),
                  dataIndex: "name",
                  key: "name",
                  onCell: ({ children }) => ({ colSpan: children?.length ? 2 : 1 }),
                },
                {
                  title: __(locale, "lang.description"),
                  dataIndex: "description",
                  key: "description",
                  onCell: ({ children }) => ({ colSpan: children?.length ? 0 : 1 }),
                },
              ]}
              scroll={{ x: "max-content" }}
              showHeader={false}
              rowSelection={{
                onSelect: (record, selected, selectedRows) => {
                  const selectedPermission = selectedRows.filter((r) => "id" in r && r.id).map((r) => r.name);
                  setSelectedPermissions(selectedPermission);
                },
                checkStrictly: false,
                defaultSelectedRowKeys: selectedCollapseIds,
              }}
              expandable={{
                expandRowByClick: true,
                defaultExpandAllRows: true,
              }}
              dataSource={permissionsDataSource.map((permission) => ({
                name: permission.name,
                children: permission.options,
              }))}
              pagination={false}
            />
          </div>
        </Form.Item>

        <Flex justify="end">
          <Button htmlType="submit" type="primary" icon={<LuSave />}>
            {__(locale, "lang.save")}
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
