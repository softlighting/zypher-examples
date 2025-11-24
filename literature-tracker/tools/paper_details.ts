import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

/**
 * 获取论文详情工具
 * 根据论文 ID 或 URL 获取详细信息，包括引用数、相关论文等
 */
export const GetPaperDetailsTool = defineTool({
  name: "get_paper_details",
  description:
    "获取论文的详细信息。根据论文 ID 或 URL 获取包括完整摘要、引用信息、相关论文推荐等详细内容。",
  parameters: z.object({
    paper_id: z.string().optional().describe("论文 ID"),
    url: z.string().optional().describe("论文 URL"),
    include_citations: z
      .boolean()
      .default(true)
      .describe("是否包含引用信息"),
    include_related: z
      .boolean()
      .default(true)
      .describe("是否包含相关论文推荐"),
  }),
  execute: async ({
    paper_id,
    url,
    include_citations,
    include_related,
  }) => {
    if (!paper_id && !url) {
      return {
        success: false,
        message: "必须提供论文 ID 或 URL",
      };
    }

    // 模拟 API 调用延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const details = generatePaperDetails(
      paper_id || url!,
      include_citations,
      include_related,
    );

    return {
      success: true,
      details,
      message: "成功获取论文详情",
    };
  },
});

function generatePaperDetails(
  identifier: string,
  includeCitations: boolean,
  includeRelated: boolean,
) {
  const details: any = {
    id: identifier,
    title: "深度学习在自然语言处理中的最新进展",
    authors: [
      {
        name: "张伟",
        affiliation: "清华大学",
        email: "zhangwei@example.edu",
      },
      {
        name: "李明",
        affiliation: "北京大学",
        email: "liming@example.edu",
      },
      {
        name: "John Smith",
        affiliation: "Stanford University",
        email: "jsmith@stanford.edu",
      },
    ],
    abstract:
      "本文系统综述了深度学习技术在自然语言处理领域的最新研究进展。我们详细介绍了 Transformer 架构及其各种变体，包括 BERT、GPT 系列和 T5 等预训练模型。研究表明，这些模型在多个 NLP 任务上取得了显著的性能提升，包括文本分类、命名实体识别、机器翻译和问答系统等。我们还探讨了模型压缩、知识蒸馏和少样本学习等前沿话题，并分析了当前技术面临的挑战和未来的发展方向。实验结果表明，通过适当的预训练和微调策略，可以在各种下游任务中获得优异的表现。",
    published: "2025-01-15",
    source: "arxiv",
    url: "https://arxiv.org/abs/2501.00001",
    categories: ["cs.CL", "cs.AI", "cs.LG"],
    doi: "10.48550/arXiv.2501.00001",
    pdf_url: "https://arxiv.org/pdf/2501.00001.pdf",
    journal: "arXiv preprint",
    version: "v2",
    updated: "2025-01-20",
    comment: "28 pages, 12 figures, accepted to ICML 2025",
  };

  if (includeCitations) {
    details.citations = {
      count: Math.floor(Math.random() * 500) + 50,
      influential_citations: Math.floor(Math.random() * 50) + 10,
      recent_citations: [
        {
          title: "改进的注意力机制在机器翻译中的应用",
          authors: ["王芳", "陈建"],
          year: 2025,
          url: "https://arxiv.org/abs/2501.00123",
        },
        {
          title: "预训练语言模型的高效微调方法",
          authors: ["Liu Wei", "Zhang Li"],
          year: 2025,
          url: "https://arxiv.org/abs/2501.00234",
        },
        {
          title: "少样本学习在 NLP 中的最新突破",
          authors: ["Sarah Johnson", "Michael Brown"],
          year: 2024,
          url: "https://arxiv.org/abs/2412.00567",
        },
      ],
    };
  }

  if (includeRelated) {
    details.related_papers = [
      {
        id: "arxiv-2501-00002",
        title: "Transformer 架构的理论分析",
        authors: ["赵敏", "钱伟"],
        similarity: 0.92,
        url: "https://arxiv.org/abs/2501.00002",
        published: "2025-01-10",
      },
      {
        id: "arxiv-2501-00003",
        title: "大规模预训练模型的优化策略",
        authors: ["Emily Chen", "David Wilson"],
        similarity: 0.88,
        url: "https://arxiv.org/abs/2501.00003",
        published: "2025-01-12",
      },
      {
        id: "arxiv-2412-00890",
        title: "多模态学习的最新进展",
        authors: ["孙华", "周杰"],
        similarity: 0.85,
        url: "https://arxiv.org/abs/2412.00890",
        published: "2024-12-28",
      },
      {
        id: "arxiv-2412-00901",
        title: "知识蒸馏在模型压缩中的应用",
        authors: ["Robert Lee", "Anna Martinez"],
        similarity: 0.82,
        url: "https://arxiv.org/abs/2412.00901",
        published: "2024-12-30",
      },
    ];
  }

  return details;
}
