import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

/**
 * 搜索学术论文工具
 * 模拟从 arXiv、PubMed 等数据源搜索论文
 */
export const SearchPapersTool = defineTool({
  name: "search_papers",
  description:
    "搜索学术论文。支持按关键词、作者、主题等条件搜索最新的学术文献。返回论文列表，包括标题、作者、摘要、发表时间等信息。",
  parameters: z.object({
    query: z.string().describe("搜索关键词或查询语句"),
    source: z
      .enum(["arxiv", "pubmed", "all"])
      .default("all")
      .describe("数据源：arxiv（计算机科学/物理），pubmed（生物医学），all（所有来源）"),
    max_results: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe("返回的最大结果数量（1-50）"),
    sort_by: z
      .enum(["relevance", "date"])
      .default("relevance")
      .describe("排序方式：relevance（相关性），date（发表时间）"),
  }),
  execute: async ({ query, source, max_results, sort_by }) => {
    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟搜索结果
    const mockPapers = generateMockPapers(query, source, max_results, sort_by);

    return {
      success: true,
      query,
      source,
      total_results: mockPapers.length,
      papers: mockPapers,
      message: `找到 ${mockPapers.length} 篇相关论文`,
    };
  },
});

/**
 * 生成模拟的论文数据
 */
function generateMockPapers(
  query: string,
  source: string,
  maxResults: number,
  sortBy: string,
): Array<{
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  source: string;
  url: string;
  categories: string[];
}> {
  const papers = [];
  const currentDate = new Date();

  for (let i = 0; i < maxResults; i++) {
    const daysAgo = sortBy === "date" ? i : Math.floor(Math.random() * 365);
    const publishDate = new Date(currentDate);
    publishDate.setDate(publishDate.getDate() - daysAgo);

    const paperSource =
      source === "all"
        ? i % 2 === 0
          ? "arxiv"
          : "pubmed"
        : source;

    papers.push({
      id: `${paperSource}-${Date.now()}-${i}`,
      title: generateTitle(query, i),
      authors: generateAuthors(),
      abstract: generateAbstract(query),
      published: publishDate.toISOString().split("T")[0],
      source: paperSource,
      url:
        paperSource === "arxiv"
          ? `https://arxiv.org/abs/2501.${String(i).padStart(5, "0")}`
          : `https://pubmed.ncbi.nlm.nih.gov/${34000000 + i}/`,
      categories: generateCategories(paperSource, query),
    });
  }

  return papers;
}

function generateTitle(query: string, index: number): string {
  const templates = [
    `${query} 的最新进展与应用研究`,
    `基于 ${query} 的创新方法论`,
    `${query} 在实际场景中的应用`,
    `深度学习与 ${query} 的结合研究`,
    `${query}：综述与未来展望`,
    `高效 ${query} 算法的设计与实现`,
    `${query} 的理论基础与实践`,
    `新型 ${query} 框架的提出与验证`,
  ];

  return templates[index % templates.length];
}

function generateAuthors(): string[] {
  const firstNames = [
    "张",
    "李",
    "王",
    "刘",
    "陈",
    "Yang",
    "Smith",
    "Johnson",
    "Brown",
  ];
  const lastNames = [
    "伟",
    "明",
    "华",
    "建",
    "Li",
    "Chen",
    "Wang",
    "Zhang",
  ];

  const numAuthors = Math.floor(Math.random() * 4) + 2; // 2-5 位作者
  const authors: string[] = [];

  for (let i = 0; i < numAuthors; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    authors.push(`${first} ${last}`);
  }

  return authors;
}

function generateAbstract(query: string): string {
  return `本文提出了一种基于 ${query} 的新方法。我们的研究表明，通过改进现有算法和引入新的技术手段，可以显著提升系统性能。实验结果显示，该方法在多个基准测试中达到了state-of-the-art的效果。我们还探讨了该方法在实际应用中的可行性，并提供了详细的实现细节和性能分析。未来的工作将聚焦于进一步优化算法效率和扩展应用场景。`;
}

function generateCategories(
  source: string,
  query: string,
): string[] {
  if (source === "arxiv") {
    return ["cs.AI", "cs.LG", "cs.CL"].slice(0, Math.floor(Math.random() * 2) + 1);
  } else {
    return ["Bioinformatics", "Genomics", "Machine Learning"].slice(
      0,
      Math.floor(Math.random() * 2) + 1,
    );
  }
}
