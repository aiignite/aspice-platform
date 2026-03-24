import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Tag, Button, Modal, Form, Input, Select, message } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { projectApi, taskApi } from "../services/api";

const { Option } = Select;

const COLUMNS = [
  { key: "backlog", title: "待办", color: "#999" },
  { key: "todo", title: "计划中", color: "#1890ff" },
  { key: "in_progress", title: "进行中", color: "#fa8c16" },
  { key: "review", title: "评审中", color: "#722ed1" },
  { key: "done", title: "已完成", color: "#52c41a" },
];

const ASPICE_PROCESSES = [
  "SYS.1", "SYS.2", "SYS.3", "SYS.4", "SYS.5",
  "SWE.1", "SWE.2", "SWE.3", "SWE.4", "SWE.5", "SWE.6",
  "SWR.1", "SWR.2", "PIR",
  "ACQ.1", "ACQ.2", "ACQ.3", "ACQ.4",
  "SUP.1", "SUP.2", "SUP.4", "SUP.8", "SUP.9", "SUP.10",
  "MAN.1", "MAN.2", "MAN.3", "MAN.5", "MAN.6",
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [projectData, tasksData] = await Promise.all([
        projectApi.get(id),
        taskApi.listByProject(id),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      message.error("加载失败");
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (values: any) => {
    try {
      await taskApi.create({ ...values, projectId: id });
      message.success("任务创建成功");
      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error) {
      message.error("创建失败");
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status } : t
    );
    setTasks(updatedTasks);

    try {
      await taskApi.update(taskId, { status });
    } catch (error) {
      message.error("更新失败");
      loadData();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.orderIndex - b.orderIndex);

  if (!project) {
    return <Card loading />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/projects")} />
            <span>{project.name}</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建任务
          </Button>
        }
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Tag color="blue">ASPICE Level {project.aspiceLevel || "-"}</Tag>
          </Col>
          <Col span={6}>
            <Tag color={project.status === "active" ? "green" : "orange"}>
              {project.status === "planning" ? "规划中" : project.status === "active" ? "进行中" : "已完成"}
            </Tag>
          </Col>
        </Row>
        {project.description && <p>{project.description}</p>}
      </Card>

      <Row gutter={16} style={{ marginTop: 24 }}>
        {COLUMNS.map((col) => (
          <Col span={4} key={col.key}>
            <Card
              title={<span style={{ color: col.color }}>{col.title}</span>}
              style={{ minHeight: 400, background: "#f5f5f5" }}
              headStyle={{ borderTop: `3px solid ${col.color}` }}
              onDrop={(e) => handleDrop(e, col.key)}
              onDragOver={handleDragOver}
            >
              {getTasksByStatus(col.key).map((task) => (
                <Card
                  key={task.id}
                  size="small"
                  draggable
                  onDragStart={(e) => handleDragStart(e as any, task.id)}
                  style={{ marginBottom: 8, cursor: "move" }}
                >
                  <div style={{ fontWeight: 500 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    {task.aspiceProcess && <Tag size="small">{task.aspiceProcess}</Tag>}
                  </div>
                </Card>
              ))}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="新建任务"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: "请输入任务标题" }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>

          <Form.Item name="description" label="任务描述">
            <Input.TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>

          <Form.Item name="aspiceProcess" label="ASPICE 过程">
            <Select placeholder="选择 ASPICE 过程" showSearch>
              {ASPICE_PROCESSES.map((p) => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="优先级" initialValue="medium">
            <Select>
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
              <Option value="critical">紧急</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="backlog">
            <Select>
              {COLUMNS.map((col) => (
                <Option key={col.key} value={col.key}>{col.title}</Option>
              ))}
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
    </div>
  );
}
