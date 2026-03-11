(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const f="tasktrack.tasks",k="tasktrack.zoom",T=.2,S=2,h=.05,O=.0022,n=[];let d=1,v,l=null,c=null,m=null;const z=document.querySelector("#app"),D=t=>({id:t,title:`Task ${t}`,details:""}),p=()=>{localStorage.setItem(f,JSON.stringify(n))},$=()=>{try{const t=localStorage.getItem(f);if(!t)return;const a=JSON.parse(t);if(!Array.isArray(a))return;n.splice(0,n.length,...a.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${s+1}`,details:typeof e.details=="string"?e.details:""})))}catch{localStorage.removeItem(f)}},x=()=>{localStorage.setItem(k,String(d))},N=()=>{const t=Number(localStorage.getItem(k));Number.isFinite(t)&&(d=g(t,T,S))},g=(t,a,e)=>Math.min(e,Math.max(a,t)),Z=t=>{const a=-t*O;return g(a,-.04,.04)},A=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(d*100)}%`)},M=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(v),v=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},L=t=>{document.body.classList.toggle("is-dragging-task",t)},w=()=>{m?.remove(),m=null},q=t=>{w();const a=t.cloneNode(!0);return a.classList.add("task-card-drag-preview"),a.style.width=`${t.offsetWidth}px`,a.style.height=`${t.offsetHeight}px`,a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.transform=`scale(${d})`,a.style.transformOrigin="top left",a.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(a),m=a,a},b=()=>{l=null,c?.classList.remove("is-dragging-source"),c=null,w(),L(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},E=({showIndicator:t=!1}={})=>{const a=document.querySelector("[data-board]");a&&(a.style.setProperty("--zoom",d.toString()),A(),t&&M())},u=(t,{showIndicator:a=!0}={})=>{d=g(t,T,S),x(),E({showIndicator:a})},P=()=>{const t=(n.at(-1)?.id??0)+1;n.push(D(t)),p(),y()},_=(t,a,e)=>{const s=n.find(r=>r.id===t);s&&(s[a]=e,p())},K=t=>{const a=n.findIndex(e=>e.id===t);a!==-1&&(n.splice(a,1),p(),y())},Y=t=>`
  <article class="task-card" data-task-card data-task-id="${t.id}">
    <div class="task-card-header">
      <button
        class="drag-task-button"
        type="button"
        draggable="true"
        aria-label="Drag task ${t.id} to trash"
        title="Drag to trash"
        data-drag-task
        data-task-id="${t.id}"
      >
        ⋮⋮
      </button>
      <input
        class="task-title"
        type="text"
        value="${t.title}"
        aria-label="Task title ${t.id}"
        data-task-input="title"
        data-task-id="${t.id}"
      />
    </div>
    <textarea
      class="task-details"
      rows="8"
      placeholder="Write the task here..."
      aria-label="Task details ${t.id}"
      data-task-input="details"
      data-task-id="${t.id}"
    >${t.details}</textarea>
  </article>
`,y=()=>{z.innerHTML=`
    <main class="shell">
      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${n.map(Y).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(d*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-task]")?.addEventListener("click",P),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.closest("[data-task-card]");if(l=o,c=i,c?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",i)){const I=q(i);s.dataTransfer.setDragImage(I,i.getBoundingClientRect().width/2,28)}L(!0)}),e.addEventListener("dragend",()=>{b()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{l&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const s=l??Number(e.dataTransfer?.getData("text/plain"));b(),s&&K(s)}),document.querySelectorAll("[data-task-input]").forEach(e=>{e.addEventListener("input",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.dataset.taskInput;_(o,i,r.value)})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),u(d+Z(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),u(d+h)),e.key==="-"&&(e.preventDefault(),u(d-h)))},E({showIndicator:!1})};$();N();y();
