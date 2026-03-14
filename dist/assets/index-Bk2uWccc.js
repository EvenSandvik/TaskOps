(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();const Z=.2,_=2,z=.05,V=.0022,U=/(https?:\/\/[^\s<>"]+)/gi,j="Write the task here...",u=[],d=[];let p=null,b=1,P,k=null,A=null,D=null,y=!1,h=!1,v=!1,L=null;const X=document.querySelector("#app"),Q=t=>({id:t,title:`#${t}`,details:"",completed:!1,notes:[]}),M=(t,e,o=[],r=[],i=1)=>({id:t,name:e,tasks:o,trashedTasks:r,nextTaskNumber:i}),g=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),W=t=>{const e=t??"";let o="",r=0;for(const i of e.matchAll(U)){const a=i.index??0,s=i[0];o+=g(e.slice(r,a)),o+=`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${g(s)}</a>`,r=a+s.length}return o+=g(e.slice(r)),o.replaceAll(`
`,"<br>")},K=t=>t?.trim()?W(t):`<span class="task-links-placeholder">${g(j)}</span>`,tt=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},et=t=>t.length?t.toSorted((e,o)=>(e.createdAt??0)-(o.createdAt??0)).map(e=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(e.createdAt).toISOString()}">${g(tt(e.createdAt))}</time>
            <p class="timeline-note">${W(e.text)}</p>
          </div>
        </li>
      `).join(""):"",x=t=>Array.isArray(t)?t.map((e,o)=>({id:Number(e.id)||o+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${o+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,notes:Array.isArray(e.notes)?e.notes.map(r=>({text:typeof r?.text=="string"?r.text:"",createdAt:Number(r?.createdAt)||Date.now()})).filter(r=>r.text.trim()):[]})):[],at=(t,e=[])=>{const o=[...t,...e].reduce((r,i)=>Math.max(r,Number(i?.id)||0),0);return Math.max(1,o+1)},S=()=>d.find(t=>t.id===p)??d[0]??null,$=()=>{const t=S();if(!t){u.splice(0,u.length);return}u.splice(0,u.length,...x(t.tasks))},st=()=>({boards:d,activeBoardId:p,zoom:b,menuSections:{completed:y,trash:h},sidebarCollapsed:v}),R=async()=>{if(!L)return;const t=await L.createWritable();await t.write(JSON.stringify(st(),null,2)),await t.close()},I=()=>{R().catch(()=>{})},B=()=>{const t=M(1,"Board 1",[],[],1);d.splice(0,d.length,t),p=t.id,b=1,y=!1,h=!1,v=!1,$()},ot=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){B();return}d.splice(0,d.length,...e.map((i,a)=>{const s=x(i?.tasks),n=x(i?.trashedTasks);return M(Number(i?.id)||a+1,typeof i?.name=="string"&&i.name.trim()?i.name:`Board ${a+1}`,s,n,Number(i?.nextTaskNumber)||at(s,n))}));const o=Number(t?.activeBoardId);p=Number.isFinite(o)?o:d[0].id,d.some(i=>i.id===p)||(p=d[0].id);const r=Number(t?.zoom);Number.isFinite(r)&&(b=O(r,Z,_)),y=!!t?.menuSections?.completed,h=!!t?.menuSections?.trash,v=!!t?.sidebarCollapsed,$()},rt=async()=>{if(!window.showOpenFilePicker){window.alert("File storage needs a Chromium-based browser and localhost/https context.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});L=t;const o=await(await L.getFile()).text();o.trim()?ot(JSON.parse(o)):B(),await R(),m()}catch{}},w=()=>{I()},T=()=>{const t=S();t&&(t.tasks=x(u),w())},nt=()=>{B()},it=()=>{const t=(d.at(-1)?.id??0)+1;d.push(M(t,`Board ${d.length+1}`,[],[],1)),p=t,$(),w(),m()},dt=t=>{t===p||!d.some(e=>e.id===t)||(T(),p=t,$(),w(),m())},lt=t=>{const e=d.find(r=>r.id===t);if(!e)return;const o=window.prompt("Gi board et navn",e.name)?.trim();o&&(e.name=o,w(),m())},ct=t=>{if(d.length<=1)return;const e=d.find(r=>r.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const o=d.findIndex(r=>r.id===t);d.splice(o,1),p===t&&(p=d[0].id,$()),w(),m()},ut=()=>{const t=S();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],w(),m())},mt=()=>{I()},pt=()=>{I()},ft=()=>{v=!v,pt(),m()},bt=t=>{t==="completed"&&(y=!y),t==="trash"&&(h=!h),mt(),m()},gt=()=>{I()},O=(t,e,o)=>Math.min(o,Math.max(e,t)),ht=t=>{const e=-t*V;return O(e,-.04,.04)},vt=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(b*100)}%`)},kt=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(P),P=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},Y=t=>{document.body.classList.toggle("is-dragging-task",t)},G=()=>{D?.remove(),D=null},yt=t=>{G();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${b})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(o=>{o.setAttribute("tabindex","-1")}),document.body.append(e),D=e,e},N=()=>{k=null,A?.classList.remove("is-dragging-source"),A=null,G(),Y(!1),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},J=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",b.toString()),vt(),t&&kt())},q=(t,{showIndicator:e=!0}={})=>{b=O(t,Z,_),gt(),J({showIndicator:e})},Tt=()=>{const t=S();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,u.push(Q(e)),T(),m()},C=(t,e,o)=>{const r=u.find(i=>i.id===t);r&&(r[e]=o,T())},St=t=>{const e=u.findIndex(i=>i.id===t);if(e===-1)return;const[o]=u.splice(e,1),r=S();r&&o&&(r.trashedTasks=r.trashedTasks??[],r.trashedTasks.push({...o,deletedAt:Date.now()})),T(),m()},wt=t=>{const e=u.find(o=>o.id===t);e&&(e.completed=!e.completed,T(),m())},F=(t,e)=>{const o=u.find(i=>i.id===t),r=e.trim();!o||!r||(o.notes.push({text:r,createdAt:Date.now()}),T(),m())},Et=(t,e)=>{const o=u.findIndex(i=>i.id===t);if(o===-1||e<0||e>=u.length||o===e)return;const[r]=u.splice(o,1);u.splice(e,0,r),T(),m()},Lt=t=>`
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
        placeholder="${j}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${g(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${K(t.details)}
      </div>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${t.notes.length?"":"is-empty"}" data-timeline-list>
        ${et(t.notes)}
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
  <li class="menu-task-item">${g(t.title)}</li>
`,$t=t=>`
  <li class="board-menu-item ${t.id===p?"is-active":""}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${g(t.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${t.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${d.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`,m=()=>{const t=S(),e=u.filter(a=>a.completed),o=t?.trashedTasks??[];X.innerHTML=`
    <main class="shell ${v?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${v?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${v?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${v?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${L?"File connected":"Open data file"}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${d.map($t).join("")}
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
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!h}">
              <h3 class="menu-section-title">Trash (${o.length})</h3>
              <i class="bi ${h?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${h?"is-collapsed":""}">
            ${o.length?o.map(H).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${h?"is-collapsed":""}" type="button" data-empty-trash ${o.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${u.map(Lt).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(b*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-toggle-sidebar]")?.addEventListener("click",ft),document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{rt()}),document.querySelector("[data-add-board]")?.addEventListener("click",it),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);dt(n)})}),document.querySelectorAll("[data-rename-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);lt(n)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.boardId);ct(n)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",ut),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const n=s.currentTarget.dataset.toggleMenuSection;bt(n)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const n=Number(s.currentTarget.dataset.taskId);wt(n)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Tt),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.closest("[data-task-card]");if(k=l,A=c,A?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(l)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",c)){const f=yt(c);s.dataTransfer.setDragImage(f,c.getBoundingClientRect().width/2,28)}Y(!0)}),a.addEventListener("dragend",()=>{N()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{k&&(s.preventDefault(),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{s.preventDefault();const n=Number(a.dataset.taskId);if(a.classList.remove("is-drop-target"),!k||!n||k===n)return;const l=k,c=u.findIndex(f=>f.id===n);N(),Et(l,c)})});const r=document.querySelector("[data-trash-zone]");r?.addEventListener("dragover",a=>{k&&(a.preventDefault(),r.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),r?.addEventListener("dragleave",()=>{r.classList.remove("is-over")}),r?.addEventListener("drop",a=>{a.preventDefault();const s=k??Number(a.dataTransfer?.getData("text/plain"));N(),s&&St(s)}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.dataset.taskInput;C(l,c,n.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const n=a.closest("[data-task-card]"),l=n?.querySelector('[data-task-input="details"]');l instanceof HTMLTextAreaElement&&(n?.classList.add("is-editing-details"),l.focus(),l.setSelectionRange(l.value.length,l.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const n=s.currentTarget,l=Number(n.dataset.taskId);C(l,"details",n.value);const c=n.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=K(n.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(f=>{if(f!==n.closest("[data-task-column]")){f.classList.remove("is-adding-note");const E=f.querySelector("[data-note-draft]");E instanceof HTMLInputElement&&(E.value="")}});const l=n.closest("[data-task-column]"),c=l?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(l?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const n=s.currentTarget,l=Number(n.dataset.taskId),c=n.closest("[data-task-column]"),f=c?.querySelector("[data-note-draft]");if(!(f instanceof HTMLInputElement))return;const E=f.value;if(E.trim()){F(l,E);return}c?.classList.remove("is-adding-note"),f.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const c=s.currentTarget;c.closest("[data-task-column]")?.classList.remove("is-adding-note"),c.value="";return}if(s.key!=="Enter")return;s.preventDefault();const n=s.currentTarget,l=Number(n.dataset.taskId);F(l,n.value)})}),document.addEventListener("click",a=>{a.target instanceof Element&&a.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(s=>{s.classList.remove("is-adding-note");const n=s.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),q(b+ht(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),q(b+z)),a.key==="-"&&(a.preventDefault(),q(b-z)))},J({showIndicator:!1})};nt();m();
