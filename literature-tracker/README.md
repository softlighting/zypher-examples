# 文献动态追踪小助手 📚

一个基于 Zypher 框架的智能学术文献追踪助手，帮助研究人员高效地搜索、追踪和管理最新的学术论文。

## 功能特性

### 🔍 文献搜索
- 支持多数据源搜索（arXiv、PubMed 等）
- 关键词智能搜索
- 按相关性或时间排序
- 自定义搜索结果数量

### 📌 论文追踪
- 添加感兴趣的论文到追踪列表
- 查看所有已追踪的论文
- 删除不再关注的论文
- 为论文添加个人备注

### 🏷️ 主题管理
- 创建研究主题标签
- 为主题配置关键词
- 更新和删除主题
- 基于主题的智能推荐

### 📄 详细信息
- 获取论文完整摘要
- 查看作者和机构信息
- 引用数和影响力分析
- 相关论文推荐

## 快速开始

### 前置要求

- [Deno](https://deno.land/) 运行时（1.40+）
- Anthropic API Key

### 安装步骤

1. **克隆仓库**
   ```bash
   cd literature-tracker
   ```

2. **配置环境变量**

   创建 `.env` 文件：
   ```bash
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **运行应用**
   ```bash
   deno task start
   # 或使用开发模式（带自动重载）
   deno task dev
   ```

## 使用示例

### 搜索论文
```
你: 搜索最新的关于 transformer 架构的论文
```

助手会使用 `search_papers` 工具搜索相关论文，并展示结果列表。

### 追踪论文
```
你: 把第 2 篇论文加入追踪列表
```

助手会将指定论文添加到你的追踪列表中。

### 管理主题
```
你: 添加一个新的研究主题：深度学习，关键词包括 neural networks, deep learning, AI
```

助手会创建一个新的研究主题并保存。

### 查看追踪列表
```
你: 查看我追踪的所有论文
```

助手会展示你的完整追踪列表。

### 获取论文详情
```
你: 获取第一篇论文的详细信息
```

助手会获取并展示论文的详细信息，包括引用数和相关论文。

## 项目结构

```
literature-tracker/
├── main.ts                      # 应用入口文件
├── deno.json                    # Deno 配置文件
├── prompt.md                    # AI 助手的自定义指令
├── README.md                    # 项目文档
├── .env                         # 环境变量配置（需自行创建）
├── data/                        # 数据存储目录
│   ├── tracked_papers.json     # 追踪的论文数据
│   └── topics.json             # 研究主题数据
└── tools/                       # 自定义工具目录
    ├── search_papers.ts        # 论文搜索工具
    ├── track_paper.ts          # 论文追踪工具
    ├── manage_topics.ts        # 主题管理工具
    └── paper_details.ts        # 论文详情工具
```

## 可用工具

### 1. search_papers
搜索学术论文

**参数：**
- `query` (string): 搜索关键词
- `source` (enum): 数据源 - arxiv, pubmed, all
- `max_results` (number): 最大结果数（1-50）
- `sort_by` (enum): 排序方式 - relevance, date

### 2. track_paper
管理追踪的论文

**参数：**
- `action` (enum): 操作类型 - add, remove, list, clear
- `paper` (object): 论文信息（添加时需要）
- `paper_id` (string): 论文 ID（删除时需要）
- `notes` (string): 备注信息（可选）

### 3. manage_topics
管理研究主题

**参数：**
- `action` (enum): 操作类型 - add, remove, update, list
- `topic_name` (string): 主题名称
- `keywords` (array): 关键词列表
- `description` (string): 主题描述（可选）
- `topic_id` (string): 主题 ID（更新/删除时使用）

### 4. get_paper_details
获取论文详细信息

**参数：**
- `paper_id` (string): 论文 ID
- `url` (string): 论文 URL
- `include_citations` (boolean): 是否包含引用信息
- `include_related` (boolean): 是否包含相关论文

## 技术栈

- **运行时**: Deno
- **AI 框架**: Zypher (@corespeed/zypher)
- **AI 模型**: Claude Sonnet 4
- **参数验证**: Zod
- **数据存储**: JSON 文件

## 开发指南

### 添加新工具

1. 在 `tools/` 目录下创建新的工具文件
2. 使用 `defineTool` 定义工具
3. 在 `main.ts` 中导入并注册工具

示例：
```typescript
// tools/my_tool.ts
import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

export const MyTool = defineTool({
  name: "my_tool",
  description: "工具描述",
  parameters: z.object({
    param: z.string().describe("参数描述"),
  }),
  execute: async ({ param }) => {
    // 工具逻辑
    return { success: true, message: "执行成功" };
  },
});
```

### 修改提示词

编辑 `prompt.md` 文件以自定义 AI 助手的行为和响应风格。

## 注意事项

- 本项目使用模拟数据进行演示，实际使用时可以集成真实的学术数据库 API
- 数据存储在本地 JSON 文件中，适合个人使用
- 定期备份 `data/` 目录以防数据丢失

## 扩展建议

- 集成真实的 arXiv API 和 PubMed API
- 添加数据库支持（SQLite、PostgreSQL）
- 实现论文自动推荐功能
- 添加邮件通知功能
- 支持导出为 BibTeX、CSV 等格式
- 添加论文阅读笔记功能
- 实现多用户支持

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

由 Zypher 框架驱动 ⚡ 使用 Claude AI 🤖
