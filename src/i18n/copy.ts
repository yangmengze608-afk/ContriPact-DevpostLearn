export type Language = 'en' | 'zh';

export const copy = {
  en: {
    brand: 'ContriPact', headline: 'Reward contribution. Protect the team.', headlineLine1: 'Reward contribution.', headlineLine2: 'Protect the team.',
    subheadLead: 'Turn awkward personal judgments into ', subheadStrong: 'shared, evidence-backed decisions.',
    landingEyebrow: 'AI-assisted contribution governance', enter: 'Enter demo case', principles: ['Rules first', 'Evidence visible', 'Team decides'],
    before: 'Before Project', after: 'After Project', preparedCase: 'Prepared competition case', caseTitle: 'Build With AI — Four-person competition team', rewardPool: 'Reward pool',
    brief: 'Competition brief', run: 'Analyze rules & planned work', rerun: 'Run analysis again', analyzing: 'Spark is analyzing…',
    judgingCriteria: 'Judging criteria', judgingQuestion: 'What actually drives the result?', contributionMap: 'Contribution map', contributionQuestion: 'Which planned work is likely to matter?',
    member: 'Member', noDirectCriterion: 'No direct scored criterion', humanCheckpoint: 'Human checkpoint', referenceQuestion: 'Use this as the shared planning reference?',
    referenceExplanation: 'AI evaluates expected contribution relevance. The team decides whether this map becomes the reference.', agreed: 'Contribution map agreed', agreedButton: '✓ Agreed', agree: 'Agree on this planning reference',
    analysisUnavailable: 'Analysis unavailable', unavailableExplanation: 'The original source stays visible. No fabricated analysis is substituted.', retry: 'Retry',
    afterLocked: 'Agree on the Before contribution map to unlock After Project.', aiAnalysis: 'AI analysis', actualEvidence: 'Actual contribution evidence', afterQuestion: 'What did the work actually contribute?',
    analyzeEvidence: 'Analyze actual contributions', reanalyzeEvidence: 'Re-run contribution analysis', analyzingEvidence: 'Spark is evaluating evidence…', rawEvidence: 'Raw evidence', aiInterpretation: 'AI interpretation',
    proposal: 'AI-assisted contribution proposal', proposalNote: 'Requires team agreement — not an objective fairness verdict.', suggestedShare: 'Suggested share', amount: 'Amount',
    validatedCache: 'Validated cache', liveInference: 'Live inference', total: 'Total', evidenceUsed: 'Evidence used',
    objection: 'Reason check', objectionQuestion: 'A member challenges the proposal', checkObjection: 'Check this objection', checkingObjection: 'Spark is checking the reason…',
    supportLabel: 'Support', ruleConnection: 'Rule connection', proposalDefended: 'Current proposal defended', reviseRequired: 'Fresh contribution analysis required',
    support: { supported: 'Supported', partially_supported: 'Partially supported', unsupported: 'Unsupported' },
    finalAgreement: 'Final agreement', acceptProposal: 'Accept current proposal', acceptedTitle: 'Team accepted the proposal',
    acceptedExplanation: 'AI evaluated contribution relevance and supplied a proposal. The team reviewed the reasoning and accepted the outcome.',
    aiRecommended: 'AI recommended', teamAccepted: 'Team accepted', finalAuthority: 'Final authority stays with the team.',
    relevance: { High: 'High', Medium: 'Medium', Supporting: 'Supporting' },
  },
  zh: {
    brand: 'ContriPact', headline: '让贡献得到应有回报。让团队免于内耗。', headlineLine1: '让贡献得到应有回报。', headlineLine2: '让团队免于内耗。',
    subheadLead: '把难以启齿的个人判断，变成', subheadStrong: '有据可循、由团队共同作出的决定。',
    landingEyebrow: 'AI 辅助的贡献治理', enter: '进入演示案例', principles: ['规则先行', '证据可见', '团队共决'],
    before: '项目开始前', after: '项目完成后', preparedCase: '预设竞赛案例', caseTitle: 'Build With AI — 四人竞赛团队', rewardPool: '奖励池',
    brief: '竞赛规则', run: '分析规则与计划任务', rerun: '重新分析', analyzing: 'Spark 正在分析…',
    judgingCriteria: '评审标准', judgingQuestion: '哪些因素真正决定比赛结果？', contributionMap: '贡献地图', contributionQuestion: '哪些计划工作最可能影响比赛结果？',
    member: '成员', noDirectCriterion: '无直接计分项', humanCheckpoint: '人工确认点', referenceQuestion: '将这份贡献地图作为团队共同参考？',
    referenceExplanation: 'AI 评估的是计划工作的预期贡献相关性；是否把这份地图作为共同参考，由团队决定。', agreed: '贡献地图已确认', agreedButton: '✓ 已确认', agree: '确认为赛前共同参考',
    analysisUnavailable: 'AI 分析暂不可用', unavailableExplanation: '原始规则或证据仍会保留在页面上，系统不会用伪造的分析结果替代失败。', retry: '重试',
    afterLocked: '先确认赛前贡献地图，才能进入项目完成后评估。', aiAnalysis: 'AI 分析', actualEvidence: '实际贡献证据', afterQuestion: '这些工作实际产生了什么贡献？',
    analyzeEvidence: '分析实际贡献', reanalyzeEvidence: '重新分析贡献', analyzingEvidence: 'Spark 正在评估证据…', rawEvidence: '原始证据', aiInterpretation: 'AI 解读',
    proposal: 'AI 辅助的贡献分配建议', proposalNote: '需要团队共同确认——这不是“客观公平”的最终裁决。', suggestedShare: '建议比例', amount: '对应金额',
    validatedCache: '已验证缓存', liveInference: '实时推理', total: '合计', evidenceUsed: '引用证据',
    objection: '异议理由检查', objectionQuestion: '一名成员对当前建议提出异议', checkObjection: '检查这条异议', checkingObjection: 'Spark 正在检查理由…',
    supportLabel: '支持程度', ruleConnection: '规则关联', proposalDefended: '当前分配建议维持不变', reviseRequired: '需要重新评估贡献后才能修改金额',
    support: { supported: '有依据', partially_supported: '部分有依据', unsupported: '缺乏依据' },
    finalAgreement: '最终确认', acceptProposal: '团队接受当前建议', acceptedTitle: '团队已接受这份建议',
    acceptedExplanation: 'AI 评估贡献与规则的相关性并提出建议；团队审阅理由后，最终由团队确认结果。',
    aiRecommended: 'AI 提出建议', teamAccepted: '团队最终确认', finalAuthority: '最终决定权始终属于团队。',
    relevance: { High: '高', Medium: '中', Supporting: '支持性' },
  },
} as const;

export const caseCopy = {
  en: {
    competitionBrief: 'Build With AI: Basics uses four equally weighted judging criteria: Design (25%): the project should feel complete and coherent as a product experience; Potential Impact (25%): it should make a credible case for solving a real problem for a real audience; Innovation/Idea (25%): it should show a creative, differentiated approach; Presentation (25%): the demo should show the project working end to end and clearly communicate the problem, audience, and value. The four criteria are equally weighted.',
    tasks: {
      T1: 'Build the end-to-end Before/After workspace and provider adapter.', T2: 'Build the automated model-evaluation harness, structured-output validators, and evidence-grounding checks.',
      T3: 'Design the bilingual ink-wash landing page and make rule/evidence links easy to inspect.', T4: 'Create the final demo video, narrative, and submission package.', T5: 'Coordinate final asset collection, deadline checks, and submission logistics.',
    },
    evidence: {
      A1: 'Implemented the complete Before/After React flow and the local/cloud AI provider adapter.', A2: 'Added analysis-unavailable fallback so the app never substitutes fake AI output when inference fails.',
      B1: 'Built Rules/Contribution/Objection model tests and found an early hallucination where the model invented a judging criterion.', B2: 'Reworked prompts and evidence IDs so every contribution judgment can be traced back to visible rules and evidence.',
      C1: 'Designed the bilingual commercial landing page and the workspace hierarchy linking rules, contribution value, and recommendation.', C2: 'Improved labels and evidence cards after a quick comprehension review so a reviewer can understand the core value in about one minute.',
      D1: 'Edited the final demo video and wrote the submission narrative explaining the problem and the Before/After flow.', D2: 'Coordinated final asset collection and uploaded the submission before the deadline.',
    },
    objections: {
      O1: 'I stayed awake all night, so I deserve 30% regardless of the judging criteria.',
      O2: 'My demo video is directly tied to the Presentation criterion, and D1 shows I produced that artifact. If the current assessment treats my work as merely administrative, it underweights a scored criterion.',
      O3: 'I was the informal team leader, so I should receive more even if that title is not part of the competition rules or contribution evidence.',
    },
  },
  zh: {
    competitionBrief: 'Build With AI: Basics 采用四项等权评审标准：设计（25%）：项目应呈现完整、连贯的产品体验；潜在影响（25%）：项目应可信且具体地说明自己为真实受众解决了真实问题；创新 / 想法（25%）：方案应具有创造性和辨识度；展示（25%）：演示应展示项目端到端运行，并清楚说明问题、受众与价值。四项标准等权。',
    tasks: {
      T1: '搭建完整的 Before / After 工作区与 AI Provider 适配层。', T2: '搭建自动化模型评测工具、结构化输出校验器与证据溯源检查。',
      T3: '设计中英双语水墨风入口，并让规则与证据关联易于检查。', T4: '制作最终演示视频、叙事结构与提交材料。', T5: '协调最终素材收集、截止时间检查与提交事务。',
    },
    evidence: {
      A1: '完成 Before / After React 全流程，并实现本地 / 云端 AI Provider 适配层。', A2: '加入“分析不可用”兜底，推理失败时绝不伪造 AI 结果。',
      B1: '搭建规则 / 贡献 / 异议模型测试，并发现模型早期曾虚构评审标准。', B2: '重构提示词与证据 ID，让每个贡献判断都能追溯到可见规则与证据。',
      C1: '设计双语商业入口与工作区信息层级，把规则、贡献价值和分配建议串联起来。', C2: '根据快速理解测试优化标签和证据卡片，让评审约一分钟内理解核心价值。',
      D1: '剪辑最终演示视频，并撰写解释问题与 Before / After 流程的提交叙事。', D2: '协调最终素材收集，并在截止时间前完成提交上传。',
    },
    objections: {
      O1: '我熬了一整夜，所以不管评审标准是什么，我都应该拿到 30%。',
      O2: '我的演示视频直接对应“展示”评审项，而且 D1 能证明这项成果由我完成。如果当前评估只把我的工作当作行政支持，就会低估一个明确计分项。',
      O3: '我是团队里非正式的负责人，所以即使这个身份不在比赛规则或贡献证据里，我也应该拿更多。',
    },
  },
} as const;

const criterionZh: Record<string, string> = {
  Design: '设计', 'Potential Impact': '潜在影响', 'Innovation/Idea': '创新 / 想法', Presentation: '展示',
};
const criterionReasonZh: Record<string, string> = {
  Design: '占比 25%，重点看项目是否形成完整、连贯的产品体验。', 'Potential Impact': '占比 25%，重点看项目是否可信且具体地解决真实受众的真实问题。',
  'Innovation/Idea': '占比 25%，重点看方案是否具有创造性和辨识度。', Presentation: '占比 25%，重点看演示能否端到端展示产品，并清楚表达问题、受众与价值。',
};
const criterionQuoteZh: Record<string, string> = {
  Design: '设计（25%）', 'Potential Impact': '潜在影响（25%）', 'Innovation/Idea': '创新 / 想法（25%）', Presentation: '展示（25%）',
};
const taskReasonZh: Record<string, string> = {
  T1: '搭建核心工作区与 Provider 适配层，直接支撑完整产品体验与问题解决能力。', T2: '建立模型评测、结构校验和证据溯源能力，支撑产品完整性与差异化 AI 方法。',
  T3: '通过双语水墨界面与可检查的规则 / 证据关联，直接支撑设计与展示。', T4: '负责最终演示与提交材料，直接支撑“展示”评审项。', T5: '负责提交协调与截止检查，属于支持性工作，本身不对应直接计分项。',
};

const objectionReasonZh: Record<string, string> = {
  O1: '熬夜本身没有连接到任何比赛评审标准或可验证贡献证据，因此不能据此改变当前贡献评估。',
  O2: 'D1 明确显示该成员制作了演示视频，这直接对应“展示”；但当前贡献评估已经认可了这项工作，因此无需修改分配。',
  O3: '“非正式负责人”这个身份本身没有出现在评审标准或贡献证据中，因此不能据此改变当前贡献评估。',
};

const afterReasonZh: Record<string, string> = {
  A: '核心产品流程、Provider 适配与失败兜底直接支撑完整产品体验与潜在影响。',
  B: '模型评测、结构校验与证据溯源提升了产品完整性，并形成更有辨识度的 AI 方法。',
  C: '双语入口与清晰的信息层级直接支撑设计与展示。',
  D: '演示视频与提交叙事直接支撑“展示”评审项；提交协调属于支持性工作。',
};

export function presentCriterionName(language: Language, name: string) { return language === 'zh' ? criterionZh[name] ?? name : name; }
export function presentCriterionReason(language: Language, name: string, modelReason: string) { return language === 'zh' ? criterionReasonZh[name] ?? modelReason : modelReason; }
export function presentCriterionQuote(language: Language, name: string, modelQuote: string) { return language === 'zh' ? criterionQuoteZh[name] ?? modelQuote : modelQuote; }
export function presentTaskReason(language: Language, taskId: string, modelReason: string) { return language === 'zh' ? taskReasonZh[taskId] ?? modelReason : modelReason; }
export function presentAfterReason(language: Language, member: string, modelReason: string) { return language === 'zh' ? afterReasonZh[member] ?? modelReason : modelReason; }
export function presentAfterSummary(language: Language, modelSummary: string) { return language === 'zh' ? '建议比例基于当前可见规则与贡献证据，用于团队讨论，而不是对“公平”的最终裁决。' : modelSummary; }

export function presentObjectionReason(language: Language, objectionId: string, modelReason: string) { return language === 'zh' ? objectionReasonZh[objectionId] ?? modelReason : modelReason; }
