(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=o(a);fetch(a.href,s)}})();const l="tasktrack.tasks",k=.2,b=2,u=.05,v=.0022,n=[];let i=1,m;const g=document.querySelector("#app"),T=t=>({id:t,title:`Task ${t}`,details:""}),p=()=>{localStorage.setItem(l,JSON.stringify(n))},O=()=>{try{const t=localStorage.getItem(l);if(!t)return;const e=JSON.parse(t);if(!Array.isArray(e))return;n.splice(0,n.length,...e.map((o,r)=>({id:Number(o.id)||r+1,title:typeof o.title=="string"&&o.title.trim()?o.title:`Task ${r+1}`,details:typeof o.details=="string"?o.details:""})))}catch{localStorage.removeItem(l)}},f=(t,e,o)=>Math.min(o,Math.max(e,t)),S=t=>{const e=-t*v;return f(e,-.04,.04)},w=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(i*100)}%`)},I=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(m),m=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},y=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",i.toString()),w(),t&&I())},d=(t,{showIndicator:e=!0}={})=>{i=f(t,k,b),y({showIndicator:e})},L=()=>{const t=(n.at(-1)?.id??0)+1;n.push(T(t)),p(),h()},E=(t,e,o)=>{const r=n.find(a=>a.id===t);r&&(r[e]=o,p())},M=t=>`
  <article class="task-card">
    <input
      class="task-title"
      type="text"
      value="${t.title}"
      aria-label="Task title ${t.id}"
      data-task-input="title"
      data-task-id="${t.id}"
    />
    <textarea
      class="task-details"
      rows="8"
      placeholder="Write the task here..."
      aria-label="Task details ${t.id}"
      data-task-input="details"
      data-task-id="${t.id}"
    >${t.details}</textarea>
  </article>
`,h=()=>{g.innerHTML=`
    <main class="shell">
      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${n.map(M).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(i*100)}%</span>
      </div>
    </main>
  `,document.querySelector("[data-add-task]")?.addEventListener("click",L),document.querySelectorAll("[data-task-input]").forEach(e=>{e.addEventListener("input",o=>{const r=o.currentTarget,a=Number(r.dataset.taskId),s=r.dataset.taskInput;E(a,s,r.value)})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),d(i+S(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),d(i+u)),e.key==="-"&&(e.preventDefault(),d(i-u)))},y({showIndicator:!1})};O();h();
