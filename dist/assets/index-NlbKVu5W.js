(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();const K="tasktrack.tasks",O="tasktrack.boards",q="tasktrack.activeBoardId",Y="tasktrack.zoom",D="tasktrack.menuSections",M="tasktrack.sidebarCollapsed",G=.2,J=2,z=.05,Q=.0022,tt=/(https?:\/\/[^\s<>"]+)/gi,W="Write the task here...",u=[],c=[];let m=null,g=1,P,h=null,N=null,B=null,y=!1,k=!1,v=!1;const et=document.querySelector("#app"),at=t=>({id:t,title:`#${t}`,details:"",completed:!1,notes:[]}),A=(t,e,o=[],r=[],i=1)=>({id:t,name:e,tasks:o,trashedTasks:r,nextTaskNumber:i}),b=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),j=t=>{const e=t??"";let o="",r=0;for(const i of e.matchAll(tt)){const a=i.index??0,s=i[0];o+=b(e.slice(r,a)),o+=`<a href="${b(s)}" target="_blank" rel="noopener noreferrer">${b(s)}</a>`,r=a+s.length}return o+=b(e.slice(r)),o.replaceAll(`
`,"<br>")},F=t=>t?.trim()?j(t):`<span class="task-links-placeholder">${b(W)}</span>`,st=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},ot=t=>t.length?t.toSorted((e,o)=>(e.createdAt??0)-(o.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${b(st(e.createdAt))}</time>
            <p class="timeline-note">${j(e.text)}</p>
          </div>
        </li>
      `).join(""):"",$=t=>Array.isArray(t)?t.map((e,o)=>({id:Number(e.id)||o+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${o+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})):[],C=(t,e=[])=>{const o=[...t,...e].reduce((r,i)=>Math.max(r,Number(i?.id)||0),0);return Math.max(1,o+1)},L=()=>c.find(t=>t.id===m)??c[0]??null,E=()=>{const t=L();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...$(t.tasks))},S=()=>{localStorage.setItem(O,JSON.stringify(c)),localStorage.setItem(q,String(m??""))},T=()=>{const t=L();t&&(t.tasks=$(u),localStorage.setItem(K,JSON.stringify(t.tasks)),S())},rt=()=>{try{const t=localStorage.getItem(O),e=Number(localStorage.getItem(q));if(t){const a=JSON.parse(t);if(Array.isArray(a)&&a.length){c.splice(0,c.length,...a.map((s,n)=>{const d=$(s?.tasks),l=$(s?.trashedTasks);return A(Number(s?.id)||n+1,typeof s?.name=="string"&&s.name.trim()?s.name:`Board ${n+1}`,d,l,Number(s?.nextTaskNumber)||C(d,l))})),m=Number.isFinite(e)?e:c[0].id,c.some(s=>s.id===m)||(m=c[0].id),E();return}}const o=JSON.parse(localStorage.getItem(K)??"[]"),r=$(o),i=A(1,"Board 1",r,[],C(r));c.splice(0,c.length,i),m=i.id,E(),S()}catch{localStorage.removeItem(O),localStorage.removeItem(q);const t=A(1,"Board 1",[],[],1);c.splice(0,c.length,t),m=t.id,E()}},nt=()=>{const t=(c.at(-1)?.id??0)+1;c.push(A(t,`Board ${c.length+1}`,[],[],1)),m=t,E(),S(),p()},it=t=>{t===m||!c.some(e=>e.id===t)||(T(),m=t,E(),S(),p())},dt=t=>{const e=c.find(r=>r.id===t);if(!e)return;const o=window.prompt("Gi board et navn",e.name)?.trim();o&&(e.name=o,S(),p())},ct=t=>{if(c.length<=1)return;const e=c.find(r=>r.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const o=c.findIndex(r=>r.id===t);c.splice(o,1),m===t&&(m=c[0].id,E()),S(),p()},lt=()=>{const t=L();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],S(),p())},ut=()=>{localStorage.setItem(D,JSON.stringify({completed:y,trash:k}))},mt=()=>{try{const t=JSON.parse(localStorage.getItem(D)??"{}");y=!!t.completed,k=!!t.trash}catch{localStorage.removeItem(D)}},pt=()=>{localStorage.setItem(M,JSON.stringify(v))},ft=()=>{try{v=!!JSON.parse(localStorage.getItem(M)??"false")}catch{localStorage.removeItem(M)}},gt=()=>{v=!v,pt(),p()},bt=t=>{t==="completed"&&(y=!y),t==="trash"&&(k=!k),ut(),p()},ht=()=>{localStorage.setItem(Y,String(g))},kt=()=>{const t=Number(localStorage.getItem(Y));Number.isFinite(t)&&(g=_(t,G,J))},_=(t,e,o)=>Math.min(o,Math.max(e,t)),vt=t=>{const e=-t*Q;return _(e,-.04,.04)},yt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(g*100)}%`)},St=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(P),P=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},V=t=>{document.body.classList.toggle("is-dragging-task",t)},U=()=>{B?.remove(),B=null},Tt=t=>{U();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${g})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(o=>{o.setAttribute("tabindex","-1")}),document.body.append(e),B=e,e},w=()=>{h=null,N?.classList.remove("is-dragging-source"),N=null,U(),V(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},X=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",g.toString()),yt(),t&&St())},x=(t,{showIndicator:e=!0}={})=>{g=_(t,G,J),ht(),X({showIndicator:e})},Et=()=>{const t=L();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(at(e)),T(),p()},R=(t,e,o)=>{const r=u.find(i=>i.id===t);r&&(r[e]=o,T())},Lt=t=>{const e=u.findIndex(i=>i.id===t);if(e===-1)return;const[o]=u.splice(e,1),r=L();r&&o&&(r.trashedTasks=r.trashedTasks??[],r.trashedTasks.push({...o,deletedAt:Date.now()})),T(),p()},It=t=>{const e=u.find(o=>o.id===t);e&&(e.completed=!e.completed,T(),p())},Z=(t,e)=>{const o=u.find(i=>i.id===t),r=e.trim();!o||!r||(o.notes.push({text:r,createdAt:Date.now()}),T(),p())},$t=(t,e)=>{const o=u.findIndex(i=>i.id===t);if(o===-1||e<0||e>=u.length||o===e)return;const[r]=u.splice(o,1);u.splice(e,0,r),T(),p()},At=t=>`
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
        placeholder="${W}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${b(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${F(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${ot(t.notes)}
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
`,H=t=>`
  <li class="menu-task-item">${b(t.title)}</li>
`,Nt=t=>`
  <li class="board-menu-item ${t.id===m?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${b(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${c.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,p=()=>{const t=L(),e=u.filter(a=>a.completed),o=t?.trashedTasks??[];et.innerHTML=`
    <main class="shell ${v?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${v?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${v?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${v?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${c.map(Nt).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!y}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${y?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${y?"is-collapsed":""}">
            ${e.length?e.map(H).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!k}">
              <h3 class="menu-section-title">Trash (${o.length})</h3>
              <i class="bi ${k?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${k?"is-collapsed":""}">
            ${o.length?o.map(H).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${k?"is-collapsed":""}" type="button" data-empty-trash ${o.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${u.map(At).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(g*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",gt),document.querySelector("[data-add-board]")?.addEventListener("click",nt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);it(n)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);dt(n)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);ct(n)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",lt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const n=s.currentTarget.dataset.toggleMenuSection;bt(n)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.taskId);It(n)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Et),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.closest("[data-task-card]");if(h=d,N=l,N?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const f=Tt(l);s.dataTransfer.setDragImage(f,l.getBoundingClientRect().width/2,28)}V(!0)}),a.addEventListener("dragend",()=>{w()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{h&&(s.preventDefault(),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{s.preventDefault();const n=Number(a.dataset.taskId);if(a.classList.remove("is-drop-target"),!h||!n||h===n)return;const d=h,l=u.findIndex(f=>f.id===n);w(),$t(d,l)})});const r=document.querySelector("[data-trash-zone]");r?.addEventListener("dragover",a=>{h&&(a.preventDefault(),r.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),r?.addEventListener("dragleave",()=>{r.classList.remove("is-over")}),r?.addEventListener("drop",a=>{a.preventDefault();const s=h??Number(a.dataTransfer?.getData("text/plain"));w(),s&&Lt(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.dataset.taskInput;R(d,l,n.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const n=a.closest("[data-task-card]"),d=n?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(n?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,d=Number(n.dataset.taskId);R(d,"details",n.value);const l=n.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=F(n.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(f=>{if(f!==n.closest("[data-task-column]")){f.classList.remove("is-adding-note");const I=f.querySelector("[data-note-draft]");I instanceof HTMLInputElement&&(I.value="")}});const d=n.closest("[data-task-column]"),l=d?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget,d=Number(n.dataset.taskId),l=n.closest("[data-task-column]"),f=l?.querySelector("[data-note-draft]");if(!(f instanceof HTMLInputElement))return;const I=f.value;if(I.trim()){Z(d,I);return}l?.classList.remove("is-adding-note"),f.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const n=s.currentTarget,d=Number(n.dataset.taskId);Z(d,n.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const n=s.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),x(g+vt(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),x(g+z)),a.key==="-"&&(a.preventDefault(),x(g-z)))},X({showIndicator:!1})};rt();kt();mt();ft();p();
