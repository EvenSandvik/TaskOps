(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const y="tasktrack.tasks",E="tasktrack.zoom",L=.2,w=2,h=.05,q=.0022,z=/(https?:\/\/[^\s<>"]+)/gi,I="Write the task here...",d=[];let n=1,b,u=null,m=null,k=null;const M=document.querySelector("#app"),Z=t=>({id:t,title:`Task ${t}`,details:"",notes:[]}),l=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),$=t=>{const a=t??"";let e="",s=0;for(const r of a.matchAll(z)){const o=r.index??0,i=r[0];e+=l(a.slice(s,o)),e+=`<a href="${l(i)}" target="_blank" rel="noopener noreferrer">${l(i)}</a>`,s=o+i.length}return e+=l(a.slice(s)),e.replaceAll(`
`,"<br>")},x=t=>t?.trim()?$(t):`<span class="task-links-placeholder">${l(I)}</span>`,P=t=>{const a=new Date(t);return Number.isNaN(a.getTime())?"":a.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},_=t=>t.length?t.toSorted((a,e)=>(e.createdAt??0)-(a.createdAt??0)).map(a=>`
        <li class="timeline-item">
          <p class="timeline-note">${$(a.text)}</p>
          <time class="timeline-time" datetime="${new Date(a.createdAt).toISOString()}">${l(P(a.createdAt))}</time>
        </li>
      `).join(""):'<li class="timeline-empty">No status notes yet.</li>',p=()=>{localStorage.setItem(y,JSON.stringify(d))},H=()=>{try{const t=localStorage.getItem(y);if(!t)return;const a=JSON.parse(t);if(!Array.isArray(a))return;d.splice(0,d.length,...a.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${s+1}`,details:typeof e.details=="string"?e.details:"",notes:Array.isArray(e.notes)?e.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})))}catch{localStorage.removeItem(y)}},K=()=>{localStorage.setItem(E,String(n))},R=()=>{const t=Number(localStorage.getItem(E));Number.isFinite(t)&&(n=v(t,L,w))},v=(t,a,e)=>Math.min(e,Math.max(a,t)),Y=t=>{const a=-t*q;return v(a,-.04,.04)},C=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(n*100)}%`)},W=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(b),b=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},D=t=>{document.body.classList.toggle("is-dragging-task",t)},N=()=>{k?.remove(),k=null},j=t=>{N();const a=t.cloneNode(!0);return a.classList.add("task-card-drag-preview"),a.style.width=`${t.offsetWidth}px`,a.style.height=`${t.offsetHeight}px`,a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.transform=`scale(${n})`,a.style.transformOrigin="top left",a.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(a),k=a,a},T=()=>{u=null,m?.classList.remove("is-dragging-source"),m=null,N(),D(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},O=({showIndicator:t=!1}={})=>{const a=document.querySelector("[data-board]");a&&(a.style.setProperty("--zoom",n.toString()),C(),t&&W())},g=(t,{showIndicator:a=!0}={})=>{n=v(t,L,w),K(),O({showIndicator:a})},B=()=>{const t=(d.at(-1)?.id??0)+1;d.push(Z(t)),p(),f()},S=(t,a,e)=>{const s=d.find(r=>r.id===t);s&&(s[a]=e,p())},F=t=>{const a=d.findIndex(e=>e.id===t);a!==-1&&(d.splice(a,1),p(),f())},A=(t,a)=>{const e=d.find(r=>r.id===t),s=a.trim();!e||!s||(e.notes.push({text:s,createdAt:Date.now()}),p(),f())},G=t=>`
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
      placeholder="${I}"
      aria-label="Task details ${t.id}"
      data-task-input="details"
      data-task-id="${t.id}"
    >${l(t.details)}</textarea>
    <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
      ${x(t.details)}
    </div>
    <section class="task-timeline">
      <ul class="timeline-list" data-timeline-list>
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
  </article>
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
  `,document.querySelector("[data-add-task]")?.addEventListener("click",B),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.closest("[data-task-card]");if(u=o,m=i,m?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",i)){const c=j(i);s.dataTransfer.setDragImage(c,i.getBoundingClientRect().width/2,28)}D(!0)}),e.addEventListener("dragend",()=>{T()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{u&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const s=u??Number(e.dataTransfer?.getData("text/plain"));T(),s&&F(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),i=r.dataset.taskInput;S(o,i,r.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const r=e.closest("[data-task-card]"),o=r?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(r?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId);S(o,"details",r.value);const i=r.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");i&&(i.innerHTML=x(r.value))}),e.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-add-note]").forEach(e=>{e.addEventListener("click",s=>{const r=s.currentTarget,o=Number(r.dataset.taskId),c=r.closest("[data-task-card]")?.querySelector("[data-note-input]");c instanceof HTMLInputElement&&A(o,c.value)})}),document.querySelectorAll("[data-note-input]").forEach(e=>{e.addEventListener("keydown",s=>{if(s.key!=="Enter")return;s.preventDefault();const r=s.currentTarget,o=Number(r.dataset.taskId);A(o,r.value)})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),g(n+Y(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),g(n+h)),e.key==="-"&&(e.preventDefault(),g(n-h)))},O({showIndicator:!1})};H();R();f();
