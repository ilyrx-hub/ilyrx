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

/* IlyrX local account system.
   This is suitable for a static GitHub Pages site: accounts are stored locally in the browser.
   For real multi-device authentication, connect the same UI to Supabase Auth (see SETUP.md). */
(function(){
 const K="ilyrx_local_users_v1", S="ilyrx_local_session_v1";
 const load=()=>JSON.parse(localStorage.getItem(K)||"[]");
 const save=x=>localStorage.setItem(K,JSON.stringify(x));
 const session=()=>JSON.parse(localStorage.getItem(S)||"null");
 const setSession=u=>{if(u)localStorage.setItem(S,JSON.stringify(u));else localStorage.removeItem(S);window.currentUser=u;};
 const esc=x=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
 window.ilyrxAuth={
  register(name,email,password){
   name=name.trim(); email=email.trim().toLowerCase();
   if(!name||!email||password.length<6)return toast("Use a username, valid email and password of 6+ characters.");
   let users=load(); if(users.some(u=>u.email===email))return toast("An account with this email already exists.");
   const u={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,email,password,createdAt:new Date().toISOString()};
   users.push(u);save(users);setSession({id:u.id,name:u.name,email:u.email});updateUI();toast("Account created successfully."); closeAuth?.();
  },
  login(email,password){
   email=email.trim().toLowerCase();const u=load().find(x=>x.email===email&&x.password===password);
   if(!u)return toast("Incorrect email or password.");
   setSession({id:u.id,name:u.name,email:u.email});updateUI();toast("Welcome back, "+u.name+"!");closeAuth?.();
  },
  logout(){setSession(null);updateUI();toast("Signed out.");},
  reset(email){const u=load().find(x=>x.email===email.trim().toLowerCase());toast(u?"Password reset demo: check your email (connect Supabase email reset for production).":"No account found for that email.")}
 };
 setSession(session());
 const modal=document.createElement("div");modal.id="authModal";modal.innerHTML=`
 <div class="auth-overlay"><div class="auth-box">
 <button class="auth-close" aria-label="Close">×</button><span class="eyebrow">ILYRX ACCOUNT</span><h3 id="authTitle">Welcome back</h3>
 <p id="authDesc">Sign in to your library and download history.</p>
 <div id="authFields"></div><button class="primary auth-submit" id="authSubmit">Sign in</button>
 <button class="auth-switch" id="authSwitch">Create an account</button>
 </div></div>`;
 document.body.appendChild(modal);
 const fields=modal.querySelector("#authFields"),title=modal.querySelector("#authTitle"),desc=modal.querySelector("#authDesc"),submit=modal.querySelector("#authSubmit"),sw=modal.querySelector("#authSwitch");
 let mode="login";
 function render(){title.textContent=mode==="login"?"Welcome back":"Create your IlyrX account";desc.textContent=mode==="login"?"Sign in to your library and download history.":"Create a free account to save games and track downloads.";fields.innerHTML=(mode==="register"?'<label>Username<input id="authName" autocomplete="username"></label>':'')+'<label>Email<input id="authEmail" type="email" autocomplete="email"></label><label>Password<input id="authPass" type="password" autocomplete="'+(mode==="login"?"current-password":"new-password")+'"></label>'+(mode==="login"?'<button class="forgot" id="forgot">Forgot password?</button>':'');submit.textContent=mode==="login"?"Sign in":"Create account";sw.textContent=mode==="login"?"Create an account":"Already have an account";modal.querySelector("#forgot")?.addEventListener("click",()=>{const e=modal.querySelector("#authEmail").value;ilyrxAuth.reset(e)});}
 window.openAuth=m=>{mode=m||"login";render();modal.classList.add("show");};
 window.closeAuth=()=>modal.classList.remove("show");
 modal.querySelector(".auth-close").onclick=closeAuth;sw.onclick=()=>{mode=mode==="login"?"register":"login";render()};
 submit.onclick=()=>mode==="login"?ilyrxAuth.login(modal.querySelector("#authEmail").value,modal.querySelector("#authPass").value):ilyrxAuth.register(modal.querySelector("#authName").value,modal.querySelector("#authEmail").value,modal.querySelector("#authPass").value);
 render();
 document.addEventListener("click",e=>{const b=e.target.closest("#accountBtn,#heroLogin,#heroAccount,#supportAccount,#dashboardLogin");if(!b)return;e.preventDefault();openAuth(currentUser?"profile":"login")});
})();
