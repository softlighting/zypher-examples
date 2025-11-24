import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

type Paper = {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  source: string;
  url: string;
  categories: string[];
};

const ARXIV_API_ENDPOINT = "https://export.arxiv.org/api/query";

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
    const normalizedQuery = query.trim();
    const normalizedSort = sort_by;

    const combinedResults: Paper[] = [];
    let arxivError: string | undefined;

    if (source === "arxiv" || source === "all") {
      const arxivTarget =
        source === "all" ? Math.min(max_results, Math.ceil(max_results / 2)) : max_results;
      try {
        const arxivPapers = await fetchArxivPapers(
          normalizedQuery,
          arxivTarget,
          normalizedSort,
        );
        combinedResults.push(...arxivPapers.slice(0, arxivTarget));
      } catch (error) {
        arxivError = error instanceof Error ? error.message : String(error);
        console.error("获取 arXiv 数据失败:", error);
      }
    }

    const needsMockData =
      source === "pubmed" || (source === "all" && combinedResults.length < max_results) ||
      (source === "arxiv" && arxivError);

    if (needsMockData) {
      const remaining =
        source === "all"
          ? Math.max(0, max_results - combinedResults.length)
          : source === "pubmed"
          ? max_results
          : Math.max(0, max_results - combinedResults.length);

      if (remaining > 0) {
        combinedResults.push(
          ...generateMockPapers(
            normalizedQuery,
            source === "pubmed" ? "pubmed" : source,
            remaining,
            normalizedSort,
          ),
        );
      }
    }

    const finalResults = combinedResults.slice(0, max_results);
    const messageSuffix = arxivError
      ? "（arXiv 数据获取失败，已使用模拟数据补全）"
      : "";

    return {
      success: true,
      query,
      source,
      total_results: finalResults.length,
      papers: finalResults,
      message: `找到 ${finalResults.length} 篇相关论文${messageSuffix}`,
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

async function fetchArxivPapers(
  query: string,
  maxResults: number,
  sortBy: string,
): Promise<Paper[]> {
  const params = new URLSearchParams({
    search_query: `all:${query}`,
    start: "0",
    max_results: Math.min(maxResults, 50).toString(),
    sortBy: sortBy === "date" ? "submittedDate" : "relevance",
    sortOrder: "descending",
  });

  const response = await fetch(`${ARXIV_API_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`arXiv API 请求失败，状态码 ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parseArxivFeed(xml);
  return parsed.slice(0, maxResults);
}

function parseArxivFeed(xml: string): Paper[] {
  const entries = xml.split("<entry>").slice(1);
  const papers: Paper[] = [];

  for (const entry of entries) {
    const entryContent = entry.split("</entry>")[0];
    const title = decodeHtmlEntities(getTagContent(entryContent, "title"));
    const abstract = decodeHtmlEntities(
      getTagContent(entryContent, "summary").replace(/\s+/g, " ").trim(),
    );
    const published = getTagContent(entryContent, "published") ||
      getTagContent(entryContent, "updated");
    const url = getTagContent(entryContent, "id");

    if (!title || !url) {
      continue;
    }

    papers.push({
      id: url,
      title,
      abstract,
      published: published ? published.split("T")[0] : "",
      source: "arxiv",
      url,
      authors: extractAuthors(entryContent),
      categories: extractCategories(entryContent),
    });
  }

  return papers;
}

function getTagContent(xmlChunk: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xmlChunk.match(regex);
  if (!match) {
    return "";
  }
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractAuthors(entryContent: string): string[] {
  const authors: string[] = [];
  const regex = /<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/gi;
  let match;
  while ((match = regex.exec(entryContent)) !== null) {
    authors.push(decodeHtmlEntities(match[1]));
  }

  if (!authors.length) {
    authors.push("未知作者");
  }

  return authors;
}

function extractCategories(entryContent: string): string[] {
  const categories: string[] = [];
  const regex = /<category[^>]*term="([^"]+)"/gi;
  let match;
  while ((match = regex.exec(entryContent)) !== null) {
    categories.push(match[1]);
  }

  return categories.length ? categories : ["cs.AI"];
}
