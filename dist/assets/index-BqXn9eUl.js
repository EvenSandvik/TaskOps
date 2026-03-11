(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();const P="tasktrack.tasks",w="tasktrack.boards",N="tasktrack.activeBoardId",Z="tasktrack.zoom",H=.2,R=2,D=.05,F=.0022,J=/(https?:\/\/[^\s<>"]+)/gi,K="Write the task here...",u=[],d=[];let m=null,f=1,O,E=null,A=null,x=null,k=!1;const V=document.querySelector("#app"),U=t=>({id:t,title:`Task ${t}`,details:"",completed:!1,notes:[]}),L=(t,e,o=[],r=[])=>({id:t,name:e,tasks:o,trashedTasks:r}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),C=t=>{const e=t??"";let o="",r=0;for(const i of e.matchAll(J)){const a=i.index??0,s=i[0];o+=g(e.slice(r,a)),o+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,r=a+s.length}return o+=g(e.slice(r)),o.replaceAll(`
`,"<br>")},Y=t=>t?.trim()?C(t):`<span class="task-links-placeholder">${g(K)}</span>`,X=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},Q=t=>t.length?t.toSorted((e,o)=>(e.createdAt??0)-(o.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${g(X(e.createdAt))}</time>
            <p class="timeline-note">${C(e.text)}</p>
          </div>
        </li>
      `).join(""):"",T=t=>Array.isArray(t)?t.map((e,o)=>({id:Number(e.id)||o+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`Task ${o+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})):[],$=()=>d.find(t=>t.id===m)??d[0]??null,h=()=>{const t=$();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...T(t.tasks))},S=()=>{localStorage.setItem(w,JSON.stringify(d)),localStorage.setItem(N,String(m??""))},y=()=>{const t=$();t&&(t.tasks=T(u),localStorage.setItem(P,JSON.stringify(t.tasks)),S())},tt=()=>{try{const t=localStorage.getItem(w),e=Number(localStorage.getItem(N));if(t){const i=JSON.parse(t);if(Array.isArray(i)&&i.length){d.splice(0,d.length,...i.map((a,s)=>L(Number(a?.id)||s+1,typeof a?.name=="string"&&a.name.trim()?a.name:`Board ${s+1}`,T(a?.tasks),T(a?.trashedTasks)))),m=Number.isFinite(e)?e:d[0].id,d.some(a=>a.id===m)||(m=d[0].id),h();return}}const o=JSON.parse(localStorage.getItem(P)??"[]"),r=L(1,"Board 1",T(o));d.splice(0,d.length,r),m=r.id,h(),S()}catch{localStorage.removeItem(w),localStorage.removeItem(N);const t=L(1,"Board 1",[]);d.splice(0,d.length,t),m=t.id,h()}},et=()=>{const t=(d.at(-1)?.id??0)+1;d.push(L(t,`Board ${d.length+1}`,[])),m=t,h(),S(),p()},at=t=>{t===m||!d.some(e=>e.id===t)||(y(),m=t,h(),p())},st=t=>{const e=d.find(r=>r.id===t);if(!e)return;const o=window.prompt("Gi board et navn",e.name)?.trim();o&&(e.name=o,S(),p())},rt=t=>{if(d.length<=1)return;const e=d.find(r=>r.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const o=d.findIndex(r=>r.id===t);d.splice(o,1),m===t&&(m=d[0].id,h()),S(),p()},ot=()=>{localStorage.setItem(Z,String(f))},nt=()=>{const t=Number(localStorage.getItem(Z));Number.isFinite(t)&&(f=q(t,H,R))},q=(t,e,o)=>Math.min(o,Math.max(e,t)),it=t=>{const e=-t*F;return q(e,-.04,.04)},dt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(f*100)}%`)},lt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(O),O=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},G=t=>{document.body.classList.toggle("is-dragging-task",t)},W=()=>{x?.remove(),x=null},ct=t=>{W();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${f})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(o=>{o.setAttribute("tabindex","-1")}),document.body.append(e),x=e,e},B=()=>{E=null,A?.classList.remove("is-dragging-source"),A=null,W(),G(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},j=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",f.toString()),dt(),t&&lt())},I=(t,{showIndicator:e=!0}={})=>{f=q(t,H,R),ot(),j({showIndicator:e})},ut=()=>{const t=(u.at(-1)?.id??0)+1;u.push(U(t)),y(),p()},M=(t,e,o)=>{const r=u.find(i=>i.id===t);r&&(r[e]=o,y())},mt=t=>{const e=u.findIndex(i=>i.id===t);if(e===-1)return;const[o]=u.splice(e,1),r=$();r&&o&&(r.trashedTasks=r.trashedTasks??[],r.trashedTasks.push({...o,deletedAt:Date.now()})),y(),p()},pt=t=>{const e=u.find(o=>o.id===t);e&&(e.completed=!e.completed,y(),p())},z=(t,e)=>{const o=u.find(i=>i.id===t),r=e.trim();!o||!r||(o.notes.push({text:r,createdAt:Date.now()}),y(),p())},ft=t=>`
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
        placeholder="${K}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${Y(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${Q(t.notes)}
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
`,_=t=>`
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
`,p=()=>{const t=$(),e=u.filter(a=>a.completed),o=t?.trashedTasks??[];V.innerHTML=`
    <main class="shell">
      <div class="menu-overlay ${k?"is-open":""}" data-menu-overlay></div>
      <aside class="left-menu ${k?"is-open":""}" aria-hidden="${k?"false":"true"}">
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
            ${e.length?e.map(_).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <h3 class="menu-section-title">Trash (${o.length})</h3>
          <ul class="menu-task-list">
            ${o.length?o.map(_).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
        </section>
      </aside>

      <div class="toolbar">
        <button class="menu-toggle-button" type="button" aria-label="Åpne/lukk meny" data-toggle-menu>
          <i class="bi ${k?"bi-x-lg":"bi-list"}" aria-hidden="true"></i>
        </button>
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
  `,document.querySelector("[data-toggle-menu]")?.addEventListener("click",()=>{k=!k,p()}),document.querySelector("[data-menu-overlay]")?.addEventListener("click",()=>{k&&(k=!1,p())}),document.querySelector("[data-add-board]")?.addEventListener("click",et),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);at(n)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);st(n)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);rt(n)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.taskId);pt(n)})}),document.querySelector("[data-add-task]")?.addEventListener("click",ut),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.closest("[data-task-card]");if(E=l,A=c,A?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(l)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",c)){const b=ct(c);s.dataTransfer.setDragImage(b,c.getBoundingClientRect().width/2,28)}G(!0)}),a.addEventListener("dragend",()=>{B()})});const r=document.querySelector("[data-trash-zone]");r?.addEventListener("dragover",a=>{E&&(a.preventDefault(),r.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),r?.addEventListener("dragleave",()=>{r.classList.remove("is-over")}),r?.addEventListener("drop",a=>{a.preventDefault();const s=E??Number(a.dataTransfer?.getData("text/plain"));B(),s&&mt(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.dataset.taskInput;M(l,c,n.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const n=a.closest("[data-task-card]"),l=n?.querySelector('[data-task-input="details"]');l instanceof HTMLTextAreaElement&&(n?.classList.add("is-editing-details"),l.focus(),l.setSelectionRange(l.value.length,l.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId);M(l,"details",n.value);const c=n.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=Y(n.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(b=>{if(b!==n.closest("[data-task-column]")){b.classList.remove("is-adding-note");const v=b.querySelector("[data-note-draft]");v instanceof HTMLInputElement&&(v.value="")}});const l=n.closest("[data-task-column]"),c=l?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(l?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.closest("[data-task-column]"),b=c?.querySelector("[data-note-draft]");if(!(b instanceof HTMLInputElement))return;const v=b.value;if(v.trim()){z(l,v);return}c?.classList.remove("is-adding-note"),b.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const c=s.currentTarget;c.closest("[data-task-column]")?.classList.remove("is-adding-note"),c.value="";return}if(s.key!=="Enter")return;s.preventDefault();const n=s.currentTarget,l=Number(n.dataset.taskId);z(l,n.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const n=s.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),I(f+it(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),I(f+D)),a.key==="-"&&(a.preventDefault(),I(f-D)))},j({showIndicator:!1})};tt();nt();p();
