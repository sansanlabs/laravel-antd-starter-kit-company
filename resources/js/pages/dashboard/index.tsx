import AuthDashboardWrapper from "@/layouts/auth-dashboard-wrapper";
import DashboardLayout from "@/layouts/dashboard-layout";
import { can } from "@/lib/permissions";
import { __ } from "@/lib/utils";
import { ActivityLogType, SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Dropdown,
  Flex,
  Modal,
  Row,
  Statistic,
  Table,
  TableProps,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { LuBadgeCheck, LuChevronDown, LuKey, LuListMinus, LuUsersRound } from "react-icons/lu";
import { UAParser } from "ua-parser-js";

type IndexType = {
  userTotal: number;
  roleTotal: number;
  permissionTotal: number;
  activityLogs: ActivityLogType[];
};

Index.layout = (page: React.ReactNode) => <AuthDashboardWrapper>{page}</AuthDashboardWrapper>;

export default function Index({ userTotal, roleTotal, permissionTotal, activityLogs }: IndexType) {
  const { locale, permissions } = usePage<SharedData>().props;
  const {
    token: { colorFillAlter },
  } = theme.useToken();

  const [isShowModalDetail, setIsShowModalDetail] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ActivityLogType | null>(null);
  const agent = UAParser(selectedData?.agent);

  const columns = [
    {
      title: __(locale, "lang.log_name"),
      dataIndex: "log_name",
      key: "log_name",
    },
    {
      title: __(locale, "lang.event"),
      dataIndex: "event",
      key: "event",
    },
    {
      title: __(locale, "lang.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: __(locale, "lang.causer"),
      dataIndex: "causer",
      key: "causer",
      render: (causer: { name: string }) => causer?.name ?? "-",
    },
    {
      title: __(locale, "lang.method"),
      dataIndex: "method",
      key: "method",
    },
    {
      title: __(locale, "lang.ip"),
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: __(locale, "lang.agent"),
      dataIndex: "agent",
      key: "agent",
      render: (agent: string) => {
        const { browser, os } = UAParser(agent);
        return (
          <Typography.Text style={{ margin: 0 }}>
            {os.name} - {browser.name}
          </Typography.Text>
        );
      },
    },
    {
      title: __(locale, "lang.occurs_in"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => dayjs(created_at).locale(locale).format("dddd, DD MMM YYYY | HH:mm:ss"),
    },
    {
      title: __(locale, "lang.action"),
      dataIndex: "id",
      key: "id",
      fixed: "right",
      align: "center",
      width: 1,
      render: (_: string, record: ActivityLogType) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "detail",
                label: __(locale, "lang.detail"),
                icon: <LuListMinus size={14} />,
                onClick: () => {
                  setSelectedData(record);
                  setIsShowModalDetail(true);
                },
              },
            ],
          }}
        >
          <Button icon={<LuChevronDown size={16} style={{ marginBottom: -2 }} />} />
        </Dropdown>
      ),
    },
  ];

  const items = [
    {
      key: "log_name",
      label: __(locale, "lang.log_name"),
      children: selectedData?.log_name,
    },
    {
      key: "event",
      label: __(locale, "lang.event"),
      children: selectedData?.event,
    },
    {
      key: "description",
      label: __(locale, "lang.description"),
      children: selectedData?.description,
    },
    {
      key: "method",
      label: __(locale, "lang.method"),
      children: selectedData?.method,
    },
    {
      key: "ip_address",
      label: __(locale, "lang.ip_address"),
      children: selectedData?.ip,
    },
    {
      key: "url",
      label: __(locale, "lang.url"),
      children: (
        <Typography.Paragraph copyable style={{ margin: 0 }}>
          {selectedData?.url}
        </Typography.Paragraph>
      ),
    },
    {
      key: "agent",
      label: __(locale, "lang.agent"),
      children: (
        <Typography.Text style={{ margin: 0 }}>
          {agent.os.name} - {agent.browser.name}
        </Typography.Text>
      ),
    },
    {
      key: "subject",
      label: __(locale, "lang.subject"),
      children: selectedData?.subject ? (
        <Typography.Paragraph>
          <pre>{JSON.stringify(selectedData?.subject, null, 2)}</pre>
        </Typography.Paragraph>
      ) : (
        "-"
      ),
    },
    {
      key: "subject_type",
      label: __(locale, "lang.subject_type"),
      children: selectedData?.subject_type ?? "-",
    },
    {
      key: "causer",
      label: __(locale, "lang.causer"),
      children: selectedData?.causer?.name,
    },
    {
      key: "causer_type",
      label: __(locale, "lang.causer_type"),
      children: selectedData?.causer_type,
    },
    {
      key: "properties",
      label: __(locale, "lang.properties"),
      children: selectedData?.properties && !Array.isArray(selectedData?.properties) && (
        <div>
          <span>{__(locale, "lang.old")} :</span>
          <Typography.Paragraph>
            <pre>{JSON.stringify(selectedData.properties.old, null, 2)}</pre>
          </Typography.Paragraph>
          <span>{__(locale, "lang.new")} :</span>
          <Typography.Paragraph>
            <pre>{JSON.stringify(selectedData.properties.attributes, null, 2)}</pre>
          </Typography.Paragraph>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title={__(locale, "lang.dashboard")}
      activeMenu="dashboard"
      breadcrumb={[
        {
          title: __(locale, "lang.dashboard"),
        },
      ]}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: colorFillAlter,
          },
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title={__(locale, "lang.users")}
                prefix={
                  <LuUsersRound
                    style={{
                      marginBottom: -3,
                      marginRight: 4,
                    }}
                  />
                }
                value={userTotal}
                valueStyle={{ fontWeight: 500 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title={__(locale, "lang.roles")}
                prefix={
                  <LuBadgeCheck
                    style={{
                      marginBottom: -3,
                      marginRight: 4,
                    }}
                  />
                }
                value={roleTotal}
                valueStyle={{ fontWeight: 500 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title={__(locale, "lang.permissions")}
                prefix={
                  <LuKey
                    style={{
                      marginBottom: -3,
                      marginRight: 4,
                    }}
                  />
                }
                value={permissionTotal}
                valueStyle={{ fontWeight: 500 }}
              />
            </Card>
          </Col>
        </Row>
      </ConfigProvider>

      {can(permissions, "UserActivityLogs.Index") && (
        <>
          <Flex justify="space-between" align="center" style={{ marginTop: 16 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {__(locale, "lang.latest_activity")}
            </Typography.Title>
            <Link href={route("user-activity-logs.index")}>
              <Button type="primary">{__(locale, "lang.show_all")}</Button>
            </Link>
          </Flex>
          <Table
            rowKey="id"
            size="small"
            scroll={{ x: "max-content" }}
            dataSource={activityLogs}
            columns={columns as TableProps["columns"]}
            pagination={false}
          />
        </>
      )}

      <Modal
        title={__(locale, "lang.detail")}
        style={{ maxWidth: "56rem" }}
        width="100%"
        open={isShowModalDetail}
        maskClosable={false}
        onOk={() => setIsShowModalDetail(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={() => setIsShowModalDetail(false)}
      >
        <Descriptions
          bordered
          items={items}
          size="small"
          column={1}
          styles={{ label: { width: "70px" }, content: { width: "80%" } }}
        />
      </Modal>
    </DashboardLayout>
  );
}
