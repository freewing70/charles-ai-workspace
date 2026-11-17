---
id: "llm-structured-outputs-json-schema-guide"
title: "終結 AI 格式崩潰：LLM 結構化輸出（Structured Outputs & JSON Schema）在企業自動化管線的 100% 穩定實作"
type: "tutorial"
category: "AI Architecture"
summary: "在 Prompt 裡寫「請只回傳 JSON」為什麼在生產環境依然有 5–15% 失敗率？本文深入解析 Constrained Decoding（CFG 與 FSM Logits Token 遮罩）如何從數學與解碼層確保 100% Schema 合規，並提供 OpenAI、Gemini responseSchema、Claude Tool Use 與本地 vLLM guided_json 的完整 TypeScript/Zod 與 Python/Pydantic 實戰代碼，同時涵蓋 Refusal 處理、Partial JSON 串流與 Union Types 陷阱。"
created: "2026-11-13"
updated: "2026-11-13"
version: "1.0"
status: "active"
visibility: "public"
tags: ["Structured Outputs", "JSON Schema", "Constrained Decoding", "Zod", "Pydantic", "vLLM", "Gemini", "企業自動化"]
tools: ["OpenAI API", "Gemini API", "Claude API", "vLLM / xgrammar", "TypeScript + Zod", "Python + Pydantic"]
cover: "/assets/covers/llm-structured-outputs-json-schema-guide.png"
featured: true
---

## 導言：為什麼「請只回傳純 JSON」是企業自動化管線的未爆彈？

幾乎每位 AI 工程師在開發第一條自動化管線時，都寫過類似這樣的 Prompt：

> 「請從這封客戶信件中擷取訂單資訊，**請務必只回傳合法的 JSON，絕對不要加上任何額外說明文字或 Markdown 標籤！**」

在開發測試跑 5 筆資料時，看起來完美無缺；但只要放進每天處理 10,000 筆工單、發票或醫療報表的生產環境，這個管線就會固定以 **5% 到 15% 的機率崩潰**，留下滿地 `SyntaxError: Unexpected token` 的半夜告警。

原因不在於模型不夠聰明，而是因為**「用自然語言約束機率分佈，本質上永遠無法達到 100% 確定性」**：
1. **Markdown 標籤幻覺**：模型在預訓練語料中看過太多技術文件，忍不住在開頭加上 ```` ```json ````，結尾加上 ```` ``` ````。
2. **尾端逗號與截斷括號**：當單據欄位變多或輸出逼近 `max_tokens`，JSON 最後一個元素多了一個 `,`，或是漏了最後的 `}`。
3. **型別漂移與幻覺鍵名**：Schema 寫的是 `amount: number`，模型卻因為圖片上的文字寫著「約四千五百元」，而貼心地吐出 `"amount": "4,500 TWD"`，直接弄掛後端資料庫的強型別寫入。
4. **禮貌性開場白**：遇到模糊輸入時，模型會先回一句「好的，這是我為您整理的資料：」，讓 `JSON.parse()` 瞬間死亡。

要徹底終結格式崩潰，靠的不是把 Prompt 寫得更兇（例如加上「如果不遵守我就拔掉你的電源」），而是把約束從**「語義層（Prompt）」下沉到「解碼器物理層（Constrained Decoding）」**。

---

## ⚙️ 底層原理解密：Constrained Decoding 如何做到 100% 合規？

在標準的文字生成過程中，LLM 每產生一個 Token（`Step t`），會針對整個詞彙表（通常包含 100,000 至 256,000 個 Tokens）輸出一組原始分數向量 **Logits**，再經過 Softmax 轉為機率分布進行抽樣。

傳統的 Prompt 約束，只是試圖透過語氣提高合法 Token 的機率，但非法 Token 的機率依然大於 0；只要採樣次數一多，小機率事件必然發生。

而 **Constrained Decoding（受限解碼）** 的核心機制則徹底改寫了這個流程：

![從「Prompt 祈禱」到「Logits 層 FSM Token 遮罩」的 100% 穩定管線](/assets/diagrams/llm-structured-outputs-json-schema-guide-arch.svg)

### 三步驟運作原理（CFG + FSM Token Masking）
1. **Schema 編譯為文法狀態機**：在請求開始前，推論引擎（如 OpenAI 內部引擎、vLLM 整合的 `xgrammar` / `Outlines`）會將你傳入的 JSON Schema 編譯成**上下文無關文法（Context-Free Grammar, CFG）**與**確定性有限狀態機（Deterministic Finite Automaton, FSM）**。
2. **即時計算合法遮罩（Bitmask）**：在解碼的每一步 `t`，狀態機知道目前 JSON 走到哪個位置。舉例來說，如果剛輸出完 `{"invoice_id": `，狀態機就知道下一個合法字符**只能**是雙引號 `"` 開頭的字串 Token。
3. **Logits 物理歸零（Logit Bias = -inf）**：推論引擎會將詞彙表中所有違反當前 FSM 狀態的 Token（例如 ```` ``` ````、中文開場白、數字或裸露的字母），其對應的 Logit 強制設為負無窮大：

```text
Masking 公式（解碼層物理攔截）：
Logit_masked(token) = Logit_raw(token)   if token in Valid_FSM_Set(state_t)
                    = -infinity          otherwise

經過 Softmax 後：
P(invalid_token) = exp(-infinity) / Z = 0.000000%
```

換句話說，在 Constrained Decoding 的保護下，模型**在物理層面上根本吐不出任何一個不合 Schema 的字元**。即便是面對 `temperature = 0.7` 的隨機採樣，它依然能維持 100% 的語法與結構合規性。

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 傳統 JSON Mode (舊式 json_object)</span>
    <p><strong>只保證「輸出是合法 JSON」，不管結構對不對：</strong></p>
    <ul>
      <li>模型不會加上 Markdown 反引號，JSON 語法也正確。</li>
      <li>但模型依然可能把 `price` 寫成 `totalPrice`，或漏掉必填欄位 `currency`。</li>
      <li>後端還是必須寫大量防禦性 `if/else` 與 Retry 邏輯。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ Structured Outputs (嚴格 Schema 綁定)</span>
    <p><strong>連鍵名、巢狀結構、Enum 與型別都 100% 鎖死：</strong></p>
    <ul>
      <li>強制符合 `required`、`additionalProperties: false` 與精確型別。</li>
      <li>列舉值（Enum）只能在指定選項中挑選，徹底消滅同義詞飄移。</li>
      <li>後端直接無痛反序列化成強型別物件，零 Parser 錯誤。</li>
    </ul>
  </div>
</div>

---

## 🌐 四大主流平台實戰對照與程式碼實作

不同模型供應商對 Structured Outputs 的實作參數與支援邊界略有差異，工程團隊在切換模型或做多模型備援（Fallback）時，務必先掌握這張架構對照表：

| 平台 / 引擎 | 核心啟用參數 | 底層支援細節與限制 | 推薦生態系工具 |
| :--- | :--- | :--- | :--- |
| **OpenAI (Responses / Chat API)** | `text.format: { type: "json_schema", strict: true }` | 必須設定 `additionalProperties: false`，且所有物件欄位皆須列入 `required`（可選欄位改用 `["string", "null"]`）。 | TypeScript `zodResponseFormat` / Python `client.responses.parse` |
| **Google Gemini API** | `generationConfig.responseMimeType = "application/json"` + `responseSchema` | 原生支援極深巢狀與 `enum`，可透過 `propertyOrdering` 控制欄位輸出順序以提升推理品質。 | `@google/genai` SDK + Type.OBJECT / `google-genai` Pydantic |
| **Anthropic Claude API** | `output_config.format`（新版）或 `tools` + `tool_choice: { type: "tool" }` | 經典穩定解法是定義一個單一 Tool 並強制 `tool_choice` 呼叫；最新 API 亦已支援原生 JSON Schema 輸出。 | `@anthropic-ai/sdk` + Zod-to-JSON-Schema |
| **自架 vLLM / SGLang** | `extra_body: { guided_json: schema }`（或 `response_format`） | 透過 `xgrammar` 或 `Outlines` 在 GPU 伺服器本地執行 FSM 遮罩，首個 Schema 請求會有毫秒級編譯快取。 | OpenAI 相容 Client + Pydantic `.model_json_schema()` |

### 實戰一：TypeScript + Zod 跨 OpenAI 與 Gemini 雙引擎實作

在 TypeScript 全端專案（如 Next.js / Astro / Node.js Worker）中，**永遠只維護一份 Zod Schema 作為單一真相來源（Single Source of Truth）**，絕不要手寫重複的 JSON Schema 字串。

```typescript
// invoice-extractor.ts
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { GoogleGenAI } from "@google/genai";

// 1. 定義嚴格的商業邏輯契約 (Single Source of Truth)
export const InvoiceExtractionSchema = z.object({
  status: z.enum(["extracted", "needs_human_review"]).describe("若單據模糊無法辨識則選 needs_human_review"),
  invoiceNumber: z.string().nullable().describe("發票號碼，找不到則為 null"),
  currency: z.enum(["TWD", "USD", "JPY", "EUR"]),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number(),
    })
  ),
  totalAmount: z.number(),
  // 預留安全與業務拒答欄位，避免模型硬編假資料
  rejectionReason: z.string().nullable().describe("僅當圖片非發票或資訊嚴重殘缺時填寫原因"),
});

export type InvoiceExtraction = z.infer<typeof InvoiceExtractionSchema>;

// 2A. OpenAI 嚴格結構化輸出 (Strict Mode)
export async function extractWithOpenAI(rawText: string): Promise<InvoiceExtraction> {
  const client = new OpenAI();
  const response = await client.responses.parse({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: "你是專業財務單據稽核員，請精確擷取單據內容，嚴禁猜測不存在的數字。" },
      { role: "user", content: rawText },
    ],
    text: {
      format: zodTextFormat(InvoiceExtractionSchema, "invoice_extraction"),
    },
  });

  // 檢查模型是否觸發安全層 Refusal
  if (response.output_parsed === null) {
    throw new Error("Model refused or failed to produce parsed output.");
  }
  return response.output_parsed;
}

// 2B. Google Gemini 原生 responseSchema 實作
export async function extractWithGemini(rawText: string): Promise<InvoiceExtraction> {
  const ai = new GoogleGenAI({});
  // 將 Zod 轉為標準 JSON Schema 並移除 Gemini 不支援的 $schema 欄位
  const jsonSchema = z.toJSONSchema(InvoiceExtractionSchema);
  delete (jsonSchema as Record<string, unknown>).$schema;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: rawText,
    config: {
      systemInstruction: "你是專業財務單據稽核員，若資訊不足請將對應欄位設為 null 並填寫 rejectionReason。",
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    },
  });

  // 經過雙重保險：模型端已被 FSM 鎖死，本地端再用 Zod parse 驗證業務規則
  return InvoiceExtractionSchema.parse(JSON.parse(response.text ?? "{}"));
}
```

### 實戰二：Python + Pydantic 串接本地 vLLM (`guided_json`) 與 Claude Tool Use

在企業內網合規環境（例如金融、醫療資料不可出網），通常會使用 Python 搭配地端部署的 **vLLM**；而在雲端高推理場景則常呼叫 **Claude**。以下示範如何用同一份 Pydantic Model 同時驅動兩者：

```python
# structured_pipeline.py
from typing import Literal, Optional, List
from pydantic import BaseModel, Field
from openai import OpenAI
import anthropic

class TicketRoutingResult(BaseModel):
    category: Literal["billing", "technical_bug", "security_incident", "feature_request"]
    severity: Literal["P0", "P1", "P2", "P3"]
    requires_human_escalation: bool
    affected_module: Optional[str] = Field(None, description="受影響的系統模組名稱，未知填 null")
    concise_summary: str = Field(..., description="50 字以內的客訴核心摘要")

# 方案 A：地端 vLLM 使用 guided_json (底層啟動 xgrammar FSM 遮罩)
def route_with_local_vllm(ticket_text: str) -> TicketRoutingResult:
    vllm_client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
    completion = vllm_client.chat.completions.create(
        model="Qwen/Qwen2.5-32B-Instruct",
        messages=[
            {"role": "system", "content": "你是資安與維運分流總機，請依工單內容回傳結構化分類。"},
            {"role": "user", "content": ticket_text},
        ],
        extra_body={
            "guided_json": TicketRoutingResult.model_json_schema(),
            "guided_decoding_backend": "xgrammar",
        },
        temperature=0.1,
    )
    return TicketRoutingResult.model_validate_json(completion.choices[0].message.content)

# 方案 B：Anthropic Claude 使用強制 Tool Use 鎖定 Schema
def route_with_claude(ticket_text: str) -> TicketRoutingResult:
    claude = anthropic.Anthropic()
    tool_schema = TicketRoutingResult.model_json_schema()

    msg = claude.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        tools=[
            {
                "name": "submit_ticket_routing",
                "description": "提交工單分類與嚴重程度評估結果",
                "input_schema": tool_schema,
            }
        ],
        tool_choice={"type": "tool", "name": "submit_ticket_routing"},
        messages=[{"role": "user", "content": ticket_text}],
    )

    for block in msg.content:
        if block.type == "tool_use" and block.name == "submit_ticket_routing":
            return TicketRoutingResult.model_validate(block.input)
    raise RuntimeError("Claude did not return expected tool_use block.")
```

---

## 🧩 企業管線最容易翻車的 4 個進階深水區

拿到 100% 合法的 JSON 只是起點。真正進入大型企業生產環境時，以下四個高階邊界狀況才是決定系統穩健度的關鍵：

### 1. 優雅處理 Refusals（拒答）與「資訊不足時的強迫幻覺」
**陷阱**：當你用 `strict: true` 強迫模型必須輸出 `{ "invoiceNumber": string, "totalAmount": number }` 時，如果使用者不小心上傳了一張**貓咪照片**或被塗黑的發票，模型因為被 FSM 鎖死不能說「抱歉這不是發票」，結果會**被逼著在數字欄位編造假資料**（例如 `"invoiceNumber": "00000000"`, `"totalAmount": 0`）！

**解法**：
- **業務層防禦**：所有擷取型 Schema 必須包含 `status: "ok" | "unreadable"` 與 `nullable` 欄位，讓模型有合法的逃生出口。
- **安全層檢查**：針對可能觸發內容安全政策的場景，OpenAI 回應物件可能出現 `refusal` 欄位，管線必須優先檢查 `if (message.refusal)` 再進行資料寫入，切勿直接當成成功處理。

### 2. Streaming Partial JSON（串流即時渲染）
當一個結構化報告包含 15 個欄位、生成需要 8 秒時，如果前端等整個 JSON 完成才一次顯示，使用者體驗會非常差。

**實戰解法**：
- **切勿在串流過程中重複呼叫原生 `JSON.parse()`**，因為不完整的字串（例如 `{"summary": "客戶反映無法登`）必定拋出語法錯誤。
- **採用容錯部分解析器（Partial JSON Parser）**：例如 Vercel AI SDK 的 `streamObject` 或開源套件 `partial-json` / `best-effort-json-parser`，它會在每收到一個 chunk 時自動補齊尚未閉合的引號與大括號，讓前端即時渲染打字機效果，同時等 `finish_reason === "stop"` 時再用完整的 Zod Schema 做最終校驗。

### 3. Union Types 與「欄位順序決定智商」（Chain-of-Thought Ordering）
**陷阱一（Discriminated Unions）**：許多引擎對複雜的 `oneOf` / `anyOf` 支援度不如扁平物件穩定，或者編譯 CFG 狀態機耗時過長。實務上建議改用帶有明確標籤的 **Discriminated Union**（例如固定有一個 `"actionType": "refund" | "replace"` 欄位），甚至在極端情況下將兩種結果設計為互斥的 Optional 子物件。

**陷阱二（CoT 欄位擺放順序）**：因為 LLM 是**從左到右（Auto-regressive）**逐字生成，**先輸出的欄位會成為後輸出欄位的 Context**！
```json
// ❌ 錯誤順序：先逼模型猜結論，再寫理由（容易為了圓謊而胡扯理由）
{ "isFraud": true, "reasoning": "..." }

// ✅ 正確順序：先強迫模型在 JSON 裡思考與舉證，最後才下結論！
{ "evidenceFound": ["IP 來自高風險代理", "短時間切換 4 張信用卡"], "reasoning": "...", "isFraud": true }
```
實測顯示，僅僅是把 `reasoning` 欄位放在 `decision` / `score` 之前，分類任務的準確率就能提升 **8% 至 15%**。

### 4. JSON Schema 複雜度爆炸與快取冷啟動
在 vLLM 或部分雲端引擎中，如果你在單一 Schema 裡寫了超過 8 層巢狀結構、大量正規表達式 `pattern`，或是 50 個超長 `enum`，FSM 編譯時間可能暴增到數秒甚至觸發 OOM。
- **黃金準則**：保持 Schema 扁平化（Flat is better than nested）；把極長的正規驗證（如複雜 Email / URL Regex）留給後端的 Zod/Pydantic 檢查並搭配重試機制，而不是全塞進模型的 Regex FSM 裡。

---

## 🧰 實戰錦囊：可直接複製的 Schema 設計師與除錯 Prompt

當你需要快速為現有業務流程設計「兼具高準確率與逃生機制」的 JSON Schema 時，可以直接使用以下兩個錦囊模板。

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · 企業級 Zod + Pydantic 雙語 Schema 架構生成器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你是資深 AI 系統架構師，專精於 LLM Structured Outputs 與 Constrained Decoding。請針對以下業務需求，幫我同時產出「TypeScript (Zod)」與「Python (Pydantic v2)」的嚴格資料契約：

業務需求描述：
[在此描述你要 AI 擷取或決策的流程，例如：從合約 PDF 擷取甲乙雙方資訊、付款條件與違約條款]

設計時必須嚴格遵守以下 4 項穩定性鐵則：
1. 【思考前置 (CoT Ordering)】：所有評估、證據摘錄與 `reasoning` 欄位，必須排列在最終布林判斷、分數或分類標籤之前。
2. 【反幻覺逃生門】：必須包含 `extraction_status: "complete" | "partial" | "invalid_input"` 與 `nullable` 欄位，嚴禁在資訊不足時強迫模型填寫假值。
3. 【OpenAI Strict 相容】：禁止使用無限制動態 key 的 `Record/Dict`，所有物件皆須明確列出屬性，可選欄位一律使用 `nullable`。
4. 【扁平化與說明】：巢狀深度不超過 3 層，並為每個關鍵欄位撰寫清晰的 `.describe()` / `Field(description=...)` 供模型對齊語義。</div>
  <div class="terminal-footer">
    <span>適用工具：Cursor / Claude / ChatGPT / API 架構設計</span>
    <span class="copy-hint">📋 點擊全選複製並貼上你的業務需求</span>
  </div>
</div>

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · 結構化輸出「合法但內容幻覺」稽核器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">我們的自動化管線雖然達成了 100% JSON Schema 格式合規，但在以下測試案例中出現了「格式完全正確，但內容產生幻覺或邏輯矛盾」的問題。

目前的 JSON Schema：
[貼上你的 JSON Schema 或 Zod 定義]

輸入原始文本：
[貼上導致出錯的真實案例文本]

模型輸出的錯誤 JSON：
[貼上模型實際吐出的 JSON]

請從「Constrained Decoding 與自回歸生成特性」進行診斷：
1. 是否因為缺少 `nullable` 或 `unreadable` 狀態，導致模型被狀態機強迫瞎猜？
2. 是否因為結論欄位排在推論欄位之前，造成自回歸鎖死？
3. 是否某個 `.describe()` 語義模糊導致邊界重疊？
請直接給出修正後的 Schema Diff 與 System Prompt 補強條款。</div>
  <div class="terminal-footer">
    <span>適用工具：AI Pipeline QA / Prompt Engineering 除錯</span>
    <span class="copy-hint">📋 點擊全選複製進行管線健檢</span>
  </div>
</div>

---

## 🛠️ 企業級管線疑難排解手冊（Troubleshooting Playbook）

| 錯誤現象 / API 報錯 | 背後真正原因 | 立即修正方案 |
| :--- | :--- | :--- |
| **`Invalid schema for response_format: 'additionalProperties' is required`** | OpenAI Strict Mode 規定每個 `object` 節點都必須顯式宣告 `additionalProperties: false`，且 `required` 必須涵蓋所有鍵。 | 使用官方 `zodTextFormat` / Pydantic helper，或在手動轉出的 JSON Schema 上遞迴補上 `additionalProperties: false`。 |
| **JSON 格式正確，但輸出在中間無故重複同一個字直到 `max_tokens`** | 模型陷入退化迴圈（Degeneration Loop），或 Schema 中的 Regex `pattern` 過於嚴苛，把高機率文字全都遮罩掉，逼出異常高熵 Token。 | 放寬過嚴的 Regex 約束（改由後端驗證），適當提高 `max_tokens` 並設定 `frequency_penalty: 0.1`（若平台支援）；同時檢查是否超過模型單次輸出上限。 |
| **第一次呼叫該 Schema 延遲高達 4–8 秒，之後變回 0.8 秒** | 第一次執行時推論引擎正在將你的 JSON Schema 編譯成 FSM / CFG 狀態機快取（Grammar Compilation Cold Start）。 | 在服務啟動階段（Warm-up）對固定 Schema 發送一筆極短的空測試請求預熱快取，並避免每次請求動態產生不同的欄位名稱。 |
| **遇到長表格擷取時，Gemini 或 Claude 偶爾漏掉最後幾列** | `max_tokens` 觸頂被強制截斷（`finish_reason: length`），導致不完整 JSON。 | 切勿只看「有沒有回傳字串」，務必在程式中斷言 `finishReason === "stop"`；若資料筆數超過 50 筆，改用分頁批次擷取（Chunked Extraction）。 |

---

## 🎯 總結：把確定性交給編譯器，把創造力留給模型

在企業自動化管線裡，**「95% 穩定」等於「每天都會壞掉」**。

透過 **Constrained Decoding（FSM / CFG Logits 遮罩）**、**Zod / Pydantic 單一契約**、**CoT 欄位先推論後結論的排列**，以及**預留 `nullable` 與 `refusal` 逃生門**，你不再需要寫滿螢幕脆弱的 Regex 清洗腳本去擦 AI 的屁股，而是真正擁有了一條可通過嚴格單元測試與企業稽核的 100% 確定性資料管線。
