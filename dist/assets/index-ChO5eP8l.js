(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const W=.2,Y=2,_=.05,rt=.0022,nt=/(https?:\/\/[^\s<>"]+)/gi,J="Write the task here...",u=[],c=[];let f=null,p=1,j,k=null,N=null,O=null,A=!1,q=!1,v=!1,h=!1,y=!1,T=null;const ot="tasktrack-file-handle-db",w="handles",H="primary",it=document.querySelector("#app"),F=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(ot,1);r.onupgradeneeded=()=>{const n=r.result;n.objectStoreNames.contains(w)||n.createObjectStore(w)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),dt=async()=>{const t=await F();return t?new Promise((e,r)=>{const a=t.transaction(w,"readonly").objectStore(w).get(H);a.onsuccess=()=>{e(a.result??null)},a.onerror=()=>{r(a.error)}}):null},ct=async t=>{const e=await F();e&&await new Promise((r,n)=>{const s=e.transaction(w,"readwrite").objectStore(w).put(t,H);s.onsuccess=()=>{r()},s.onerror=()=>{n(s.error)}})},lt=async()=>{const t=await F();t&&await new Promise((e,r)=>{const a=t.transaction(w,"readwrite").objectStore(w).delete(H);a.onsuccess=()=>{e()},a.onerror=()=>{r(a.error)}})},G=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},ut=t=>({id:t,title:`#${t}`,details:"",completed:!1,notes:[]}),z=(t,e,r=[],n=[],o=1)=>({id:t,name:e,tasks:r,trashedTasks:n,nextTaskNumber:o}),b=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),V=t=>{const e=t??"";let r="",n=0;for(const o of e.matchAll(nt)){const a=o.index??0,s=o[0];r+=b(e.slice(n,a)),r+=`<a href="${b(s)}" target="_blank" rel="noopener noreferrer">${b(s)}</a>`,n=a+s.length}return r+=b(e.slice(n)),r.replaceAll(`
`,"<br>")},U=t=>t?.trim()?V(t):`<span class="task-links-placeholder">${b(J)}</span>`,mt=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},ft=(t,e=!1)=>`${t.toSorted((o,a)=>(o.createdAt??0)-(a.createdAt??0)).map(o=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(o.createdAt).toISOString()}">${b(mt(o.createdAt))}</time>
            <p class="timeline-note">${V(o.text)}</p>
          </div>
        </li>
      `).join("")}${e?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,D=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(n=>({text:typeof n?.text=="string"?n.text:"",createdAt:Number(n?.createdAt)||Date.now()})).filter(n=>n.text.trim()):[]})):[],pt=(t,e=[])=>{const r=[...t,...e].reduce((n,o)=>Math.max(n,Number(o?.id)||0),0);return Math.max(1,r+1)},E=()=>c.find(t=>t.id===f)??c[0]??null,x=()=>{const t=E();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...D(t.tasks))},bt=()=>({boards:c,activeBoardId:f,zoom:p,menuSections:{completed:v,trash:h},sidebarCollapsed:y}),X=async()=>{if(!T)return;const t=await T.createWritable();await t.write(JSON.stringify(bt(),null,2)),await t.close()},P=()=>{X().catch(()=>{})},M=()=>{const t=z(1,"Board 1",[],[],1);c.splice(0,c.length,t),f=t.id,p=1,v=!1,h=!1,y=!1,x()},Q=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){M();return}c.splice(0,c.length,...e.map((o,a)=>{const s=D(o?.tasks),i=D(o?.trashedTasks);return z(Number(o?.id)||a+1,typeof o?.name=="string"&&o.name.trim()?o.name:`Board ${a+1}`,s,i,Number(o?.nextTaskNumber)||pt(s,i))}));const r=Number(t?.activeBoardId);f=Number.isFinite(r)?r:c[0].id,c.some(o=>o.id===f)||(f=c[0].id);const n=Number(t?.zoom);Number.isFinite(n)&&(p=C(n,W,Y)),v=!!t?.menuSections?.completed,h=!!t?.menuSections?.trash,y=!!t?.sidebarCollapsed,x()},gt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await dt();if(!t||!await G(t,!0))return!1;const n=await(await t.getFile()).text();return T=t,n.trim()?Q(JSON.parse(n)):M(),!0}catch{return await lt().catch(()=>{}),!1}},ht=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await G(t,!0))return;T=t,await ct(T);const n=await(await T.getFile()).text();n.trim()?Q(JSON.parse(n)):M(),await X(),m()}catch{}},L=()=>{P()},S=()=>{const t=E();t&&(t.tasks=D(u),L())},yt=()=>{M()},kt=()=>{const t=(c.at(-1)?.id??0)+1;c.push(z(t,`Board ${c.length+1}`,[],[],1)),f=t,x(),L(),m()},vt=t=>{t===f||!c.some(e=>e.id===t)||(S(),f=t,x(),L(),m())},wt=t=>{const e=c.find(n=>n.id===t);if(!e)return;const r=window.prompt("Gi board et navn",e.name)?.trim();r&&(e.name=r,L(),m())},Tt=t=>{if(c.length<=1)return;const e=c.find(n=>n.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=c.findIndex(n=>n.id===t);c.splice(r,1),f===t&&(f=c[0].id,x()),L(),m()},St=()=>{const t=E();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],L(),m())},Et=()=>{P()},Lt=()=>{P()},$t=()=>{y=!y,Lt(),m()},At=t=>{t==="completed"&&(v=!v),t==="trash"&&(h=!h),Et(),m()},xt=()=>{P()},C=(t,e,r)=>Math.min(r,Math.max(e,t)),It=t=>{const e=-t*rt;return C(e,-.04,.04)},Nt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(p*100)}%`)},qt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(j),j=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},tt=t=>{document.body.classList.toggle("is-dragging-task",t)},et=()=>{O?.remove(),O=null},at=()=>Array.from(document.querySelectorAll("[data-task-column]")),Dt=(t,e)=>{if(!t||!e||t===e)return;const r=document.querySelector("[data-board]");if(!r)return;const n=at(),o=n.find(d=>Number(d.dataset.taskId)===t),a=n.find(d=>Number(d.dataset.taskId)===e);if(!o||!a||o===a)return;const s=n.indexOf(o),i=n.indexOf(a);s===-1||i===-1||s===i||(s<i?r.insertBefore(o,a.nextSibling):r.insertBefore(o,a),q=!0)},Pt=t=>at().findIndex(e=>Number(e.dataset.taskId)===t),Mt=t=>{et();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${p})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),O=e,e},I=()=>{k=null,N?.classList.remove("is-dragging-source"),N=null,et(),tt(!1),A=!1,q=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},st=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",p.toString()),Nt(),t&&qt())},B=(t,{showIndicator:e=!0}={})=>{p=C(t,W,Y),xt(),st({showIndicator:e})},Bt=()=>{const t=E();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(ut(e)),S(),m()},Z=(t,e,r)=>{const n=u.find(o=>o.id===t);n&&(n[e]=r,S())},Ot=t=>{const e=u.findIndex(o=>o.id===t);if(e===-1)return;const[r]=u.splice(e,1),n=E();n&&r&&(n.trashedTasks=n.trashedTasks??[],n.trashedTasks.push({...r,deletedAt:Date.now()})),S(),m()},Ht=t=>{const e=u.find(r=>r.id===t);e&&(e.completed=!e.completed,S(),m())},R=(t,e)=>{const r=u.find(o=>o.id===t),n=e.trim();!r||!n||(r.notes.push({text:n,createdAt:Date.now()}),S(),m())},Ft=(t,e)=>{const r=u.findIndex(o=>o.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[n]=u.splice(r,1);u.splice(e,0,n),S(),m()},zt=t=>{const e=ft(t.notes,t.completed);return`
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
        placeholder="${J}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${b(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${U(t.details)}
      </div>
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
`},K=t=>`
  <li class="menu-task-item">${b(t.title)}</li>
`,Ct=t=>`
  <li class="board-menu-item ${t.id===f?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${b(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${c.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,m=()=>{const t=E(),e=u.filter(a=>a.completed),r=t?.trashedTasks??[];it.innerHTML=`
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
          ${c.map(Ct).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!v}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${v?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${v?"is-collapsed":""}">
            ${e.length?e.map(K).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
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
            ${r.length?r.map(K).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
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
          ${u.map(zt).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(p*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",$t),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{ht()}),document.querySelector("[data-add-board]")?.addEventListener("click",kt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);vt(i)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);wt(i)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Tt(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",St),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const i=s.currentTarget.dataset.toggleMenuSection;At(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.taskId);Ht(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Bt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.closest("[data-task-card]");if(A=!1,q=!1,k=d,N=l,N?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const g=Mt(l);s.dataTransfer.setDragImage(g,l.getBoundingClientRect().width/2,28)}tt(!0)}),a.addEventListener("dragend",()=>{if(!A&&q){I(),m();return}I()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{if(!k)return;s.preventDefault();const i=Number(a.dataset.taskId);Dt(k,i),document.querySelectorAll("[data-task-column].is-drop-target").forEach(d=>{d!==a&&d.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-drop-target"),!k)return;const i=k,d=Pt(i);A=!0,I(),d>=0&&Ft(i,d)})});const n=document.querySelector("[data-trash-zone]");n?.addEventListener("dragover",a=>{k&&(a.preventDefault(),n.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),n?.addEventListener("dragleave",()=>{n.classList.remove("is-over")}),n?.addEventListener("drop",a=>{a.preventDefault();const s=k??Number(a.dataTransfer?.getData("text/plain"));A=!0,I(),s&&Ot(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.dataset.taskInput;Z(d,l,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const i=a.closest("[data-task-card]"),d=i?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId);Z(d,"details",i.value);const l=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=U(i.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(g=>{if(g!==i.closest("[data-task-column]")){g.classList.remove("is-adding-note");const $=g.querySelector("[data-note-draft]");$ instanceof HTMLInputElement&&($.value="")}});const d=i.closest("[data-task-column]"),l=d?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.closest("[data-task-column]"),g=l?.querySelector("[data-note-draft]");if(!(g instanceof HTMLInputElement))return;const $=g.value;if($.trim()){R(d,$);return}l?.classList.remove("is-adding-note"),g.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const i=s.currentTarget,d=Number(i.dataset.taskId);R(d,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const i=s.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),B(p+It(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),B(p+_)),a.key==="-"&&(a.preventDefault(),B(p-_)))},st({showIndicator:!1})},_t=async()=>{yt(),await gt(),m()};_t();
