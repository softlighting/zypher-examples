import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

const TRACKED_PAPERS_FILE = "./data/tracked_papers.json";

interface TrackedPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  published: string;
  source: string;
  url: string;
  categories: string[];
  tracked_at: string;
  notes?: string;
}

/**
 * 追踪论文工具
 * 管理用户追踪的论文列表
 */
export const TrackPaperTool = defineTool({
  name: "track_paper",
  description:
    "管理追踪的论文。可以添加论文到追踪列表、删除追踪的论文、或查看所有已追踪的论文。",
  parameters: z.object({
    action: z
      .enum(["add", "remove", "list", "clear"])
      .describe("操作类型：add（添加），remove（删除），list（查看列表），clear（清空所有）"),
    paper: z
      .object({
        id: z.string(),
        title: z.string(),
        authors: z.array(z.string()),
        abstract: z.string(),
        published: z.string(),
        source: z.string(),
        url: z.string(),
        categories: z.array(z.string()),
      })
      .optional()
      .describe("要添加的论文信息（仅当 action 为 add 时需要）"),
    paper_id: z
      .string()
      .optional()
      .describe("要删除的论文 ID（仅当 action 为 remove 时需要）"),
    notes: z.string().optional().describe("添加论文时的备注信息"),
  }),
  execute: async ({ action, paper, paper_id, notes }) => {
    const trackedPapers = await loadTrackedPapers();

    switch (action) {
      case "add":
        if (!paper) {
          return {
            success: false,
            message: "添加论文时必须提供论文信息",
          };
        }
        return await addPaper(trackedPapers, paper, notes);

      case "remove":
        if (!paper_id) {
          return {
            success: false,
            message: "删除论文时必须提供论文 ID",
          };
        }
        return await removePaper(trackedPapers, paper_id);

      case "list":
        return {
          success: true,
          total: trackedPapers.length,
          papers: trackedPapers,
          message: `当前追踪 ${trackedPapers.length} 篇论文`,
        };

      case "clear":
        await saveTrackedPapers([]);
        return {
          success: true,
          message: "已清空所有追踪的论文",
        };

      default:
        return {
          success: false,
          message: "未知的操作类型",
        };
    }
  },
});

async function loadTrackedPapers(): Promise<TrackedPaper[]> {
  try {
    const content = await Deno.readTextFile(TRACKED_PAPERS_FILE);
    return JSON.parse(content);
  } catch (error) {
    // 文件不存在或解析失败，返回空数组
    if (error instanceof Deno.errors.NotFound) {
      return [];
    }
    console.error("读取追踪论文文件失败:", error);
    return [];
  }
}

async function saveTrackedPapers(papers: TrackedPaper[]): Promise<void> {
  try {
    // 确保目录存在
    await Deno.mkdir("./data", { recursive: true });
    await Deno.writeTextFile(
      TRACKED_PAPERS_FILE,
      JSON.stringify(papers, null, 2),
    );
  } catch (error) {
    console.error("保存追踪论文文件失败:", error);
    throw error;
  }
}

async function addPaper(
  trackedPapers: TrackedPaper[],
  paper: Omit<TrackedPaper, "tracked_at" | "notes">,
  notes?: string,
) {
  // 检查是否已经追踪
  if (trackedPapers.some((p) => p.id === paper.id)) {
    return {
      success: false,
      message: `论文 "${paper.title}" 已经在追踪列表中`,
    };
  }

  const newPaper: TrackedPaper = {
    ...paper,
    tracked_at: new Date().toISOString(),
    notes,
  };

  trackedPapers.push(newPaper);
  await saveTrackedPapers(trackedPapers);

  return {
    success: true,
    paper: newPaper,
    message: `成功追踪论文 "${paper.title}"`,
  };
}

async function removePaper(trackedPapers: TrackedPaper[], paperId: string) {
  const index = trackedPapers.findIndex((p) => p.id === paperId);

  if (index === -1) {
    return {
      success: false,
      message: `未找到 ID 为 ${paperId} 的论文`,
    };
  }

  const removedPaper = trackedPapers[index];
  trackedPapers.splice(index, 1);
  await saveTrackedPapers(trackedPapers);

  return {
    success: true,
    removed_paper: removedPaper,
    message: `成功删除追踪的论文 "${removedPaper.title}"`,
  };
}
