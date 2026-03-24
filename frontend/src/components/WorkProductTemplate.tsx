import { Table, Tag, Button, Space, Modal, message } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";

const WORK_PRODUCT_TEMPLATES = [
  { id: "SRS", name: "软件需求规范", description: "描述软件需求，包括功能需求、非功能需求、接口需求", phase: "需求阶段", process: "SWE.1", template: "# 软件需求规范 (SRS)\n\n## 1. 简介\n\n### 1.1 目的\n本文档定义软件的需求...", required: true },
  { id: "SDS", name: "软件设计说明", description: "描述软件架构和详细设计", phase: "设计阶段", process: "SWE.2/SWE.3", template: "# 软件设计说明 (SDS)\n\n## 1. 简介\n\n### 1.1 目的\n本文档定义软件的设计...", required: true },
  { id: "STR", name: "软件测试报告", description: "记录软件测试结果和缺陷", phase: "测试阶段", process: "SWE.5/SWE.6", template: "# 软件测试报告 (STR)\n\n## 1. 测试概述\n\n### 1.1 测试范围\n[描述被测试的内容]", required: true },
  { id: "SCS", name: "软件构建说明", description: "描述软件构建过程和环境", phase: "构建阶段", process: "SWE.6", template: "# 软件构建说明 (SCS)\n\n## 1. 构建环境\n\n### 1.1 硬件要求\n[列出硬件配置]", required: false },
  { id: "QAP", name: "质量保证计划", description: "计划质量保证活动", phase: "全过程", process: "SUP.1", template: "# 质量保证计划 (QAP)\n\n## 1. 目的和范围\n\n### 1.1 目的\n本文档定义项目的质量保证活动...", required: true },
  { id: "CMP", name: "配置管理计划", description: "计划配置管理活动", phase: "全过程", process: "SUP.8", template: "# 配置管理计划 (CMP)\n\n## 1. 配置管理范围\n\n### 1.1 配置项\n| CI ID | 配置项名称 | 类型 | 负责人 |", required: true },
];

interface WorkProductTemplateProps {
  selectedProcesses?: string[];
}

export default function WorkProductTemplate({ selectedProcesses = [] }: WorkProductTemplateProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof WORK_PRODUCT_TEMPLATES[0] | null>(null);
  const selectedSet = new Set(selectedProcesses);

  const getApplicableTemplates = () => {
    if (selectedProcesses.length === 0) return WORK_PRODUCT_TEMPLATES;
    return WORK_PRODUCT_TEMPLATES.filter((t) => {
      const procs = t.process.split("/");
      return procs.some((p) => selectedSet.has(p.trim()));
    });
  };

  const handlePreview = (template: typeof WORK_PRODUCT_TEMPLATES[0]) => {
    setPreviewTemplate(template);
    setPreviewVisible(true);
  };

  const handleDownload = (template: typeof WORK_PRODUCT_TEMPLATES[0]) => {
    const blob = new Blob([template.template], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}_Template.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success(`下载 ${template.name} 模板成功`);
  };

  const columns = [
    { title: "模板名称", dataIndex: "name", key: "name", render: (_: any, r: any) => <Space><Tag color="purple">{r.id}</Tag><span>{r.name}</span></Space> },
    { title: "描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "阶段", dataIndex: "phase", key: "phase", render: (p: string) => <Tag>{p}</Tag> },
    { title: "过程", dataIndex: "process", key: "process", render: (p: string) => <Space>{p.split("/").map(s => <Tag key={s} color="blue">{s}</Tag>)}</Space> },
    { title: "必选", dataIndex: "required", key: "required", render: (r: boolean) => r ? <Tag color="red">必选</Tag> : <Tag color="default">可选</Tag> },
    { title: "操作", key: "action", render: (_: any, r: any) => <Space><Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(r)}>预览</Button><Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(r)}>下载</Button></Space> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4>工作产品模板库</h4>
        <p style={{ color: "#666", margin: 0 }}>共 {getApplicableTemplates().length} 个模板{selectedProcesses.length > 0 && `（已按选定的 ${selectedProcesses.length} 个过程筛选）`}</p>
      </div>
      <Table columns={columns} dataSource={getApplicableTemplates()} rowKey="id" size="small" pagination={false} />
      <Modal title={previewTemplate?.name} open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={[<Button key="close" onClick={() => setPreviewVisible(false)}>关闭</Button>, <Button type="primary" icon={<DownloadOutlined />} onClick={() => { if (previewTemplate) { handleDownload(previewTemplate); setPreviewVisible(false); } }}>下载模板</Button>]} width={700}>
        {previewTemplate && <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 4, maxHeight: 400, overflow: "auto", fontSize: 12, whiteSpace: "pre-wrap" }}>{previewTemplate.template}</pre>}
      </Modal>
    </div>
  );
}
