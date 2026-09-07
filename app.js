
(function(){
 const sbReady=window.supabase && window.ILYRX_SUPABASE_URL && !String(window.ILYRX_SUPABASE_URL).includes("YOUR_SUPABASE");
 const sb=sbReady?window.supabase.createClient(window.ILYRX_SUPABASE_URL,window.ILYRX_SUPABASE_ANON_KEY):null;
 window.ilyrxSupabase=sb; window.currentUser=null;
 const modal=document.createElement("div"); modal.id="authModal"; modal.style.display="none";
 modal.innerHTML=`<div class="auth-overlay"><div class="auth-box"><button class="auth-close">×</button><label>ILYRX ACCOUNT</label><h3 id="at">Welcome back</h3><p id="ad">Sign in to your library and download history.</p><div id="af"></div><button class="primary-btn auth-submit" id="as">Sign in</button><button class="auth-switch" id="ax">Create an account</button></div></div>`;
 document.body.appendChild(modal);
 let mode="login"; const $=x=>modal.querySelector(x);
 function render(){
  $("#at").textContent=mode==="login"?"Welcome back":mode==="register"?"Create your IlyrX account":"Reset your password";
  $("#ad").textContent=mode==="login"?"Sign in to your library and download history.":mode==="register"?"Create a free account and access your library anywhere.":"Enter your email to receive a reset link.";
  $("#af").innerHTML=(mode==="register"?'<label>Username<input id="an" autocomplete="username"></label>':'')+
   '<label>Email<input id="ae" type="email" autocomplete="email"></label>'+
   (mode!=="reset"?'<label>Password<input id="ap" type="password" autocomplete="'+(mode==="login"?"current-password":"new-password")+'"></label>':'');
  $("#as").textContent=mode==="login"?"Sign in":mode==="register"?"Create account":"Send reset link";
  $("#ax").textContent=mode==="login"?"Create an account":mode==="register"?"Already have an account":"Back to sign in";
  $("#ax").onclick=()=>{mode=mode==="login"?"register":"login";render()};
  if(mode==="login"){const f=document.createElement("button");f.className="forgot";f.textContent="Forgot password?";f.onclick=()=>{mode="reset";render()};$("#af").appendChild(f)}
 }
 function toast(t){let n=document.getElementById("ilyrxToast");if(!n){n=document.createElement("div");n.id="ilyrxToast";n.style="position:fixed;right:18px;bottom:18px;background:#171b22;border:1px solid #343a45;color:#fff;padding:12px 15px;border-radius:8px;font:11px Inter;z-index:10000";document.body.appendChild(n)}n.textContent=t;n.style.display="block";setTimeout(()=>n.style.display="none",3500)}
 window.openAuth=()=>{mode="login";render();modal.style.display="block"};
 $(".auth-close").onclick=()=>modal.style.display="none";
 $("#as").onclick=async()=>{
  if(!sb)return toast("Add your Supabase URL and anon/publishable key in config.js first.");
  const email=$("#ae").value.trim().toLowerCase(); if(!email)return toast("Enter your email.");
  if(mode==="reset"){const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.href});return toast(error?error.message:"Reset email sent.")}
  const password=$("#ap").value;if(password.length<6)return toast("Password must be at least 6 characters.");
  if(mode==="login"){const {error}=await sb.auth.signInWithPassword({email,password});if(error)return toast(error.message);toast("Signed in successfully.");}
  else {const name=$("#an").value.trim();if(name.length<2)return toast("Enter a username.");const {data,error}=await sb.auth.signUp({email,password,options:{data:{username:name}}});if(error)return toast(error.message);toast(data.session?"Account created!":"Check your email to confirm your account.");}
  modal.style.display="none"; await sync();
 };
 async function sync(){if(!sb)return;const {data}=await sb.auth.getUser();window.currentUser=data.user||null;const b=document.getElementById("accountBtn");if(b)b.textContent=window.currentUser?"My Library":"Log in"}
 if(sb)sb.auth.onAuthStateChange(()=>sync());
 document.getElementById("accountBtn")?.addEventListener("click",openAuth);
 document.getElementById("heroAccount")?.addEventListener("click",openAuth);
 document.getElementById("searchBtn")?.addEventListener("click",()=>document.getElementById("searchPanel").classList.toggle("show"));
 document.getElementById("closeSearch")?.addEventListener("click",()=>document.getElementById("searchPanel").classList.remove("show"));
 document.getElementById("siteSearch")?.addEventListener("input",e=>{
   const q=e.target.value.toLowerCase();document.querySelectorAll(".game-card").forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?"":"none");
 });
 render();sync();
})();
