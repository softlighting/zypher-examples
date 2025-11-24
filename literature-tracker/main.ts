import "@std/dotenv/load";
import {
  AnthropicModelProvider,
  runAgentInTerminal,
  ZypherAgent,
} from "@corespeed/zypher";

// 导入自定义工具
import { SearchPapersTool } from "./tools/search_papers.ts";
import { TrackPaperTool } from "./tools/track_paper.ts";
import { ManageTopicsTool } from "./tools/manage_topics.ts";
import { GetPaperDetailsTool } from "./tools/paper_details.ts";

/**
 * 获取必需的环境变量
 */
function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`环境变量 ${name} 未设置。请创建 .env 文件并设置 ${name}=your_api_key`);
  }
  return value;
}

/**
 * 加载自定义提示词
 */
async function loadPrompt(): Promise<string> {
  try {
    return await Deno.readTextFile("./prompt.md");
  } catch (error) {
    console.error("加载 prompt.md 失败:", error);
    // 返回默认提示词
    return "你是一个专业的学术文献追踪助手，帮助研究人员追踪和管理最新的学术论文动态。";
  }
}

/**
 * 主函数
 */
async function main() {
  console.log("🔬 文献动态追踪小助手启动中...\n");

  // 加载自定义提示词
  const prompt = await loadPrompt();

  // 创建 Zypher Agent
  const zypher = new ZypherAgent(
    new AnthropicModelProvider({
      apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
    }),
    {
      customInstructions: prompt,
    },
  );

  // 注册自定义工具
  const mcpServerManager = zypher.mcpServerManager;

  console.log("📚 注册自定义工具...");
  mcpServerManager.registerTool(SearchPapersTool);
  mcpServerManager.registerTool(TrackPaperTool);
  mcpServerManager.registerTool(ManageTopicsTool);
  mcpServerManager.registerTool(GetPaperDetailsTool);

  console.log("✅ 工具注册完成！");
  console.log("\n可用工具:");
  console.log("  • search_papers - 搜索学术论文");
  console.log("  • track_paper - 管理追踪的论文");
  console.log("  • manage_topics - 管理研究主题");
  console.log("  • get_paper_details - 获取论文详情");
  console.log("\n开始使用吧！你可以说：");
  console.log("  • 搜索最新的关于 transformer 的论文");
  console.log("  • 追踪这篇论文");
  console.log("  • 查看我追踪的所有论文");
  console.log("  • 添加一个新的研究主题：深度学习");
  console.log("  • 获取这篇论文的详细信息");
  console.log("\n" + "=".repeat(60) + "\n");

  // 初始化并运行
  await zypher.init();
  await runAgentInTerminal(zypher, "claude-sonnet-4-20250514");
}

// 运行主函数
if (import.meta.main) {
  main().catch((error) => {
    console.error("❌ 错误:", error.message);
    Deno.exit(1);
  });
}
