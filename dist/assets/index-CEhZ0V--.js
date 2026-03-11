(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=e(a);fetch(a.href,o)}})();const v="tasktrack.tasks",$="tasktrack.zoom",w=.2,I=2,T=.05,z=.0022,P=/(https?:\/\/[^\s<>"]+)/gi,x="Write the task here...",d=[];let i=1,L,f=null,g=null,h=null,c=!1;const H=document.querySelector("#app"),Z=t=>({id:t,title:`Task ${t}`,details:"",notes:[]}),u=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),q=t=>{const r=t??"";let e="",s=0;for(const a of r.matchAll(P)){const o=a.index??0,n=a[0];e+=u(r.slice(s,o)),e+=`<a href="${u(n)}" target="_blank" rel="noopener noreferrer">${u(n)}</a>`,s=o+n.length}return e+=u(r.slice(s)),e.replaceAll(`
`,"<br>")},D=t=>t?.trim()?q(t):`<span class="task-links-placeholder">${u(x)}</span>`,_=t=>{const r=new Date(t);return Number.isNaN(r.getTime())?"":r.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},K=t=>t.length?t.toSorted((r,e)=>(r.createdAt??0)-(e.createdAt??0)).map(r=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(r.createdAt).toISOString()}">${u(_(r.createdAt))}</time>
            <p class="timeline-note">${q(r.text)}</p>
          </div>
        </li>
      `).join(""):"",y=()=>{localStorage.setItem(v,JSON.stringify(d))},R=()=>{try{const t=localStorage.getItem(v);if(!t)return;const r=JSON.parse(t);if(!Array.isArray(r))return;d.splice(0,d.length,...r.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${s+1}`,details:typeof e.details=="string"?e.details:"",notes:Array.isArray(e.notes)?e.notes.map(a=>({text:typeof a?.text=="string"?a.text:"",createdAt:Number(a?.createdAt)||Date.now()})).filter(a=>a.text.trim()):[]})))}catch{localStorage.removeItem(v)}},W=()=>{localStorage.setItem($,String(i))},Y=()=>{const t=Number(localStorage.getItem($));Number.isFinite(t)&&(i=b(t,w,I))},b=(t,r,e)=>Math.min(e,Math.max(r,t)),C=t=>{const r=-t*z;return b(r,-.04,.04)},j=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(i*100)}%`)},B=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(L),L=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},O=t=>{document.body.classList.toggle("is-dragging-task",t)},N=()=>{h?.remove(),h=null},F=t=>{N();const r=t.cloneNode(!0);return r.classList.add("task-card-drag-preview"),r.style.width=`${t.offsetWidth}px`,r.style.height=`${t.offsetHeight}px`,r.style.position="fixed",r.style.top="-9999px",r.style.left="-9999px",r.style.transform=`scale(${i})`,r.style.transformOrigin="top left",r.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(r),h=r,r},E=()=>{f=null,g?.classList.remove("is-dragging-source"),g=null,N(),O(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},M=({showIndicator:t=!1}={})=>{const r=document.querySelector("[data-board]");r&&(r.style.setProperty("--zoom",i.toString()),j(),t&&B())},k=(t,{showIndicator:r=!0}={})=>{i=b(t,w,I),W(),M({showIndicator:r})},G=()=>{const t=(d.at(-1)?.id??0)+1;d.push(Z(t)),y(),m()},S=(t,r,e)=>{const s=d.find(a=>a.id===t);s&&(s[r]=e,y())},J=t=>{const r=d.findIndex(e=>e.id===t);r!==-1&&(d.splice(r,1),y(),m())},A=(t,r)=>{const e=d.find(a=>a.id===t),s=r.trim();!e||!s||(e.notes.push({text:s,createdAt:Date.now()}),y(),m())},V=t=>`
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
          value="${u(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${x}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${u(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${D(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${K(t.notes)}
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
`,m=()=>{H.innerHTML=`
    <main class="shell">
      <div class="menu-overlay ${c?"is-open":""}" data-menu-overlay></div>
      <aside class="left-menu ${c?"is-open":""}" aria-hidden="${c?"false":"true"}">
        <h2 class="left-menu-title">Meny</h2>
        <p class="left-menu-text">Her kan du senere legge inn filter, prosjekter eller tags.</p>
      </aside>

      <div class="toolbar">
        <button class="menu-toggle-button" type="button" aria-label="Åpne/lukk meny" data-toggle-menu>
          <i class="bi ${c?"bi-x-lg":"bi-list"}" aria-hidden="true"></i>
        </button>
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${d.map(V).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(i*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-menu]")?.addEventListener("click",()=>{c=!c,m()}),document.querySelector("[data-menu-overlay]")?.addEventListener("click",()=>{c&&(c=!1,m())}),document.querySelector("[data-add-task]")?.addEventListener("click",G),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.closest("[data-task-card]");if(f=o,g=n,g?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",n)){const l=F(n);s.dataTransfer.setDragImage(l,n.getBoundingClientRect().width/2,28)}O(!0)}),e.addEventListener("dragend",()=>{E()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{f&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const s=f??Number(e.dataTransfer?.getData("text/plain"));E(),s&&J(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.dataset.taskInput;S(o,n,a.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const a=e.closest("[data-task-card]"),o=a?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(a?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",s=>{const a=s.currentTarget,o=Number(a.dataset.taskId);S(o,"details",a.value);const n=a.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");n&&(n.innerHTML=D(a.value))}),e.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const a=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(l=>{if(l!==a.closest("[data-task-column]")){l.classList.remove("is-adding-note");const p=l.querySelector("[data-note-draft]");p instanceof HTMLInputElement&&(p.value="")}});const o=a.closest("[data-task-column]"),n=o?.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(o?.classList.add("is-adding-note"),n.focus())})}),document.querySelectorAll("[data-note-done]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const a=s.currentTarget,o=Number(a.dataset.taskId),n=a.closest("[data-task-column]"),l=n?.querySelector("[data-note-draft]");if(!(l instanceof HTMLInputElement))return;const p=l.value;if(p.trim()){A(o,p);return}n?.classList.remove("is-adding-note"),l.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation()}),e.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const n=s.currentTarget;n.closest("[data-task-column]")?.classList.remove("is-adding-note"),n.value="";return}if(s.key!=="Enter")return;s.preventDefault();const a=s.currentTarget,o=Number(a.dataset.taskId);A(o,a.value)})}),document.addEventListener("click",e=>{e.target instanceof Element&&e.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const a=s.querySelector("[data-note-draft]");a instanceof HTMLInputElement&&(a.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),k(i+C(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),k(i+T)),e.key==="-"&&(e.preventDefault(),k(i-T)))},M({showIndicator:!1})};R();Y();m();
