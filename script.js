const $=s=>document.querySelector(s);
$("#theme").onclick=()=>{document.body.classList.toggle("light");localStorage.theme=document.body.classList.contains("light")?"light":"dark"};
if(localStorage.theme==="light")document.body.classList.add("light");
$("#menu").onclick=()=>{const n=$("#nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="70px";n.style.left="0";n.style.right="0";n.style.padding="18px 4%";n.style.background="#080a10";n.style.flexDirection="column"};
const search=$("#search"),filter=$("#filter"),items=[...document.querySelectorAll("#downloadsList article")],none=$("#none");
function filterItems(){let q=search.value.toLowerCase(),c=filter.value,count=0;items.forEach(x=>{let ok=(x.dataset.search.includes(q))&&(c==="all"||x.dataset.cat===c);x.classList.toggle("hide",!ok);if(ok)count++});none.style.display=count?"none":"block"}
search.oninput=filterItems;filter.onchange=filterItems;
const toast=m=>{let t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2200)};
document.querySelectorAll("[data-msg]").forEach(x=>x.onclick=e=>{e.preventDefault();toast(x.dataset.msg)});
$("#gen").onclick=()=>{let s="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";let p="";for(let i=0;i<16;i++)p+=s[Math.floor(Math.random()*s.length)];$("#pass").value=p};
let exp="",calc=$("#calc"),keys=$("#keys");
["7","8","9","÷","4","5","6","×","1","2","3","−","C","0",".","+","="].forEach(k=>{let b=document.createElement("button");b.textContent=k;b.onclick=()=>{if(k==="C"){exp="";calc.value=0}else if(k==="="){try{exp=String(Function("return "+exp.replaceAll("÷","/").replaceAll("×","*").replaceAll("−","-"))());calc.value=exp}catch{exp="";calc.value="Error"}}else{exp+=k;calc.value=exp}};keys.appendChild(b)});
$("#counter").oninput=e=>{let v=e.target.value;$("#chars").textContent=v.length+" characters";$("#words").textContent=(v.trim()?v.trim().split(/\s+/).length:0)+" words"};
