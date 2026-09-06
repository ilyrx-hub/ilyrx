const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const auth=$('#auth'), tool=$('#tool'), dash=$('#dashboard'), chat=$('#chat'); let reg=false;
function openPanel(p){p.classList.add('show')}
function closePanels(){[auth,tool,dash,chat].forEach(x=>x.classList.remove('show'))}
function authOpen(r=false){reg=r;openPanel(auth);$('#authTitle').textContent=r?'Create your account':'Welcome back';$('#submit').textContent=r?'Create account':'Sign in';$('#email').style.display=r?'block':'none';$('#switch').textContent=r?'Already have an account? Sign in':'Create a new account';}
$('#account').onclick=()=>localStorage.getItem('ilyrx_session')?openDashboard():authOpen(false);
$('#create').onclick=()=>authOpen(true);
$$('.close').forEach(b=>b.onclick=closePanels);
$('#switch').onclick=()=>authOpen(!reg);
$('#submit').onclick=()=>{
 const u=$('#user').value.trim(), e=$('#email').value.trim(), p=$('#pass').value;
 if(u.length<3||p.length<6)return alert('Use a username (3+) and password (6+).');
 let a=JSON.parse(localStorage.getItem('ilyrx_accounts')||'{}');
 if(reg){if(!e.includes('@'))return alert('Enter a valid email.');if(a[u])return alert('Username already exists.');a[u]={email:e,password:p};localStorage.setItem('ilyrx_accounts',JSON.stringify(a));}
 else if(!a[u]||a[u].password!==p)return alert('Invalid username or password.');
 localStorage.setItem('ilyrx_session',u); updateAccount(); closePanels();
};
function updateAccount(){const u=localStorage.getItem('ilyrx_session');$('#account').textContent=u||'Sign in';}
function openDashboard(){const u=localStorage.getItem('ilyrx_session'), a=JSON.parse(localStorage.getItem('ilyrx_accounts')||'{}');$('#dashUser').textContent=u||'Guest';$('#dashEmail').textContent=u&&a[u]?a[u].email:'Not signed in';$('#avatar').textContent=(u||'G').slice(0,1).toUpperCase();openPanel(dash)}
$('#logout').onclick=()=>{localStorage.removeItem('ilyrx_session');updateAccount();closePanels()};
updateAccount();

$('#theme').onclick=()=>document.body.classList.toggle('light');
const tools={
 json:['JSON Formatter',`<textarea id="ta" placeholder='{"name":"IlyrX"}'></textarea><button class="primary" id="go">Format</button><pre class="toolout" id="out"></pre>`],
 counter:['Character Counter',`<textarea id="ta" placeholder="Type here..."></textarea><div class="toolout" id="out">Characters: 0 | Words: 0 | Lines: 0</div>`],
 password:['Password Generator',`<label>Length</label><input id="len" type="number" value="18" min="8" max="64"><button class="primary" id="go">Generate</button><div class="toolout" id="out"></div>`],
 color:['Color Converter',`<input id="ta" value="#7567ff"><button class="primary" id="go">Convert</button><div class="toolout" id="out"></div>`]
};
$$('[data-tool]').forEach(b=>b.onclick=()=>{let d=tools[b.dataset.tool];$('#toolTitle').textContent=d[0];$('#toolBody').innerHTML=d[1];openPanel(tool);let t=b.dataset.tool;
if(t==='json')$('#go').onclick=()=>{try{$('#out').textContent=JSON.stringify(JSON.parse($('#ta').value),null,2)}catch(e){$('#out').textContent='Invalid JSON'}};
if(t==='counter')$('#ta').oninput=e=>{let v=e.target.value;$('#out').textContent=`Characters: ${v.length} | Words: ${v.trim()?v.trim().split(/\s+/).length:0} | Lines: ${v?v.split('\n').length:0}`};
if(t==='password')$('#go').onclick=()=>{let c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*',n=Math.max(8,Math.min(64,+$('#len').value||18)),p='';crypto.getRandomValues(new Uint32Array(n)).forEach(x=>p+=c[x%c.length]);$('#out').textContent=p};
if(t==='color')$('#go').onclick=()=>{let h=$('#ta').value.replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))return $('#out').textContent='Use a 6-digit HEX value.';$('#out').textContent=`HEX: #${h.toUpperCase()}\nRGB: rgb(${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)})`};
});
$('#search').oninput=e=>$$('.download-item').forEach(x=>x.style.display=x.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'grid':'none');
$$('.download').forEach(b=>b.onclick=()=>{let n=+(localStorage.getItem('ilyrx_downloads')||0)+1;localStorage.setItem('ilyrx_downloads',n);alert('Demo download started. Add your real file URL to enable the actual download.');});
$('#notify').onclick=()=>alert('2 notifications: Welcome to IlyrX! • Developer tools updated.');
$('#chatLauncher').onclick=()=>openPanel(chat);
$('#sendChat').onclick=sendChat;$('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});
function sendChat(){let v=$('#chatInput').value.trim();if(!v)return;$('#messages').insertAdjacentHTML('beforeend',`<div class="msg user">${escapeHtml(v)}</div>`);$('#chatInput').value='';setTimeout(()=>$('#messages').insertAdjacentHTML('beforeend',`<div class="msg bot">Thanks! This demo can be connected to a real support system or backend for live replies.</div>`),500)}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});
