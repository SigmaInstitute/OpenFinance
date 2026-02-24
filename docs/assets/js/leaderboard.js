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

function renderLeaderboard(data){
  const meta = document.getElementById("lb-meta");
  if(meta){
    meta.innerHTML = `
      <div class="kv">
        <span>Last updated: <code>${data.updated_at || "—"}</code></span>
        <span>Dataset version: <code>${data.dataset_version || "—"}</code></span>
        <span>Vol standardization: <code>${(data.vol_standardization ? (data.vol_standardization*100).toFixed(0) : 10)}% ex-post</code></span>
      </div>
    `;
  }

  const tbody = document.getElementById("lb-body");
  tbody.innerHTML = "";
  (data.entries || []).forEach((r, idx)=>{
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

  const note = document.getElementById("lb-note");
  if(note){
    note.textContent = data.note || "For easier comparability, all models are rescaled to a common ex-post volatility. Sharpe ratios are unaffected by this scaling.";
  }

  const qbody = document.getElementById("queue-body");
  qbody.innerHTML = "";
  (data.queue || []).forEach((r)=>{
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

(async function(){
  const err = document.getElementById("lb-error");
  try{
    const data = await loadJSON("data/leaderboard.json");
    renderLeaderboard(data);
  }catch(e){
    console.error(e);
    if(err){
      err.innerHTML = `<div class="notice"><strong>Could not load leaderboard data.</strong><div class="small mono">${String(e.message || e)}</div><div class="small">Tip: if you are previewing locally, run <code>python -m http.server</code> in the <code>docs/</code> folder.</div></div>`;
    }
  }
})();