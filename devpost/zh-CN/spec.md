---
doc: spec
status: approved
lang: zh-CN
source: ../spec.md
---

# ContriPact — Build With AI 技术规格（中文审阅稿）

> 英文 `devpost/spec.md` 是 canonical source；本文件用于中文审阅。技术含义应与英文版保持一致。

## 一句话先说清楚它怎么工作

ContriPact 这版不是完整生产系统，而是一个固定四人竞赛案例的本地 Web POC。

浏览器负责用户看得见、且不需要 AI 判断的部分：落地页、语言切换、Before/After 切换、展示规则和证据、把百分比换算成 ¥12,000 的金额、最终 Accept 状态。

一个很薄的本地 Node/Express 服务专门包住 AI：它把**已经准备好的竞赛规则 / 任务 / 成员证据 / 异议**送给模型，并要求模型只能返回受 JSON Schema 限制的结构化结果。服务端再次检查模型是否引用了真实存在的 criterion 和 evidence，只有验证通过的数据才能进入 UI。

AI 只做三类判断：
1. 从竞赛 brief 中提取真正影响结果的评分标准；
2. 判断某项计划任务或真实贡献与这些标准的相关性，并在 After 阶段给出可争议的奖励 proposal；
3. 检查一个异议是否真的有规则 / 证据依据，以及它是否足以改变原贡献判断。

如果 AI 失败，产品显示 **Analysis unavailable**，原始规则和证据仍然在；绝不拿预写的“AI 风格文本”假装成功。

`High / Medium / Supporting` 描述的是**任务或贡献 bundle 对比赛结果的相关性**，不是给某个人贴“高价值 / 低价值”标签。

## 用户路径

对应 `prd.md > The Core Journey`。

1. 用户进入黑白 + 水墨商业落地页，默认英文，可切中文；切换语言不会重置 Demo 状态。
2. 点击主 CTA 进入固定的四人案例，奖金池 ¥12,000。
3. **Before Project**：展示竞赛原文 → AI 提取评分标准 → AI 把计划任务连到标准 → 团队确认 contribution map。此时不分钱。
4. 团队确认后的 map 只是一个赛前共同参考，不是预先决定谁拿多少钱。
5. **After Project**：展示四个人真实完成的贡献证据 → AI 判断每个人最重要的 contribution bundle 与哪些竞赛标准相关 → 给出奖励百分比 proposal。
6. 服务端只接受可追溯结果：成员必须存在、evidence 必须属于该成员、criterion 必须是当前竞赛真实标准、四人百分比必须总和 100%。
7. 浏览器用确定性公式把百分比换成 ¥12,000 中的金额。
8. 一名成员提出异议。每次只检查**一个 objection**，AI 必须指出一个最直接的 criterion（或 `NONE`）和对应 evidence，并说明是否真的改变贡献判断。
9. 如果异议有依据但不足以改变贡献判断，产品明确解释为什么 proposal 保持不变；若未来某个异议真的改变判断，则必须重新跑完整贡献分析后才能展示新金额。
10. 团队点击 Accept；最终页面明确写清：AI 给的是贡献相关性分析和 proposal，最后同意的是人。

## 架构

```text
┌──────────────────────────── React + Vite 浏览器 ────────────────────────────┐
│ Landing / 语言 / Before-After / 证据 / proposal / objection / final accept │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ localhost JSON
                                   ▼
┌──────────────────────── Express AI 边界层 ─────────────────────────────────┐
│ Route → 输入校验 → Prompt → AI Provider → Schema → 业务交叉校验           │
│                                 │                                          │
│                                 └── Spark-X2.5 本地 Ollama                 │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
                      固定 Demo 数据：规则 / 任务 / 证据 / ¥12,000
```

产品逻辑与模型实现解耦。之后换模型，不需要重写 React 用户路径或治理语义。

## 技术栈

### 前端
- **React 19.3 + TypeScript**：足够实现单一工作区与有限状态流，不需要 Next.js 这类更重框架。
- **Vite 8.x**：本地开发和打包简单快速。
- **原生 CSS / CSS Modules**：水墨视觉是定制设计，用 UI 框架反而要大量覆盖默认样式。
- **React reducer/context**：不额外引入 Redux/Zustand；一个固定案例不需要。
- **typed bilingual copy dictionary**：只有英中两套固定产品文案，不引入完整 i18n 库。

### 本地服务
- **Node.js 24 LTS**：作为公开项目的支持基线。当前电脑安装的 Node 25.9.0 已经 EOL，不应该拿它当项目标准。
- **Express 5.x**：只做四个窄 AI route。
- **Zod 4.x**：服务端输入 / 输出与业务交叉校验。
- **原生 fetch**：调用 Ollama，不额外上 AI SDK。

### AI
- **Ollama >= 0.34.1**；当前机器是 0.40.1。
- **默认 provider：Spark-X2.5-4B Q4_K_M**，本地运行。
- 最终产品参数：`num_ctx=8192`、`think=false`、`temperature=0`、固定 `seed=42`、`top_p=0.9`、不同任务独立的 output-token cap。
- 这些参数不是为了刷 benchmark，而是为了**可重复、可控、短输出**。
- 目前不把云模型接入 POC critical path。最终四阶段 Gate 已连续 3 轮通过；保留 provider interface，但没有证据需要时不增加付费依赖。

## 在哪里跑、别人怎么试

这版评审 POC 以本地 macOS 运行 + 公共 GitHub + 1–3 分钟录屏为主。为了证明本地模型，不需要先解决“如何把 Ollama 4B 部署到公网”。

启动目标：

```bash
npm install
npm run dev
```

浏览器：

```text
http://localhost:5173
```

Vite 将 `/api/*` 代理到本地 Express；浏览器不直接碰 Ollama。

录制 Demo 前可以先真实跑一次分析，并保持同一个 server process。**只有通过验证的真实结果**可以进入内存 cache。这样视频里不用让评委等 20–30 秒，但仍然不是 fake AI。

开发时 `force=true` 可以绕过 cache 重新推理。服务器重启后 cache 清空。

## 视觉

对应 `prd.md > Look and Feel`。

- 黑 / 白 / 暖白 / 墨灰；状态色克制使用。
- 大标题偏 serif / 宋体气质；证据、标签、数字用干净 sans-serif。
- Landing 更商业、更艺术；轻量 canvas/CSS 做指针水波 / 墨扩散，但必须在文字之后、不能遮 CTA、不能影响点击。
- Workspace 更密但保持冷静，必须让用户一眼看到：**rule → contribution → recommendation**。
- 禁止 neon AI、金融终端感、卡通“公平秤”。
- 默认英文；中文是同一状态下的文案切换，而不是两套产品。

## 关键组件

### Commercial Landing
对应 `prd.md > Commercial Entry`。

`LandingPage` 只负责 approved headline/copy、语言按钮、水墨交互、进入 Demo 的 CTA。这里完全不需要 AI。

### Demo Case + 状态机
对应 `prd.md > States and Boundaries`。

React 内存 state 只保存：
- language；
- 当前 Landing / Before / After / Final；
- Before map 是否已同意；
- 已验证规则分析；
- 已验证贡献分析；
- objection 结果；
- final accepted；
- 每个分析任务的 loading/error。

刷新可以重置；持久化本来就不属于本 POC。

### Rule Analysis
对应 `prd.md > Competition Rule Analysis`。

模型返回：
- 精确 criterion 名称；
- 整数权重；
- 简短 reason；
- 来自原 brief 的短原文 quote。

服务端检查：
- 权重总和 100；
- quote 真正存在于 brief；
- 不允许第五个凭空标准。

**重要性标签不再让 AI 生成。** UI 直接从数字权重派生，当前 Build With AI: Basics 预设案例采用四项官方等权标准，每项 25%，UI 不再要求模型生成额外的重要性标签。

### Before Contribution Planning
对应 `prd.md > Before-Project Contribution Planning`。

输入：validated criteria + prepared planned tasks。

每个任务输出：
- task ID；
- exact criterion；
- `High | Medium | Supporting`；
- 规则依据 reason。

这些等级描述“任务对竞赛结果可能多重要”，不是成员价值；此阶段绝不出现分钱。

### After Contribution Evaluation
对应 `prd.md > After-Project Contribution Evaluation`。

每位成员输出一个“最重要贡献 bundle”：
- member ID；
- 一个或多个真实 evidence ID；
- 一个或多个 exact criterion；
- bundle 的 `High | Medium | Supporting` relevance；
- 简短 reason；
- suggested reward share percent。

Schema 会把 criterion 和 evidence 限死在当前案例真实枚举中；服务端进一步检查 evidence 是否真的属于这位成员。

原始证据与 AI interpretation 必须分开显示。

### Reward Recommendation
对应 `prd.md > Reward Recommendation`。

只有同时满足下列条件才展示 proposal：
- A/B/C/D 各出现一次；
- evidence 全部真实且归属正确；
- criterion 全合法；
- 四人百分比正好 100%。

金额不让模型算：

```text
amountCny = 12000 × suggestedSharePercent / 100
```

由于使用整数百分比，¥12,000 可以精确拆分为 ¥120 的倍数。

UI 标签：**AI-assisted contribution proposal — requires team agreement**。

### Objection Check
对应 `prd.md > Objection and Reason Check`。

真实产品一次只检查一个 objection。

输出：
- objection ID；
- `supported | partially_supported | unsupported`；
- 一个 exact criterion 或 `NONE`；
- evidence IDs；
- 是否改变原 contribution assessment；
- `keep | revise`；
- concise reason。

交叉规则：
- unsupported → `NONE` + 无 evidence + 不改变 assessment + `keep`；
- supported / partially supported → 必须连到真实 criterion，并在有证据时引用 evidence；
- `changes=false` → `keep`；
- `changes=true` → `revise`，但不能直接让 objection 模型随手改钱，必须重新跑完整 contribution analysis 后才能展示新金额。

因此，“你的理由确实和评分标准有关”不等于“你一定应该多拿钱”。Objection 调用读取的是本轮真实、已验证的 After assessment，而不是另一份静态 baseline。

### Final Agreement
对应 `prd.md > Final Agreement`。

最终页面展示当前通过验证的 allocation + 关键 reasoning，用户点击 Accept 后进入本地 `accepted=true` 状态。

必须明确：**AI recommended; the team accepted.**

### Analysis unavailable
任何 AI 环节失败都统一：
- 原始规则 / 证据继续显示；
- 当前操作的未验证结果清空；
- 显示 Analysis unavailable + Retry；
- 绝不塞一个预写的“成功答案”。

## Provider 接口

```ts
interface ContributionAIProvider {
  analyzeRules(input: RulesInput): Promise<RulesAnalysis>;
  analyzeBefore(input: BeforeInput): Promise<BeforeAnalysis>;
  analyzeAfter(input: AfterInput): Promise<AfterAnalysis>;
  checkObjection(input: ObjectionInput): Promise<ObjectionCheck>;
}
```

首版只有 `OllamaSparkProvider` 实现。Route 不知道 Spark prompt 细节，Provider 也不知道 React 状态。

## 数据模型

### 固定 DemoCase

```ts
type DemoCase = {
  id: string;
  version: string;
  prizePoolCny: 12000;
  competitionBrief: string;
  plannedTasks: PlannedTask[];
  members: Member[];
  evidence: EvidenceItem[];
  preparedObjection: Objection;
};
```

案例是 committed immutable fixture。

### 浏览器状态
React 内存；language 可选同步 localStorage。刷新可以重置 Demo。

### AI 结果
服务端验证通过后才进入浏览器；服务端也可以按 `operation + scenario version + input hash` 存一份进程内 cache。

### Final agreement
只存在 React 内存，不做审计数据库。

## Ollama Contract

```text
POST http://127.0.0.1:11434/api/chat
```

核心 payload：

```json
{
  "model": "contripact-spark-x2.5-4b-q4",
  "messages": ["system + 一个任务专用 user message"],
  "stream": false,
  "think": false,
  "format": "task-specific JSON Schema",
  "options": {
    "num_ctx": 8192,
    "temperature": 0,
    "seed": 42,
    "top_p": 0.9,
    "num_predict": "按任务限制"
  }
}
```

不请求、不保存、不展示 chain-of-thought；只展示简短、可回到 evidence 的 reason。

## Server API

```text
POST /api/analyze/rules
POST /api/analyze/before
POST /api/analyze/after
POST /api/analyze/objection
```

统一 envelope：

```ts
type AnalysisEnvelope<T> =
  | { ok: true; data: T; cached: boolean }
  | { ok: false; error: "MODEL_UNAVAILABLE" | "INVALID_MODEL_OUTPUT" | "TIMEOUT" };
```

## 文件结构

```text
ContriPact-DevpostLearn/
├── src/
│   ├── app/App.tsx
│   ├── app/demoReducer.ts
│   ├── components/landing/{LandingPage,InkField}.tsx
│   ├── components/workspace/
│   │   ├── Workspace.tsx
│   │   ├── ModeSwitch.tsx
│   │   ├── RulePanel.tsx
│   │   ├── BeforeMap.tsx
│   │   ├── MemberEvidence.tsx
│   │   ├── RewardProposal.tsx
│   │   ├── ObjectionPanel.tsx
│   │   └── FinalAgreement.tsx
│   ├── components/common/AnalysisState.tsx
│   ├── data/demoCase.ts
│   ├── i18n/copy.ts
│   ├── lib/{api,money}.ts
│   └── styles/
├── server/
│   ├── index.ts
│   ├── routes/analysis.ts
│   ├── ai/{provider,ollamaSpark,prompts,schemas,validate}.ts
│   └── cache/analysisCache.ts
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   ├── spec.html
│   ├── model-gate/
│   └── zh-CN/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

模型二进制、`node_modules`、`.env`、KIOXIA 绝对路径不进 Git。

## 外部依赖

### Ollama
本地 AI runtime。停止或找不到模型时，返回 MODEL_UNAVAILABLE；UI 不伪造成功结果。

### Spark-X2.5-4B GGUF
默认本地模型，Q4_K_M。Gate 使用官方 `XHToken/Spark-X2.5-4B-GGUF` 文件。

### 不需要的东西
本 POC critical path 不需要：Supabase、Auth、Analytics、云模型 API、支付、OCR、GitHub/Figma/Docs connector。

## 失败模式

- Ollama 没开 / model alias 不存在 → Analysis unavailable。
- JSON Schema 合法但业务不合法（证据归属错、比例不是 100%、异议字段自相矛盾）→ INVALID_MODEL_OUTPUT，不自动“修成看起来对”。
- 本地推理慢 → honest loading；视频前允许真实 warm cache。
- 水墨效果影响可读性 / 性能 → 直接关特效，产品功能优先。

## 为什么做这些简化

- 固定一个真实案例，而不是先做文件上传和 OCR：我们要证明的是规则 → 贡献，而不是 parser。
- 不做账号 / DB：不会增强 60 秒核心价值。
- 首版 provider interface 只实现 Spark：没有证据需要时不增加付费 fallback。
- importance 从数字权重派生：不要让 AI 重复一个可确定的事实。
- relevance 评工作，不评人：更符合 ContriPact 的治理边界。
- 一次一个 objection：与真实交互一致，也更稳。
- 真实 validated memory cache：提升 Demo 节奏，但不是 fake fallback。

## Spark Gate 最终结果

运行 contract：8K context、`think=false`、Schema enum、一次一个 objection、`temperature=0`、固定 `seed=42`。

Shipping 阶段将预设案例修正为当前四项等权标准：`Design`、`Potential Impact`、`Innovation/Idea`、`Presentation`。修正后 Spark-X2.5-4B 连续完成 **3/3 完整 Rules → Before → After → Objection Gate**，四个阶段的结构化输出在三轮中均逐项完全一致。

稳定 After proposal 为：**B 35% / A 30% / C 20% / D 15%**。Prepared O2 三轮均一致识别为：`Presentation` + `D1`，`supported`，不改变 contribution assessment，因此 `keep` 当前建议。

冷推理 wall time 波动较大：Rules 12.256–27.893s，Before 26.605–47.651s，After 23.045–60.954s，三条 objection 批次 24.038–34.524s。因此录屏前允许先用真实推理 warm validated in-memory cache。已在干净产品 server 上验证：第一遍 Rules / Before / After / O2 全部为 `live`，第二遍全部命中 `cache`，没有 seeded / fake fallback。

当前最终证据保存在 `model-gate/stability-final/`；旧 provisional rubric 的三轮结果保存在 `model-gate/stability-provisional-rubric/`，仅作为开发过程历史，不再作为当前提交证据。

这支持 Spark-X2.5-4B 作为这个**固定、强 schema 约束 POC**的本地 provider；不代表 4B 模型已经适合任意真实工资 / 奖金争议。

## 当前技术决策

- React/Vite + 极薄 Express，本地优先。
- Node 24 LTS。
- Spark-X2.5-4B Q4_K_M 默认 provider。
- Schema + 独立业务校验双层约束。
- `think=false`。
- `temperature=0` + `seed=42`，相同输入必须可复现。
- rule importance 不由 AI 生成。
- relevance 描述工作，不描述人的价值。
- objection 一次一个。
- 可 warm 真实 validated memory cache；不允许 fake fallback。
