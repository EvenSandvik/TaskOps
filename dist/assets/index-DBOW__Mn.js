(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=e(a);fetch(a.href,o)}})();const k="tasktrack.tasks",A="tasktrack.zoom",w=.2,I=2,b=.05,M=.0022,z=/(https?:\/\/[^\s<>"]+)/gi,$="Write the task here...",d=[];let i=1,T,m=null,p=null,v=null;const P=document.querySelector("#app"),Z=t=>({id:t,title:`Task ${t}`,details:"",notes:[]}),c=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),x=t=>{const r=t??"";let e="",s=0;for(const a of r.matchAll(z)){const o=a.index??0,n=a[0];e+=c(r.slice(s,o)),e+=`<a href="${c(n)}" target="_blank" rel="noopener noreferrer">${c(n)}</a>`,s=o+n.length}return e+=c(r.slice(s)),e.replaceAll(`
`,"<br>")},D=t=>t?.trim()?x(t):`<span class="task-links-placeholder">${c($)}</span>`,H=t=>{const r=new Date(t);return Number.isNaN(r.getTime())?"":r.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},_=t=>t.length?t.toSorted((r,e)=>(r.createdAt??0)-(e.createdAt??0)).map(r=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(r.createdAt).toISOString()}">${c(H(r.createdAt))}</time>
            <p class="timeline-note">${x(r.text)}</p>
          </div>
        </li>
      `).join(""):"",f=()=>{localStorage.setItem(k,JSON.stringify(d))},K=()=>{try{const t=localStorage.getItem(k);if(!t)return;const r=JSON.parse(t);if(!Array.isArray(r))return;d.splice(0,d.length,...r.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${s+1}`,details:typeof e.details=="string"?e.details:"",notes:Array.isArray(e.notes)?e.notes.map(a=>({text:typeof a?.text=="string"?a.text:"",createdAt:Number(a?.createdAt)||Date.now()})).filter(a=>a.text.trim()):[]})))}catch{localStorage.removeItem(k)}},R=()=>{localStorage.setItem(A,String(i))},W=()=>{const t=Number(localStorage.getItem(A));Number.isFinite(t)&&(i=h(t,w,I))},h=(t,r,e)=>Math.min(e,Math.max(r,t)),Y=t=>{const r=-t*M;return h(r,-.04,.04)},C=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(i*100)}%`)},j=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(T),T=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},q=t=>{document.body.classList.toggle("is-dragging-task",t)},N=()=>{v?.remove(),v=null},B=t=>{N();const r=t.cloneNode(!0);return r.classList.add("task-card-drag-preview"),r.style.width=`${t.offsetWidth}px`,r.style.height=`${t.offsetHeight}px`,r.style.position="fixed",r.style.top="-9999px",r.style.left="-9999px",r.style.transform=`scale(${i})`,r.style.transformOrigin="top left",r.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(r),v=r,r},L=()=>{m=null,p?.classList.remove("is-dragging-source"),p=null,N(),q(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},O=({showIndicator:t=!1}={})=>{const r=document.querySelector("[data-board]");r&&(r.style.setProperty("--zoom",i.toString()),C(),t&&j())},y=(t,{showIndicator:r=!0}={})=>{i=h(t,w,I),R(),O({showIndicator:r})},F=()=>{const t=(d.at(-1)?.id??0)+1;d.push(Z(t)),f(),g()},E=(t,r,e)=>{const s=d.find(a=>a.id===t);s&&(s[r]=e,f())},G=t=>{const r=d.findIndex(e=>e.id===t);r!==-1&&(d.splice(r,1),f(),g())},S=(t,r)=>{const e=d.find(a=>a.id===t),s=r.trim();!e||!s||(e.notes.push({text:s,createdAt:Date.now()}),f(),g())},J=t=>`
  <section class="task-column" data-task-column data-task-id="${t.id}">
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
          value="${c(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${$}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${c(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${D(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${_(t.notes)}
      </ul>
      <div class="timeline-compose">
        <button class="timeline-plus-button" type="button" aria-label="Add status note" data-open-note-composer data-task-id="${t.id}">+</button>
        <div class="timeline-compose-box" data-note-composer>
          <input
            class="timeline-note-draft"
            type="text"
            placeholder="Write status"
            aria-label="Write status note for task ${t.id}"
            data-note-draft
            data-task-id="${t.id}"
          />
          <button class="timeline-done-button" type="button" data-note-done data-task-id="${t.id}">Done</button>
        </div>
      </div>
    </section>
  </section>
`,g=()=>{P.innerHTML=`
    <main class="shell">
      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${d.map(J).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(i*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-task]")?.addEventListener("click",F),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.closest("[data-task-card]");if(m=o,p=n,p?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",n)){const l=B(n);s.dataTransfer.setDragImage(l,n.getBoundingClientRect().width/2,28)}q(!0)}),e.addEventListener("dragend",()=>{L()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{m&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const s=m??Number(e.dataTransfer?.getData("text/plain"));L(),s&&G(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.dataset.taskInput;E(o,n,a.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const a=e.closest("[data-task-card]"),o=a?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(a?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId);E(o,"details",a.value);const n=a.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");n&&(n.innerHTML=D(a.value))}),e.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const a=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(l=>{if(l!==a.closest("[data-task-column]")){l.classList.remove("is-adding-note");const u=l.querySelector("[data-note-draft]");u instanceof HTMLInputElement&&(u.value="")}});const o=a.closest("[data-task-column]"),n=o?.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(o?.classList.add("is-adding-note"),n.focus())})}),document.querySelectorAll("[data-note-done]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.closest("[data-task-column]"),l=n?.querySelector("[data-note-draft]");if(!(l instanceof HTMLInputElement))return;const u=l.value;if(u.trim()){S(o,u);return}n?.classList.remove("is-adding-note"),l.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation()}),e.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const n=s.currentTarget;n.closest("[data-task-column]")?.classList.remove("is-adding-note"),n.value="";return}if(s.key!=="Enter")return;s.preventDefault();const a=s.currentTarget,o=Number(a.dataset.taskId);S(o,a.value)})}),document.addEventListener("click",e=>{e.target instanceof Element&&e.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const a=s.querySelector("[data-note-draft]");a instanceof HTMLInputElement&&(a.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),y(i+Y(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),y(i+b)),e.key==="-"&&(e.preventDefault(),y(i-b)))},O({showIndicator:!1})};K();W();g();
