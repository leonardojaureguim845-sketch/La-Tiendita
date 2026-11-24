const screens=[...document.querySelectorAll(".screen")];
const viewButtons=[...document.querySelectorAll("[data-view]")];
const names={portada:"PORTADA",catalogo:"CATÁLOGO",ubicacion:"UBICACIÓN"};
function showView(id){
  if(!document.getElementById(id))return;
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
  document.querySelectorAll(".side-link,.mobile-link").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  document.getElementById("crumbCurrent").textContent=names[id]||"PORTADA";
}
viewButtons.forEach(b=>b.addEventListener("click",e=>{e.preventDefault();showView(b.dataset.view)}));
const themeToggle=document.getElementById("themeToggle");
if(localStorage.getItem("tiendita-theme")==="dark")document.body.classList.add("dark");
function updateThemeIcon(){themeToggle.textContent=document.body.classList.contains("dark")?"☼":"☾"}
themeToggle.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("tiendita-theme",document.body.classList.contains("dark")?"dark":"light");updateThemeIcon()});
updateThemeIcon();

const cards=[...document.querySelectorAll(".product-card")];
const perPage=12;let currentPage=0,activeCategory="todos",query="";
const count=document.getElementById("productCount");
const indicator=document.getElementById("pageIndicator");
function renderProducts(){
  const filtered=cards.filter(c=>(activeCategory==="todos"||c.dataset.category===activeCategory)&&c.dataset.name.includes(query));
  count.textContent=filtered.length;
  const pages=Math.max(1,Math.ceil(filtered.length/perPage));
  currentPage=Math.min(currentPage,pages-1);
  cards.forEach(c=>c.classList.add("hidden"));
  filtered.slice(currentPage*perPage,(currentPage+1)*perPage).forEach(c=>c.classList.remove("hidden"));
  const first=filtered.length?currentPage*perPage+1:0;
  const last=Math.min((currentPage+1)*perPage,filtered.length);
  indicator.textContent=`MOSTRANDO ${first}–${last} DE ${filtered.length}`;
  document.getElementById("prevPage").disabled=currentPage===0;
  document.getElementById("nextPage").disabled=currentPage>=pages-1;
}
document.querySelectorAll(".category-pill").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".category-pill").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");activeCategory=b.dataset.category;currentPage=0;renderProducts();
}));
document.getElementById("productSearch").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();currentPage=0;renderProducts()});
document.getElementById("prevPage").addEventListener("click",()=>{currentPage--;renderProducts()});
document.getElementById("nextPage").addEventListener("click",()=>{currentPage++;renderProducts()});
renderProducts();

if("serviceWorker" in navigator && location.protocol!=="file:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("No se pudo registrar el Service Worker",err)));
}

const mobileMenuBtn=document.getElementById("mobileMenuBtn");
const mobileMenu=document.getElementById("mobileMenu");
if(mobileMenuBtn&&mobileMenu){
  mobileMenuBtn.addEventListener("click",()=>{
    const open=mobileMenu.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded",String(open));
    mobileMenuBtn.textContent=open?"✕":"☰";
  });
  mobileMenu.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>{
    showView(btn.dataset.view);
    mobileMenu.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded","false");
    mobileMenuBtn.textContent="☰";
  }));
}
