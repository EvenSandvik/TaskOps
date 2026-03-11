(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const y="tasktrack.tasks",E="tasktrack.zoom",L=.2,w=2,h=.05,q=.0022,z=/(https?:\/\/[^\s<>"]+)/gi,$="Write the task here...",d=[];let n=1,b,u=null,m=null,k=null;const M=document.querySelector("#app"),Z=t=>({id:t,title:`Task ${t}`,details:"",notes:[]}),l=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),I=t=>{const a=t??"";let e="",r=0;for(const s of a.matchAll(z)){const o=s.index??0,i=s[0];e+=l(a.slice(r,o)),e+=`<a href="${l(i)}" target="_blank" rel="noopener noreferrer">${l(i)}</a>`,r=o+i.length}return e+=l(a.slice(r)),e.replaceAll(`
`,"<br>")},x=t=>t?.trim()?I(t):`<span class="task-links-placeholder">${l($)}</span>`,P=t=>{const a=new Date(t);return Number.isNaN(a.getTime())?"":a.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},_=t=>t.length?t.toSorted((a,e)=>(a.createdAt??0)-(e.createdAt??0)).map(a=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(a.createdAt).toISOString()}">${l(P(a.createdAt))}</time>
            <p class="timeline-note">${I(a.text)}</p>
          </div>
        </li>
      `).join(""):'<li class="timeline-empty">No status notes yet.</li>',p=()=>{localStorage.setItem(y,JSON.stringify(d))},H=()=>{try{const t=localStorage.getItem(y);if(!t)return;const a=JSON.parse(t);if(!Array.isArray(a))return;d.splice(0,d.length,...a.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${r+1}`,details:typeof e.details=="string"?e.details:"",notes:Array.isArray(e.notes)?e.notes.map(s=>({text:typeof s?.text=="string"?s.text:"",createdAt:Number(s?.createdAt)||Date.now()})).filter(s=>s.text.trim()):[]})))}catch{localStorage.removeItem(y)}},K=()=>{localStorage.setItem(E,String(n))},R=()=>{const t=Number(localStorage.getItem(E));Number.isFinite(t)&&(n=v(t,L,w))},v=(t,a,e)=>Math.min(e,Math.max(a,t)),Y=t=>{const a=-t*q;return v(a,-.04,.04)},C=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(n*100)}%`)},W=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(b),b=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},D=t=>{document.body.classList.toggle("is-dragging-task",t)},N=()=>{k?.remove(),k=null},j=t=>{N();const a=t.cloneNode(!0);return a.classList.add("task-card-drag-preview"),a.style.width=`${t.offsetWidth}px`,a.style.height=`${t.offsetHeight}px`,a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.transform=`scale(${n})`,a.style.transformOrigin="top left",a.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(a),k=a,a},T=()=>{u=null,m?.classList.remove("is-dragging-source"),m=null,N(),D(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},O=({showIndicator:t=!1}={})=>{const a=document.querySelector("[data-board]");a&&(a.style.setProperty("--zoom",n.toString()),C(),t&&W())},g=(t,{showIndicator:a=!0}={})=>{n=v(t,L,w),K(),O({showIndicator:a})},B=()=>{const t=(d.at(-1)?.id??0)+1;d.push(Z(t)),p(),f()},S=(t,a,e)=>{const r=d.find(s=>s.id===t);r&&(r[a]=e,p())},F=t=>{const a=d.findIndex(e=>e.id===t);a!==-1&&(d.splice(a,1),p(),f())},A=(t,a)=>{const e=d.find(s=>s.id===t),r=a.trim();!e||!r||(e.notes.push({text:r,createdAt:Date.now()}),p(),f())},G=t=>`
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
          value="${l(t.title)}"
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
      >${l(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${x(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${_(t.notes)}
      </ul>
      <div class="timeline-input-row">
        <input
          class="timeline-input"
          type="text"
          placeholder="Add status note"
          aria-label="Add status note for task ${t.id}"
          data-note-input
          data-task-id="${t.id}"
        />
        <button class="timeline-add-button" type="button" data-add-note data-task-id="${t.id}">Add</button>
      </div>
    </section>
  </section>
`,f=()=>{M.innerHTML=`
    <main class="shell">
      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${d.map(G).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(n*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-task]")?.addEventListener("click",B),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId),i=s.closest("[data-task-card]");if(u=o,m=i,m?.classList.add("is-dragging-source"),r.dataTransfer?.setData("text/plain",String(o)),r.dataTransfer&&(r.dataTransfer.effectAllowed="move",i)){const c=j(i);r.dataTransfer.setDragImage(c,i.getBoundingClientRect().width/2,28)}D(!0)}),e.addEventListener("dragend",()=>{T()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{u&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const r=u??Number(e.dataTransfer?.getData("text/plain"));T(),r&&F(r)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId),i=s.dataset.taskInput;S(o,i,s.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",r=>{if(r.target instanceof Element&&r.target.closest("a"))return;const s=e.closest("[data-task-card]"),o=s?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(s?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId);S(o,"details",s.value);const i=s.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");i&&(i.innerHTML=x(s.value))}),e.addEventListener("blur",r=>{r.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-add-note]").forEach(e=>{e.addEventListener("click",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId),c=s.closest("[data-task-column]")?.querySelector("[data-note-input]");c instanceof HTMLInputElement&&A(o,c.value)})}),document.querySelectorAll("[data-note-input]").forEach(e=>{e.addEventListener("keydown",r=>{if(r.key!=="Enter")return;r.preventDefault();const s=r.currentTarget,o=Number(s.dataset.taskId);A(o,s.value)})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),g(n+Y(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),g(n+h)),e.key==="-"&&(e.preventDefault(),g(n-h)))},O({showIndicator:!1})};H();R();f();
