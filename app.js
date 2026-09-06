(() => {
const cfg=window.ILYRX_CONFIG||{};
const configured=cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR-PROJECT")&&cfg.SUPABASE_PUBLISHABLE_KEY&&!cfg.SUPABASE_PUBLISHABLE_KEY.includes("YOUR_");
const supabase=configured&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY):null;
const $=s=>document.querySelector(s); let currentUser=null,mode="login",channel=null;
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function openAuth(m="login"){mode=m;$("#authTitle").textContent=m==="login"?"Welcome back":"Create your account";$("#authSub").textContent=m==="login"?"Sign in to your IlyrX account.":"Join IlyrX and access your dashboard.";$("#authSubmit").textContent=m==="login"?"Sign in":"Create account";$("#nameWrap").classList.toggle("hidden",m==="login");$("#forgotBtn").classList.toggle("hidden",m!=="login");$("#switchText").textContent=m==="login"?"Don't have an account?":"Already have an account?";$("#switchAuth").textContent=m==="login"?"Create one":"Sign in";$("#authMessage").textContent="";$("#authModal").classList.remove("hidden")}
function closeAuth(){$("#authModal").classList.add("hidden")}
function updateUI(){const n=currentUser?(currentUser.user_metadata?.username||currentUser.email.split("@")[0]):"Login";$("#accountBtn").textContent=n;$("#heroAccount").textContent=currentUser?"Client Area":"Get Started";$("#heroLogin").textContent=currentUser?"Open Account":"Create Account";$("#supportAccount").textContent=currentUser?"Open Client Area →":"Create Account →";const dn=currentUser?(currentUser.user_metadata?.username||currentUser.email.split("@")[0]):"Guest";$("#dashUser")&&($("#dashUser").textContent=dn);$("#dashEmail")&&($("#dashEmail").textContent=currentUser?.email||"Not signed in");$("#welcomeName")&&($("#welcomeName").textContent=currentUser?dn:"Guest");$("#dashAvatar")&&($("#dashAvatar").textContent=dn[0].toUpperCase());$("#profileDashAvatar")&&($("#profileDashAvatar").textContent=dn[0].toUpperCase());$("#profileUsername")&&($("#profileUsername").value=currentUser?.user_metadata?.username||dn);$("#profileEmailInput")&&($("#profileEmailInput").value=currentUser?.email||"");}
function openProfile(){const n=currentUser.user_metadata?.username||currentUser.email.split("@")[0];$("#profileName").textContent=n;$("#profileEmail").textContent=currentUser.email;$("#profileAvatar").textContent=n[0].toUpperCase();$("#profileModal").classList.remove("hidden")}
async function loadChat(){
 if(!supabase||!currentUser){$("#chatStatus").textContent="Sign in to join.";$("#chatInput").disabled=true;$("#chatForm button").disabled=true;return}
 $("#chatStatus").textContent="Realtime room connected.";$("#chatInput").disabled=false;$("#chatForm button").disabled=false;
 const {data,error}=await supabase.from("messages").select("*").order("created_at",{ascending:true}).limit(100);
 if(error){$("#messages").innerHTML='<div class="empty">Run supabase.sql first, then add your project keys in config.js.</div>';return}
 $("#messages").innerHTML="";(data||[]).forEach(addMessage);
 if(channel)await supabase.removeChannel(channel);
 channel=supabase.channel("ilyrx-general").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},p=>addMessage(p.new)).subscribe();
}
function addMessage(m){const box=$("#messages");if(box.querySelector(`[data-id="${m.id}"]`))return;if(box.querySelector(".empty"))box.innerHTML="";const el=document.createElement("div");el.className="message";el.dataset.id=m.id;const n=m.username||"User";el.innerHTML=`<div class="message-head"><span class="avatar">${escape(n[0].toUpperCase())}</span><b>${escape(n)}</b><time>${new Date(m.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</time></div><p>${escape(m.content)}</p>`;box.appendChild(el);box.scrollTop=box.scrollHeight}
$("#accountBtn").onclick=()=>currentUser?openProfile():openAuth("login");
$("#heroAccount").onclick=()=>currentUser?openProfile():openAuth("signup");
$("#heroLogin").onclick=()=>currentUser?openProfile():openAuth("signup");
$("#supportAccount").onclick=()=>currentUser?openProfile():openAuth("signup");
$("#closeAuth").onclick=closeAuth;$("#closeProfile").onclick=()=>$("#profileModal").classList.add("hidden");
$("#switchAuth").onclick=e=>{e.preventDefault();openAuth(mode==="login"?"signup":"login")};
$("#authModal").onclick=e=>{if(e.target.id==="authModal")closeAuth()};
$("#profileModal").onclick=e=>{if(e.target.id==="profileModal")$("#profileModal").classList.add("hidden")};
$("#authForm").onsubmit=async e=>{e.preventDefault();if(!supabase){$("#authMessage").textContent="Configure Supabase first in config.js.";return}const email=$("#authEmail").value.trim(),password=$("#authPassword").value;$("#authMessage").textContent="Please wait…";let r;if(mode==="login")r=await supabase.auth.signInWithPassword({email,password});else{const username=$("#authName").value.trim();if(!username){$("#authMessage").textContent="Username is required.";return}r=await supabase.auth.signUp({email,password,options:{data:{username}}})}if(r.error){$("#authMessage").textContent=r.error.message;return}$("#authMessage").textContent=mode==="signup"?"Account created. Check your email if confirmation is enabled.":"Signed in.";if(mode==="login")setTimeout(closeAuth,400)};
$("#forgotBtn").onclick=async()=>{if(!supabase)return;const email=$("#authEmail").value.trim();if(!email){$("#authMessage").textContent="Enter your email first.";return}const r=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.href});$("#authMessage").textContent=r.error?r.error.message:"Password reset email sent."};
$("#logoutBtn").onclick=async()=>{if(supabase)await supabase.auth.signOut();$("#profileModal").classList.add("hidden");toast("Signed out.")};
$("#chatForm").onsubmit=async e=>{e.preventDefault();if(!supabase||!currentUser)return;const input=$("#chatInput"),content=input.value.trim();if(!content)return;input.disabled=true;const username=currentUser.user_metadata?.username||currentUser.email.split("@")[0];const r=await supabase.from("messages").insert({user_id:currentUser.id,username,content});input.disabled=false;if(r.error)toast(r.error.message);else input.value=""};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");toast(document.body.classList.contains("light")?"Light mode enabled":"Dark mode enabled")};
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll(".game-card").forEach(c=>c.classList.toggle("hidden-card",f!=="all"&&c.dataset.cat!==f))});
document.querySelectorAll("[data-demo]").forEach(b=>b.onclick=()=>toast(`${b.dataset.demo} is ready for your content.`));
document.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>toast(`${b.dataset.game}: connect this button to your real download link or official release page.`));
$("#notificationBtn")?.addEventListener("click",async()=>{if("Notification"in window){const p=await Notification.requestPermission();toast(p==="granted"?"Browser notifications enabled.":"Notifications not enabled.")}});
(async()=>{if(!supabase){updateUI();return}const s=await supabase.auth.getSession();currentUser=s.data.session?.user||null;updateUI();loadChat();supabase.auth.onAuthStateChange((_e,session)=>{currentUser=session?.user||null;updateUI();loadChat()})})();
})();
document.querySelectorAll(".dash-nav").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".dash-nav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".dash-tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("#tab-"+btn.dataset.tab)?.classList.add("active")});
document.querySelectorAll("[data-tabgo]").forEach(b=>b.onclick=()=>{const t=b.dataset.tabgo;document.querySelector(`.dash-nav[data-tab="${t}"]`)?.click();document.querySelector("#dashboard")?.scrollIntoView({behavior:"smooth"})});
$("#dashboardLogin")?.addEventListener("click",()=>currentUser?document.querySelector('.dash-nav[data-tab="profile"]')?.click():openAuth("login"));
$("#profileLogout")?.addEventListener("click",()=>$("#logoutBtn").click());
$("#newTicket")?.addEventListener("click",()=>toast(currentUser?"Ticket form is ready for your Supabase tickets table.":"Sign in first."));
$("#notifyPermission")?.addEventListener("click",async()=>{if("Notification"in window){const p=await Notification.requestPermission();toast(p==="granted"?"Browser notifications enabled.":"Notifications not enabled.")}else toast("This browser does not support notifications.")});
