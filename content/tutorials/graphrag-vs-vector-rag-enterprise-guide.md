---
id: "graphrag-vs-vector-rag-enterprise-guide"
title: "超越傳統向量搜尋：GraphRAG（知識圖譜檢索增強）架構解析與高複雜度跨文件推理實戰"
type: "tutorial"
category: "Enterprise AI"
summary: "為什麼傳統 Vector RAG 面對「這 300 份合約最常出現的 5 大風險主題是什麼？」或「跨子公司擔保鏈」問題時會集體失智？本文深入剖析 Microsoft GraphRAG 與 LightRAG 核心架構：從實體與關係抽取、Leiden 分層社群聚類、Local Search 到 Global Map-Reduce 全域推理，提供成本與延遲對照表、企業選型決策矩陣，以及可直接複製的知識圖譜實體抽取 Prompt 範本。"
created: "2026-11-16"
updated: "2026-11-16"
version: "1.0"
status: "active"
visibility: "public"
tags: ["GraphRAG", "知識圖譜", "Vector RAG", "Enterprise AI", "Leiden 演算法", "跨文件推理", "LightRAG", "企業知識庫"]
tools: ["Microsoft GraphRAG", "LightRAG", "Neo4j", "LlamaIndex", "Qdrant", "Python"]
cover: "/assets/covers/graphrag-vs-vector-rag-enterprise-guide.png"
featured: true
---

## 導言：當傳統 Vector RAG 撞上「全局視野」與「多跳推理」的天花板

過去兩年，幾乎所有企業導入內部 AI 知識庫的標準起手式都是 **Vector RAG（向量檢索增強生成）**：把 PDF 切塊（Chunking）、轉成 Embedding 向量存進向量資料庫（如 Qdrant、Pinecone、pgvector），使用者提問時撈出最相似的 Top-5 段落送給 LLM 回答。

這套做法在回答**「單點事實型問題」**時表現極佳（例如：「公司 2026 年的出差住宿補助上限是多少？」）。但當業務主管或法務長開始問出真正有商業價值的**高複雜度問題**時，Vector RAG 就會立刻現出原形、開始胡說八道：

1. **全域歸納問題（Global Sensemaking）**：「請盤點這 300 份供應商合約中，最常出現的 5 大潛在違約風險主題是什麼？」
2. **多跳關聯推理（Multi-Hop Reasoning）**：「A 子公司的專利授權條款，是透過哪幾層轉投資或連帶擔保協議，最終影響到 B 專案的交付風險？」

原因非常簡單：**向量相似度搜尋本質上是「局部瞎子摸象」。** 當你只撈出 Top-5 或 Top-10 個切片給 LLM 時，模型根本沒看過其餘 295 份文件，卻被迫裝作看過全部資料來做總結；而在多跳推理中，連接「A 公司」與「B 專案」的中間人可能落在第 4 份文件的某個冷門段落，向量距離根本排不進 Top-10，整條證據鏈就此斷裂。

為了突破這道天花板，以 **Microsoft GraphRAG** 與輕量化開源架構 **LightRAG** 為代表的「知識圖譜檢索增強（Graph-based RAG）」成為企業級 AI 架構演進的關鍵分水嶺。

---

## 🔍 盲點剖析：Vector RAG 與 GraphRAG 的底層思維差異

在深入技術細節前，我們先用一張對照看懂兩者在檢索世界觀上的本質差異：

<div class="vibe-grid-2">
  <div class="vibe-box-danger">
    <span class="badge">❌ 傳統 Vector RAG 的視角</span>
    <p><strong>把知識切碎成互不相連的「文字孤島」：</strong></p>
    <ul>
      <li>文件被硬生生切成 500 字一塊的 Chunk，彼此之間沒有結構化連結。</li>
      <li>僅能靠「字面與語意相似度」撈取局部片段，完全缺乏全域拓撲地圖。</li>
      <li>面對「跨 300 份文件的總結」只能靠盲猜，極易產生嚴重倖存者偏差與幻覺。</li>
    </ul>
  </div>
  <div class="vibe-box-success">
    <span class="badge">✅ GraphRAG 的視角</span>
    <p><strong>先讀完所有文件，畫出「實體關聯網與社群摘要報告」：</strong></p>
    <ul>
      <li>在離線建索引階段，就讓 LLM 提取出「人、事、時、地、條款」與它們之間的關聯邊。</li>
      <li>透過圖演算法將高度互連的節點聚類成「主題社群」，預先寫好高階摘要。</li>
      <li>查詢時既能沿著關係鏈精準「多跳追兇」，也能用 Map-Reduce 橫掃全局！</li>
    </ul>
  </div>
</div>

---

## ⚙️ GraphRAG 核心架構拆解：從原始文件到雙軌推理管線

Microsoft Research 所提出的 GraphRAG 經典架構，將整個系統明確劃分為 **Phase 1：離線圖譜建置（Indexing）** 與 **Phase 2：線上雙軌檢索（Local & Global Search）**。

![GraphRAG 知識圖譜檢索增強：離線 Leiden 社群建模與雙軌推理管線](/assets/diagrams/graphrag-vs-vector-rag-enterprise-guide-arch.svg)

### Phase 1：離線知識圖譜建置四步驟

1. **語料切片（TextUnits）**
   將原始文件切分為約 600 Tokens 的 `TextUnit`（保留 100 Tokens 重疊），作為後續所有實體抽取與引用溯源的最小顆粒度單位。
2. **LLM 實體與關係抽取（Entity & Relationship Extraction）**
   這是整個建置過程最核心、也最吃 Token 的步驟。系統會要求 LLM 讀過每一個 TextUnit，提取出關鍵實體（例如：`甲公司`、`資安賠償上限條款`、`SLA 99.9%`）以及實體間的具體關係與權重分數。
   - **Gleaning（二次拾穗機制）**：研究團隊發現單輪抽取常會漏掉約 20%~30% 的次要實體，因此會在抽取完第一輪後，再追問模型一次：「還有沒有遺漏的實體或關聯？」，顯著提升圖譜召回率。
3. **Leiden 演算法分層社群聚類（Hierarchical Community Detection）**
   當成千上萬個節點與邊組成一張龐大的知識圖譜後，GraphRAG 會使用圖論中極為高效的 **Leiden 社群偵測演算法**，根據節點之間的連線緊密程度，自動把圖譜切分成不同層級（Level 0 宏觀領域 → Level 1 子主題 → Level 2 具體事件集群）的社群結構。
4. **預先生成社群報告（Community Summaries）**
   系統由底層社群開始，逐層往上請 LLM 為每一個社群生成一份結構化的「社群摘要報告（Community Report）」，包含該群組的核心主題、關鍵角色、潛在衝突與重要程度評分。

---

### Phase 2：雙軌檢索引擎——Global Search vs. Local Search

建立好知識圖譜與分層社群報告後，面對不同類型的使用者提問，系統會路由（Route）至截然不同的檢索模式：

#### 1. Global Search（全域搜尋 · Map-Reduce 模式）
專攻**「沒有明確指定單一實體、需要總結整批文件宏觀趨勢」**的問題（例如：前述 300 份合約的 5 大風險主題）。
- **Map 階段**：系統不直接查原文片段，而是把預先算好的特定層級（例如 Level 1）所有「社群摘要報告」分批平行送給 LLM，請它針對當前問題打分（Helpfulness Score 0~100）並提取該社群的相關論點。
- **過濾與排序**：丟棄得分為 0 的無關社群論點，保留高權重證據並依重要度排序。
- **Reduce 階段**：將所有高分論點匯總送給主模型，綜合成一份結構嚴謹、涵蓋整座資料庫的全局分析報告，且每一條論點都能回溯至對應的社群編號與原始文件。

#### 2. Local Search（局部搜尋 · 向量錨定 + 鄰域多跳擴展）
專攻**「針對特定實體、需要跨文件追蹤因果或關聯」**的問題（例如：A 子公司如何透過中間合約影響 B 專案）。
- **向量錨定起始點**：先用傳統向量搜尋比對問題，找出與提問最相關的幾個核心實體節點（Anchor Entities）。
- **圖譜鄰域遍歷（1~2 Hop Expansion）**：沿著這些錨點在知識圖譜中的邊往外擴展 1 到 2 跳，把相關連的其他節點、關係描述、對應的社群報告以及原始 `TextUnit` 片段全部打包組裝成超高品質的上下文 Context。
- **上下文生成**：送入 LLM 推理出完整的多跳邏輯鏈。

---

## 📊 企業選型實戰：4 種主流 RAG 架構的成本、延遲與能力對比

導入 GraphRAG 並不是「無腦全換」。它的建置成本與查詢延遲遠高於傳統向量搜尋。以下這張實戰對照表，能幫助你在架構評審會上做出最理性的技術決策：

| 評估維度 | 傳統 Vector RAG | Hybrid (BM25 + Vector + Rerank) | LightRAG（輕量化雙層圖譜） | Full Microsoft GraphRAG |
| :--- | :--- | :--- | :--- | :--- |
| **建置成本 (1,000 頁文件)** | 極低（僅 Embedding 費用，約 USD 0.1~0.3） | 低（Embedding + 倒排索引，約 USD 0.2~0.5） | **中**（單輪實體/關鍵字抽取，約 USD 2~6） | **極高**（含 Gleaning + 社群摘要，約 USD 15~45+） |
| **增量更新難度** | 極易（新增/刪除單一檔案即生效） | 易（直接增刪向量與關鍵字索引） | **較易**（支援圖譜增量合併節點與邊） | **高**（變動文件常須重算 Leiden 社群與摘要） |
| **單次查詢延遲** | 0.8 ~ 1.8 秒 | 1.2 ~ 2.5 秒 | 1.8 ~ 3.5 秒 | Local: 2~4 秒 / **Global: 8~25 秒** |
| **單點精準查詢（條文/規格）** | 良（專有名詞易漏） | **極佳（企業日常客服首選）** | 佳 | 良（殺雞用牛刀） |
| **跨文件多跳推理** | 差 | 中（依賴文件剛好同處一份段落） | **優**（支援低階實體/高階主題檢索） | **極佳** |
| **全域宏觀總結 (300 份歸納)** | **極差（嚴重失憶與幻覺）** | 差 | 良 | **無可取代（Map-Reduce 全局視野）** |

> [!IMPORTANT]
> **2026 年企業架構黃金法則：Router + Hybrid + GraphRAG 分層共存**
> 千萬不要用全量 GraphRAG 去回答「公司 Wi-Fi 密碼是多少」或「報帳流程是什麼」！最省錢且體驗最好的設計，是在入口處放一個 **Intent Router（意圖路由器）**：
> - 80% 的日常單點查詢走 **Hybrid RAG（BM25 + Vector + Reranker）**，1.5 秒內毫秒回應、成本趨近於零。
> - 20% 涉及複雜跨文件關聯或高管趨勢分析的請求，才動態導流到 **LightRAG** 或 **GraphRAG Global Search**。

---

## 🛠️ 實戰指南：圖譜抽取品質決定成敗（Schema 設計與實作）

許多團隊實作 GraphRAG 效果不佳，90% 的原因出在**「沒有限定領域本體（Domain Ontology / Entity Types），放任 LLM 亂抽實體」**。

如果一份法律合約裡，LLM 同時抽出了 `本公司`、`甲方`、`台灣某科技股份有限公司` 三個不同名稱但其實指向同一家公司的節點，整張圖譜就會支離破碎，無法連結！

### 必須在抽取階段做對的 3 件工程實務

1. **嚴格定義 Entity Types 白名單**：針對不同業務領域，鎖死抽取類型（例如法務合約僅抽：`ORGANIZATION`、`CONTRACT_CLAUSE`、`OBLIGATION`、`PENALTY`、`JURISDICTION`、`DATE`）。
2. **強制實體標準化（Entity Resolution）**：在 Prompt 中要求將代名詞（甲方、乙方、本公司）還原為具體公司全名，並在圖譜寫入 Neo4j 或 Parquet 前，透過「字串相似度 + Embedding 餘弦相似度（大於 0.92）」合併同義節點。
3. **用結構化 Python Pydantic 管線控制輸出**：確保每筆抽取結果都能無痛寫入圖資料庫。

```python
from pydantic import BaseModel, Field
from typing import List, Literal

# 1. 嚴格鎖死企業合約領域的實體與關係本體 (Domain Ontology)
EntityType = Literal[
    "ORGANIZATION",     # 簽約主體、子公司、供應商
    "CONTRACT_CLAUSE",  # 特定條款（如保密義務、排他條款、SLA）
    "RISK_FACTOR",      # 潛在風險點（如無限連帶責任、單方解約權）
    "MONETARY_TERM",    # 金額、違約金、賠償上限
    "PROJECT_ASSET"     # 交付標的、軟體系統、專利授權
]

class ExtractedEntity(BaseModel):
    canonical_name: str = Field(..., description="標準化後的完整實體名稱，嚴禁使用甲方/乙方等代稱")
    entity_type: EntityType
    description: str = Field(..., description="該實體在上下文中的核心定義與角色摘要")

class ExtractedRelation(BaseModel):
    source: str = Field(..., description="起始實體的 canonical_name")
    target: str = Field(..., description="目標實體的 canonical_name")
    relation_type: str = Field(..., description="大寫英文動詞片語，例如 GUARANTEES, CAPS_LIABILITY_AT, DEPENDS_ON")
    evidence_quote: str = Field(..., description="支撐此關係的原始文件關鍵短句，用於引用溯源")
    weight: int = Field(..., ge=1, le=10, description="商業風險與關聯強度評分 1-10")

class KnowledgeGraphChunk(BaseModel):
    entities: List[ExtractedEntity]
    relations: List[ExtractedRelation]
```

### 意圖路由器（Hybrid vs. GraphRAG 動態分流）實作示範

```python
from typing import Literal

QueryRoute = Literal["HYBRID_VECTOR", "GRAPH_LOCAL", "GRAPH_GLOBAL"]

def route_enterprise_query(user_query: str, llm_router_client) -> QueryRoute:
    """
    依據問題的推理跨度，決定送往低延遲 Hybrid RAG 還是高推理 GraphRAG
    """
    prompt = f"""請判斷以下企業知識庫提問應使用哪種檢索策略，僅回傳代號：
    - HYBRID_VECTOR：查詢單一規定、特定條文編號、操作步驟、明確名詞定義。
    - GRAPH_LOCAL：涉及特定實體之間的多層關聯、上下游影響、跨部門責任歸屬。
    - GRAPH_GLOBAL：需要針對整個文件庫進行宏觀盤點、趨勢統計、共同風險主題歸納（如「最常出現的 N 個...」、「整體比較...」）。

    使用者問題：{user_query}
    僅輸出標籤："""
    
    decision = llm_router_client.generate(prompt).strip().upper()
    if decision in ("HYBRID_VECTOR", "GRAPH_LOCAL", "GRAPH_GLOBAL"):
        return decision  # type: ignore
    return "HYBRID_VECTOR"
```

---

## 🧰 實戰錦囊：GraphRAG 領域實體抽取與社群摘要 Prompt 範本

直接拿預設通用 Prompt 跑企業資料，抽出的圖譜往往雜訊過多。以下兩套實戰 Prompt 模板，能幫你大幅提升圖譜純度與全局歸納精準度。

### 範本 1：高精度領域實體與關係抽取器（含實體消歧規範）

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 01 · 企業級 GraphRAG 實體與關聯抽取器</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你是極度嚴謹的知識圖譜工程師。請閱讀以下企業文件片段，並嚴格依照指定的領域本體（Ontology）抽取實體與關聯邊。

【允許的實體類型 (Entity Types)】
- ORGANIZATION：公司、部門、子公司、政府機構、供應商
- CONTRACT_CLAUSE：合約條款、SLA、智財權歸屬、保密義務
- RISK_FACTOR：法律風險、違約罰則、單方終止權、無限賠償責任
- MONETARY_TERM：金額上限、付款條件、違約金比例
- PROJECT_ASSET：具體專案名稱、軟體模組、交付物

【強制消歧鐵則 (Canonicalization Rules)】
1. 禁止抽出「甲方」、「乙方」、「本公司」、「該公司」等代名詞！若上下文有提及真實公司名稱，必須統一還原為「公司完整名稱」。
2. 每條關係 (Relationship) 必須附上原文依據短句與 1~10 的風險關聯權重。
3. 禁止憑空捏造原文未提及的因果關係；若該片段無有效實體，請輸出空陣列。

【待處理文件片段】
{{TEXT_UNIT_CONTENT}}

請嚴格以 JSON 格式輸出：{"entities": [...], "relations": [...]}。</div>
  <div class="terminal-footer">
    <span>適用階段：GraphRAG Phase 1 離線建置 / LightRAG 索引管線</span>
    <span class="copy-hint">📋 建議搭配 Structured Outputs / JSON Mode 執行</span>
  </div>
</div>

### 範本 2：Leiden 社群報告與 Global Map 評分提示詞

<div class="vibe-prompt-card">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
    </div>
    <span class="terminal-title">Prompt 02 · GraphRAG 社群摘要生成與異常風險盤點</span>
    <span class="terminal-badge">複製即用</span>
  </div>
  <div class="terminal-body">你現在是資深企業法務與風險分析總監。以下是知識圖譜經由 Leiden 聚類演算法劃分出的某一個「高度關聯社群」的節點與邊清單。

請為這個社群產出一份精煉的【社群風險情報報告 (Community Report)】：

【輸入社群圖譜資料】
- 社群節點清單：{{COMMUNITY_NODES}}
- 社群關係邊清單：{{COMMUNITY_EDGES}}

請嚴格按照以下結構輸出：
1. 社群核心主題命名（一句話概括這群實體在討論什麼共同業務或條款）
2. 關鍵參與者與控制核心（指出連線度最高的核心主體與關鍵條款）
3. 跨文件衝突與風險點盤點（是否存在互相矛盾的賠償上限、隱性連帶責任或單邊不平等條款？明確列出證據編號）
4. 重要度評分 (1-100) 與一句話理由：供後續 Global Map-Reduce 查詢快速過濾優先級。</div>
  <div class="terminal-footer">
    <span>適用階段：Leiden 社群摘要生成 / 企業合約批量稽核</span>
    <span class="copy-hint">📋 可使用輕量模型平行批次生成以壓低 70% 建置成本</span>
  </div>
</div>

---

## 🎯 總結：什麼時候才真的該上 GraphRAG？

<div class="vibe-box-concept">
  <span class="badge">💡 企業 RAG 演進決策檢查表</span>
  <ul>
    <li><strong>先跑通 Hybrid RAG</strong>：若你的需求 90% 是查內部 SOP、產品規格書或 FAQ，把 BM25 + Vector + Reranker 做好就已經贏過 80% 系統，不需要過度工程化。</li>
    <li><strong>出現「全局歸納」痛點就該升級</strong>：當用戶開始問「這批資料的整體趨勢、共同風險、跨文件比較」，傳統 Top-K 必死無疑，此時必須導入 GraphRAG 的社群摘要與 Map-Reduce 架構。</li>
    <li><strong>出現「多跳關聯」痛點用圖譜補齊</strong>：在金融盡調（DD）、法務合約審查、醫療知識庫與供應鏈追蹤場景，透過 Entity-Relation 鄰域擴展能徹底消滅證據斷鏈問題。</li>
    <li><strong>善用混合路由控管成本</strong>：用 Router 將簡單問題留在毫秒級向量庫，只把複雜問題交給 GraphRAG，才能兼顧速度、準確度與帳單預算。</li>
  </ul>
</div>
