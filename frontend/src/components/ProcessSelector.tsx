import { Checkbox, Collapse, Tag, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./ProcessSelector.css";

const { Panel } = Collapse;

// VDA QAR Required Processes (16 required)
const VDA_PROCESSES = {
  "系统工程过程 (SYS)": [
    { id: "SYS.1", name: "需求获取", desc: "获取并记录利益相关方的需求和期望" },
    { id: "SYS.2", name: "系统需求导出与分析", desc: "从需求中导出系统需求并进行规范分析" },
    { id: "SYS.3", name: "系统架构设计", desc: "设计满足系统需求的系统架构" },
    { id: "SYS.4", name: "系统集成与集成测试", desc: "集成系统组件并验证其符合系统需求" },
    { id: "SYS.5", name: "系统合格测试", desc: "验证系统在其目标环境中满足利益相关方需求" },
  ],
  "软件工程过程 (SWE)": [
    { id: "SWE.1", name: "软件需求导出", desc: "从系统需求中导出软件需求" },
    { id: "SWE.2", name: "软件架构设计", desc: "设计满足软件需求的软件架构" },
    { id: "SWE.3", name: "软件详细设计", desc: "详细设计软件组件" },
    { id: "SWE.4", name: "软件单元设计与实现", desc: "设计、实现并验证软件单元" },
    { id: "SWE.5", name: "软件单元测试", desc: "测试软件单元以验证其符合软件详细设计" },
    { id: "SWE.6", name: "软件集成与集成测试", desc: "集成软件组件并进行集成测试" },
  ],
  "软件可靠性过程 (SWR)": [
    { id: "SWR.1", name: "软件可靠性管理", desc: "计划和管理软件可靠性活动" },
    { id: "SWR.2", name: "软件可靠性持续分析和评估", desc: "持续分析和评估软件可靠性" },
  ],
  "过程改进 (PIR)": [
    { id: "PIR", name: "过程改进", desc: "评估项目过程并提出改进建议" },
  ],
  "采购过程 (ACQ)": [
    { id: "ACQ.1", name: "需求定义", desc: "定义采购项目的需求" },
    { id: "ACQ.2", name: "供应商选择", desc: "选择并评估供应商" },
    { id: "ACQ.3", name: "合同管理", desc: "管理供应商合同" },
    { id: "ACQ.4", name: "产品验收", desc: "验收供应商提供的产品" },
  ],
  "支持过程 (SUP)": [
    { id: "SUP.1", name: "质量保证", desc: "客观验证项目过程和工作产品符合要求" },
    { id: "SUP.2", name: "验证", desc: "根据方法和标准独立验证工作产品" },
    { id: "SUP.4", name: "联合评审", desc: "评估工作产品的状态和质量" },
    { id: "SUP.8", name: "配置管理", desc: "唯一标识、存储、控制配置项" },
    { id: "SUP.9", name: "问题解决管理", desc: "确保问题得到有效解决" },
    { id: "SUP.10", name: "变更请求管理", desc: "评估、控制和追踪变更请求" },
  ],
  "管理过程 (MAN)": [
    { id: "MAN.1", name: "项目方向管理", desc: "建立和监控项目目标" },
    { id: "MAN.2", name: "项目管理", desc: "计划、监控和控制项目" },
    { id: "MAN.3", name: "项目风险管理", desc: "识别、分析和缓解项目风险" },
    { id: "MAN.5", name: "进度管理", desc: "管理和控制项目进度" },
    { id: "MAN.6", name: "成本管理", desc: "管理和控制项目成本" },
  ],
};

// Work products for each process
const WORK_PRODUCTS: Record<string, string[]> = {
  "SYS.1": ["利益相关方需求规范 (SRS)", "需求变更记录"],
  "SYS.2": ["系统需求规范 (SysRS)", "接口需求规范", "系统需求变更记录"],
  "SYS.3": ["系统架构规范", "系统设计说明", "接口设计说明"],
  "SYS.4": ["系统集成计划", "系统集成报告", "集成测试报告"],
  "SYS.5": ["系统合格测试规范", "系统合格测试报告", "测试结果记录"],
  "SWE.1": ["软件需求规范 (SRS)", "软件需求变更记录"],
  "SWE.2": ["软件架构规范", "软件设计说明", "接口规范"],
  "SWE.3": ["软件详细设计说明 (SDD)", "数据规范"],
  "SWE.4": ["源代码", "软件单元规范", "单元设计说明"],
  "SWE.5": ["单元测试规范", "单元测试报告", "测试覆盖率报告"],
  "SWE.6": ["软件集成计划", "集成测试报告", "软件构建说明"],
  "SWR.1": ["软件可靠性计划", "软件可靠性规范"],
  "SWR.2": ["可靠性分析报告", "缺陷报告"],
  "PIR": ["过程评估报告", "改进建议"],
  "ACQ.1": ["采购需求规范", "供应商评估标准"],
  "ACQ.2": ["供应商提案", "供应商评估报告", "选择决策记录"],
  "ACQ.3": ["合同", "合同变更记录", "供应商进度报告"],
  "ACQ.4": ["验收计划", "验收报告", "验收证书"],
  "SUP.1": ["质量保证计划", "质量保证报告", "审计报告"],
  "SUP.2": ["验证计划", "验证报告", "验证结果记录"],
  "SUP.4": ["评审计划", "评审记录", "评审关闭报告"],
  "SUP.8": ["配置管理计划", "配置项清单", "变更记录"],
  "SUP.9": ["问题记录", "问题分析报告", "问题关闭记录"],
  "SUP.10": ["变更请求记录", "变更评估报告", "变更实施记录"],
  "MAN.1": ["项目方向规范", "项目方向变更记录"],
  "MAN.2": ["项目管理计划", "进度报告", "状态报告"],
  "MAN.3": ["风险管理计划", "风险登记册", "风险应对记录"],
  "MAN.5": ["进度计划", "进度跟踪报告"],
  "MAN.6": ["预算计划", "成本跟踪报告", "成本偏差分析"],
};

interface ProcessSelectorProps {
  value?: string[];
  onChange?: (selected: string[]) => void;
  mode?: "view" | "edit";
}

export default function ProcessSelector({ value = [], onChange, mode = "edit" }: ProcessSelectorProps) {
  const selectedSet = new Set(value);

  const handleToggle = (processId: string, checked: boolean) => {
    const newSelected = checked
      ? [...value, processId]
      : value.filter((id) => id !== processId);
    onChange?.(newSelected);
  };

  const handleGroupToggle = (groupProcesses: string[], checked: boolean) => {
    const newSelected = checked
      ? [...new Set([...value, ...groupProcesses])]
      : value.filter((id) => !groupProcesses.includes(id));
    onChange?.(newSelected);
  };

  const getGroupSelectedCount = (groupProcesses: string[]) => {
    return groupProcesses.filter((id) => selectedSet.has(id)).length;
  };

  return (
    <div className="process-selector">
      <div style={{ marginBottom: 16, color: "#666" }}>
        已选择 {value.length} 个过程
        {value.length > 0 && (
          <span style={{ marginLeft: 16 }}>
            <Tag color="blue">VDA Scope</Tag>
          </span>
        )}
      </div>

      <Collapse defaultActiveKey={["系统工程过程 (SYS)"]} ghost>
        {Object.entries(VDA_PROCESSES).map(([groupName, processes]) => {
          const groupIds = processes.map((p) => p.id);
          const groupSelectedCount = getGroupSelectedCount(groupIds);

          return (
            <Panel
              key={groupName}
              header={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Checkbox
                    checked={groupSelectedCount === processes.length}
                    indeterminate={
                      groupSelectedCount > 0 && groupSelectedCount < processes.length
                    }
                    onChange={(e) =>
                      handleGroupToggle(groupIds, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span style={{ fontWeight: 500 }}>{groupName}</span>
                  <Tag color="default">{groupSelectedCount}/{processes.length}</Tag>
                </div>
              }
            >
              <div className="process-list">
                {processes.map((process) => (
                  <div key={process.id} className="process-item">
                    <Checkbox
                      checked={selectedSet.has(process.id)}
                      onChange={(e) =>
                        handleToggle(process.id, e.target.checked)
                      }
                      disabled={mode === "view"}
                    />
                    <div className="process-info">
                      <div className="process-header">
                        <Tag color="purple">{process.id}</Tag>
                        <span className="process-name">{process.name}</span>
                        <Tooltip title={process.desc}>
                          <InfoCircleOutlined style={{ color: "#999" }} />
                        </Tooltip>
                      </div>
                      {selectedSet.has(process.id) && (
                        <div className="work-products">
                          <span className="work-products-label">工作产品：</span>
                          {WORK_PRODUCTS[process.id]?.map((wp, i) => (
                            <Tag key={i} color="cyan" style={{ margin: "2px 4px" }}>
                              {wp}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
