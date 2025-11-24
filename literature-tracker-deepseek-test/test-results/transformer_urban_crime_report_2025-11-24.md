# Transformer 驱动的城市犯罪预测自动检索报告

- 生成时间：2025-11-24 17:46（UTC）
- 检索方式：通过升级后的 `search_papers` 工作流直接向 `https://export.arxiv.org/api/query` 发送请求，核心查询：
  - `search_query=all:"transformer urban crime prediction"`
  - `search_query=all:"crime prediction" AND all:transformer`
  - 其他辅助关键词：`transformer crime prediction`, `transformer urban safety`
- 所有摘要均来自自动解析的 arXiv Atom XML；如需复现，可在相同仓库根目录执行等效的 `Invoke-WebRequest` 命令。

## 重点论文（按发表日期倒序）

| 发表日期 | 论文 | Transformer 角色 | 与城市犯罪预测的关联 |
| --- | --- | --- | --- |
| 2025-06-02 | **MobCLIP: Learning General-purpose Geospatial Representation at Scale** | CLIP 风格的多模态 Transformer，对全国网格位置做 token 化并在 4 模态上对齐 | 在 11 个城市任务中统一表现，犯罪案件预测准确率提升 95%，可直接迁移到城市治安热度建模 |
| 2025-05-05 | **Prediction-powered estimators for finite population statistics in highly imbalanced textual data: Public hate crime estimation** | Transformer 编码器生成警情文本预测，再与 Hansen-Hurwitz / 分层抽样估计器结合 | 在瑞典警方报告上估算仇恨犯罪规模，显著减少人工标注成本，可支撑城市年度犯罪统计 |
| 2023-11-16 | **TransCrimeNet: A Transformer-Based Model for Text-Based Crime Prediction in Criminal Networks** | BERT 提取审讯、社媒文本特征并与图嵌入融合 | 面向刑事网络的未来犯罪预测，F1 提升 12.7%，可与城市社交/情报数据结合实现预警 |
| 2023-10-04 | **AnomalyCLIP（Delving into CLIP latent space for Video Anomaly Recognition）** | 基于 CLIP + Transformer 的 MIL 框架，学习文本引导的异常方向 | 多数据集异常检测 SOTA，可用于城市监控视频中识别暴力/犯罪事件 |
| 2025-01-08 | **A Digital Shadow for Modeling, Studying and Preventing Urban Crime** | （非 Transformer，但通过 agent-based digital twin 接入 Transformer 特征） | 马拉加城市级“数字影子”平台，可结合上述 Transformer 表征输入，形成行为仿真与预测闭环 |

> 说明：由于“Transformer + 城市犯罪预测”公开研究仍较稀缺，自动化检索在保证关键词覆盖的前提下保留了与城市犯罪高度相关、或可直接迁移的 Transformer 应用（地理表征、文本估计、视频异常）。

## 观察与建议
1. **多模态趋势**：MobCLIP、AnomalyCLIP 等工作证明，将视觉/文本/地理数据在 Transformer 统一语义空间中对齐，可显著提升治安热力和视频监控类任务的泛化能力。
2. **统计+Transformer 结合**：瑞典仇恨犯罪研究表明，可先用 Transformer 自动打分，再通过经典抽样估计封装不确定性，适合需要官方统计背书的城市级项目。
3. **文本情报价值**：TransCrimeNet 展示了将 Transformer 文本特征与图结构融合的可行性，建议与本项目的 `track_paper` / `manage_topics` 数据结合，探索社交舆情驱动的城市犯罪预测。
4. **仿真平台对接**：城市数字影子模型可视作“下游应用”，需要高质量的 Transformer 表征提供每天的风险分布，建议在未来测试脚本中模拟该数据流。

—— 自动化测试输出（literature-tracker）

