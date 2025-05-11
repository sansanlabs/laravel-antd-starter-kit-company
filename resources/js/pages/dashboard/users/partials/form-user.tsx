import SectionRequired from "@/components/section-required";
import { __, handleFormErrorMessages } from "@/lib/utils";
import { RoleType, SharedData, UserType } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { App, Button, Flex, Form, Input, Select } from "antd";
import { LuSave } from "react-icons/lu";

type FormType = {
  user: UserType;
  roles: RoleType[];
};

export default function FormUser({ user, roles }: FormType) {
  const { locale } = usePage<SharedData>().props;
  const { modal, message } = App.useApp();

  const [formUser] = Form.useForm();

  const onSave = (values: { roles: string[] }) => {
    const modalConfirm = modal.confirm({
      title: __(locale, "modal_confirm.title"),
      content: __(locale, "modal_confirm.desc"),
      cancelButtonProps: { disabled: false },
      onOk: () => {
        return new Promise((resolve) => {
          router.put(route("users.update", { user: user.id }), values, {
            onStart: () => {
              modalConfirm.update({ cancelButtonProps: { disabled: true } });
            },
            onSuccess: () => {
              message.destroy();
              message.success(__(locale, "message.success"));
            },
            onError: (errors) => {
              handleFormErrorMessages(errors, message, formUser);
            },
            onFinish: resolve,
          });
        });
      },
    });
  };

  return (
    <div>
      <SectionRequired />

      <Form
        layout="vertical"
        form={formUser}
        onFinish={onSave}
        initialValues={
          user && {
            name: user.name,
            email: user.email,
            roles: user.roles.map((role) => role.name),
          }
        }
      >
        <Form.Item label={__(locale, "lang.name")} name="name" rules={[{ required: true }]}>
          <Input readOnly />
        </Form.Item>

        <Form.Item label={__(locale, "lang.email")} name="email" rules={[{ required: true }]}>
          <Input readOnly />
        </Form.Item>

        <Form.Item label={__(locale, "lang.roles")} name="roles">
          <Select allowClear mode="multiple" options={roles.map((role) => ({ label: role.name, value: role.name }))} />
        </Form.Item>

        <Flex justify="end">
          <Button type="primary" htmlType="submit" icon={<LuSave />}>
            {__(locale, "lang.save")}
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
