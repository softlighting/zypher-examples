#!/bin/bash

# DeepSeek API 测试脚本（使用 curl）
# 测试文献追踪助手的核心功能

DEEPSEEK_API_KEY="sk-50ef015b4dbe4bb893c19e0b70c4cc9a"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"
RESULTS_DIR="./test-results"

# 确保结果目录存在
mkdir -p "$RESULTS_DIR"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 DeepSeek API 测试开始"
echo "使用模型: deepseek-chat"
echo "测试目的: 验证文献追踪助手在 DeepSeek 上的性能"
echo ""

# 测试 1: 基本对话能力
echo "============================================================"
echo "测试 1: 基本对话能力"
echo "============================================================"
echo ""

TEST1_PAYLOAD=$(cat <<'EOF'
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的学术文献追踪助手，帮助研究人员追踪和管理最新的学术论文动态。"
    },
    {
      "role": "user",
      "content": "你好！请介绍一下你的功能。"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
EOF
)

echo -e "${BLUE}发送请求到 DeepSeek API...${NC}"
RESPONSE=$(curl -s -X POST "$DEEPSEEK_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d "$TEST1_PAYLOAD")

# 保存原始响应
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
echo "$RESPONSE" > "$RESULTS_DIR/test1_basic_conversation_$TIMESTAMP.json"

# 解析并显示结果
if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ 测试成功${NC}"
    echo ""
    echo "助手回复:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])" 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "Token 使用:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); usage=data.get('usage',{}); print(f\"  输入: {usage.get('prompt_tokens',0)}\n  输出: {usage.get('completion_tokens',0)}\n  总计: {usage.get('total_tokens',0)}\")" 2>/dev/null
else
    echo -e "${RED}❌ 测试失败${NC}"
    echo "错误响应:"
    echo "$RESPONSE"
fi

echo ""
echo "结果已保存到: $RESULTS_DIR/test1_basic_conversation_$TIMESTAMP.json"
echo ""

# 测试 2: 文献搜索场景
echo "============================================================"
echo "测试 2: 文献搜索场景模拟"
echo "============================================================"
echo ""

TEST2_PAYLOAD=$(cat <<'EOF'
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的学术文献追踪助手。你可以帮助用户：\n1. 搜索最新的学术论文\n2. 追踪感兴趣的论文\n3. 管理研究主题\n4. 获取论文详细信息\n\n你有以下工具可用：\n- search_papers: 搜索学术论文\n- track_paper: 管理追踪的论文\n- manage_topics: 管理研究主题\n- get_paper_details: 获取论文详情"
    },
    {
      "role": "user",
      "content": "我想搜索最新的关于 transformer 架构的论文，你能帮我吗？"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
EOF
)

echo -e "${BLUE}发送请求到 DeepSeek API...${NC}"
RESPONSE=$(curl -s -X POST "$DEEPSEEK_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d "$TEST2_PAYLOAD")

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
echo "$RESPONSE" > "$RESULTS_DIR/test2_literature_search_$TIMESTAMP.json"

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ 测试成功${NC}"
    echo ""
    echo "助手回复:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])" 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "Token 使用:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); usage=data.get('usage',{}); print(f\"  输入: {usage.get('prompt_tokens',0)}\n  输出: {usage.get('completion_tokens',0)}\n  总计: {usage.get('total_tokens',0)}\")" 2>/dev/null
else
    echo -e "${RED}❌ 测试失败${NC}"
    echo "错误响应:"
    echo "$RESPONSE"
fi

echo ""
echo "结果已保存到: $RESULTS_DIR/test2_literature_search_$TIMESTAMP.json"
echo ""

# 测试 3: 复杂任务
echo "============================================================"
echo "测试 3: 复杂任务理解"
echo "============================================================"
echo ""

TEST3_PAYLOAD=$(cat <<'EOF'
{
  "model": "deepseek-chat",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的学术文献追踪助手。你需要帮助用户：\n1. 理解用户的研究需求\n2. 推荐合适的论文搜索策略\n3. 帮助组织和管理文献"
    },
    {
      "role": "user",
      "content": "我正在做一个关于大语言模型在医疗领域应用的研究项目。\n我需要：\n1. 找到最新的相关论文（最近3个月）\n2. 特别关注模型的准确性和可解释性\n3. 建立一个追踪列表\n你能帮我制定一个文献检索和管理计划吗？"
    }
  ],
  "temperature": 0.8,
  "max_tokens": 2000
}
EOF
)

echo -e "${BLUE}发送请求到 DeepSeek API...${NC}"
RESPONSE=$(curl -s -X POST "$DEEPSEEK_API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d "$TEST3_PAYLOAD")

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
echo "$RESPONSE" > "$RESULTS_DIR/test3_complex_task_$TIMESTAMP.json"

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ 测试成功${NC}"
    echo ""
    echo "助手回复:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])" 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "Token 使用:"
    echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); usage=data.get('usage',{}); print(f\"  输入: {usage.get('prompt_tokens',0)}\n  输出: {usage.get('completion_tokens',0)}\n  总计: {usage.get('total_tokens',0)}\")" 2>/dev/null
else
    echo -e "${RED}❌ 测试失败${NC}"
    echo "错误响应:"
    echo "$RESPONSE"
fi

echo ""
echo "结果已保存到: $RESULTS_DIR/test3_complex_task_$TIMESTAMP.json"
echo ""

echo "============================================================"
echo "🎉 所有测试完成！"
echo "============================================================"
echo "测试结果已保存到 $RESULTS_DIR/ 目录"
