(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const tt=.2,et=2,X=.05,gt=.0022,ht=/(https?:\/\/[^\s<>"]+)/gi,at="Write the task here...",st=420,kt=300,yt=920,u=[],c=[];let b=null,p=1,Y,v=null,M=null,_=null,x=!1,B=!1,w=!1,k=!1,y=!1,T=null,L=null;const vt="tasktrack-file-handle-db",E="handles",C="primary",wt=document.querySelector("#app"),R=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(vt,1);r.onupgradeneeded=()=>{const n=r.result;n.objectStoreNames.contains(E)||n.createObjectStore(E)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),Tt=async()=>{const t=await R();return t?new Promise((e,r)=>{const a=t.transaction(E,"readonly").objectStore(E).get(C);a.onsuccess=()=>{e(a.result??null)},a.onerror=()=>{r(a.error)}}):null},Et=async t=>{const e=await R();e&&await new Promise((r,n)=>{const s=e.transaction(E,"readwrite").objectStore(E).put(t,C);s.onsuccess=()=>{r()},s.onerror=()=>{n(s.error)}})},St=async()=>{const t=await R();t&&await new Promise((e,r)=>{const a=t.transaction(E,"readwrite").objectStore(E).delete(C);a.onsuccess=()=>{e()},a.onerror=()=>{r(a.error)}})},rt=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},Lt=t=>({id:t,title:`#${t}`,details:"",completed:!1,width:st,notes:[]}),N=t=>{const e=Number(t);return Number.isFinite(e)?Math.min(yt,Math.max(kt,e)):st},W=(t,e,r=[],n=[],o=1)=>({id:t,name:e,tasks:r,trashedTasks:n,nextTaskNumber:o}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),nt=t=>{const e=t??"";let r="",n=0;for(const o of e.matchAll(ht)){const a=o.index??0,s=o[0];r+=g(e.slice(n,a)),r+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,n=a+s.length}return r+=g(e.slice(n)),r.replaceAll(`
`,"<br>")},ot=t=>t?.trim()?nt(t):`<span class="task-links-placeholder">${g(at)}</span>`,$t=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},At=(t,e=!1)=>`${t.toSorted((o,a)=>(o.createdAt??0)-(a.createdAt??0)).map(o=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(o.createdAt).toISOString()}">${g($t(o.createdAt))}</time>
            <p class="timeline-note">${nt(o.text)}</p>
          </div>
        </li>
      `).join("")}${e?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,H=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,width:N(e.width),notes:Array.isArray(e.notes)?e.notes.map(n=>({text:typeof n?.text=="string"?n.text:"",createdAt:Number(n?.createdAt)||Date.now()})).filter(n=>n.text.trim()):[]})):[],It=(t,e=[])=>{const r=[...t,...e].reduce((n,o)=>Math.max(n,Number(o?.id)||0),0);return Math.max(1,r+1)},A=()=>c.find(t=>t.id===b)??c[0]??null,D=()=>{const t=A();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...H(t.tasks))},xt=()=>({boards:c,activeBoardId:b,zoom:p,menuSections:{completed:w,trash:k},sidebarCollapsed:y}),it=async()=>{if(!L)return;const t=await L.createWritable();await t.write(JSON.stringify(xt(),null,2)),await t.close()},F=()=>{it().catch(()=>{})},O=()=>{const t=W(1,"Board 1",[],[],1);c.splice(0,c.length,t),b=t.id,p=1,w=!1,k=!1,y=!1,D()},dt=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){O();return}c.splice(0,c.length,...e.map((o,a)=>{const s=H(o?.tasks),i=H(o?.trashedTasks);return W(Number(o?.id)||a+1,typeof o?.name=="string"&&o.name.trim()?o.name:`Board ${a+1}`,s,i,Number(o?.nextTaskNumber)||It(s,i))}));const r=Number(t?.activeBoardId);b=Number.isFinite(r)?r:c[0].id,c.some(o=>o.id===b)||(b=c[0].id);const n=Number(t?.zoom);Number.isFinite(n)&&(p=j(n,tt,et)),w=!!t?.menuSections?.completed,k=!!t?.menuSections?.trash,y=!!t?.sidebarCollapsed,D()},Nt=async()=>{if(!window.showOpenFilePicker)return!1;try{const t=await Tt();if(!t||!await rt(t,!0))return!1;const n=await(await t.getFile()).text();return L=t,n.trim()?dt(JSON.parse(n)):O(),!0}catch{return await St().catch(()=>{}),!1}},Dt=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await rt(t,!0))return;L=t,await Et(L);const n=await(await L.getFile()).text();n.trim()?dt(JSON.parse(n)):O(),await it(),m()}catch{}},I=()=>{F()},S=()=>{const t=A();t&&(t.tasks=H(u),I())},qt=()=>{O()},Pt=()=>{const t=(c.at(-1)?.id??0)+1;c.push(W(t,`Board ${c.length+1}`,[],[],1)),b=t,D(),I(),m()},Mt=t=>{t===b||!c.some(e=>e.id===t)||(S(),b=t,D(),I(),m())},Bt=t=>{c.find(r=>r.id===t)&&(T=t,m())},J=(t,e)=>{const r=c.find(o=>o.id===t);if(!r){T=null,m();return}const n=e.trim();n&&(r.name=n,I()),T=null,m()},Ht=()=>{T!==null&&(T=null,m())},Ft=t=>{c.find(r=>r.id===t)&&(T=t,m())},Ot=t=>{if(c.length<=1)return;const e=c.find(n=>n.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=c.findIndex(n=>n.id===t);c.splice(r,1),b===t&&(b=c[0].id,D()),I(),m()},zt=()=>{const t=A();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],I(),m())},_t=()=>{F()},Ct=()=>{F()},Rt=()=>{y=!y,Ct(),m()},Wt=t=>{t==="completed"&&(w=!w),t==="trash"&&(k=!k),_t(),m()},jt=()=>{F()},j=(t,e,r)=>Math.min(r,Math.max(e,t)),Zt=t=>{const e=-t*gt;return j(e,-.04,.04)},Kt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(p*100)}%`)},Xt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(Y),Y=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},ct=t=>{document.body.classList.toggle("is-dragging-task",t)},lt=()=>{_?.remove(),_=null},ut=()=>Array.from(document.querySelectorAll("[data-task-column]")),Yt=(t,e)=>{if(!t||!e||t===e)return;const r=document.querySelector("[data-board]");if(!r)return;const n=ut(),o=n.find(d=>Number(d.dataset.taskId)===t),a=n.find(d=>Number(d.dataset.taskId)===e);if(!o||!a||o===a)return;const s=n.indexOf(o),i=n.indexOf(a);s===-1||i===-1||s===i||(s<i?r.insertBefore(o,a.nextSibling):r.insertBefore(o,a),B=!0)},Jt=t=>ut().findIndex(e=>Number(e.dataset.taskId)===t),Vt=t=>{lt();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${p})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),_=e,e},P=()=>{v=null,M?.classList.remove("is-dragging-source"),M=null,lt(),ct(!1),x=!1,B=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},mt=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",p.toString()),Kt(),t&&Xt())},z=(t,{showIndicator:e=!0}={})=>{p=j(t,tt,et),jt(),mt({showIndicator:e})},Ut=()=>{const t=A();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(Lt(e)),S(),m()},V=(t,e,r)=>{const n=u.find(o=>o.id===t);n&&(n[e]=r,S())},U=(t,e,{persist:r=!1}={})=>{const n=u.find(o=>o.id===t);n&&(n.width=N(e),r&&S())},Gt=t=>{const e=u.findIndex(o=>o.id===t);if(e===-1)return;const[r]=u.splice(e,1),n=A();n&&r&&(n.trashedTasks=n.trashedTasks??[],n.trashedTasks.push({...r,deletedAt:Date.now()})),S(),m()},Qt=t=>{const e=u.find(r=>r.id===t);e&&(e.completed=!e.completed,S(),m())},G=(t,e)=>{const r=u.find(o=>o.id===t),n=e.trim();!r||!n||(r.notes.push({text:n,createdAt:Date.now()}),S(),m())},te=(t,e)=>{const r=u.findIndex(o=>o.id===t);if(r===-1||e<0||e>=u.length||r===e)return;const[n]=u.splice(r,1);u.splice(e,0,n),S(),m()},ee=t=>{const e=At(t.notes,t.completed);return`
  <section class="task-column" data-task-column data-task-id="${t.id}" style="--task-width: ${N(t.width)}px;">
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
        placeholder="${at}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${ot(t.details)}
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
`},Q=t=>`
  <li class="menu-task-item">${g(t.title)}</li>
`,ae=t=>`
  <li class="board-menu-item ${t.id===b?"is-active":""}">
    ${T===t.id?`<input class="board-menu-edit-input" type="text" value="${g(t.name)}" aria-label="Edit board name" data-edit-board-name data-board-id="${t.id}" />`:`<button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${g(t.name)}</button>`}
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${c.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,m=()=>{const t=A(),e=u.filter(a=>a.completed),r=t?.trashedTasks??[];wt.innerHTML=`
    <main class="shell ${y?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${y?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${y?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${y?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${L?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${c.map(ae).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!w}">
            <h3 class="menu-section-title">Completed (${e.length})</h3>
            <i class="bi ${w?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${w?"is-collapsed":""}">
            ${e.length?e.map(Q).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
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
            ${r.length?r.map(Q).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
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
          ${u.map(ee).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(p*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",Rt),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{Dt()}),document.querySelector("[data-add-board]")?.addEventListener("click",Pt),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Mt(i)}),a.addEventListener("dblclick",s=>{s.preventDefault();const i=Number(s.currentTarget.dataset.boardId);Ft(i)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Bt(i)})}),document.querySelectorAll("[data-edit-board-name]").forEach(a=>{Number(a.dataset.boardId)===T&&(a.focus(),a.select()),a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{const i=Number(s.currentTarget.dataset.boardId);s.key==="Enter"&&(s.preventDefault(),J(i,s.currentTarget.value)),s.key==="Escape"&&(s.preventDefault(),Ht())}),a.addEventListener("blur",s=>{const i=Number(s.currentTarget.dataset.boardId);J(i,s.currentTarget.value)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.boardId);Ot(i)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",zt),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const i=s.currentTarget.dataset.toggleMenuSection;Wt(i)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const i=Number(s.currentTarget.dataset.taskId);Qt(i)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Ut),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.closest("[data-task-card]");if(x=!1,B=!1,v=d,M=l,M?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(d)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",l)){const f=Vt(l);s.dataTransfer.setDragImage(f,l.getBoundingClientRect().width/2,28)}ct(!0)}),a.addEventListener("dragend",()=>{if(!x&&B){P(),m();return}P()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{if(!v)return;s.preventDefault();const i=Number(a.dataset.taskId);Yt(v,i),document.querySelectorAll("[data-task-column].is-drop-target").forEach(d=>{d!==a&&d.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-drop-target"),!v)return;const i=v,d=Jt(i);x=!0,P(),d>=0&&te(i,d)})});const n=document.querySelector("[data-trash-zone]");n?.addEventListener("dragover",a=>{v&&(a.preventDefault(),n.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),n?.addEventListener("dragleave",()=>{n.classList.remove("is-over")}),n?.addEventListener("drop",a=>{a.preventDefault();const s=v??Number(a.dataTransfer?.getData("text/plain"));x=!0,P(),s&&Gt(s)}),document.querySelectorAll("[data-resize-task]").forEach(a=>{a.addEventListener("pointerdown",s=>{s.preventDefault(),s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.closest("[data-task-column]"),f=u.find($=>$.id===d);if(!d||!l||!f)return;const h=s.pointerId,ft=s.clientX,pt=N(f.width||l.getBoundingClientRect().width);i.setPointerCapture?.(h);const Z=$=>{if($.pointerId!==h)return;const bt=($.clientX-ft)/p,K=N(pt+bt);U(d,K),l.style.setProperty("--task-width",`${K}px`)},q=$=>{$.pointerId===h&&(window.removeEventListener("pointermove",Z),window.removeEventListener("pointerup",q),window.removeEventListener("pointercancel",q),i.releasePointerCapture?.(h),U(d,f.width,{persist:!0}))};window.addEventListener("pointermove",Z),window.addEventListener("pointerup",q),window.addEventListener("pointercancel",q)})}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.dataset.taskInput;V(d,l,i.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const i=a.closest("[data-task-card]"),d=i?.querySelector('[data-task-input="details"]');d instanceof HTMLTextAreaElement&&(i?.classList.add("is-editing-details"),d.focus(),d.setSelectionRange(d.value.length,d.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const i=s.currentTarget,d=Number(i.dataset.taskId);V(d,"details",i.value);const l=i.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");l&&(l.innerHTML=ot(i.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(f=>{if(f!==i.closest("[data-task-column]")){f.classList.remove("is-adding-note");const h=f.querySelector("[data-note-draft]");h instanceof HTMLInputElement&&(h.value="")}});const d=i.closest("[data-task-column]"),l=d?.querySelector("[data-note-draft]");l instanceof HTMLInputElement&&(d?.classList.add("is-adding-note"),l.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const i=s.currentTarget,d=Number(i.dataset.taskId),l=i.closest("[data-task-column]"),f=l?.querySelector("[data-note-draft]");if(!(f instanceof HTMLInputElement))return;const h=f.value;if(h.trim()){G(d,h);return}l?.classList.remove("is-adding-note"),f.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const l=s.currentTarget;l.closest("[data-task-column]")?.classList.remove("is-adding-note"),l.value="";return}if(s.key!=="Enter")return;s.preventDefault();const i=s.currentTarget,d=Number(i.dataset.taskId);G(d,i.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const i=s.querySelector("[data-note-draft]");i instanceof HTMLInputElement&&(i.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),z(p+Zt(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),z(p+X)),a.key==="-"&&(a.preventDefault(),z(p-X)))},mt({showIndicator:!1})},se=async()=>{qt(),await Nt(),m()};se();
