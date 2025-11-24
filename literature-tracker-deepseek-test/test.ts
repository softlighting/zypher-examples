import "@std/dotenv/load";

/**
 * DeepSeek API 测试脚本
 * 测试文献追踪助手的核心功能
 */

const DEEPSEEK_API_KEY = "sk-50ef015b4dbe4bb893c19e0b70c4cc9a";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 调用 DeepSeek API
 */
async function callDeepSeek(
  messages: Message[],
  temperature = 0.7,
): Promise<ChatResponse> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API 错误: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * 保存测试结果
 */
async function saveTestResult(testName: string, result: any) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `./test-results/${testName}_${timestamp}.json`;
  await Deno.writeTextFile(filename, JSON.stringify(result, null, 2));
  console.log(`✅ 测试结果已保存到: ${filename}`);
}

/**
 * 测试 1: 基本对话能力
 */
async function test1_BasicConversation() {
  console.log("\n" + "=".repeat(60));
  console.log("测试 1: 基本对话能力");
  console.log("=".repeat(60));

  const messages: Message[] = [
    {
      role: "system",
      content:
        "你是一个专业的学术文献追踪助手，帮助研究人员追踪和管理最新的学术论文动态。",
    },
    {
      role: "user",
      content: "你好！请介绍一下你的功能。",
    },
  ];

  try {
    const response = await callDeepSeek(messages);
    const assistantReply = response.choices[0].message.content;

    console.log("\n用户: " + messages[1].content);
    console.log("\n助手: " + assistantReply);
    console.log("\n使用的 token 数:");
    console.log(`  - 输入: ${response.usage.prompt_tokens}`);
    console.log(`  - 输出: ${response.usage.completion_tokens}`);
    console.log(`  - 总计: ${response.usage.total_tokens}`);

    await saveTestResult("test1_basic_conversation", {
      test: "基本对话能力",
      messages,
      response: assistantReply,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("❌ 测试失败:", error);
    return false;
  }
}

/**
 * 测试 2: 文献搜索场景
 */
async function test2_LiteratureSearch() {
  console.log("\n" + "=".repeat(60));
  console.log("测试 2: 文献搜索场景模拟");
  console.log("=".repeat(60));

  const messages: Message[] = [
    {
      role: "system",
      content: `你是一个专业的学术文献追踪助手。你可以帮助用户：
1. 搜索最新的学术论文
2. 追踪感兴趣的论文
3. 管理研究主题
4. 获取论文详细信息

你有以下工具可用：
- search_papers: 搜索学术论文
- track_paper: 管理追踪的论文
- manage_topics: 管理研究主题
- get_paper_details: 获取论文详情`,
    },
    {
      role: "user",
      content: "我想搜索最新的关于 transformer 架构的论文，你能帮我吗？",
    },
  ];

  try {
    const response = await callDeepSeek(messages);
    const assistantReply = response.choices[0].message.content;

    console.log("\n用户: " + messages[1].content);
    console.log("\n助手: " + assistantReply);
    console.log("\n使用的 token 数:");
    console.log(`  - 输入: ${response.usage.prompt_tokens}`);
    console.log(`  - 输出: ${response.usage.completion_tokens}`);
    console.log(`  - 总计: ${response.usage.total_tokens}`);

    await saveTestResult("test2_literature_search", {
      test: "文献搜索场景",
      messages,
      response: assistantReply,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("❌ 测试失败:", error);
    return false;
  }
}

/**
 * 测试 3: 多轮对话
 */
async function test3_MultiTurnConversation() {
  console.log("\n" + "=".repeat(60));
  console.log("测试 3: 多轮对话能力");
  console.log("=".repeat(60));

  const messages: Message[] = [
    {
      role: "system",
      content:
        "你是一个专业的学术文献追踪助手，帮助研究人员追踪和管理最新的学术论文动态。",
    },
    {
      role: "user",
      content: "我想追踪深度学习方向的论文。",
    },
  ];

  const conversationLog: any[] = [];

  try {
    // 第一轮对话
    console.log("\n第一轮对话:");
    let response = await callDeepSeek(messages);
    let assistantReply = response.choices[0].message.content;
    console.log("用户: " + messages[1].content);
    console.log("助手: " + assistantReply);

    messages.push({
      role: "assistant",
      content: assistantReply,
    });

    conversationLog.push({
      turn: 1,
      user: messages[1].content,
      assistant: assistantReply,
      usage: response.usage,
    });

    // 第二轮对话
    console.log("\n第二轮对话:");
    const userMessage2 = "特别是关于 transformer 和注意力机制的论文。";
    messages.push({
      role: "user",
      content: userMessage2,
    });

    response = await callDeepSeek(messages);
    assistantReply = response.choices[0].message.content;
    console.log("用户: " + userMessage2);
    console.log("助手: " + assistantReply);

    conversationLog.push({
      turn: 2,
      user: userMessage2,
      assistant: assistantReply,
      usage: response.usage,
    });

    messages.push({
      role: "assistant",
      content: assistantReply,
    });

    // 第三轮对话
    console.log("\n第三轮对话:");
    const userMessage3 = "你能总结一下我们刚才讨论的内容吗？";
    messages.push({
      role: "user",
      content: userMessage3,
    });

    response = await callDeepSeek(messages);
    assistantReply = response.choices[0].message.content;
    console.log("用户: " + userMessage3);
    console.log("助手: " + assistantReply);

    conversationLog.push({
      turn: 3,
      user: userMessage3,
      assistant: assistantReply,
      usage: response.usage,
    });

    console.log("\n总使用 token 数:");
    const totalTokens = conversationLog.reduce(
      (sum, log) => sum + log.usage.total_tokens,
      0,
    );
    console.log(`  - 总计: ${totalTokens}`);

    await saveTestResult("test3_multi_turn", {
      test: "多轮对话能力",
      conversation: conversationLog,
      total_tokens: totalTokens,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("❌ 测试失败:", error);
    return false;
  }
}

/**
 * 测试 4: 复杂任务理解
 */
async function test4_ComplexTask() {
  console.log("\n" + "=".repeat(60));
  console.log("测试 4: 复杂任务理解");
  console.log("=".repeat(60));

  const messages: Message[] = [
    {
      role: "system",
      content: `你是一个专业的学术文献追踪助手。你需要帮助用户：
1. 理解用户的研究需求
2. 推荐合适的论文搜索策略
3. 帮助组织和管理文献`,
    },
    {
      role: "user",
      content: `我正在做一个关于大语言模型在医疗领域应用的研究项目。
我需要：
1. 找到最新的相关论文（最近3个月）
2. 特别关注模型的准确性和可解释性
3. 建立一个追踪列表
你能帮我制定一个文献检索和管理计划吗？`,
    },
  ];

  try {
    const response = await callDeepSeek(messages, 0.8);
    const assistantReply = response.choices[0].message.content;

    console.log("\n用户需求:");
    console.log(messages[1].content);
    console.log("\n助手回复:");
    console.log(assistantReply);
    console.log("\n使用的 token 数:");
    console.log(`  - 输入: ${response.usage.prompt_tokens}`);
    console.log(`  - 输出: ${response.usage.completion_tokens}`);
    console.log(`  - 总计: ${response.usage.total_tokens}`);

    await saveTestResult("test4_complex_task", {
      test: "复杂任务理解",
      messages,
      response: assistantReply,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("❌ 测试失败:", error);
    return false;
  }
}

/**
 * 主测试函数
 */
async function runAllTests() {
  console.log("🧪 DeepSeek API 测试开始");
  console.log("使用模型: deepseek-chat");
  console.log("测试目的: 验证文献追踪助手在 DeepSeek 上的性能\n");

  const results = {
    timestamp: new Date().toISOString(),
    api_key: DEEPSEEK_API_KEY.substring(0, 10) + "...",
    tests: [] as any[],
  };

  // 运行所有测试
  const test1 = await test1_BasicConversation();
  results.tests.push({ name: "基本对话能力", passed: test1 });

  const test2 = await test2_LiteratureSearch();
  results.tests.push({ name: "文献搜索场景", passed: test2 });

  const test3 = await test3_MultiTurnConversation();
  results.tests.push({ name: "多轮对话能力", passed: test3 });

  const test4 = await test4_ComplexTask();
  results.tests.push({ name: "复杂任务理解", passed: test4 });

  // 生成测试报告
  console.log("\n" + "=".repeat(60));
  console.log("测试总结");
  console.log("=".repeat(60));

  const passedTests = results.tests.filter((t) => t.passed).length;
  const totalTests = results.tests.length;

  console.log(`\n通过测试: ${passedTests}/${totalTests}`);
  results.tests.forEach((test) => {
    console.log(`  ${test.passed ? "✅" : "❌"} ${test.name}`);
  });

  // 保存总结报告
  await saveTestResult("summary", results);

  console.log("\n🎉 所有测试完成！");
  console.log(`结果已保存到 test-results/ 目录`);
}

// 运行测试
if (import.meta.main) {
  try {
    // 确保结果目录存在
    await Deno.mkdir("./test-results", { recursive: true });
    await runAllTests();
  } catch (error) {
    console.error("❌ 测试执行失败:", error);
    Deno.exit(1);
  }
}
