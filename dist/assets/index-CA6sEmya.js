(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const f of l.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function r(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(n){if(n.ep)return;n.ep=!0;const l=r(n);fetch(n.href,l)}})();const pt=.2,bt=2,nt=.05,At=.0022,xt=/(https?:\/\/[^\s<>"]+)/gi,gt="Write the task here...",ht=420,qt=300,Nt=920,J=["red","orange","yellow","green","blue","purple","pink"],b=[],u=[];let v=null,k=1,it,I=null,j=null,Q=null,H=!1,Z=!1,$=!1,w=!1,T=!1,D=null,R="",E=!1,x=null,q=null,L=null,dt=null,G=!1,N=null;const Dt="tasktrack-file-handle-db",A="handles",tt="primary",Bt=document.querySelector("#app"),Pt=()=>{clearTimeout(dt),G=!0,m(),dt=window.setTimeout(()=>{G=!1,m()},2e3)},et=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(Dt,1);r.onupgradeneeded=()=>{const o=r.result;o.objectStoreNames.contains(A)||o.createObjectStore(A)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),Mt=async()=>{const t=await et();return t?new Promise((e,r)=>{const l=t.transaction(A,"readonly").objectStore(A).get(tt);l.onsuccess=()=>{e(l.result??null)},l.onerror=()=>{r(l.error)}}):null},Ct=async t=>{const e=await et();e&&await new Promise((r,o)=>{const f=e.transaction(A,"readwrite").objectStore(A).put(t,tt);f.onsuccess=()=>{r()},f.onerror=()=>{o(f.error)}})},Ht=async()=>{const t=await et();t&&await new Promise((e,r)=>{const l=t.transaction(A,"readwrite").objectStore(A).delete(tt);l.onsuccess=()=>{e()},l.onerror=()=>{r(l.error)}})},vt=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},Ot=t=>({id:t,title:`#${t}`,details:"",completed:!1,color:J[Math.floor(Math.random()*J.length)],width:ht,notes:[]}),O=t=>{const e=Number(t);return Number.isFinite(e)?Math.min(Nt,Math.max(qt,e)):ht},at=(t,e,r=[],o=[],n=1)=>({id:t,name:e,tasks:r,trashedTasks:o,nextTaskNumber:n}),y=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),yt=t=>{const e=t??"";let r="",o=0;for(const n of e.matchAll(xt)){const l=n.index??0,f=n[0];r+=y(e.slice(o,l));const h=f.length>60?`${f.slice(0,60)}…`:f;r+=`<a href="${y(f)}" target="_blank" rel="noopener noreferrer" title="${y(f)}">${y(h)}</a>`,o=l+f.length}return r+=y(e.slice(o)),r.replaceAll(`
`,"<br>")},kt=t=>t?.trim()?yt(t):`<span class="task-links-placeholder">${y(gt)}</span>`,Ft=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},zt=(t,e=!1)=>`${t.toSorted((n,l)=>(n.createdAt??0)-(l.createdAt??0)).map(n=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(n.createdAt).toISOString()}">${y(Ft(n.createdAt))}</time>
            <p class="timeline-note">${yt(n.text)}</p>
          </div>
        </li>
      `).join("")}${e?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,K=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,color:J.includes(e.color)?e.color:null,width:O(e.width),notes:Array.isArray(e.notes)?e.notes.map(o=>({text:typeof o?.text=="string"?o.text:"",createdAt:Number(o?.createdAt)||Date.now()})).filter(o=>o.text.trim()):[]})):[],_t=(t,e=[])=>{const r=[...t,...e].reduce((o,n)=>Math.max(o,Number(n?.id)||0),0);return Math.max(1,r+1)},M=()=>u.find(t=>t.id===v)??u[0]??null,C=()=>{const t=M();if(!t){b.splice(0,b.length);return}b.splice(0,b.length,...K(t.tasks))},Rt=()=>({boards:u,activeBoardId:v,zoom:k,menuSections:{completed:$,trash:w},sidebarCollapsed:T,boardCompletedCollapsed:E}),wt=async()=>{if(!N)return!1;const t=await N.createWritable();return await t.write(JSON.stringify(Rt(),null,2)),await t.close(),!0},F=({showSaved:t=!1}={})=>{wt().then(e=>{e&&t&&Pt()}).catch(()=>{})},X=()=>{const t=at(1,"Board 1",[],[],1);u.splice(0,u.length,t),v=t.id,k=1,$=!1,w=!1,T=!1,E=!1,C()},Tt=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){X();return}u.splice(0,u.length,...e.map((n,l)=>{const f=K(n?.tasks),h=K(n?.trashedTasks);return at(Number(n?.id)||l+1,typeof n?.name=="string"&&n.name.trim()?n.name:`Board ${l+1}`,f,h,Number(n?.nextTaskNumber)||_t(f,h))}));const r=Number(t?.activeBoardId);v=Number.isFinite(r)?r:u[0].id,u.some(n=>n.id===v)||(v=u[0].id);const o=Number(t?.zoom);Number.isFinite(o)&&(k=st(o,pt,bt)),$=!!t?.menuSections?.completed,w=!!t?.menuSections?.trash,T=!!t?.sidebarCollapsed,E=!!t?.boardCompletedCollapsed,C()},Wt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await Mt();if(!t||!await vt(t,!0))return!1;const o=await(await t.getFile()).text();return N=t,o.trim()?Tt(JSON.parse(o)):X(),!0}catch{return await Ht().catch(()=>{}),!1}},jt=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await vt(t,!0))return;N=t,await Ct(N);const o=await(await N.getFile()).text();o.trim()?Tt(JSON.parse(o)):X(),await wt(),m()}catch{}},B=({showSaved:t=!1}={})=>{F({showSaved:t})},S=({showSaved:t=!1}={})=>{const e=M();e&&(e.tasks=K(b),B({showSaved:t}))},Zt=()=>{X()},Kt=()=>{const t=(u.at(-1)?.id??0)+1;u.push(at(t,`Board ${u.length+1}`,[],[],1)),v=t,C(),B(),m()},Xt=t=>{t===v||!u.some(e=>e.id===t)||(S(),v=t,C(),B(),m())},lt=(t,e)=>{const r=u.find(n=>n.id===t);if(!r){D=null,m();return}const o=e.trim();o&&(r.name=o,B()),D=null,m()},Ut=()=>{D!==null&&(D=null,m())},Vt=t=>{u.find(r=>r.id===t)&&(D=t,m())},Yt=t=>{if(u.length<=1)return;const e=u.find(o=>o.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=u.findIndex(o=>o.id===t);u.splice(r,1),v===t&&(v=u[0].id,C()),B(),m()},Jt=()=>{const t=M();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],B(),m())},Qt=()=>{F()},Gt=()=>{F()},te=()=>{T=!T,Gt(),m()},ee=t=>{t==="completed"&&($=!$),t==="trash"&&(w=!w),Qt(),m()},ae=()=>{F()},st=(t,e,r)=>Math.min(r,Math.max(e,t)),se=t=>{const e=-t*At;return st(e,-.04,.04)},re=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(k*100)}%`)},oe=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(it),it=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},Et=t=>{document.body.classList.toggle("is-dragging-task",t)},St=()=>{Q?.remove(),Q=null},Lt=()=>Array.from(document.querySelectorAll("[data-task-column]")),ne=(t,e)=>{if(!t||!e||t===e)return;const r=document.querySelector("[data-board]");if(!r)return;const o=Lt(),n=o.find(z=>Number(z.dataset.taskId)===t),l=o.find(z=>Number(z.dataset.taskId)===e);if(!n||!l||n===l)return;const f=o.indexOf(n),h=o.indexOf(l);f===-1||h===-1||f===h||(f<h?r.insertBefore(n,l.nextSibling):r.insertBefore(n,l),Z=!0)},ie=t=>Lt().findIndex(e=>Number(e.dataset.taskId)===t),de=t=>{St();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${k})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),Q=e,e},W=()=>{I=null,j?.classList.remove("is-dragging-source"),j=null,St(),Et(!1),H=!1,Z=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},It=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",k.toString()),re(),t&&oe())},Y=(t,{showIndicator:e=!0}={})=>{k=st(t,pt,bt),ae(),It({showIndicator:e})},le=()=>{const t=M();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,b.push(Ot(e)),S(),m()},ct=(t,e,r)=>{const o=b.find(n=>n.id===t);o&&(o[e]=r,S({showSaved:!0}))},ut=(t,e,{persist:r=!1}={})=>{const o=b.find(n=>n.id===t);o&&(o.width=O(e),r&&S())},ce=t=>{const e=b.findIndex(n=>n.id===t);if(e===-1)return;const[r]=b.splice(e,1),o=M();o&&r&&(o.trashedTasks=o.trashedTasks??[],o.trashedTasks.push({...r,deletedAt:Date.now()})),S(),clearTimeout(q),x={task:r,boardId:v},q=window.setTimeout(()=>{x=null,q=null,m()},5e3),m()},ue=t=>{const e=b.find(r=>r.id===t);e&&(e.completed=!e.completed,S({showSaved:!0}),m())},mt=(t,e)=>{const r=b.find(n=>n.id===t),o=e.trim();!r||!o||(r.notes.push({text:o,createdAt:Date.now()}),S({showSaved:!0}),m())},me=(t,e)=>{const r=b.findIndex(n=>n.id===t);if(r===-1||e<0||e>=b.length||r===e)return;const[o]=b.splice(r,1);b.splice(e,0,o),S(),m()},fe=()=>{if(!x)return;const{task:t,boardId:e}=x;clearTimeout(q),q=null,x=null;const r=u.find(o=>o.id===e);if(r){const o=r.trashedTasks.findIndex(n=>n.id===t.id);o!==-1&&r.trashedTasks.splice(o,1),r.tasks.push({...t}),e===v&&C(),S()}m()},pe=()=>{clearTimeout(q),q=null,x=null,m()},be=()=>{E=!E,F(),m()},ge=(t,e)=>{const r=u.findIndex(n=>n.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[o]=u.splice(r,1);u.splice(e,0,o),B(),m()},he=t=>{const e=zt(t.notes,t.completed);return`
  <section class="task-column" data-task-column data-task-id="${t.id}" style="--task-width: ${O(t.width)}px;">
    <article class="task-card ${t.completed?"is-completed":""}"
             data-task-card data-task-id="${t.id}">
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
          value="${y(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${gt}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${y(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${kt(t.details)}
      </div>
      <button
        class="task-resize-handle"
        type="button"
        aria-label="Resize task ${t.id}"
        title="Drag to resize"
        data-resize-task
        data-task-id="${t.id}"
      ></button>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${e.trim()?"":"is-empty"}" data-timeline-list>
        ${e}
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
`},ft=t=>`
  <li class="menu-task-item">${y(t.title)}</li>
`,ve=t=>{const e=t.tasks.filter(r=>!r.completed).length;return`
  <li class="board-menu-item ${t.id===v?"is-active":""}" data-board-item data-board-id="${t.id}">
    <button class="board-drag-handle" type="button" draggable="true" data-drag-board data-board-id="${t.id}" aria-label="Drag to reorder board">⋮⋮</button>
    ${D===t.id?`<input class="board-menu-edit-input" type="text" value="${y(t.name)}" aria-label="Edit board name" data-edit-board-name data-board-id="${t.id}" />`:`<button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${y(t.name)}${e>0?`<span class="board-task-count">${e}</span>`:""}</button>`}
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${u.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
  `},m=()=>{const t=document.activeElement instanceof HTMLInputElement&&document.activeElement.hasAttribute("data-search"),e=M(),r=b.filter(a=>a.completed),o=e?.trashedTasks??[],n=R.toLowerCase().trim(),l=b.filter(a=>E&&a.completed?!1:n?a.title.toLowerCase().includes(n)||a.details.toLowerCase().includes(n):!0);Bt.innerHTML=`
    <main class="shell ${T?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${T?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${T?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${T?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${N?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${u.map(ve).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!$}">
            <h3 class="menu-section-title">Completed (${r.length})</h3>
            <i class="bi ${$?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${$?"is-collapsed":""}">
            ${r.length?r.map(ft).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!w}">
              <h3 class="menu-section-title">Trash (${o.length})</h3>
              <i class="bi ${w?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${w?"is-collapsed":""}">
            ${o.length?o.map(ft).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${w?"is-collapsed":""}" type="button" data-empty-trash ${o.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
        <input class="search-input" type="search" placeholder="Search tasks…" value="${y(R)}" data-search />
        <button class="toolbar-btn${E?" is-active":""}" type="button" data-toggle-board-completed title="${E?"Show completed tasks":"Hide completed tasks"}">
          <i class="bi bi-eye${E?"-slash":""}" aria-hidden="true"></i>
        </button>
      </div>

      ${G?`<div class="save-indicator is-visible" data-save-indicator aria-live="polite" aria-atomic="true">
        <i class="bi bi-check2" aria-hidden="true"></i> Saved
      </div>`:""}

      ${x?`
      <div class="undo-toast" data-undo-toast>
        <span class="undo-toast-text">Task moved to trash</span>
        <button class="undo-toast-btn" type="button" data-undo-trash>Undo</button>
        <button class="undo-toast-dismiss" type="button" data-dismiss-undo aria-label="Dismiss"><i class="bi bi-x" aria-hidden="true"></i></button>
      </div>
      `:""}

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${l.map(he).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(k*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",te),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{jt()}),document.querySelector("[data-add-board]")?.addEventListener("click",Kt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Xt(i)}),a.addEventListener("dblclick",s=>{s.preventDefault();const i=Number(s.currentTarget.dataset.boardId);Vt(i)})}),document.querySelectorAll("[data-edit-board-name]").forEach(a=>{Number(a.dataset.boardId)===D&&(a.focus(),a.select()),a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{const i=Number(s.currentTarget.dataset.boardId);s.key==="Enter"&&(s.preventDefault(),lt(i,s.currentTarget.value)),s.key==="Escape"&&(s.preventDefault(),Ut())}),a.addEventListener("blur",s=>{const i=Number(s.currentTarget.dataset.boardId);lt(i,s.currentTarget.value)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Yt(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",Jt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const i=s.currentTarget.dataset.toggleMenuSection;ee(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.taskId);ue(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",le),document.querySelector("[data-search]")?.addEventListener("input",a=>{R=a.currentTarget.value;const s=R.toLowerCase().trim();document.querySelectorAll("[data-task-column]").forEach(i=>{const d=Number(i.dataset.taskId),c=b.find(g=>g.id===d);if(!c)return;const p=!s||c.title.toLowerCase().includes(s)||c.details.toLowerCase().includes(s);i.style.display=p?"":"none"})}),document.querySelector("[data-toggle-board-completed]")?.addEventListener("click",be),document.querySelector("[data-undo-trash]")?.addEventListener("click",fe),document.querySelector("[data-dismiss-undo]")?.addEventListener("click",pe);let f=!1;document.querySelectorAll("[data-drag-board]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=Number(a.dataset.boardId);L=i,f=!1,s.dataTransfer?.setData("text/plain",String(i)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move"),a.closest("[data-board-item]")?.classList.add("is-dragging-board")}),a.addEventListener("dragend",()=>{document.querySelectorAll("[data-board-item].is-dragging-board").forEach(s=>s.classList.remove("is-dragging-board")),document.querySelectorAll("[data-board-item].is-board-drop-target").forEach(s=>s.classList.remove("is-board-drop-target")),f||m(),L=null})}),document.querySelectorAll("[data-board-item]").forEach(a=>{a.addEventListener("dragover",s=>{if(!L||(s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="move"),Number(a.dataset.boardId)===L))return;const d=a.closest(".board-menu-list");if(!d)return;const c=Array.from(d.querySelectorAll("[data-board-item]")),p=c.find(V=>Number(V.dataset.boardId)===L);if(!p||p===a)return;const g=c.indexOf(p),U=c.indexOf(a);g<U?d.insertBefore(p,a.nextSibling):d.insertBefore(p,a),a.classList.add("is-board-drop-target")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-board-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-board-drop-target"),!L)return;const i=L,d=a.closest(".board-menu-list"),p=(d?Array.from(d.querySelectorAll("[data-board-item]")):[]).findIndex(g=>Number(g.dataset.boardId)===i);f=!0,L=null,ge(i,p)})}),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-card]");if(H=!1,Z=!1,I=d,j=c,j?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",c)){const p=de(c);s.dataTransfer.setDragImage(p,c.getBoundingClientRect().width/2,28)}Et(!0)}),a.addEventListener("dragend",()=>{if(!H&&Z){W(),m();return}W()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{if(!I)return;s.preventDefault();const i=Number(a.dataset.taskId);ne(I,i),document.querySelectorAll("[data-task-column].is-drop-target").forEach(d=>{d!==a&&d.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-drop-target"),!I)return;const i=I,d=ie(i);H=!0,W(),d>=0&&me(i,d)})});const h=document.querySelector("[data-trash-zone]");if(h?.addEventListener("dragover",a=>{I&&(a.preventDefault(),h.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),h?.addEventListener("dragleave",()=>{h.classList.remove("is-over")}),h?.addEventListener("drop",a=>{a.preventDefault();const s=I??Number(a.dataTransfer?.getData("text/plain"));H=!0,W(),s&&ce(s)}),document.querySelectorAll("[data-resize-task]").forEach(a=>{a.addEventListener("pointerdown",s=>{s.preventDefault(),s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=b.find(P=>P.id===d);if(!d||!c||!p)return;const g=s.pointerId,U=s.clientX,V=O(p.width||c.getBoundingClientRect().width);i.setPointerCapture?.(g);const rt=P=>{if(P.pointerId!==g)return;const $t=(P.clientX-U)/k,ot=O(V+$t);ut(d,ot),c.style.setProperty("--task-width",`${ot}px`)},_=P=>{P.pointerId===g&&(window.removeEventListener("pointermove",rt),window.removeEventListener("pointerup",_),window.removeEventListener("pointercancel",_),i.releasePointerCapture?.(g),ut(d,p.width,{persist:!0}))};window.addEventListener("pointermove",rt),window.addEventListener("pointerup",_),window.addEventListener("pointercancel",_)})}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.dataset.taskInput;ct(d,c,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const i=a.closest("[data-task-card]"),d=i?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId);ct(d,"details",i.value);const c=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=kt(i.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(p=>{if(p!==i.closest("[data-task-column]")){p.classList.remove("is-adding-note");const g=p.querySelector("[data-note-draft]");g instanceof HTMLInputElement&&(g.value="")}});const d=i.closest("[data-task-column]"),c=d?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=c?.querySelector("[data-note-draft]");if(!(p instanceof HTMLInputElement))return;const g=p.value;if(g.trim()){mt(d,g);return}c?.classList.remove("is-adding-note"),p.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const c=s.currentTarget;c.closest("[data-task-column]")?.classList.remove("is-adding-note"),c.value="";return}if(s.key!=="Enter")return;s.preventDefault();const i=s.currentTarget,d=Number(i.dataset.taskId);mt(d,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const i=s.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),Y(k+se(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),Y(k+nt)),a.key==="-"&&(a.preventDefault(),Y(k-nt)))},It({showIndicator:!1}),t){const a=document.querySelector("[data-search]");a instanceof HTMLInputElement&&a.focus()}},ye=async()=>{Zt(),await Wt(),m()};ye();
