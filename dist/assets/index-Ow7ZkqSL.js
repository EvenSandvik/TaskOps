(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const D="tasktrack.tasks",L="tasktrack.boards",A="tasktrack.activeBoardId",B="tasktrack.zoom",M=.2,z=2,w=.05,G=.0022,C=/(https?:\/\/[^\s<>"]+)/gi,_="Write the task here...",l=[],i=[];let d=null,c=1,x,k=null,S=null,I=null,p=!1;const W=document.querySelector("#app"),F=t=>({id:t,title:`Task ${t}`,details:"",notes:[]}),h=(t,a,e=[])=>({id:t,name:a,tasks:e}),f=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),P=t=>{const a=t??"";let e="",r=0;for(const s of a.matchAll(C)){const o=s.index??0,n=s[0];e+=f(a.slice(r,o)),e+=`<a href="${f(n)}" target="_blank" rel="noopener noreferrer">${f(n)}</a>`,r=o+n.length}return e+=f(a.slice(r)),e.replaceAll(`
`,"<br>")},Z=t=>t?.trim()?P(t):`<span class="task-links-placeholder">${f(_)}</span>`,J=t=>{const a=new Date(t);return Number.isNaN(a.getTime())?"":a.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},j=t=>t.length?t.toSorted((a,e)=>(a.createdAt??0)-(e.createdAt??0)).map(a=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(a.createdAt).toISOString()}">${f(J(a.createdAt))}</time>
            <p class="timeline-note">${P(a.text)}</p>
          </div>
        </li>
      `).join(""):"",E=t=>Array.isArray(t)?t.map((a,e)=>({id:Number(a.id)||e+1,title:typeof a.title=="string"&&a.title.trim()?a.title:`Task ${e+1}`,details:typeof a.details=="string"?a.details:"",notes:Array.isArray(a.notes)?a.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})):[],H=()=>i.find(t=>t.id===d)??i[0]??null,g=()=>{const t=H();if(!t){l.splice(0,l.length);return}l.splice(0,l.length,...E(t.tasks))},y=()=>{localStorage.setItem(L,JSON.stringify(i)),localStorage.setItem(A,String(d??""))},v=()=>{const t=H();t&&(t.tasks=E(l),localStorage.setItem(D,JSON.stringify(t.tasks)),y())},V=()=>{try{const t=localStorage.getItem(L),a=Number(localStorage.getItem(A));if(t){const s=JSON.parse(t);if(Array.isArray(s)&&s.length){i.splice(0,i.length,...s.map((o,n)=>h(Number(o?.id)||n+1,typeof o?.name=="string"&&o.name.trim()?o.name:`Board ${n+1}`,E(o?.tasks)))),d=Number.isFinite(a)?a:i[0].id,i.some(o=>o.id===d)||(d=i[0].id),g();return}}const e=JSON.parse(localStorage.getItem(D)??"[]"),r=h(1,"Board 1",E(e));i.splice(0,i.length,r),d=r.id,g(),y()}catch{localStorage.removeItem(L),localStorage.removeItem(A);const t=h(1,"Board 1",[]);i.splice(0,i.length,t),d=t.id,g()}},U=()=>{const t=(i.at(-1)?.id??0)+1;i.push(h(t,`Board ${i.length+1}`,[])),d=t,g(),y(),u()},X=t=>{t===d||!i.some(a=>a.id===t)||(v(),d=t,g(),u())},Q=t=>{const a=i.find(r=>r.id===t);if(!a)return;const e=window.prompt("Gi board et navn",a.name)?.trim();e&&(a.name=e,y(),u())},tt=t=>{if(i.length<=1)return;const a=i.find(r=>r.id===t);if(!a||!window.confirm(`Slette board "${a.name}"?`))return;const e=i.findIndex(r=>r.id===t);i.splice(e,1),d===t&&(d=i[0].id,g()),y(),u()},et=()=>{localStorage.setItem(B,String(c))},at=()=>{const t=Number(localStorage.getItem(B));Number.isFinite(t)&&(c=$(t,M,z))},$=(t,a,e)=>Math.min(e,Math.max(a,t)),rt=t=>{const a=-t*G;return $(a,-.04,.04)},st=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(c*100)}%`)},ot=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(x),x=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},R=t=>{document.body.classList.toggle("is-dragging-task",t)},K=()=>{I?.remove(),I=null},nt=t=>{K();const a=t.cloneNode(!0);return a.classList.add("task-card-drag-preview"),a.style.width=`${t.offsetWidth}px`,a.style.height=`${t.offsetHeight}px`,a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.transform=`scale(${c})`,a.style.transformOrigin="top left",a.querySelectorAll("input, textarea, button").forEach(e=>{e.setAttribute("tabindex","-1")}),document.body.append(a),I=a,a},N=()=>{k=null,S?.classList.remove("is-dragging-source"),S=null,K(),R(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},Y=({showIndicator:t=!1}={})=>{const a=document.querySelector("[data-board]");a&&(a.style.setProperty("--zoom",c.toString()),st(),t&&ot())},T=(t,{showIndicator:a=!0}={})=>{c=$(t,M,z),et(),Y({showIndicator:a})},it=()=>{const t=(l.at(-1)?.id??0)+1;l.push(F(t)),v(),u()},q=(t,a,e)=>{const r=l.find(s=>s.id===t);r&&(r[a]=e,v())},dt=t=>{const a=l.findIndex(e=>e.id===t);a!==-1&&(l.splice(a,1),v(),u())},O=(t,a)=>{const e=l.find(s=>s.id===t),r=a.trim();!e||!r||(e.notes.push({text:r,createdAt:Date.now()}),v(),u())},lt=t=>`
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
          value="${f(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${_}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${f(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${Z(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${j(t.notes)}
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
`,ct=t=>`
  <li class="board-menu-item ${t.id===d?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${f(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${i.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,u=()=>{W.innerHTML=`
    <main class="shell">
      <div class="menu-overlay ${p?"is-open":""}" data-menu-overlay></div>
      <aside class="left-menu ${p?"is-open":""}" aria-hidden="${p?"false":"true"}">
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${i.map(ct).join("")}
        </ul>
      </aside>

      <div class="toolbar">
        <button class="menu-toggle-button" type="button" aria-label="Åpne/lukk meny" data-toggle-menu>
          <i class="bi ${p?"bi-x-lg":"bi-list"}" aria-hidden="true"></i>
        </button>
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${l.map(lt).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(c*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-menu]")?.addEventListener("click",()=>{p=!p,u()}),document.querySelector("[data-menu-overlay]")?.addEventListener("click",()=>{p&&(p=!1,u())}),document.querySelector("[data-add-board]")?.addEventListener("click",U),document.querySelectorAll("[data-switch-board]").forEach(e=>{e.addEventListener("click",r=>{const s=Number(r.currentTarget.dataset.boardId);X(s)})}),document.querySelectorAll("[data-rename-board]").forEach(e=>{e.addEventListener("click",r=>{const s=Number(r.currentTarget.dataset.boardId);Q(s)})}),document.querySelectorAll("[data-delete-board]").forEach(e=>{e.addEventListener("click",r=>{const s=Number(r.currentTarget.dataset.boardId);tt(s)})}),document.querySelector("[data-add-task]")?.addEventListener("click",it),document.querySelectorAll("[data-drag-task]").forEach(e=>{e.addEventListener("dragstart",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId),n=s.closest("[data-task-card]");if(k=o,S=n,S?.classList.add("is-dragging-source"),r.dataTransfer?.setData("text/plain",String(o)),r.dataTransfer&&(r.dataTransfer.effectAllowed="move",n)){const m=nt(n);r.dataTransfer.setDragImage(m,n.getBoundingClientRect().width/2,28)}R(!0)}),e.addEventListener("dragend",()=>{N()})});const t=document.querySelector("[data-trash-zone]");t?.addEventListener("dragover",e=>{k&&(e.preventDefault(),t.classList.add("is-over"),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}),t?.addEventListener("dragleave",()=>{t.classList.remove("is-over")}),t?.addEventListener("drop",e=>{e.preventDefault();const r=k??Number(e.dataTransfer?.getData("text/plain"));N(),r&&dt(r)}),document.querySelectorAll('[data-task-input="title"]').forEach(e=>{e.addEventListener("input",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId),n=s.dataset.taskInput;q(o,n,s.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(e=>{e.addEventListener("click",r=>{if(r.target instanceof Element&&r.target.closest("a"))return;const s=e.closest("[data-task-card]"),o=s?.querySelector('[data-task-input="details"]');o instanceof HTMLTextAreaElement&&(s?.classList.add("is-editing-details"),o.focus(),o.setSelectionRange(o.value.length,o.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(e=>{e.addEventListener("input",r=>{const s=r.currentTarget,o=Number(s.dataset.taskId);q(o,"details",s.value);const n=s.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");n&&(n.innerHTML=Z(s.value))}),e.addEventListener("blur",r=>{r.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(e=>{e.addEventListener("click",r=>{r.stopPropagation();const s=r.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(m=>{if(m!==s.closest("[data-task-column]")){m.classList.remove("is-adding-note");const b=m.querySelector("[data-note-draft]");b instanceof HTMLInputElement&&(b.value="")}});const o=s.closest("[data-task-column]"),n=o?.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(o?.classList.add("is-adding-note"),n.focus())})}),document.querySelectorAll("[data-note-done]").forEach(e=>{e.addEventListener("click",r=>{r.stopPropagation();const s=r.currentTarget,o=Number(s.dataset.taskId),n=s.closest("[data-task-column]"),m=n?.querySelector("[data-note-draft]");if(!(m instanceof HTMLInputElement))return;const b=m.value;if(b.trim()){O(o,b);return}n?.classList.remove("is-adding-note"),m.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(e=>{e.addEventListener("click",r=>{r.stopPropagation()}),e.addEventListener("keydown",r=>{if(r.key==="Escape"){r.preventDefault();const n=r.currentTarget;n.closest("[data-task-column]")?.classList.remove("is-adding-note"),n.value="";return}if(r.key!=="Enter")return;r.preventDefault();const s=r.currentTarget,o=Number(s.dataset.taskId);O(o,s.value)})}),document.addEventListener("click",e=>{e.target instanceof Element&&e.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(r=>{r.classList.remove("is-adding-note");const s=r.querySelector("[data-note-draft]");s instanceof HTMLInputElement&&(s.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",e=>{!e.ctrlKey&&!e.metaKey||(e.preventDefault(),T(c+rt(e.deltaY)))},{passive:!1}),window.onkeydown=e=>{!e.metaKey&&!e.ctrlKey||((e.key==="+"||e.key==="=")&&(e.preventDefault(),T(c+w)),e.key==="-"&&(e.preventDefault(),T(c-w)))},Y({showIndicator:!1})};V();at();u();
