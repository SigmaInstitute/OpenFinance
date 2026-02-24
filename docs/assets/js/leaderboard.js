async function loadJSON(url){
  const res = await fetch(url, {cache: "no-store"});
  if(!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return await res.json();
}

function fmtPct(x, digits=2){
  if(x === null || x === undefined || Number.isNaN(x)) return "—";
  return (100*x).toFixed(digits) + "%";
}
function fmtNum(x, digits=4){
  if(x === null || x === undefined || Number.isNaN(x)) return "—";
  return Number(x).toFixed(digits);
}
function badge(status){
  const s = String(status || "").toLowerCase();
  let cls = "info";
  if(s.includes("scor")) cls = "ok";
  else if(s.includes("valid")) cls = "warn";
  else if(s.includes("submit")) cls = "info";
  else if(s.includes("fail")) cls = "danger";
  return `<span class="badge ${cls}">${status}</span>`;
}
function progressBar(pct){
  const p = Math.max(0, Math.min(100, pct ?? 0));
  return `<div class="progress" title="${p.toFixed(0)}%"><div style="width:${p}%;"></div></div>`;
}

function uniqSorted(values){
  const set = new Set();
  (values || []).forEach(v=>{
    if(v === null || v === undefined) return;
    const s = String(v).trim();
    if(!s) return;
    set.add(s);
  });
  return Array.from(set).sort((a,b)=>a.localeCompare(b));
}

function setSelectOptions(sel, options, placeholder="All"){
  if(!sel) return;
  sel.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder;
  sel.appendChild(opt0);

  options.forEach(v=>{
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    sel.appendChild(o);
  });
}

function renderMeta(data){
  const meta = document.getElementById("lb-meta");
  if(!meta) return;
  meta.innerHTML = `
    <div class="kv">
      <span>Last updated: <code>${data.updated_at || "—"}</code></span>
      <span>Dataset version: <code>${data.dataset_version || "—"}</code></span>
      <span>Vol standardization: <code>${(data.vol_standardization ? (data.vol_standardization*100).toFixed(0) : 10)}% ex-post</code></span>
    </div>
  `;
}

function renderNote(data){
  const note = document.getElementById("lb-note");
  if(!note) return;
  note.textContent = data.note || "For easier comparability, all models are rescaled to a common ex-post volatility. Sharpe ratios are unaffected by this scaling.";
}

function renderQueue(queue){
  const qbody = document.getElementById("queue-body");
  if(!qbody) return;
  qbody.innerHTML = "";
  (queue || []).forEach((r)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div><strong>${r.model_name || "—"}</strong></div>
        <div class="small">Author: ${r.author || "—"}</div>
      </td>
      <td>${r.language || "—"}</td>
      <td>${badge(r.status || "Submitted")}</td>
      <td>${progressBar(r.progress ?? 0)}</td>
      <td class="small">${r.message || "—"}</td>
      <td class="small">${r.submitted || "—"}</td>
    `;
    qbody.appendChild(tr);
  });
}

function renderEntries(entries){
  const tbody = document.getElementById("lb-body");
  if(!tbody) return;
  tbody.innerHTML = "";
  (entries || []).forEach((r, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="num">${r.rank ?? (idx+1)}</td>
      <td>
        <div><strong>${r.model_name || "—"}</strong></div>
        <div class="small">Author: ${r.author || "—"}</div>
      </td>
      <td>${r.language || "—"}</td>
      <td>${badge(r.status || "Scored")}</td>
      <td class="num">${fmtNum(r.sharpe, 4)}</td>
      <td class="num">${fmtPct(r.ann_return, 2)}</td>
      <td class="num">${fmtPct(r.ann_vol, 2)}</td>
      <td class="num">${fmtPct(r.max_drawdown, 2)}</td>
      <td class="num">${r.year || "—"}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initLeaderboard(data){
  const all = (data.entries || []).slice();

  // Controls
  const elSearch = document.getElementById('lb-search');
  const elLang = document.getElementById('lb-lang');
  const elStatus = document.getElementById('lb-status');
  const elYear = document.getElementById('lb-year');
  const elPageSize = document.getElementById('lb-page-size');
  const elPrev = document.getElementById('lb-prev');
  const elNext = document.getElementById('lb-next');
  const elInfo = document.getElementById('lb-page-info');
  const elClear = document.getElementById('lb-clear');

  // Populate selects
  setSelectOptions(elLang, uniqSorted(all.map(x=>x.language)), 'All languages');
  setSelectOptions(elStatus, uniqSorted(all.map(x=>x.status)), 'All statuses');

  const years = Array.from(new Set(all.map(x=>x.year).filter(x=>x!==null && x!==undefined)))
    .sort((a,b)=>Number(b)-Number(a))
    .map(x=>String(x));
  setSelectOptions(elYear, years, 'All years');

  // State
  const state = {
    search: '',
    lang: '',
    status: '',
    year: '',
    page: 1,
    pageSize: Number(elPageSize?.value || 10),
  };

  function matches(r){
    if(state.lang && String(r.language||'') !== state.lang) return false;
    if(state.status && String(r.status||'') !== state.status) return false;
    if(state.year && String(r.year||'') !== state.year) return false;

    const q = state.search.trim().toLowerCase();
    if(q){
      const hay = `${r.model_name||''} ${r.author||''}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  }

  function getFiltered(){
    return all.filter(matches);
  }

  function clampPage(total){
    const maxPage = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.max(1, Math.min(maxPage, state.page));
    return maxPage;
  }

  function render(){
    const filtered = getFiltered();
    const maxPage = clampPage(filtered.length);

    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const pageRows = filtered.slice(start, end);

    renderEntries(pageRows);

    if(elInfo){
      const from = filtered.length ? (start + 1) : 0;
      const to = Math.min(end, filtered.length);
      elInfo.textContent = `Showing ${from}–${to} of ${filtered.length} (page ${state.page}/${maxPage})`;
    }

    if(elPrev) elPrev.disabled = state.page <= 1;
    if(elNext) elNext.disabled = state.page >= maxPage;
  }

  function resetAndRender(){
    state.page = 1;
    render();
  }

  // Event listeners
  if(elSearch){
    let t = null;
    elSearch.addEventListener('input', ()=>{
      clearTimeout(t);
      t = setTimeout(()=>{
        state.search = elSearch.value || '';
        resetAndRender();
      }, 120);
    });
  }
  if(elLang){
    elLang.addEventListener('change', ()=>{
      state.lang = elLang.value || '';
      resetAndRender();
    });
  }
  if(elStatus){
    elStatus.addEventListener('change', ()=>{
      state.status = elStatus.value || '';
      resetAndRender();
    });
  }
  if(elYear){
    elYear.addEventListener('change', ()=>{
      state.year = elYear.value || '';
      resetAndRender();
    });
  }
  if(elPageSize){
    elPageSize.addEventListener('change', ()=>{
      state.pageSize = Number(elPageSize.value || 10);
      resetAndRender();
    });
  }
  if(elPrev){
    elPrev.addEventListener('click', ()=>{
      state.page = Math.max(1, state.page - 1);
      render();
    });
  }
  if(elNext){
    elNext.addEventListener('click', ()=>{
      state.page = state.page + 1;
      render();
    });
  }
  if(elClear){
    elClear.addEventListener('click', ()=>{
      state.search = '';
      state.lang = '';
      state.status = '';
      state.year = '';
      state.page = 1;
      if(elSearch) elSearch.value = '';
      if(elLang) elLang.value = '';
      if(elStatus) elStatus.value = '';
      if(elYear) elYear.value = '';
      render();
    });
  }

  // Initial render
  render();
}

(async function(){
  const err = document.getElementById("lb-error");
  try{
    const data = await loadJSON("data/leaderboard.json");
    if(err) err.style.display = 'none';

    renderMeta(data);
    renderNote(data);
    renderQueue(data.queue || []);
    initLeaderboard(data);
  }catch(e){
    console.error(e);
    if(err){
      err.style.display = 'block';
      err.innerHTML = `<div class="notice"><strong>Could not load leaderboard data.</strong><div class="small mono">${String(e.message || e)}</div><div class="small">Tip: if you are previewing locally, run <code>python -m http.server</code> in the <code>docs/</code> folder.</div></div>`;
    }
  }
})();
