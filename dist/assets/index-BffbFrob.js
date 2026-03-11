(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();const H="tasktrack.tasks",x="tasktrack.boards",q="tasktrack.activeBoardId",R="tasktrack.zoom",O="tasktrack.menuSections",K=.2,Y=2,B=.05,U=.0022,X=/(https?:\/\/[^\s<>"]+)/gi,G="Write the task here...",u=[],c=[];let m=null,g=1,z,h=null,$=null,D=null,k=!1,v=!1;const Q=document.querySelector("#app"),tt=t=>({id:t,title:`#${t}`,details:"",completed:!1,notes:[]}),A=(t,e,o=[],r=[],i=1)=>({id:t,name:e,tasks:o,trashedTasks:r,nextTaskNumber:i}),b=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),J=t=>{const e=t??"";let o="",r=0;for(const i of e.matchAll(X)){const a=i.index??0,s=i[0];o+=b(e.slice(r,a)),o+=`<a href="${b(s)}" target="_blank" rel="noopener noreferrer">${b(s)}</a>`,r=a+s.length}return o+=b(e.slice(r)),o.replaceAll(`
`,"<br>")},W=t=>t?.trim()?J(t):`<span class="task-links-placeholder">${b(G)}</span>`,et=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},at=t=>t.length?t.toSorted((e,o)=>(e.createdAt??0)-(o.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${b(et(e.createdAt))}</time>
            <p class="timeline-note">${J(e.text)}</p>
          </div>
        </li>
      `).join(""):"",I=t=>Array.isArray(t)?t.map((e,o)=>({id:Number(e.id)||o+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${o+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})):[],_=(t,e=[])=>{const o=[...t,...e].reduce((r,i)=>Math.max(r,Number(i?.id)||0),0);return Math.max(1,o+1)},E=()=>c.find(t=>t.id===m)??c[0]??null,S=()=>{const t=E();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...I(t.tasks))},y=()=>{localStorage.setItem(x,JSON.stringify(c)),localStorage.setItem(q,String(m??""))},T=()=>{const t=E();t&&(t.tasks=I(u),localStorage.setItem(H,JSON.stringify(t.tasks)),y())},st=()=>{try{const t=localStorage.getItem(x),e=Number(localStorage.getItem(q));if(t){const a=JSON.parse(t);if(Array.isArray(a)&&a.length){c.splice(0,c.length,...a.map((s,n)=>{const d=I(s?.tasks),l=I(s?.trashedTasks);return A(Number(s?.id)||n+1,typeof s?.name=="string"&&s.name.trim()?s.name:`Board ${n+1}`,d,l,Number(s?.nextTaskNumber)||_(d,l))})),m=Number.isFinite(e)?e:c[0].id,c.some(s=>s.id===m)||(m=c[0].id),S();return}}const o=JSON.parse(localStorage.getItem(H)??"[]"),r=I(o),i=A(1,"Board 1",r,[],_(r));c.splice(0,c.length,i),m=i.id,S(),y()}catch{localStorage.removeItem(x),localStorage.removeItem(q);const t=A(1,"Board 1",[],[],1);c.splice(0,c.length,t),m=t.id,S()}},ot=()=>{const t=(c.at(-1)?.id??0)+1;c.push(A(t,`Board ${c.length+1}`,[],[],1)),m=t,S(),y(),p()},rt=t=>{t===m||!c.some(e=>e.id===t)||(T(),m=t,S(),y(),p())},nt=t=>{const e=c.find(r=>r.id===t);if(!e)return;const o=window.prompt("Gi board et navn",e.name)?.trim();o&&(e.name=o,y(),p())},it=t=>{if(c.length<=1)return;const e=c.find(r=>r.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const o=c.findIndex(r=>r.id===t);c.splice(o,1),m===t&&(m=c[0].id,S()),y(),p()},dt=()=>{const t=E();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],y(),p())},ct=()=>{localStorage.setItem(O,JSON.stringify({completed:k,trash:v}))},lt=()=>{try{const t=JSON.parse(localStorage.getItem(O)??"{}");k=!!t.completed,v=!!t.trash}catch{localStorage.removeItem(O)}},ut=t=>{t==="completed"&&(k=!k),t==="trash"&&(v=!v),ct(),p()},mt=()=>{localStorage.setItem(R,String(g))},pt=()=>{const t=Number(localStorage.getItem(R));Number.isFinite(t)&&(g=M(t,K,Y))},M=(t,e,o)=>Math.min(o,Math.max(e,t)),ft=t=>{const e=-t*U;return M(e,-.04,.04)},gt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(g*100)}%`)},bt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(z),z=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},j=t=>{document.body.classList.toggle("is-dragging-task",t)},F=()=>{D?.remove(),D=null},ht=t=>{F();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${g})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(o=>{o.setAttribute("tabindex","-1")}),document.body.append(e),D=e,e},w=()=>{h=null,$?.classList.remove("is-dragging-source"),$=null,F(),j(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},V=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",g.toString()),gt(),t&&bt())},N=(t,{showIndicator:e=!0}={})=>{g=M(t,K,Y),mt(),V({showIndicator:e})},kt=()=>{const t=E();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(tt(e)),T(),p()},P=(t,e,o)=>{const r=u.find(i=>i.id===t);r&&(r[e]=o,T())},vt=t=>{const e=u.findIndex(i=>i.id===t);if(e===-1)return;const[o]=u.splice(e,1),r=E();r&&o&&(r.trashedTasks=r.trashedTasks??[],r.trashedTasks.push({...o,deletedAt:Date.now()})),T(),p()},yt=t=>{const e=u.find(o=>o.id===t);e&&(e.completed=!e.completed,T(),p())},Z=(t,e)=>{const o=u.find(i=>i.id===t),r=e.trim();!o||!r||(o.notes.push({text:r,createdAt:Date.now()}),T(),p())},Tt=(t,e)=>{const o=u.findIndex(i=>i.id===t);if(o===-1||e<0||e>=u.length||o===e)return;const[r]=u.splice(o,1);u.splice(e,0,r),T(),p()},St=t=>`
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
          value="${b(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${G}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${b(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${W(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${at(t.notes)}
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
`,C=t=>`
  <li class="menu-task-item">${b(t.title)}</li>
`,Et=t=>`
  <li class="board-menu-item ${t.id===m?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${b(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${c.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,p=()=>{const t=E(),e=u.filter(a=>a.completed),o=t?.trashedTasks??[];Q.innerHTML=`
    <main class="shell">
      <aside class="left-menu" aria-hidden="false">
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${c.map(Et).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!k}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${k?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${k?"is-collapsed":""}">
            ${e.length?e.map(C).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-action" type="button" data-empty-trash ${o.length?"":"disabled"}>Empty</button>
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!v}">
              <h3 class="menu-section-title">Trash (${o.length})</h3>
              <i class="bi ${v?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${v?"is-collapsed":""}">
            ${o.length?o.map(C).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
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
          ${u.map(St).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(g*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-add-board]")?.addEventListener("click",ot),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);rt(n)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);nt(n)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);it(n)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",dt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const n=s.currentTarget.dataset.toggleMenuSection;ut(n)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.taskId);yt(n)})}),document.querySelector("[data-add-task]")?.addEventListener("click",kt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.closest("[data-task-card]");if(h=d,$=l,$?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const f=ht(l);s.dataTransfer.setDragImage(f,l.getBoundingClientRect().width/2,28)}j(!0)}),a.addEventListener("dragend",()=>{w()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{h&&(s.preventDefault(),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{s.preventDefault();const n=Number(a.dataset.taskId);if(a.classList.remove("is-drop-target"),!h||!n||h===n)return;const d=h,l=u.findIndex(f=>f.id===n);w(),Tt(d,l)})});const r=document.querySelector("[data-trash-zone]");r?.addEventListener("dragover",a=>{h&&(a.preventDefault(),r.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),r?.addEventListener("dragleave",()=>{r.classList.remove("is-over")}),r?.addEventListener("drop",a=>{a.preventDefault();const s=h??Number(a.dataTransfer?.getData("text/plain"));w(),s&&vt(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.dataset.taskInput;P(d,l,n.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const n=a.closest("[data-task-card]"),d=n?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(n?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId);P(d,"details",n.value);const l=n.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=W(n.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(f=>{if(f!==n.closest("[data-task-column]")){f.classList.remove("is-adding-note");const L=f.querySelector("[data-note-draft]");L instanceof HTMLInputElement&&(L.value="")}});const d=n.closest("[data-task-column]"),l=d?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.closest("[data-task-column]"),f=l?.querySelector("[data-note-draft]");if(!(f instanceof HTMLInputElement))return;const L=f.value;if(L.trim()){Z(d,L);return}l?.classList.remove("is-adding-note"),f.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const n=s.currentTarget,d=Number(n.dataset.taskId);Z(d,n.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const n=s.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),N(g+ft(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),N(g+B)),a.key==="-"&&(a.preventDefault(),N(g-B)))},V({showIndicator:!1})};st();pt();lt();p();
