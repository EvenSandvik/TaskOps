(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();const _="tasktrack.tasks",w="tasktrack.boards",N="tasktrack.activeBoardId",P="tasktrack.zoom",Z=.2,H=2,q=.05,j=.0022,F=/(https?:\/\/[^\s<>"]+)/gi,R="Write the task here...",u=[],d=[];let m=null,f=1,O,k=null,L=null,x=null;const J=document.querySelector("#app"),V=t=>({id:t,title:`Task ${t}`,details:"",completed:!1,notes:[]}),E=(t,e,r=[],o=[])=>({id:t,name:e,tasks:r,trashedTasks:o}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),K=t=>{const e=t??"";let r="",o=0;for(const i of e.matchAll(F)){const a=i.index??0,s=i[0];r+=g(e.slice(o,a)),r+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,o=a+s.length}return r+=g(e.slice(o)),r.replaceAll(`
`,"<br>")},C=t=>t?.trim()?K(t):`<span class="task-links-placeholder">${g(R)}</span>`,U=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},X=t=>t.length?t.toSorted((e,r)=>(e.createdAt??0)-(r.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${g(U(e.createdAt))}</time>
            <p class="timeline-note">${K(e.text)}</p>
          </div>
        </li>
      `).join(""):"",T=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(o=>({text:typeof o?.text=="string"?o.text:"",createdAt:Number(o?.createdAt)||Date.now()})).filter(o=>o.text.trim()):[]})):[],A=()=>d.find(t=>t.id===m)??d[0]??null,v=()=>{const t=A();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...T(t.tasks))},S=()=>{localStorage.setItem(w,JSON.stringify(d)),localStorage.setItem(N,String(m??""))},h=()=>{const t=A();t&&(t.tasks=T(u),localStorage.setItem(_,JSON.stringify(t.tasks)),S())},Q=()=>{try{const t=localStorage.getItem(w),e=Number(localStorage.getItem(N));if(t){const i=JSON.parse(t);if(Array.isArray(i)&&i.length){d.splice(0,d.length,...i.map((a,s)=>E(Number(a?.id)||s+1,typeof a?.name=="string"&&a.name.trim()?a.name:`Board ${s+1}`,T(a?.tasks),T(a?.trashedTasks)))),m=Number.isFinite(e)?e:d[0].id,d.some(a=>a.id===m)||(m=d[0].id),v();return}}const r=JSON.parse(localStorage.getItem(_)??"[]"),o=E(1,"Board 1",T(r));d.splice(0,d.length,o),m=o.id,v(),S()}catch{localStorage.removeItem(w),localStorage.removeItem(N);const t=E(1,"Board 1",[]);d.splice(0,d.length,t),m=t.id,v()}},tt=()=>{const t=(d.at(-1)?.id??0)+1;d.push(E(t,`Board ${d.length+1}`,[])),m=t,v(),S(),b()},et=t=>{t===m||!d.some(e=>e.id===t)||(h(),m=t,v(),b())},at=t=>{const e=d.find(o=>o.id===t);if(!e)return;const r=window.prompt("Gi board et navn",e.name)?.trim();r&&(e.name=r,S(),b())},st=t=>{if(d.length<=1)return;const e=d.find(o=>o.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=d.findIndex(o=>o.id===t);d.splice(r,1),m===t&&(m=d[0].id,v()),S(),b()},rt=()=>{localStorage.setItem(P,String(f))},ot=()=>{const t=Number(localStorage.getItem(P));Number.isFinite(t)&&(f=D(t,Z,H))},D=(t,e,r)=>Math.min(r,Math.max(e,t)),nt=t=>{const e=-t*j;return D(e,-.04,.04)},it=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(f*100)}%`)},dt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(O),O=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},Y=t=>{document.body.classList.toggle("is-dragging-task",t)},G=()=>{x?.remove(),x=null},ct=t=>{G();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${f})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),x=e,e},I=()=>{k=null,L?.classList.remove("is-dragging-source"),L=null,G(),Y(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},W=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",f.toString()),it(),t&&dt())},$=(t,{showIndicator:e=!0}={})=>{f=D(t,Z,H),rt(),W({showIndicator:e})},lt=()=>{const t=(u.at(-1)?.id??0)+1;u.push(V(t)),h(),b()},B=(t,e,r)=>{const o=u.find(i=>i.id===t);o&&(o[e]=r,h())},ut=t=>{const e=u.findIndex(i=>i.id===t);if(e===-1)return;const[r]=u.splice(e,1),o=A();o&&r&&(o.trashedTasks=o.trashedTasks??[],o.trashedTasks.push({...r,deletedAt:Date.now()})),h(),b()},mt=t=>{const e=u.find(r=>r.id===t);e&&(e.completed=!e.completed,h(),b())},M=(t,e)=>{const r=u.find(i=>i.id===t),o=e.trim();!r||!o||(r.notes.push({text:o,createdAt:Date.now()}),h(),b())},pt=(t,e)=>{const r=u.findIndex(i=>i.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[o]=u.splice(r,1);u.splice(e,0,o),h(),b()},ft=t=>`
  <section class="task-column" data-task-column data-task-id="${t.id}">
    <article class="task-card ${t.completed?"is-completed":""}" data-task-card data-task-id="${t.id}">
      <div class="task-card-header">
        <button
          class="complete-task-button"
          type="button"
          aria-label="${t.completed?"Mark task as incomplete":"Mark task as complete"}"
          title="${t.completed?"Completed":"Mark complete"}"
          data-toggle-complete
          data-task-id="${t.id}"
        >
          <i class="bi ${t.completed?"bi-check-circle-fill":"bi-circle"}" aria-hidden="true"></i>
        </button>
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
          value="${g(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${R}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${C(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${X(t.notes)}
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
`,z=t=>`
  <li class="menu-task-item">${g(t.title)}</li>
`,gt=t=>`
  <li class="board-menu-item ${t.id===m?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${g(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${d.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,b=()=>{const t=A(),e=u.filter(a=>a.completed),r=t?.trashedTasks??[];J.innerHTML=`
    <main class="shell">
      <aside class="left-menu" aria-hidden="false">
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${d.map(gt).join("")}
        </ul>

        <section class="menu-section">
          <h3 class="menu-section-title">Completed (${e.length})</h3>
          <ul class="menu-task-list">
            ${e.length?e.map(z).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <h3 class="menu-section-title">Trash (${r.length})</h3>
          <ul class="menu-task-list">
            ${r.length?r.map(z).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${u.map(ft).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(f*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-board]")?.addEventListener("click",tt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);et(n)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);at(n)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);st(n)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.taskId);mt(n)})}),document.querySelector("[data-add-task]")?.addEventListener("click",lt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const n=s.currentTarget,c=Number(n.dataset.taskId),l=n.closest("[data-task-card]");if(k=c,L=l,L?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(c)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const p=ct(l);s.dataTransfer.setDragImage(p,l.getBoundingClientRect().width/2,28)}Y(!0)}),a.addEventListener("dragend",()=>{I()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{k&&(s.preventDefault(),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{s.preventDefault();const n=Number(a.dataset.taskId);if(a.classList.remove("is-drop-target"),!k||!n||k===n)return;const c=k,l=u.findIndex(p=>p.id===n);I(),pt(c,l)})});const o=document.querySelector("[data-trash-zone]");o?.addEventListener("dragover",a=>{k&&(a.preventDefault(),o.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),o?.addEventListener("dragleave",()=>{o.classList.remove("is-over")}),o?.addEventListener("drop",a=>{a.preventDefault();const s=k??Number(a.dataTransfer?.getData("text/plain"));I(),s&&ut(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,c=Number(n.dataset.taskId),l=n.dataset.taskInput;B(c,l,n.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const n=a.closest("[data-task-card]"),c=n?.querySelector('[data-task-input="details"]');c instanceof HTMLTextAreaElement&&(n?.classList.add("is-editing-details"),c.focus(),c.setSelectionRange(c.value.length,c.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,c=Number(n.dataset.taskId);B(c,"details",n.value);const l=n.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=C(n.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(p=>{if(p!==n.closest("[data-task-column]")){p.classList.remove("is-adding-note");const y=p.querySelector("[data-note-draft]");y instanceof HTMLInputElement&&(y.value="")}});const c=n.closest("[data-task-column]"),l=c?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(c?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget,c=Number(n.dataset.taskId),l=n.closest("[data-task-column]"),p=l?.querySelector("[data-note-draft]");if(!(p instanceof HTMLInputElement))return;const y=p.value;if(y.trim()){M(c,y);return}l?.classList.remove("is-adding-note"),p.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const n=s.currentTarget,c=Number(n.dataset.taskId);M(c,n.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const n=s.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),$(f+nt(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),$(f+q)),a.key==="-"&&(a.preventDefault(),$(f-q)))},W({showIndicator:!1})};Q();ot();b();
