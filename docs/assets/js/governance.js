async function loadText(url){
  const res = await fetch(url, {cache: 'no-store'});
  if(!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return await res.text();
}

(async function(){
  const err = document.getElementById('gov-error');
  const content = document.getElementById('gov-content');
  try{
    const md = await loadText('downloads/GOVERNANCE_v0.1.md');
    if(content){
      content.innerHTML = renderMarkdown(md);
    }
    if(err){ err.style.display = 'none'; }
  }catch(e){
    console.error(e);
    if(err){
      err.style.display = 'block';
      err.innerHTML = `<strong>Could not load governance markdown.</strong><div class="small mono" style="margin-top:6px;">${String(e.message || e)}</div>`;
    }
    if(content){
      content.innerHTML = `<p class="small">Tip: if you are previewing locally, run <code>python -m http.server</code> in the <code>docs/</code> folder.</p>`;
    }
  }
})();
