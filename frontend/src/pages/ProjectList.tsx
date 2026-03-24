import { useEffect, useState } from "react";
import { Table, Button, Card, Space, Tag, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { projectApi } from "../services/api";

const { Option } = Select;

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectApi.list();
      setProjects(data);
    } catch (error) {
      message.error("加载项目失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      await projectApi.create(values);
      message.success("项目创建成功");
      setModalVisible(false);
      form.resetFields();
      loadProjects();
    } catch (error) {
      message.error("创建失败");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "blue",
      active: "green",
      on_hold: "orange",
      completed: "gray",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/projects/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === "planning" ? "规划中" :
           status === "active" ? "进行中" :
           status === "on_hold" ? "暂停" : "已完成"}
        </Tag>
      ),
    },
    {
      title: "ASPICE 级别",
      dataIndex: "aspiceLevel",
      key: "aspiceLevel",
      render: (level: number) => level ? `Level ${level}` : "-",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Card
      title="ASPICE 项目列表"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新建项目
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="新建项目"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item name="description" label="项目描述">
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="planning">
            <Select>
              <Option value="planning">规划中</Option>
              <Option value="active">进行中</Option>
              <Option value="on_hold">暂停</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item name="aspiceLevel" label="ASPICE 级别">
            <Select placeholder="选择 ASPICE 级别">
              <Option value={1}>Level 1</Option>
              <Option value={2}>Level 2</Option>
              <Option value={3}>Level 3</Option>
            </Select>
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
            <Button onClick={() => setModalVisible(false)}>
              取消
            </Button>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
}
