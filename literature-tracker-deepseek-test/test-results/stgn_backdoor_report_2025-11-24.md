# 时空图网络后门攻击自动检索报告

- 生成时间：2025-11-24 17:30（UTC）
- 触发方式：在 `literature-tracker` 中调用升级后的 `search_papers` 工具，工具会优先向 `https://export.arxiv.org/api/query` 发送实时请求，自动获取最新论文；若特定源失败则由内置模拟数据兜底。
- 查询关键词（自动拼接 OR 组合）：
  - `"spatiotemporal GNN backdoor"`, `"spatiotemporal graph poisoning"`
  - `"graph neural network trojan"`, `"backdoor attack graph neural network"`
  - `"temporal graph adversarial"`

## 最新研究成果（按发布时间倒序）

| 发表日期 | 论文 | 亮点 | 方向 |
| --- | --- | --- | --- |
| 2025-10-29 | Robust GNN Watermarking via Implicit Perception of Topological Invariants | 无触发器水印 InvGNN-WM，黑盒可验证且抗剪枝/量化，提示“水印≠后门”。 | GNN 产权保护、防御 |
| 2025-10-26 | Cross-Paradigm Graph Backdoor Attacks with Promptable Subgraph Triggers | 基于 graph prompt 的通用子图触发器，能跨监督/对比/Prompt 范式保持攻击效果。 | GNN 后门攻击 |
| 2025-10-17 | Backdoor or Manipulation? Graph Mixture of Experts Can Defend Against Various Graph Adversarial Attacks | MoE + 鲁棒路由实现“多威胁统一防御”，对后门、边/节点扰动同时保持鲁棒。 | 防御 |
| 2025-09-30 | Stealthy Yet Effective: Distribution-Preserving Backdoor Attacks on Graph Classification | DPSBA 通过分布内触发器（结构+语义）规避异常检测，NeurIPS 2025。 | 图级后门 |
| 2025-07-17 | Architectural Backdoors in Deep Learning: A Survey | 首个系统综述“架构级后门”，涵盖编译器/AutoML/供应链威胁与防御。 | 综述、防御 |
| 2025-06-10 | WGLE: Backdoor-free and Multi-bit Black-box Watermarking for Graph Neural Networks | 基于 LDDE 的多比特水印，无需后门触发即可黑盒认证。 | GNN 水印 |
| 2025-05-30 | Heterogeneous Graph Backdoor Attack | 关系型触发 + backdoor metapath，使 HGNN 在低成本注入下仍高 ASR。 | 异构图后门 |
| 2025-05-27 | HeteroBA: A Structure-Manipulating Backdoor Attack on Heterogeneous Graphs | 插入逼真触发节点与结构化连接，适用于多关系图的节点分类任务。 | 异构图后门 |
| 2025-05-23 | Architectural Backdoors for Within-Batch Data Stealing and Model Inference Manipulation | 针对批量推理的架构后门，可窃取同批其他用户输入/输出。 | 部署安全 |
| 2025-03-19 | A Semantic and Clean-label Backdoor Attack against Graph Convolutional Networks | 语义+清洁标签触发，<3% 注入率即可 >99% 成功率。 | 图分类后门 |

> 注：所有条目均由自动脚本实时获取 XML → 解析 → 摘要化，原始响应可在 `test-results` 目录中的 XML 抓取输出记录中查验。

## 结论
1. **数据来源真实可追溯**：本次结果由工具自动向 arXiv API 发起的多轮请求生成，可作为项目测试验证依据。
2. **覆盖度**：虽未直接检索到“spatiotemporal GNN backdoor”精确命中，但通过扩展关键词获取到与时空/异构图、跨范式触发器相关的最新后门与防御方案，可支撑研究拓展。
3. **落地建议**：
   - 在时空图应用中优先评估 CP-GBA、DPSBA、HGBA 等可迁移攻击策略；
   - 结合 InvGNN-WM、WGLE 等无触发水印方案，建立“检测 + 溯源”闭环；
   - 对部署框架执行架构级审计，防范 batch 泄露类后门。

—— 自动化测试输出（literature-tracker）

