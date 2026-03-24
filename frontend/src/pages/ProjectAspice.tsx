import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Tabs, Button, Space, message } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import ProcessSelector from "../components/ProcessSelector";
import WorkProductTemplate from "../components/WorkProductTemplate";
import { projectApi } from "../services/api";

const { TabPane } = Tabs;

export default function ProjectAspice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      const data = await projectApi.get(id);
      setProject(data);
      setSelectedProcesses(data.vdaScope || []);
    } catch (error) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProcesses = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await projectApi.update(id, { vdaScope: selectedProcesses });
      message.success("保存成功");
    } catch (error) {
      message.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !project) {
    return <Card loading />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/projects/${id}`)} />
            <span>{project.name} - ASPICE 配置</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSaveProcesses}>
            保存配置
          </Button>
        }
      >
        <Row gutter={24}>
          <Col span={8}>
            <Card title="项目信息" size="small">
              <p><strong>ASPICE 级别：</strong>Level {project.aspiceLevel || "-"}</p>
              <p><strong>已选过程数：</strong>{selectedProcesses.length}</p>
              <p><strong>状态：</strong>{project.status === "active" ? "进行中" : "规划中"}</p>
            </Card>
          </Col>
          <Col span={16}>
            <Card title="VDA QAR Scope" size="small" style={{ marginBottom: 16 }}>
              <p style={{ color: "#666" }}>
                VDA QAR 要求 16 个必选过程域。根据项目类型和范围选择适用的过程。
              </p>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="processes">
          <TabPane tab="过程配置" key="processes">
            <ProcessSelector
              value={selectedProcesses}
              onChange={setSelectedProcesses}
            />
          </TabPane>
          <TabPane tab="工作产品模板" key="templates">
            <WorkProductTemplate selectedProcesses={selectedProcesses} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
