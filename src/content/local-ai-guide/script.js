/**
 * 本地 AI 硬體與調校實戰手冊 - 互動腳本
 * 包含：
 * 1. 「我的電腦能跑什麼 AI」互動式 4-bit 記憶體與 Context 診斷計算機
 * 2. Ollama / LM Studio / llama.cpp 設定分頁切換與一鍵複製指令
 * 3. 「七句照做」黃金法則互動自檢表 (支援 localStorage 狀態保存)
 * 4. 閱讀進度條、深淺色主題切換、右側目錄 ScrollSpy
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. 深淺色主題切換
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('local_ai_guide_theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('local_ai_guide_theme', next);
  });

  // =========================================================================
  // 2. 互動式「我的電腦能跑什麼 AI」診斷計算機
  // =========================================================================
  let state = {
    platform: 'mac', // 'mac' | 'pc'
    memoryGB: 32,
    usage: 'agent',  // 'chat' | 'doc' | 'agent'
    ctxK: 64
  };

  const platformBtns = document.querySelectorAll('#platformSelect .seg-btn');
  const memoryPills = document.querySelectorAll('#memoryPills .pill-btn');
  const memorySlider = document.getElementById('memorySlider');
  const usageBtns = document.querySelectorAll('#usageSelect .seg-btn');

  const memTypeLabel = document.getElementById('memTypeLabel');
  const memValueDisplay = document.getElementById('memValueDisplay');
  const resSafeMem = document.getElementById('resSafeMem');
  const resSafeMemNote = document.getElementById('resSafeMemNote');
  const resCtxMem = document.getElementById('resCtxMem');
  const resCtxNote = document.getElementById('resCtxNote');
  const resMaxParams = document.getElementById('resMaxParams');
  const resWeightBudget = document.getElementById('resWeightBudget');

  const barTotalText = document.getElementById('barTotalText');
  const barStatusBadge = document.getElementById('barStatusBadge');
  const barWeights = document.getElementById('barWeights');
  const barCtx = document.getElementById('barCtx');
  const barFree = document.getElementById('barFree');
  const barSys = document.getElementById('barSys');

  const legWeights = document.getElementById('legWeights');
  const legCtx = document.getElementById('legCtx');
  const legFree = document.getElementById('legFree');
  const legSys = document.getElementById('legSys');
  const calcRecommendation = document.getElementById('calcRecommendation');

  function updateCalculator() {
    const totalMem = state.memoryGB;
    memValueDisplay.textContent = `${totalMem} GB`;
    barTotalText.textContent = `${totalMem} GB`;

    // 法則 B：Mac 先照記憶體的 3/4 (75%) 來算；PC 獨立顯卡預留約 1.5GB ~ 2GB 給系統顯示緩衝
    let safeMem = totalMem;
    let sysReserved = 0;

    if (state.platform === 'mac') {
      memTypeLabel.textContent = 'Mac 統一記憶體';
      safeMem = +(totalMem * 0.75).toFixed(1);
      sysReserved = +(totalMem - safeMem).toFixed(1);
      resSafeMemNote.textContent = `法則：Mac 取 3/4 (已保留 ${sysReserved} GB 給 macOS)`;
    } else {
      memTypeLabel.textContent = '獨立顯卡 VRAM';
      sysReserved = totalMem <= 12 ? 1.0 : 1.5;
      safeMem = +(totalMem - sysReserved).toFixed(1);
      resSafeMemNote.textContent = `已扣除顯示器與驅動基礎佔用 (${sysReserved} GB)`;
    }

    resSafeMem.textContent = `${safeMem} GB`;

    // 根據 Context 長度與模型量級估算 KV Cache 空間 (搭配 Q8 KV Cache & Flash Attention)
    let ctxMem = 1.5;
    if (state.ctxK === 8) {
      ctxMem = totalMem >= 32 ? 1.5 : 1.0;
      resCtxNote.textContent = '8k Context 佔用極小，適合日常輕量問答';
    } else if (state.ctxK === 32) {
      ctxMem = totalMem >= 32 ? 3.2 : 2.2;
      resCtxNote.textContent = '32k Context 適合單篇長文或中小型程式碼分析';
    } else {
      // 64k Agent 模式
      ctxMem = totalMem >= 64 ? 7.5 : (totalMem >= 32 ? 5.2 : 3.2);
      resCtxNote.textContent = '接 Agent 必備 64k Context (建議開啟 Q8 KV Cache)';
    }

    resCtxMem.textContent = `~${ctxMem.toFixed(1)} GB`;

    // 可用於模型權重的空間預算
    const weightBudget = Math.max(1.5, +(safeMem - ctxMem - 0.8).toFixed(1));
    // 法則 A：4-bit 模型大小 ≈ 參數量 × 0.6 GB => 參數量 ≈ weightBudget / 0.6
    const rawMaxB = Math.floor(weightBudget / 0.6);

    let recommendedTierText = '';
    let chosenWeightGB = 0;
    let adviceHTML = '';

    if (totalMem < 16) {
      recommendedTierText = '3B ~ 7B 小模型';
      chosenWeightGB = Math.min(weightBudget, 4.5);
      adviceHTML = `
        <h4>💡 診斷建議：輕量入門級 (${totalMem} GB)</h4>
        <p>目前記憶體較為緊湊，建議主力運行 <strong>3B ～ 7B / 8B (4-bit)</strong> 小模型。若要接 Agent 開到 64k Context，務必開啟 <code>Flash Attention</code> 與 <code>q8_0</code> KV Cache，並把高難度推理交給雲端 API。</p>
        <div class="rec-models-tags">
          <span class="model-pill">Qwen2.5 / Qwen3 7B-8B (Q4_K_M)</span>
          <span class="model-pill">Llama-3.1-8B-Instruct</span>
          <span class="model-pill">Gemma-3-4B / 12B (Q4)</span>
        </div>
      `;
    } else if (totalMem < 28) {
      // 16GB ~ 24GB 區間
      recommendedTierText = state.ctxK === 64 ? '8B ~ 14B 等級' : '14B ~ 24B 等級';
      chosenWeightGB = state.ctxK === 64 ? Math.min(weightBudget, 8.5) : Math.min(weightBudget, 11.0);
      adviceHTML = `
        <h4>💡 診斷建議：16GB 跑小模型黃金區 (${totalMem} GB)</h4>
        <p>遵循黃金法則：<strong>「16GB 跑小模型」</strong>。最甜的區間是 <strong>8B ～ 14B (4-bit 權重約 5GB～8.5GB)</strong>，這樣才能留出充裕空間把 Context 拉到 32k～64k。切忌硬塞剛好切齊記憶體的 27B 模型，否則一開對話就會變成打字機！</p>
        <div class="rec-models-tags">
          <span class="model-pill">Qwen2.5-Coder-14B (Q4_K_M ~8.5GB)</span>
          <span class="model-pill">Gemma-3-12B-IT (Q4_K_M ~7.3GB)</span>
          <span class="model-pill">Llama-3.1-8B (Q4_K_M ~4.9GB)</span>
        </div>
      `;
    } else if (totalMem < 56) {
      // 32GB ~ 48GB 區間
      recommendedTierText = '27B ~ 32B / 30B MoE';
      chosenWeightGB = Math.min(weightBudget, 17.5);
      adviceHTML = `
        <h4>💡 診斷建議：32GB 主力甜點區 — 順跑 27B~32B 與 64k Agent (${totalMem} GB)</h4>
        <p>遵循黃金法則：<strong>「32GB 跑 27B 等級」</strong>！<code>27B × 0.6 ≈ 16.2 GB</code>，加上 <strong>64k Context</strong> 的 ~5GB 空間，剛好完美落在安全上限內。如果你想要極致生成速度，強烈推薦試試 <strong>30B-A3B MoE（混合專家）模型</strong>！</p>
        <div class="rec-models-tags">
          <span class="model-pill">Gemma-3-27B-IT (Q4_K_M ~16.5GB)</span>
          <span class="model-pill">Qwen3-30B-A3B MoE (極速推薦 ⚡)</span>
          <span class="model-pill">Qwen2.5-32B-Instruct (Q4_K_M ~19GB)</span>
        </div>
      `;
    } else if (totalMem < 96) {
      // 64GB 區間
      recommendedTierText = '27B~32B (全開長 Context) / 70B';
      chosenWeightGB = Math.min(weightBudget, 24.0);
      adviceHTML = `
        <h4>💡 診斷建議：64GB 長 Context 工作站 (${totalMem} GB)</h4>
        <p>遵循黃金法則：<strong>「64GB 開長 Context」</strong>！與其硬塞一個把記憶體吃乾抹淨的超大模型，64GB 最爽的用法是跑 <strong>27B～32B（甚至 Q5/Q6 高精度量化）或中型 MoE 模型，並把 Context 徹底展開到 64k～128k</strong>，讓 AI Agent 讀完整個專案庫也不失憶！</p>
        <div class="rec-models-tags">
          <span class="model-pill">Qwen3-30B-A3B / 32B (Q5_K_M + 128k Context)</span>
          <span class="model-pill">Gemma-3-27B (Q6_K + 64k+ Context)</span>
          <span class="model-pill">Llama-3.3-70B (Q4_K_M ~42GB)</span>
        </div>
      `;
    } else {
      // 128GB 旗艦區間
      recommendedTierText = '70B ~ 120B+ / 大型 MoE 模型';
      chosenWeightGB = Math.min(weightBudget, 55.0);
      adviceHTML = `
        <h4>💡 診斷建議：128GB 旗艦重裝級 — 真正切換到大模型 (${totalMem} GB)</h4>
        <p>遵循黃金法則：<strong>「128GB 才換到大模型」</strong>！你擁有近 96GB 的安全可用 AI 記憶體，可以輕鬆駕馭 <strong>70B ～ 120B+ 巨型模型或大型 MoE 模型</strong>，同時全開 64k～128k Context，享受完全離線的頂級私有 AI 工作站。</p>
        <div class="rec-models-tags">
          <span class="model-pill">Llama-3.3-70B / Qwen-72B (Q5/Q6 + 64k Context)</span>
          <span class="model-pill">大型 MoE 旗艦模型 (4-bit + 長 Context)</span>
          <span class="model-pill">多模型同時常駐 (Coding + Vision + Embedding)</span>
        </div>
      `;
    }

    resMaxParams.textContent = recommendedTierText;
    resWeightBudget.textContent = `模型權重可用預算：約 ${weightBudget} GB (約 ${rawMaxB}B 參數上限)`;

    // 計算視覺進度條比例
    const freeMem = Math.max(0.5, +(totalMem - sysReserved - ctxMem - chosenWeightGB).toFixed(1));
    const wPct = Math.round((chosenWeightGB / totalMem) * 100);
    const cPct = Math.round((ctxMem / totalMem) * 100);
    const sPct = Math.round((sysReserved / totalMem) * 100);
    const fPct = Math.max(2, 100 - wPct - cPct - sPct);

    barWeights.style.width = `${wPct}%`;
    barCtx.style.width = `${cPct}%`;
    barFree.style.width = `${fPct}%`;
    barSys.style.width = `${sPct}%`;

    legWeights.textContent = `${chosenWeightGB.toFixed(1)} GB`;
    legCtx.textContent = `${ctxMem.toFixed(1)} GB`;
    legFree.textContent = `${freeMem.toFixed(1)} GB`;
    legSys.textContent = `${sysReserved.toFixed(1)} GB`;

    if (freeMem < 2.0) {
      barStatusBadge.className = 'status-badge status-tight';
      barStatusBadge.textContent = '⚠️ 記憶體較緊繃，建議開啟 Q8 KV Cache';
    } else {
      barStatusBadge.className = 'status-badge status-good';
      barStatusBadge.textContent = '✅ 預留空間充足，可順暢運行不掉速';
    }

    calcRecommendation.innerHTML = adviceHTML;
  }

  // 綁定平台切換
  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      platformBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.platform = btn.getAttribute('data-platform');
      updateCalculator();
    });
  });

  // 綁定記憶體快速按鈕
  memoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      memoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mem = parseInt(pill.getAttribute('data-mem'), 10);
      state.memoryGB = mem;
      memorySlider.value = mem;
      updateCalculator();
    });
  });

  // 綁定記憶體滑桿
  memorySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.memoryGB = val;
    memoryPills.forEach(p => {
      p.classList.toggle('active', parseInt(p.getAttribute('data-mem'), 10) === val);
    });
    updateCalculator();
  });

  // 綁定使用情境與 Context 選擇
  usageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      usageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.usage = btn.getAttribute('data-usage');
      state.ctxK = parseInt(btn.getAttribute('data-ctx'), 10);
      updateCalculator();
    });
  });

  // 初始化計算機
  updateCalculator();

  // =========================================================================
  // 3. 程式碼分頁 Tabs 與一鍵複製指令
  // =========================================================================
  const codeTabs = document.querySelectorAll('.code-tab');
  const codeContents = document.querySelectorAll('.code-tab-content');

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      codeTabs.forEach(t => t.classList.remove('active'));
      codeContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const preEl = document.getElementById(targetId);
      if (!preEl) return;
      const text = preEl.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const origText = btn.textContent;
        btn.textContent = '✓ 已複製！';
        setTimeout(() => {
          btn.textContent = origText;
        }, 1800);
      } catch (err) {
        btn.textContent = '複製失敗';
      }
    });
  });

  // =========================================================================
  // 4. 「七句照做」黃金法則自檢表 (localStorage 記憶)
  // =========================================================================
  const ruleChecks = document.querySelectorAll('.rule-check');
  const checklistScore = document.getElementById('checklistScore');
  const STORAGE_KEY_RULES = 'local_ai_guide_golden_rules_v1';

  let savedRules = {};
  try {
    savedRules = JSON.parse(localStorage.getItem(STORAGE_KEY_RULES) || '{}');
  } catch (e) {
    savedRules = {};
  }

  function updateChecklistCount() {
    let checkedCount = 0;
    ruleChecks.forEach(chk => {
      if (chk.checked) checkedCount++;
    });
    checklistScore.textContent = `${checkedCount} / ${ruleChecks.length}`;
  }

  ruleChecks.forEach(chk => {
    const ruleId = chk.getAttribute('data-rule');
    if (savedRules[ruleId]) {
      chk.checked = true;
    }
    chk.addEventListener('change', () => {
      savedRules[ruleId] = chk.checked;
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(savedRules));
      updateChecklistCount();
    });
  });

  updateChecklistCount();

  // =========================================================================
  // 5. 閱讀進度條 & 右側目錄 ScrollSpy
  // =========================================================================
  const readingProgress = document.getElementById('readingProgress');
  const sections = document.querySelectorAll('.doc-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    readingProgress.style.width = `${pct}%`;

    // ScrollSpy
    let currentSectionId = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 160) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      tocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  }, { passive: true });
});
