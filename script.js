const $ = s => document.querySelector(s);

const theme = $("#theme");
theme.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("theme") === "light") document.body.classList.add("light");

const menu = $("#menu"), nav = $("#nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("mobile-open");
  if (open) {
    nav.style.display = "flex"; nav.style.position = "absolute"; nav.style.top = "72px"; nav.style.left = "0"; nav.style.right = "0";
    nav.style.padding = "18px 4%"; nav.style.background = "#080b12"; nav.style.flexDirection = "column";
  } else nav.removeAttribute("style");
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { if (window.innerWidth <= 900) nav.removeAttribute("style"); }));

const toast = message => {
  const t = $("#toast"); t.textContent = message; t.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
};

$("#gen").addEventListener("click", () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 16; i++) password += chars[Math.floor(Math.random() * chars.length)];
  $("#pass").value = password; toast("Password generated locally");
});

let expression = "";
const calc = $("#calc"), keys = $("#keys");
["7","8","9","÷","4","5","6","×","1","2","3","−","C","0",".","+","="].forEach(key => {
  const button = document.createElement("button"); button.textContent = key;
  button.addEventListener("click", () => {
    if (key === "C") { expression = ""; calc.value = "0"; return; }
    if (key === "=") {
      try {
        if (!expression) return;
        const result = Function("return " + expression.replaceAll("÷", "/").replaceAll("×", "*").replaceAll("−", "-"))();
        expression = String(result); calc.value = expression;
      } catch { expression = ""; calc.value = "Error"; }
      return;
    }
    expression += key; calc.value = expression;
  }); keys.appendChild(button);
});

$("#counter").addEventListener("input", e => {
  const value = e.target.value;
  $("#chars").textContent = `${value.length} characters`;
  $("#words").textContent = `${value.trim() ? value.trim().split(/\s+/).length : 0} words`;
});

const search = $("#search"), filter = $("#filter"), items = [...document.querySelectorAll("#downloadsList article")], none = $("#none");
function filterResources() {
  const query = search.value.toLowerCase().trim(), category = filter.value;
  let visible = 0;
  items.forEach(item => {
    const match = item.dataset.search.includes(query) && (category === "all" || item.dataset.cat === category);
    item.classList.toggle("hide", !match); if (match) visible++;
  });
  none.style.display = visible ? "none" : "block";
}
search.addEventListener("input", filterResources); filter.addEventListener("change", filterResources);
