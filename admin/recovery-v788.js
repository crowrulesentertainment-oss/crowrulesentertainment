(function(){
function esc(v){return String(v??"").replace(/</g,"&lt;")}
async function loadV788(){
 const sb=window.sb; if(!sb)return;
 let box=document.getElementById("v788TrustDrift");
 if(!box){box=document.createElement("div");box.className="panel";box.id="v788TrustDrift";box.innerHTML='<h2>V7.88 RECOVERY TRUST HISTORY &amp; DRIFT</h2><pre id="v788Summary" class="muted">CONNECTING</pre><div id="v788History" class="muted"></div><button class="btn" id="v788Verify">VERIFY DRIFT</button><button class="btn" id="v788Baseline">SET TRUSTED BASELINE</button>';const t=document.getElementById("trustSummary")?.closest(".panel");if(t)t.parentNode.insertBefore(box,t);else document.getElementById("app")?.prepend(box)}
 const h=await sb.rpc("cr_podcast_recovery_trust_history_v787",{p_limit:1});
 if(h.error||!h.data?.length){document.getElementById("v788Summary").textContent=h.error?"V7.88: "+String(h.error.message||h.error):"No V7.87 trust verification exists yet.";return}
 const id=h.data[0].id;
 const d=await sb.rpc("cr_podcast_recovery_trust_drift_verify_v788",{p_verification_id:id});
 document.getElementById("v788Summary").textContent=d.error?"V7.88: "+String(d.error.message||d.error):JSON.stringify(d.data,null,2);
 const hist=await sb.rpc("cr_podcast_recovery_trust_drift_history_v788",{p_limit:25});
 document.getElementById("v788History").innerHTML=hist.error?"V7.88: "+esc(hist.error.message):"<h3>DRIFT HISTORY</h3>"+(hist.data?.length?hist.data.map(x=>"<div class='panel'><strong>"+esc(x.drift_status)+"</strong> • Δ "+esc(x.score_delta)+" • "+esc(x.detected_at)+"<br>"+esc(JSON.stringify(x.drift_types))+"</div>").join(""):"No drift records.");
 document.getElementById("v788Verify").onclick=loadV788;
 document.getElementById("v788Baseline").onclick=async()=>{const r=await sb.rpc("cr_podcast_recovery_trust_baseline_v788",{p_verification_id:id});if(r.error)alert(String(r.error.message||r.error));else await loadV788()};
}
window.addEventListener("load",()=>setTimeout(loadV788,1200));
})();
