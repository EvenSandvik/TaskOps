(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();const K=.2,R=2,H=.05,et=.0022,at=/(https?:\/\/[^\s<>"]+)/gi,W="Write the task here...",u=[],d=[];let p=null,b=1,_,k=null,x=null,M=null,v=!1,h=!1,y=!1,T=null;const st="tasktrack-file-handle-db",w="handles",B="primary",rt=document.querySelector("#app"),O=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(st,1);r.onupgradeneeded=()=>{const o=r.result;o.objectStoreNames.contains(w)||o.createObjectStore(w)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),ot=async()=>{const t=await O();return t?new Promise((e,r)=>{const a=t.transaction(w,"readonly").objectStore(w).get(B);a.onsuccess=()=>{e(a.result??null)},a.onerror=()=>{r(a.error)}}):null},nt=async t=>{const e=await O();e&&await new Promise((r,o)=>{const s=e.transaction(w,"readwrite").objectStore(w).put(t,B);s.onsuccess=()=>{r()},s.onerror=()=>{o(s.error)}})},it=async()=>{const t=await O();t&&await new Promise((e,r)=>{const a=t.transaction(w,"readwrite").objectStore(w).delete(B);a.onsuccess=()=>{e()},a.onerror=()=>{r(a.error)}})},Y=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},dt=t=>({id:t,title:`#${t}`,details:"",completed:!1,notes:[]}),F=(t,e,r=[],o=[],n=1)=>({id:t,name:e,tasks:r,trashedTasks:o,nextTaskNumber:n}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),J=t=>{const e=t??"";let r="",o=0;for(const n of e.matchAll(at)){const a=n.index??0,s=n[0];r+=g(e.slice(o,a)),r+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,o=a+s.length}return r+=g(e.slice(o)),r.replaceAll(`
`,"<br>")},G=t=>t?.trim()?J(t):`<span class="task-links-placeholder">${g(W)}</span>`,ct=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},lt=t=>t.length?t.toSorted((e,r)=>(e.createdAt??0)-(r.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${g(ct(e.createdAt))}</time>
            <p class="timeline-note">${J(e.text)}</p>
          </div>
        </li>
      `).join(""):"",I=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(o=>({text:typeof o?.text=="string"?o.text:"",createdAt:Number(o?.createdAt)||Date.now()})).filter(o=>o.text.trim()):[]})):[],ut=(t,e=[])=>{const r=[...t,...e].reduce((o,n)=>Math.max(o,Number(n?.id)||0),0);return Math.max(1,r+1)},E=()=>d.find(t=>t.id===p)??d[0]??null,A=()=>{const t=E();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...I(t.tasks))},mt=()=>({boards:d,activeBoardId:p,zoom:b,menuSections:{completed:v,trash:h},sidebarCollapsed:y}),V=async()=>{if(!T)return;const t=await T.createWritable();await t.write(JSON.stringify(mt(),null,2)),await t.close()},N=()=>{V().catch(()=>{})},q=()=>{const t=F(1,"Board 1",[],[],1);d.splice(0,d.length,t),p=t.id,b=1,v=!1,h=!1,y=!1,A()},U=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){q();return}d.splice(0,d.length,...e.map((n,a)=>{const s=I(n?.tasks),i=I(n?.trashedTasks);return F(Number(n?.id)||a+1,typeof n?.name=="string"&&n.name.trim()?n.name:`Board ${a+1}`,s,i,Number(n?.nextTaskNumber)||ut(s,i))}));const r=Number(t?.activeBoardId);p=Number.isFinite(r)?r:d[0].id,d.some(n=>n.id===p)||(p=d[0].id);const o=Number(t?.zoom);Number.isFinite(o)&&(b=z(o,K,R)),v=!!t?.menuSections?.completed,h=!!t?.menuSections?.trash,y=!!t?.sidebarCollapsed,A()},pt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await ot();if(!t||!await Y(t,!0))return!1;const o=await(await t.getFile()).text();return T=t,o.trim()?U(JSON.parse(o)):q(),!0}catch{return await it().catch(()=>{}),!1}},ft=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await Y(t,!0))return;T=t,await nt(T);const o=await(await T.getFile()).text();o.trim()?U(JSON.parse(o)):q(),await V(),m()}catch{}},L=()=>{N()},S=()=>{const t=E();t&&(t.tasks=I(u),L())},bt=()=>{q()},gt=()=>{const t=(d.at(-1)?.id??0)+1;d.push(F(t,`Board ${d.length+1}`,[],[],1)),p=t,A(),L(),m()},ht=t=>{t===p||!d.some(e=>e.id===t)||(S(),p=t,A(),L(),m())},yt=t=>{const e=d.find(o=>o.id===t);if(!e)return;const r=window.prompt("Gi board et navn",e.name)?.trim();r&&(e.name=r,L(),m())},kt=t=>{if(d.length<=1)return;const e=d.find(o=>o.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=d.findIndex(o=>o.id===t);d.splice(r,1),p===t&&(p=d[0].id,A()),L(),m()},vt=()=>{const t=E();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],L(),m())},wt=()=>{N()},Tt=()=>{N()},St=()=>{y=!y,Tt(),m()},Et=t=>{t==="completed"&&(v=!v),t==="trash"&&(h=!h),wt(),m()},Lt=()=>{N()},z=(t,e,r)=>Math.min(r,Math.max(e,t)),$t=t=>{const e=-t*et;return z(e,-.04,.04)},At=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(b*100)}%`)},xt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(_),_=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},X=t=>{document.body.classList.toggle("is-dragging-task",t)},Q=()=>{M?.remove(),M=null},It=t=>{Q();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${b})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),M=e,e},D=()=>{k=null,x?.classList.remove("is-dragging-source"),x=null,Q(),X(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},tt=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",b.toString()),At(),t&&xt())},P=(t,{showIndicator:e=!0}={})=>{b=z(t,K,R),Lt(),tt({showIndicator:e})},Nt=()=>{const t=E();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(dt(e)),S(),m()},C=(t,e,r)=>{const o=u.find(n=>n.id===t);o&&(o[e]=r,S())},qt=t=>{const e=u.findIndex(n=>n.id===t);if(e===-1)return;const[r]=u.splice(e,1),o=E();o&&r&&(o.trashedTasks=o.trashedTasks??[],o.trashedTasks.push({...r,deletedAt:Date.now()})),S(),m()},Dt=t=>{const e=u.find(r=>r.id===t);e&&(e.completed=!e.completed,S(),m())},j=(t,e)=>{const r=u.find(n=>n.id===t),o=e.trim();!r||!o||(r.notes.push({text:o,createdAt:Date.now()}),S(),m())},Pt=(t,e)=>{const r=u.findIndex(n=>n.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[o]=u.splice(r,1);u.splice(e,0,o),S(),m()},Mt=t=>`
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
        placeholder="${W}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${G(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${lt(t.notes)}
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
`,Z=t=>`
  <li class="menu-task-item">${g(t.title)}</li>
`,Bt=t=>`
  <li class="board-menu-item ${t.id===p?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${g(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${d.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,m=()=>{const t=E(),e=u.filter(a=>a.completed),r=t?.trashedTasks??[];rt.innerHTML=`
    <main class="shell ${y?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${y?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${y?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${y?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${T?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${d.map(Bt).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!v}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${v?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${v?"is-collapsed":""}">
            ${e.length?e.map(Z).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!h}">
              <h3 class="menu-section-title">Trash (${r.length})</h3>
              <i class="bi ${h?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${h?"is-collapsed":""}">
            ${r.length?r.map(Z).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${h?"is-collapsed":""}" type="button" data-empty-trash ${r.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${u.map(Mt).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(b*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",St),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{ft()}),document.querySelector("[data-add-board]")?.addEventListener("click",gt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);ht(i)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);yt(i)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);kt(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",vt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const i=s.currentTarget.dataset.toggleMenuSection;Et(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.taskId);Dt(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Nt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=s.currentTarget,c=Number(i.dataset.taskId),l=i.closest("[data-task-card]");if(k=c,x=l,x?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(c)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const f=It(l);s.dataTransfer.setDragImage(f,l.getBoundingClientRect().width/2,28)}X(!0)}),a.addEventListener("dragend",()=>{D()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{k&&(s.preventDefault(),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{s.preventDefault();const i=Number(a.dataset.taskId);if(a.classList.remove("is-drop-target"),!k||!i||k===i)return;const c=k,l=u.findIndex(f=>f.id===i);D(),Pt(c,l)})});const o=document.querySelector("[data-trash-zone]");o?.addEventListener("dragover",a=>{k&&(a.preventDefault(),o.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),o?.addEventListener("dragleave",()=>{o.classList.remove("is-over")}),o?.addEventListener("drop",a=>{a.preventDefault();const s=k??Number(a.dataTransfer?.getData("text/plain"));D(),s&&qt(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,c=Number(i.dataset.taskId),l=i.dataset.taskInput;C(c,l,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const i=a.closest("[data-task-card]"),c=i?.querySelector('[data-task-input="details"]');c instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),c.focus(),c.setSelectionRange(c.value.length,c.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,c=Number(i.dataset.taskId);C(c,"details",i.value);const l=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=G(i.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(f=>{if(f!==i.closest("[data-task-column]")){f.classList.remove("is-adding-note");const $=f.querySelector("[data-note-draft]");$ instanceof HTMLInputElement&&($.value="")}});const c=i.closest("[data-task-column]"),l=c?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(c?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget,c=Number(i.dataset.taskId),l=i.closest("[data-task-column]"),f=l?.querySelector("[data-note-draft]");if(!(f instanceof HTMLInputElement))return;const $=f.value;if($.trim()){j(c,$);return}l?.classList.remove("is-adding-note"),f.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const i=s.currentTarget,c=Number(i.dataset.taskId);j(c,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const i=s.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),P(b+$t(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),P(b+H)),a.key==="-"&&(a.preventDefault(),P(b-H)))},tt({showIndicator:!1})},Ot=async()=>{bt(),await pt(),m()};Ot();
