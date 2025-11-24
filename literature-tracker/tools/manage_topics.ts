import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

const TOPICS_FILE = "./data/topics.json";

interface ResearchTopic {
  id: string;
  name: string;
  keywords: string[];
  description?: string;
  created_at: string;
  last_searched?: string;
}

/**
 * 管理研究主题工具
 * 管理用户关注的研究领域和主题
 */
export const ManageTopicsTool = defineTool({
  name: "manage_topics",
  description:
    "管理研究主题。可以添加新的研究主题、删除主题、更新主题关键词、或查看所有关注的主题。每个主题可以包含多个关键词，用于智能推荐相关论文。",
  parameters: z.object({
    action: z
      .enum(["add", "remove", "update", "list"])
      .describe(
        "操作类型：add（添加主题），remove（删除主题），update（更新主题），list（查看所有主题）",
      ),
    topic_name: z
      .string()
      .optional()
      .describe("主题名称（add 和 remove 时需要）"),
    keywords: z
      .array(z.string())
      .optional()
      .describe("主题相关的关键词列表（add 和 update 时需要）"),
    description: z.string().optional().describe("主题描述（可选）"),
    topic_id: z
      .string()
      .optional()
      .describe("主题 ID（update 和 remove 时可使用）"),
  }),
  execute: async ({
    action,
    topic_name,
    keywords,
    description,
    topic_id,
  }) => {
    const topics = await loadTopics();

    switch (action) {
      case "add":
        if (!topic_name || !keywords || keywords.length === 0) {
          return {
            success: false,
            message: "添加主题时必须提供主题名称和至少一个关键词",
          };
        }
        return await addTopic(topics, topic_name, keywords, description);

      case "remove":
        if (!topic_name && !topic_id) {
          return {
            success: false,
            message: "删除主题时必须提供主题名称或主题 ID",
          };
        }
        return await removeTopic(topics, topic_name, topic_id);

      case "update":
        if (!topic_id && !topic_name) {
          return {
            success: false,
            message: "更新主题时必须提供主题名称或主题 ID",
          };
        }
        return await updateTopic(
          topics,
          topic_id,
          topic_name,
          keywords,
          description,
        );

      case "list":
        return {
          success: true,
          total: topics.length,
          topics: topics,
          message: `当前关注 ${topics.length} 个研究主题`,
        };

      default:
        return {
          success: false,
          message: "未知的操作类型",
        };
    }
  },
});

async function loadTopics(): Promise<ResearchTopic[]> {
  try {
    const content = await Deno.readTextFile(TOPICS_FILE);
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return [];
    }
    console.error("读取主题文件失败:", error);
    return [];
  }
}

async function saveTopics(topics: ResearchTopic[]): Promise<void> {
  try {
    await Deno.mkdir("./data", { recursive: true });
    await Deno.writeTextFile(TOPICS_FILE, JSON.stringify(topics, null, 2));
  } catch (error) {
    console.error("保存主题文件失败:", error);
    throw error;
  }
}

async function addTopic(
  topics: ResearchTopic[],
  name: string,
  keywords: string[],
  description?: string,
) {
  // 检查是否已存在同名主题
  if (topics.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
    return {
      success: false,
      message: `主题 "${name}" 已存在`,
    };
  }

  const newTopic: ResearchTopic = {
    id: `topic-${Date.now()}`,
    name,
    keywords,
    description,
    created_at: new Date().toISOString(),
  };

  topics.push(newTopic);
  await saveTopics(topics);

  return {
    success: true,
    topic: newTopic,
    message: `成功添加研究主题 "${name}"`,
  };
}

async function removeTopic(
  topics: ResearchTopic[],
  topicName?: string,
  topicId?: string,
) {
  const index = topics.findIndex(
    (t) =>
      (topicId && t.id === topicId) ||
      (topicName && t.name.toLowerCase() === topicName.toLowerCase()),
  );

  if (index === -1) {
    return {
      success: false,
      message: `未找到指定的研究主题`,
    };
  }

  const removedTopic = topics[index];
  topics.splice(index, 1);
  await saveTopics(topics);

  return {
    success: true,
    removed_topic: removedTopic,
    message: `成功删除研究主题 "${removedTopic.name}"`,
  };
}

async function updateTopic(
  topics: ResearchTopic[],
  topicId?: string,
  topicName?: string,
  keywords?: string[],
  description?: string,
) {
  const topic = topics.find(
    (t) =>
      (topicId && t.id === topicId) ||
      (topicName && t.name.toLowerCase() === topicName.toLowerCase()),
  );

  if (!topic) {
    return {
      success: false,
      message: `未找到指定的研究主题`,
    };
  }

  // 更新主题信息
  if (keywords && keywords.length > 0) {
    topic.keywords = keywords;
  }
  if (description !== undefined) {
    topic.description = description;
  }

  await saveTopics(topics);

  return {
    success: true,
    topic: topic,
    message: `成功更新研究主题 "${topic.name}"`,
  };
}
