(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const U=.2,Q=2,K=.05,ft=.0022,bt=/(https?:\/\/[^\s<>"]+)/gi,tt="Write the task here...",et=420,ht=300,gt=920,u=[],l=[];let b=null,f=1,X,y=null,P=null,z=null,x=!1,M=!1,w=!1,k=!1,v=!1,S=null;const kt="tasktrack-file-handle-db",T="handles",_="primary",vt=document.querySelector("#app"),C=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(kt,1);r.onupgradeneeded=()=>{const n=r.result;n.objectStoreNames.contains(T)||n.createObjectStore(T)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),yt=async()=>{const t=await C();return t?new Promise((e,r)=>{const a=t.transaction(T,"readonly").objectStore(T).get(_);a.onsuccess=()=>{e(a.result??null)},a.onerror=()=>{r(a.error)}}):null},wt=async t=>{const e=await C();e&&await new Promise((r,n)=>{const s=e.transaction(T,"readwrite").objectStore(T).put(t,_);s.onsuccess=()=>{r()},s.onerror=()=>{n(s.error)}})},Tt=async()=>{const t=await C();t&&await new Promise((e,r)=>{const a=t.transaction(T,"readwrite").objectStore(T).delete(_);a.onsuccess=()=>{e()},a.onerror=()=>{r(a.error)}})},at=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},Et=t=>({id:t,title:`#${t}`,details:"",completed:!1,width:et,notes:[]}),I=t=>{const e=Number(t);return Number.isFinite(e)?Math.min(gt,Math.max(ht,e)):et},W=(t,e,r=[],n=[],o=1)=>({id:t,name:e,tasks:r,trashedTasks:n,nextTaskNumber:o}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),st=t=>{const e=t??"";let r="",n=0;for(const o of e.matchAll(bt)){const a=o.index??0,s=o[0];r+=g(e.slice(n,a)),r+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,n=a+s.length}return r+=g(e.slice(n)),r.replaceAll(`
`,"<br>")},rt=t=>t?.trim()?st(t):`<span class="task-links-placeholder">${g(tt)}</span>`,St=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},Lt=(t,e=!1)=>`${t.toSorted((o,a)=>(o.createdAt??0)-(a.createdAt??0)).map(o=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(o.createdAt).toISOString()}">${g(St(o.createdAt))}</time>
            <p class="timeline-note">${st(o.text)}</p>
          </div>
        </li>
      `).join("")}${e?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,B=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,width:I(e.width),notes:Array.isArray(e.notes)?e.notes.map(n=>({text:typeof n?.text=="string"?n.text:"",createdAt:Number(n?.createdAt)||Date.now()})).filter(n=>n.text.trim()):[]})):[],$t=(t,e=[])=>{const r=[...t,...e].reduce((n,o)=>Math.max(n,Number(o?.id)||0),0);return Math.max(1,r+1)},$=()=>l.find(t=>t.id===b)??l[0]??null,N=()=>{const t=$();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...B(t.tasks))},At=()=>({boards:l,activeBoardId:b,zoom:f,menuSections:{completed:w,trash:k},sidebarCollapsed:v}),nt=async()=>{if(!S)return;const t=await S.createWritable();await t.write(JSON.stringify(At(),null,2)),await t.close()},H=()=>{nt().catch(()=>{})},F=()=>{const t=W(1,"Board 1",[],[],1);l.splice(0,l.length,t),b=t.id,f=1,w=!1,k=!1,v=!1,N()},ot=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){F();return}l.splice(0,l.length,...e.map((o,a)=>{const s=B(o?.tasks),i=B(o?.trashedTasks);return W(Number(o?.id)||a+1,typeof o?.name=="string"&&o.name.trim()?o.name:`Board ${a+1}`,s,i,Number(o?.nextTaskNumber)||$t(s,i))}));const r=Number(t?.activeBoardId);b=Number.isFinite(r)?r:l[0].id,l.some(o=>o.id===b)||(b=l[0].id);const n=Number(t?.zoom);Number.isFinite(n)&&(f=j(n,U,Q)),w=!!t?.menuSections?.completed,k=!!t?.menuSections?.trash,v=!!t?.sidebarCollapsed,N()},xt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await yt();if(!t||!await at(t,!0))return!1;const n=await(await t.getFile()).text();return S=t,n.trim()?ot(JSON.parse(n)):F(),!0}catch{return await Tt().catch(()=>{}),!1}},It=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await at(t,!0))return;S=t,await wt(S);const n=await(await S.getFile()).text();n.trim()?ot(JSON.parse(n)):F(),await nt(),m()}catch{}},A=()=>{H()},E=()=>{const t=$();t&&(t.tasks=B(u),A())},Nt=()=>{F()},qt=()=>{const t=(l.at(-1)?.id??0)+1;l.push(W(t,`Board ${l.length+1}`,[],[],1)),b=t,N(),A(),m()},Dt=t=>{t===b||!l.some(e=>e.id===t)||(E(),b=t,N(),A(),m())},Pt=t=>{const e=l.find(n=>n.id===t);if(!e)return;const r=window.prompt("Gi board et navn",e.name)?.trim();r&&(e.name=r,A(),m())},Mt=t=>{if(l.length<=1)return;const e=l.find(n=>n.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=l.findIndex(n=>n.id===t);l.splice(r,1),b===t&&(b=l[0].id,N()),A(),m()},Bt=()=>{const t=$();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],A(),m())},Ht=()=>{H()},Ft=()=>{H()},Ot=()=>{v=!v,Ft(),m()},zt=t=>{t==="completed"&&(w=!w),t==="trash"&&(k=!k),Ht(),m()},_t=()=>{H()},j=(t,e,r)=>Math.min(r,Math.max(e,t)),Ct=t=>{const e=-t*ft;return j(e,-.04,.04)},Wt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(f*100)}%`)},jt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(X),X=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},it=t=>{document.body.classList.toggle("is-dragging-task",t)},dt=()=>{z?.remove(),z=null},ct=()=>Array.from(document.querySelectorAll("[data-task-column]")),Rt=(t,e)=>{if(!t||!e||t===e)return;const r=document.querySelector("[data-board]");if(!r)return;const n=ct(),o=n.find(d=>Number(d.dataset.taskId)===t),a=n.find(d=>Number(d.dataset.taskId)===e);if(!o||!a||o===a)return;const s=n.indexOf(o),i=n.indexOf(a);s===-1||i===-1||s===i||(s<i?r.insertBefore(o,a.nextSibling):r.insertBefore(o,a),M=!0)},Zt=t=>ct().findIndex(e=>Number(e.dataset.taskId)===t),Kt=t=>{dt();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${f})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),z=e,e},D=()=>{y=null,P?.classList.remove("is-dragging-source"),P=null,dt(),it(!1),x=!1,M=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},lt=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",f.toString()),Wt(),t&&jt())},O=(t,{showIndicator:e=!0}={})=>{f=j(t,U,Q),_t(),lt({showIndicator:e})},Xt=()=>{const t=$();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(Et(e)),E(),m()},Y=(t,e,r)=>{const n=u.find(o=>o.id===t);n&&(n[e]=r,E())},J=(t,e,{persist:r=!1}={})=>{const n=u.find(o=>o.id===t);n&&(n.width=I(e),r&&E())},Yt=t=>{const e=u.findIndex(o=>o.id===t);if(e===-1)return;const[r]=u.splice(e,1),n=$();n&&r&&(n.trashedTasks=n.trashedTasks??[],n.trashedTasks.push({...r,deletedAt:Date.now()})),E(),m()},Jt=t=>{const e=u.find(r=>r.id===t);e&&(e.completed=!e.completed,E(),m())},V=(t,e)=>{const r=u.find(o=>o.id===t),n=e.trim();!r||!n||(r.notes.push({text:n,createdAt:Date.now()}),E(),m())},Vt=(t,e)=>{const r=u.findIndex(o=>o.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[n]=u.splice(r,1);u.splice(e,0,n),E(),m()},Gt=t=>{const e=Lt(t.notes,t.completed);return`
  <section class="task-column" data-task-column data-task-id="${t.id}" style="--task-width: ${I(t.width)}px;">
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
        placeholder="${tt}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${rt(t.details)}
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
`},G=t=>`
  <li class="menu-task-item">${g(t.title)}</li>
`,Ut=t=>`
  <li class="board-menu-item ${t.id===b?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${g(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${l.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,m=()=>{const t=$(),e=u.filter(a=>a.completed),r=t?.trashedTasks??[];vt.innerHTML=`
    <main class="shell ${v?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${v?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${v?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${v?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${S?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${l.map(Ut).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!w}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${w?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${w?"is-collapsed":""}">
            ${e.length?e.map(G).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!k}">
              <h3 class="menu-section-title">Trash (${r.length})</h3>
              <i class="bi ${k?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${k?"is-collapsed":""}">
            ${r.length?r.map(G).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${k?"is-collapsed":""}" type="button" data-empty-trash ${r.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${u.map(Gt).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(f*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",Ot),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{It()}),document.querySelector("[data-add-board]")?.addEventListener("click",qt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Dt(i)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Pt(i)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Mt(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",Bt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const i=s.currentTarget.dataset.toggleMenuSection;zt(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.taskId);Jt(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Xt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-card]");if(x=!1,M=!1,y=d,P=c,P?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",c)){const p=Kt(c);s.dataTransfer.setDragImage(p,c.getBoundingClientRect().width/2,28)}it(!0)}),a.addEventListener("dragend",()=>{if(!x&&M){D(),m();return}D()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{if(!y)return;s.preventDefault();const i=Number(a.dataset.taskId);Rt(y,i),document.querySelectorAll("[data-task-column].is-drop-target").forEach(d=>{d!==a&&d.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-drop-target"),!y)return;const i=y,d=Zt(i);x=!0,D(),d>=0&&Vt(i,d)})});const n=document.querySelector("[data-trash-zone]");n?.addEventListener("dragover",a=>{y&&(a.preventDefault(),n.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),n?.addEventListener("dragleave",()=>{n.classList.remove("is-over")}),n?.addEventListener("drop",a=>{a.preventDefault();const s=y??Number(a.dataTransfer?.getData("text/plain"));x=!0,D(),s&&Yt(s)}),document.querySelectorAll("[data-resize-task]").forEach(a=>{a.addEventListener("pointerdown",s=>{s.preventDefault(),s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=u.find(L=>L.id===d);if(!d||!c||!p)return;const h=s.pointerId,ut=s.clientX,mt=I(p.width||c.getBoundingClientRect().width);i.setPointerCapture?.(h);const R=L=>{if(L.pointerId!==h)return;const pt=(L.clientX-ut)/f,Z=I(mt+pt);J(d,Z),c.style.setProperty("--task-width",`${Z}px`)},q=L=>{L.pointerId===h&&(window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",q),window.removeEventListener("pointercancel",q),i.releasePointerCapture?.(h),J(d,p.width,{persist:!0}))};window.addEventListener("pointermove",R),window.addEventListener("pointerup",q),window.addEventListener("pointercancel",q)})}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.dataset.taskInput;Y(d,c,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const i=a.closest("[data-task-card]"),d=i?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId);Y(d,"details",i.value);const c=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=rt(i.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(p=>{if(p!==i.closest("[data-task-column]")){p.classList.remove("is-adding-note");const h=p.querySelector("[data-note-draft]");h instanceof HTMLInputElement&&(h.value="")}});const d=i.closest("[data-task-column]"),c=d?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),c=i.closest("[data-task-column]"),p=c?.querySelector("[data-note-draft]");if(!(p instanceof HTMLInputElement))return;const h=p.value;if(h.trim()){V(d,h);return}c?.classList.remove("is-adding-note"),p.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const c=s.currentTarget;c.closest("[data-task-column]")?.classList.remove("is-adding-note"),c.value="";return}if(s.key!=="Enter")return;s.preventDefault();const i=s.currentTarget,d=Number(i.dataset.taskId);V(d,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const i=s.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),O(f+Ct(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),O(f+K)),a.key==="-"&&(a.preventDefault(),O(f-K)))},lt({showIndicator:!1})},Qt=async()=>{Nt(),await xt(),m()};Qt();
