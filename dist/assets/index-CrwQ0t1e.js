(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const f="tasktrack.tasks",L="tasktrack.zoom",S=.2,E=2,y=.05,x=.0022,z=/(https?:\/\/[^\s<>"]+)/gi,w="Write the task here...",d=[];let n=1,h,c=null,u=null,m=null;const q=document.querySelector("#app"),N=t=>({id:t,title:`Task ${t}`,details:""}),l=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),M=t=>{const a=t??"";let e="",s=0;for(const r of a.matchAll(z)){const o=r.index??0,i=r[0];e+=l(a.slice(s,o)),e+=`<a href="${l(i)}" target="_blank" rel="noopener noreferrer">${l(i)}</a>`,s=o+i.length}return e+=l(a.slice(s)),e.replaceAll(`
`,"<br>")},A=t=>t?.trim()?M(t):`<span class="task-links-placeholder">${l(w)}</span>`,g=()=>{localStorage.setItem(f,JSON.stringify(d))},Z=()=>{try{const t=localStorage.getItem(f);if(!t)return;const a=JSON.parse(t);if(!Array.isArray(a))return;d.splice(0,d.length,...a.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${s+1}`,details:typeof e.details=="string"?e.details:""})))}catch{localStorage.removeItem(f)}},P=()=>{localStorage.setItem(L,String(n))},_=()=>{const t=Number(localStorage.getItem(L));Number.isFinite(t)&&(n=v(t,S,E))},v=(t,a,e)=>Math.min(e,Math.max(a,t)),H=t=>{const a=-t*x;return v(a,-.04,.04)},K=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(n*100)}%`)},R=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(h),h=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},I=t=>{document.body.classList.toggle("is-dragging-task",t)},O=()=>{m?.remove(),m=null},Y=t=>{O();const a=t.cloneNode(!0);return a.classList.add("task-card-drag-preview"),a.style.width=`${t.offsetWidth}px`,a.style.height=`${t.offsetHeight}px`,a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.transform=`scale(${n})`,a.style.transformOrigin="top left",a.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(a),m=a,a},b=()=>{c=null,u?.classList.remove("is-dragging-source"),u=null,O(),I(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},$=({showIndicator:t=!1}={})=>{const a=document.querySelector("[data-board]");a&&(a.style.setProperty("--zoom",n.toString()),K(),t&&R())},p=(t,{showIndicator:a=!0}={})=>{n=v(t,S,E),P(),$({showIndicator:a})},C=()=>{const t=(d.at(-1)?.id??0)+1;d.push(N(t)),g(),k()},T=(t,a,e)=>{const s=d.find(r=>r.id===t);s&&(s[a]=e,g())},W=t=>{const a=d.findIndex(e=>e.id===t);a!==-1&&(d.splice(a,1),g(),k())},B=t=>`
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
        value="${l(t.title)}"
        aria-label="Task title ${t.id}"
        data-task-input="title"
        data-task-id="${t.id}"
      />
    </div>
    <textarea
      class="task-details task-details-input"
      rows="8"
      placeholder="${w}"
      aria-label="Task details ${t.id}"
      data-task-input="details"
      data-task-id="${t.id}"
    >${l(t.details)}</textarea>
    <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
      ${A(t.details)}
    </div>
  </article>
`,k=()=>{q.innerHTML=`
    <main class="shell">
      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${d.map(B).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(n*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-task]")?.addEventListener("click",C),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.closest("[data-task-card]");if(c=o,u=i,u?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",i)){const D=Y(i);s.dataTransfer.setDragImage(D,i.getBoundingClientRect().width/2,28)}I(!0)}),e.addEventListener("dragend",()=>{b()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{c&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const s=c??Number(e.dataTransfer?.getData("text/plain"));b(),s&&W(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.dataset.taskInput;T(o,i,r.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const r=e.closest("[data-task-card]"),o=r?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(r?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId);T(o,"details",r.value);const i=r.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");i&&(i.innerHTML=A(r.value))}),e.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),p(n+H(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),p(n+y)),e.key==="-"&&(e.preventDefault(),p(n-y)))},$({showIndicator:!1})};Z();_();k();
