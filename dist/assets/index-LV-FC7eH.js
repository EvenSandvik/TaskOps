(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const f of l.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();const pt=.2,bt=2,nt=.05,xt=.0022,qt=/(https?:\/\/[^\s<>"]+)/gi,gt="Write the task here...",ht=420,Nt=300,Dt=920,vt=["red","orange","yellow","green","blue","purple","pink"],V={red:"#ef4444",orange:"#f97316",yellow:"#f59e0b",green:"#22c55e",blue:"#3b82f6",purple:"#a855f7",pink:"#ec4899"},b=[],u=[];let v=null,y=1,it,I=null,K=null,G=null,H=!1,Z=!1,A=!1,E=!1,L=!1,P=null,W="",S=!1,T=null,q=null,N=null,$=null,dt=null,D=null;const Pt="tasktrack-file-handle-db",x="handles",tt="primary",Bt=document.querySelector("#app"),Ct=()=>{clearTimeout(dt);const t=document.querySelector("[data-save-indicator]");t&&(t.classList.add("is-visible"),dt=window.setTimeout(()=>{t.classList.remove("is-visible")},2e3))},et=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const s=window.indexedDB.open(Pt,1);s.onupgradeneeded=()=>{const o=s.result;o.objectStoreNames.contains(x)||o.createObjectStore(x)},s.onsuccess=()=>{t(s.result)},s.onerror=()=>{e(s.error)}}),Mt=async()=>{const t=await et();return t?new Promise((e,s)=>{const l=t.transaction(x,"readonly").objectStore(x).get(tt);l.onsuccess=()=>{e(l.result??null)},l.onerror=()=>{s(l.error)}}):null},Ot=async t=>{const e=await et();e&&await new Promise((s,o)=>{const f=e.transaction(x,"readwrite").objectStore(x).put(t,tt);f.onsuccess=()=>{s()},f.onerror=()=>{o(f.error)}})},Ht=async()=>{const t=await et();t&&await new Promise((e,s)=>{const l=t.transaction(x,"readwrite").objectStore(x).delete(tt);l.onsuccess=()=>{e()},l.onerror=()=>{s(l.error)}})},kt=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const s=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(s)==="granted"?!0:await t.requestPermission(s)==="granted"},Ft=t=>({id:t,title:`#${t}`,details:"",completed:!1,color:null,width:ht,notes:[]}),F=t=>{const e=Number(t);return Number.isFinite(e)?Math.min(Dt,Math.max(Nt,e)):ht},at=(t,e,s=[],o=[],n=1)=>({id:t,name:e,tasks:s,trashedTasks:o,nextTaskNumber:n}),k=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),yt=t=>{const e=t??"";let s="",o=0;for(const n of e.matchAll(qt)){const l=n.index??0,f=n[0];s+=k(e.slice(o,l));const h=f.length>60?`${f.slice(0,60)}…`:f;s+=`<a href="${k(f)}" target="_blank" rel="noopener noreferrer" title="${k(f)}">${k(h)}</a>`,o=l+f.length}return s+=k(e.slice(o)),s.replaceAll(`
`,"<br>")},wt=t=>t?.trim()?yt(t):`<span class="task-links-placeholder">${k(gt)}</span>`,zt=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},_t=(t,e=!1)=>`${t.toSorted((n,l)=>(n.createdAt??0)-(l.createdAt??0)).map(n=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(n.createdAt).toISOString()}">${k(zt(n.createdAt))}</time>
            <p class="timeline-note">${yt(n.text)}</p>
          </div>
        </li>
      `).join("")}${e?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,X=t=>Array.isArray(t)?t.map((e,s)=>({id:Number(e.id)||s+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${s+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,color:vt.includes(e.color)?e.color:null,width:F(e.width),notes:Array.isArray(e.notes)?e.notes.map(o=>({text:typeof o?.text=="string"?o.text:"",createdAt:Number(o?.createdAt)||Date.now()})).filter(o=>o.text.trim()):[]})):[],Rt=(t,e=[])=>{const s=[...t,...e].reduce((o,n)=>Math.max(o,Number(n?.id)||0),0);return Math.max(1,s+1)},M=()=>u.find(t=>t.id===v)??u[0]??null,O=()=>{const t=M();if(!t){b.splice(0,b.length);return}b.splice(0,b.length,...X(t.tasks))},Wt=()=>({boards:u,activeBoardId:v,zoom:y,menuSections:{completed:A,trash:E},sidebarCollapsed:L,boardCompletedCollapsed:S}),Tt=async()=>{if(!D)return!1;const t=await D.createWritable();return await t.write(JSON.stringify(Wt(),null,2)),await t.close(),!0},z=()=>{Tt().then(t=>{t&&Ct()}).catch(()=>{})},U=()=>{const t=at(1,"Board 1",[],[],1);u.splice(0,u.length,t),v=t.id,y=1,A=!1,E=!1,L=!1,S=!1,O()},Et=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){U();return}u.splice(0,u.length,...e.map((n,l)=>{const f=X(n?.tasks),h=X(n?.trashedTasks);return at(Number(n?.id)||l+1,typeof n?.name=="string"&&n.name.trim()?n.name:`Board ${l+1}`,f,h,Number(n?.nextTaskNumber)||Rt(f,h))}));const s=Number(t?.activeBoardId);v=Number.isFinite(s)?s:u[0].id,u.some(n=>n.id===v)||(v=u[0].id);const o=Number(t?.zoom);Number.isFinite(o)&&(y=rt(o,pt,bt)),A=!!t?.menuSections?.completed,E=!!t?.menuSections?.trash,L=!!t?.sidebarCollapsed,S=!!t?.boardCompletedCollapsed,O()},jt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await Mt();if(!t||!await kt(t,!0))return!1;const o=await(await t.getFile()).text();return D=t,o.trim()?Et(JSON.parse(o)):U(),!0}catch{return await Ht().catch(()=>{}),!1}},Kt=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await kt(t,!0))return;D=t,await Ot(D);const o=await(await D.getFile()).text();o.trim()?Et(JSON.parse(o)):U(),await Tt(),m()}catch{}},B=()=>{z()},w=()=>{const t=M();t&&(t.tasks=X(b),B())},Zt=()=>{U()},Xt=()=>{const t=(u.at(-1)?.id??0)+1;u.push(at(t,`Board ${u.length+1}`,[],[],1)),v=t,O(),B(),m()},Ut=t=>{t===v||!u.some(e=>e.id===t)||(w(),v=t,O(),B(),m())},lt=(t,e)=>{const s=u.find(n=>n.id===t);if(!s){P=null,m();return}const o=e.trim();o&&(s.name=o,B()),P=null,m()},Yt=()=>{P!==null&&(P=null,m())},Jt=t=>{u.find(s=>s.id===t)&&(P=t,m())},Vt=t=>{if(u.length<=1)return;const e=u.find(o=>o.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const s=u.findIndex(o=>o.id===t);u.splice(s,1),v===t&&(v=u[0].id,O()),B(),m()},Qt=()=>{const t=M();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],B(),m())},Gt=()=>{z()},te=()=>{z()},ee=()=>{L=!L,te(),m()},ae=t=>{t==="completed"&&(A=!A),t==="trash"&&(E=!E),Gt(),m()},re=()=>{z()},rt=(t,e,s)=>Math.min(s,Math.max(e,t)),se=t=>{const e=-t*xt;return rt(e,-.04,.04)},oe=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(y*100)}%`)},ne=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(it),it=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},Lt=t=>{document.body.classList.toggle("is-dragging-task",t)},St=()=>{G?.remove(),G=null},$t=()=>Array.from(document.querySelectorAll("[data-task-column]")),ie=(t,e)=>{if(!t||!e||t===e)return;const s=document.querySelector("[data-board]");if(!s)return;const o=$t(),n=o.find(_=>Number(_.dataset.taskId)===t),l=o.find(_=>Number(_.dataset.taskId)===e);if(!n||!l||n===l)return;const f=o.indexOf(n),h=o.indexOf(l);f===-1||h===-1||f===h||(f<h?s.insertBefore(n,l.nextSibling):s.insertBefore(n,l),Z=!0)},de=t=>$t().findIndex(e=>Number(e.dataset.taskId)===t),le=t=>{St();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${y})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(s=>{s.setAttribute("tabindex","-1")}),document.body.append(e),G=e,e},j=()=>{I=null,K?.classList.remove("is-dragging-source"),K=null,St(),Lt(!1),H=!1,Z=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},It=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",y.toString()),oe(),t&&ne())},Q=(t,{showIndicator:e=!0}={})=>{y=rt(t,pt,bt),re(),It({showIndicator:e})},ce=()=>{const t=M();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,b.push(Ft(e)),w(),m()},ct=(t,e,s)=>{const o=b.find(n=>n.id===t);o&&(o[e]=s,w())},ut=(t,e,{persist:s=!1}={})=>{const o=b.find(n=>n.id===t);o&&(o.width=F(e),s&&w())},ue=t=>{const e=b.findIndex(n=>n.id===t);if(e===-1)return;const[s]=b.splice(e,1),o=M();o&&s&&(o.trashedTasks=o.trashedTasks??[],o.trashedTasks.push({...s,deletedAt:Date.now()})),w(),clearTimeout(N),q={task:s,boardId:v},N=window.setTimeout(()=>{q=null,N=null,m()},5e3),m()},me=t=>{const e=b.find(s=>s.id===t);e&&(e.completed=!e.completed,w(),m())},mt=(t,e)=>{const s=b.find(n=>n.id===t),o=e.trim();!s||!o||(s.notes.push({text:o,createdAt:Date.now()}),w(),m())},fe=(t,e)=>{const s=b.findIndex(n=>n.id===t);if(s===-1||e<0||e>=b.length||s===e)return;const[o]=b.splice(s,1);b.splice(e,0,o),w(),m()},pe=()=>{if(!q)return;const{task:t,boardId:e}=q;clearTimeout(N),N=null,q=null;const s=u.find(o=>o.id===e);if(s){const o=s.trashedTasks.findIndex(n=>n.id===t.id);o!==-1&&s.trashedTasks.splice(o,1),s.tasks.push({...t}),e===v&&O(),w()}m()},be=()=>{clearTimeout(N),N=null,q=null,m()},ge=()=>{S=!S,z(),m()},he=(t,e)=>{const s=u.findIndex(n=>n.id===t);if(s===-1||e<0||e>=u.length||s===e)return;const[o]=u.splice(s,1);u.splice(e,0,o),B(),m()},ve=t=>{const e=_t(t.notes,t.completed);return`
  <section class="task-column" data-task-column data-task-id="${t.id}" style="--task-width: ${F(t.width)}px;">
    <article class="task-card ${t.completed?"is-completed":""}"
             style="${t.color?`border-left: 3px solid ${V[t.color]};`:""}"
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
          class="task-color-dot${t.color?" has-color":""}"
          style="${t.color?`background: ${V[t.color]};`:""}"
          type="button"
          aria-label="Set task color"
          title="Color label"
          data-color-toggle
          data-task-id="${t.id}"
        ></button>
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
          value="${k(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      ${T===t.id?`
      <div class="task-color-picker" data-color-picker data-task-id="${t.id}">
        ${vt.map(s=>`<button class="color-swatch${t.color===s?" is-selected":""}" style="background:${V[s]};" type="button" data-pick-color="${s}" data-task-id="${t.id}" title="${s}"></button>`).join("")}
        <button class="color-swatch color-swatch-clear${t.color?"":" is-selected"}" type="button" data-pick-color="" data-task-id="${t.id}" title="Clear color">✕</button>
      </div>
      `:""}
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${gt}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${k(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${wt(t.details)}
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
  <li class="menu-task-item">${k(t.title)}</li>
`,ke=t=>{const e=t.tasks.filter(s=>!s.completed).length;return`
  <li class="board-menu-item ${t.id===v?"is-active":""}" data-board-item data-board-id="${t.id}">
    <button class="board-drag-handle" type="button" draggable="true" data-drag-board data-board-id="${t.id}" aria-label="Drag to reorder board">⋮⋮</button>
    ${P===t.id?`<input class="board-menu-edit-input" type="text" value="${k(t.name)}" aria-label="Edit board name" data-edit-board-name data-board-id="${t.id}" />`:`<button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${k(t.name)}${e>0?`<span class="board-task-count">${e}</span>`:""}</button>`}
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${u.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
  `},m=()=>{const t=document.activeElement instanceof HTMLInputElement&&document.activeElement.hasAttribute("data-search");T!==null&&!b.find(a=>a.id===T)&&(T=null);const e=M(),s=b.filter(a=>a.completed),o=e?.trashedTasks??[],n=W.toLowerCase().trim(),l=b.filter(a=>S&&a.completed?!1:n?a.title.toLowerCase().includes(n)||a.details.toLowerCase().includes(n):!0);Bt.innerHTML=`
    <main class="shell ${L?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${L?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${L?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${L?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${D?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${u.map(ke).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!A}">
            <h3 class="menu-section-title">Completed (${s.length})</h3>
            <i class="bi ${A?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${A?"is-collapsed":""}">
            ${s.length?s.map(ft).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!E}">
              <h3 class="menu-section-title">Trash (${o.length})</h3>
              <i class="bi ${E?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${E?"is-collapsed":""}">
            ${o.length?o.map(ft).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${E?"is-collapsed":""}" type="button" data-empty-trash ${o.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
        <input class="search-input" type="search" placeholder="Search tasks…" value="${k(W)}" data-search />
        <button class="toolbar-btn${S?" is-active":""}" type="button" data-toggle-board-completed title="${S?"Show completed tasks":"Hide completed tasks"}">
          <i class="bi bi-eye${S?"-slash":""}" aria-hidden="true"></i>
        </button>
      </div>

      <div class="save-indicator" data-save-indicator aria-live="polite" aria-atomic="true">
        <i class="bi bi-check2" aria-hidden="true"></i> Saved
      </div>

      ${q?`
      <div class="undo-toast" data-undo-toast>
        <span class="undo-toast-text">Task moved to trash</span>
        <button class="undo-toast-btn" type="button" data-undo-trash>Undo</button>
        <button class="undo-toast-dismiss" type="button" data-dismiss-undo aria-label="Dismiss"><i class="bi bi-x" aria-hidden="true"></i></button>
      </div>
      `:""}

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${l.map(ve).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(y*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",ee),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{Kt()}),document.querySelector("[data-add-board]")?.addEventListener("click",Xt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",r=>{const i=Number(r.currentTarget.dataset.boardId);Ut(i)}),a.addEventListener("dblclick",r=>{r.preventDefault();const i=Number(r.currentTarget.dataset.boardId);Jt(i)})}),document.querySelectorAll("[data-edit-board-name]").forEach(a=>{Number(a.dataset.boardId)===P&&(a.focus(),a.select()),a.addEventListener("click",r=>{r.stopPropagation()}),a.addEventListener("keydown",r=>{const i=Number(r.currentTarget.dataset.boardId);r.key==="Enter"&&(r.preventDefault(),lt(i,r.currentTarget.value)),r.key==="Escape"&&(r.preventDefault(),Yt())}),a.addEventListener("blur",r=>{const i=Number(r.currentTarget.dataset.boardId);lt(i,r.currentTarget.value)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",r=>{const i=Number(r.currentTarget.dataset.boardId);Vt(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",Qt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",r=>{const i=r.currentTarget.dataset.toggleMenuSection;ae(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",r=>{const i=Number(r.currentTarget.dataset.taskId);me(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",ce),document.querySelector("[data-search]")?.addEventListener("input",a=>{W=a.currentTarget.value;const r=W.toLowerCase().trim();document.querySelectorAll("[data-task-column]").forEach(i=>{const d=Number(i.dataset.taskId),c=b.find(g=>g.id===d);if(!c)return;const p=!r||c.title.toLowerCase().includes(r)||c.details.toLowerCase().includes(r);i.style.display=p?"":"none"})}),document.querySelector("[data-toggle-board-completed]")?.addEventListener("click",ge),document.querySelector("[data-undo-trash]")?.addEventListener("click",pe),document.querySelector("[data-dismiss-undo]")?.addEventListener("click",be),document.querySelectorAll("[data-color-toggle]").forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation();const i=Number(a.dataset.taskId);T=T===i?null:i,m()})}),document.querySelectorAll("[data-pick-color]").forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation();const i=Number(a.dataset.taskId),d=a.dataset.pickColor||null,c=b.find(p=>p.id===i);c&&(c.color=d,w()),T=null,m()})});let f=!1;document.querySelectorAll("[data-drag-board]").forEach(a=>{a.addEventListener("dragstart",r=>{const i=Number(a.dataset.boardId);$=i,f=!1,r.dataTransfer?.setData("text/plain",String(i)),r.dataTransfer&&(r.dataTransfer.effectAllowed="move"),a.closest("[data-board-item]")?.classList.add("is-dragging-board")}),a.addEventListener("dragend",()=>{document.querySelectorAll("[data-board-item].is-dragging-board").forEach(r=>r.classList.remove("is-dragging-board")),document.querySelectorAll("[data-board-item].is-board-drop-target").forEach(r=>r.classList.remove("is-board-drop-target")),f||m(),$=null})}),document.querySelectorAll("[data-board-item]").forEach(a=>{a.addEventListener("dragover",r=>{if(!$||(r.preventDefault(),r.dataTransfer&&(r.dataTransfer.dropEffect="move"),Number(a.dataset.boardId)===$))return;const d=a.closest(".board-menu-list");if(!d)return;const c=Array.from(d.querySelectorAll("[data-board-item]")),p=c.find(J=>Number(J.dataset.boardId)===$);if(!p||p===a)return;const g=c.indexOf(p),Y=c.indexOf(a);g<Y?d.insertBefore(p,a.nextSibling):d.insertBefore(p,a),a.classList.add("is-board-drop-target")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-board-drop-target")}),a.addEventListener("drop",r=>{if(r.preventDefault(),a.classList.remove("is-board-drop-target"),!$)return;const i=$,d=a.closest(".board-menu-list"),p=(d?Array.from(d.querySelectorAll("[data-board-item]")):[]).findIndex(g=>Number(g.dataset.boardId)===i);f=!0,$=null,he(i,p)})}),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",r=>{const i=r.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-card]");if(H=!1,Z=!1,I=d,K=c,K?.classList.add("is-dragging-source"),r.dataTransfer?.setData("text/plain",String(d)),r.dataTransfer&&(r.dataTransfer.effectAllowed="move",c)){const p=le(c);r.dataTransfer.setDragImage(p,c.getBoundingClientRect().width/2,28)}Lt(!0)}),a.addEventListener("dragend",()=>{if(!H&&Z){j(),m();return}j()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",r=>{if(!I)return;r.preventDefault();const i=Number(a.dataset.taskId);ie(I,i),document.querySelectorAll("[data-task-column].is-drop-target").forEach(d=>{d!==a&&d.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),r.dataTransfer&&(r.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",r=>{if(r.preventDefault(),a.classList.remove("is-drop-target"),!I)return;const i=I,d=de(i);H=!0,j(),d>=0&&fe(i,d)})});const h=document.querySelector("[data-trash-zone]");if(h?.addEventListener("dragover",a=>{I&&(a.preventDefault(),h.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),h?.addEventListener("dragleave",()=>{h.classList.remove("is-over")}),h?.addEventListener("drop",a=>{a.preventDefault();const r=I??Number(a.dataTransfer?.getData("text/plain"));H=!0,j(),r&&ue(r)}),document.querySelectorAll("[data-resize-task]").forEach(a=>{a.addEventListener("pointerdown",r=>{r.preventDefault(),r.stopPropagation();const i=r.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=b.find(C=>C.id===d);if(!d||!c||!p)return;const g=r.pointerId,Y=r.clientX,J=F(p.width||c.getBoundingClientRect().width);i.setPointerCapture?.(g);const st=C=>{if(C.pointerId!==g)return;const At=(C.clientX-Y)/y,ot=F(J+At);ut(d,ot),c.style.setProperty("--task-width",`${ot}px`)},R=C=>{C.pointerId===g&&(window.removeEventListener("pointermove",st),window.removeEventListener("pointerup",R),window.removeEventListener("pointercancel",R),i.releasePointerCapture?.(g),ut(d,p.width,{persist:!0}))};window.addEventListener("pointermove",st),window.addEventListener("pointerup",R),window.addEventListener("pointercancel",R)})}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",r=>{const i=r.currentTarget,d=Number(i.dataset.taskId),c=i.dataset.taskInput;ct(d,c,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",r=>{if(r.target instanceof Element&&r.target.closest("a"))return;const i=a.closest("[data-task-card]"),d=i?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",r=>{const i=r.currentTarget,d=Number(i.dataset.taskId);ct(d,"details",i.value);const c=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=wt(i.value))}),a.addEventListener("blur",r=>{r.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation();const i=r.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(p=>{if(p!==i.closest("[data-task-column]")){p.classList.remove("is-adding-note");const g=p.querySelector("[data-note-draft]");g instanceof HTMLInputElement&&(g.value="")}});const d=i.closest("[data-task-column]"),c=d?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation();const i=r.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=c?.querySelector("[data-note-draft]");if(!(p instanceof HTMLInputElement))return;const g=p.value;if(g.trim()){mt(d,g);return}c?.classList.remove("is-adding-note"),p.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation()}),a.addEventListener("keydown",r=>{if(r.key==="Escape"){r.preventDefault();const c=r.currentTarget;c.closest("[data-task-column]")?.classList.remove("is-adding-note"),c.value="";return}if(r.key!=="Enter")return;r.preventDefault();const i=r.currentTarget,d=Number(i.dataset.taskId);mt(d,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||(document.querySelectorAll(".task-column.is-adding-note").forEach(r=>{r.classList.remove("is-adding-note");const i=r.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")}),T!==null&&a.target instanceof Element&&!a.target.closest("[data-color-picker], [data-color-toggle]")&&(T=null,m()))}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),Q(y+se(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),Q(y+nt)),a.key==="-"&&(a.preventDefault(),Q(y-nt)))},It({showIndicator:!1}),t){const a=document.querySelector("[data-search]");a instanceof HTMLInputElement&&a.focus()}},ye=async()=>{Zt(),await jt(),m()};ye();
