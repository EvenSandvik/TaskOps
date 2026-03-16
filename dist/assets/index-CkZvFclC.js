(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const p of d.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function r(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function n(i){if(i.ep)return;i.ep=!0;const d=r(i);fetch(i.href,d)}})();const Nt=.2,xt=2,gt=.05,Wt=.0022,Zt=/(https?:\/\/[^\s<>"]+)/gi,Dt="Write the task here...",qt=420,Kt=300,Ut=920,lt=["red","orange","yellow","green","blue","purple","pink"],b=[],f=[];let y=null,v=1,yt,w=null,at=null,ct=null,_=!1,st=!1,q=!1,A=!1,$=!1,H=null,Q="",N=!1,M=null,C=null,T=null,vt=null,ut=!1,x=null,D=null,it=!1,j=[],P=null,tt=null,nt=!1,et="",wt=!1;const Vt="tasktrack-file-handle-db",F="handles",ft="primary",rt=document.querySelector("#app"),Z=window.taskTrackDesktop??null,E=!!Z?.isDesktop,Xt=()=>{clearTimeout(vt),ut=!0,u(),vt=window.setTimeout(()=>{ut=!1,u()},2e3)},pt=()=>new Promise((t,e)=>{if(!window.indexedDB){t(null);return}const r=window.indexedDB.open(Vt,1);r.onupgradeneeded=()=>{const n=r.result;n.objectStoreNames.contains(F)||n.createObjectStore(F)},r.onsuccess=()=>{t(r.result)},r.onerror=()=>{e(r.error)}}),Yt=async()=>{const t=await pt();return t?new Promise((e,r)=>{const d=t.transaction(F,"readonly").objectStore(F).get(ft);d.onsuccess=()=>{e(d.result??null)},d.onerror=()=>{r(d.error)}}):null},Jt=async t=>{const e=await pt();e&&await new Promise((r,n)=>{const p=e.transaction(F,"readwrite").objectStore(F).put(t,ft);p.onsuccess=()=>{r()},p.onerror=()=>{n(p.error)}})},Gt=async()=>{const t=await pt();t&&await new Promise((e,r)=>{const d=t.transaction(F,"readwrite").objectStore(F).delete(ft);d.onsuccess=()=>{e()},d.onerror=()=>{r(d.error)}})},Pt=async(t,e=!0)=>{if(!t?.queryPermission||!t.requestPermission)return!1;const r=e?{mode:"readwrite"}:{mode:"read"};return await t.queryPermission(r)==="granted"?!0:await t.requestPermission(r)==="granted"},Qt=t=>({id:t,title:`#${t}`,details:"",completed:!1,color:lt[Math.floor(Math.random()*lt.length)],width:qt,notes:[]}),Y=t=>{const e=Number(t);return Number.isFinite(e)?Math.min(Ut,Math.max(Kt,e)):qt},mt=(t,e,r=[],n=[],i=1)=>({id:t,name:e,tasks:r,trashedTasks:n,nextTaskNumber:i}),h=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),Ft=t=>{const e=t??"";let r="",n=0;for(const i of e.matchAll(Zt)){const d=i.index??0,p=i[0];r+=h(e.slice(n,d));const g=p.length>60?`${p.slice(0,60)}…`:p;r+=`<a href="${h(p)}" target="_blank" rel="noopener noreferrer" title="${h(p)}">${h(g)}</a>`,n=d+p.length}return r+=h(e.slice(n)),r.replaceAll(`
`,"<br>")},Bt=t=>t?.trim()?Ft(t):`<span class="task-links-placeholder">${h(Dt)}</span>`,te=t=>{const e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},ee=(t,e,r=!1)=>`${e.toSorted((d,p)=>(d.createdAt??0)-(p.createdAt??0)).map(d=>`
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(d.createdAt).toISOString()}">${h(te(d.createdAt))}</time>
            <div class="timeline-note-row">
              <p class="timeline-note">${Ft(d.text)}</p>
              <button
                class="timeline-note-delete"
                type="button"
                aria-label="Delete status note"
                title="Delete status note"
                data-delete-note
                data-task-id="${t}"
                data-note-id="${d.id}"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </li>
      `).join("")}${r?`
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `:""}`,W=t=>Array.isArray(t)?t.map((e,r)=>({id:Number(e.id)||r+1,title:typeof e.title=="string"&&e.title.trim()?e.title:`#${r+1}`,details:typeof e.details=="string"?e.details:"",completed:!!e.completed,color:lt.includes(e.color)?e.color:null,width:Y(e.width),notes:Array.isArray(e.notes)?e.notes.map((n,i)=>{const d=Number(n?.createdAt)||Date.now();return{id:Number(n?.id)||d*1e3+i,text:typeof n?.text=="string"?n.text:"",createdAt:d}}).filter(n=>n.text.trim()):[]})):[],Mt=(t,e=[])=>{const r=[...t,...e].reduce((n,i)=>Math.max(n,Number(i?.id)||0),0);return Math.max(1,r+1)},O=()=>f.find(t=>t.id===y)??f[0]??null,K=()=>{const t=O();if(!t){b.splice(0,b.length);return}b.splice(0,b.length,...W(t.tasks))},Tt=()=>({boards:f,activeBoardId:y,zoom:v,menuSections:{completed:q,trash:A},sidebarCollapsed:$,boardCompletedCollapsed:N}),ot=async()=>{if(E){const e=await Z.saveState({filePath:tt,state:Tt()});return D={...D??{},...e??{}},Array.isArray(e?.files)&&(j=e.files),P=typeof e?.recentFilePath=="string"?e.recentFilePath:P,tt=e?.path??tt,!0}if(!x)return!1;const t=await x.createWritable();return await t.write(JSON.stringify(Tt(),null,2)),await t.close(),!0},J=({showSaved:t=!1}={})=>{ot().then(e=>{e&&t&&Xt()}).catch(()=>{})},ae=t=>{const e=Number(t?.lastUsedAt)||Number(t?.lastSavedAt)||0;if(!e)return"Never used";const r=new Date(e);return Number.isNaN(r.getTime())?"Unknown":r.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})},Ct=async()=>{if(!E)return;const t=await Z.listFiles();j=Array.isArray(t?.files)?t.files:[],P=typeof t?.recentFilePath=="string"?t.recentFilePath:null},Ht=async t=>{if(!E)return;const e=await Z.loadState(t);x={kind:"desktop"},D=e,tt=e?.path??t??null,Array.isArray(e?.files)&&(j=e.files),P=typeof e?.recentFilePath=="string"?e.recentFilePath:P,e?.state&&typeof e.state=="object"?X(e.state):(I(),await ot()),nt=!1,u()},Et=async(t="")=>{if(!E)return;const e=await Z.createFile(t);Array.isArray(e?.files)&&(j=e.files),P=typeof e?.recentFilePath=="string"?e.recentFilePath:P,et="",await Ht(e?.path)},I=()=>{const t=mt(1,"Board 1",[],[],1);f.splice(0,f.length,t),y=t.id,v=1,q=!1,A=!1,$=!1,N=!1,K()},X=t=>{const e=Array.isArray(t?.boards)?t.boards:[];if(!e.length){I();return}f.splice(0,f.length,...e.map((i,d)=>{const p=W(i?.tasks),g=W(i?.trashedTasks);return mt(Number(i?.id)||d+1,typeof i?.name=="string"&&i.name.trim()?i.name:`Board ${d+1}`,p,g,Number(i?.nextTaskNumber)||Mt(p,g))}));const r=Number(t?.activeBoardId);y=Number.isFinite(r)?r:f[0].id,f.some(i=>i.id===y)||(y=f[0].id);const n=Number(t?.zoom);Number.isFinite(n)&&(v=bt(n,Nt,xt)),q=!!t?.menuSections?.completed,A=!!t?.menuSections?.trash,$=!!t?.sidebarCollapsed,N=!!t?.boardCompletedCollapsed,K()},se=async()=>{if(E)try{const t=await Z.loadState();if(x={kind:"desktop"},D=t,t?.encryptionError)return window.alert("Could not decrypt the local TaskTrack data file. This can happen if the file was copied from another OS account. TaskTrack will not overwrite your data file automatically."),I(),!0;if(t?.state)X(t.state);else if(typeof t?.rawState=="string"&&t.rawState.trim())try{X(JSON.parse(t.rawState))}catch{window.alert("TaskTrack found data but could not parse it. Your file was not changed automatically."),I()}else I(),await ot();return!0}catch{return I(),!0}if(!window.showOpenFilePicker)return!1;try{const t=await Yt();if(!t||!await Pt(t,!0))return!1;const n=await(await t.getFile()).text();return x=t,n.trim()?X(JSON.parse(n)):I(),!0}catch{return await Gt().catch(()=>{}),!1}},re=async()=>{if(E){await Ct(),nt=!0,u();return}if(!window.showOpenFilePicker){window.alert("TaskTrack must run in a Chromium-based browser on localhost or https. If you opened index.html directly, start the app with npm run dev and use the served URL.");return}try{const[t]=await window.showOpenFilePicker({multiple:!1,types:[{description:"TaskTrack data",accept:{"application/json":[".json"]}}]});if(!await Pt(t,!0))return;x=t,await Jt(x);const n=await(await x.getFile()).text();n.trim()?X(JSON.parse(n)):I(),await ot(),u()}catch{}},B=({showSaved:t=!1}={})=>{J({showSaved:t})},S=({showSaved:t=!1}={})=>{const e=O();e&&(e.tasks=W(b),B({showSaved:t}))},ne=()=>{I()},oe=()=>E?D?.encryptionError?{label:"Encryption error",title:"Desktop data could not be decrypted on this OS account.",className:"is-warning"}:D?.isEncrypted?{label:"Encrypted at rest",title:"Local desktop data is encrypted using OS secure storage.",className:"is-encrypted"}:D?.encryptionAvailable===!1?{label:"Encryption unavailable",title:"OS secure storage is unavailable, so local data is not encrypted at rest.",className:"is-unencrypted"}:{label:"Checking encryption...",title:"Encryption status will appear after the first desktop state load.",className:""}:{label:"",title:"",className:""},ie=()=>{const t=(f.at(-1)?.id??0)+1;f.push(mt(t,`Board ${f.length+1}`,[],[],1)),y=t,K(),B(),u()},de=t=>{t===y||!f.some(e=>e.id===t)||(S(),y=t,K(),B(),u())},St=(t,e)=>{const r=f.find(i=>i.id===t);if(!r){H=null,u();return}const n=e.trim();n&&(r.name=n,B()),H=null,u()},le=()=>{H!==null&&(H=null,u())},ce=t=>{f.find(r=>r.id===t)&&(H=t,u())},ue=t=>{if(f.length<=1)return;const e=f.find(n=>n.id===t);if(!e||!window.confirm(`Slette board "${e.name}"?`))return;const r=f.findIndex(n=>n.id===t);f.splice(r,1),y===t&&(y=f[0].id,K()),B(),u()},fe=()=>{const t=O();!t||!t.trashedTasks?.length||window.confirm("Empty trash for this board?")&&(t.trashedTasks=[],B(),u())},pe=()=>{J()},me=()=>{J()},be=()=>{$=!$,me(),u()},he=t=>{t==="completed"&&(q=!q),t==="trash"&&(A=!A),pe(),u()},ke=()=>{J()},bt=(t,e,r)=>Math.min(r,Math.max(e,t)),ge=t=>{const e=-t*Wt;return bt(e,-.04,.04)},ye=()=>{const t=document.querySelector("[data-zoom-value]");t&&(t.textContent=`${Math.round(v*100)}%`)},ve=()=>{const t=document.querySelector("[data-zoom-indicator]");t&&(t.classList.add("is-visible"),clearTimeout(yt),yt=window.setTimeout(()=>{t.classList.remove("is-visible")},900))},Ot=t=>{document.body.classList.toggle("is-dragging-task",t)},zt=()=>{ct?.remove(),ct=null},Rt=()=>Array.from(document.querySelectorAll("[data-task-column]")),we=(t,e)=>{if(!t||!e||t===e)return;const r=document.querySelector("[data-board]");if(!r)return;const n=Rt(),i=n.find(L=>Number(L.dataset.taskId)===t),d=n.find(L=>Number(L.dataset.taskId)===e);if(!i||!d||i===d)return;const p=n.indexOf(i),g=n.indexOf(d);p===-1||g===-1||p===g||(p<g?r.insertBefore(i,d.nextSibling):r.insertBefore(i,d),st=!0)},Te=t=>Rt().findIndex(e=>Number(e.dataset.taskId)===t),Ee=t=>{zt();const e=t.cloneNode(!0);return e.classList.add("task-card-drag-preview"),e.style.width=`${t.offsetWidth}px`,e.style.height=`${t.offsetHeight}px`,e.style.position="fixed",e.style.top="-9999px",e.style.left="-9999px",e.style.transform=`scale(${v})`,e.style.transformOrigin="top left",e.querySelectorAll("input, textarea, button").forEach(r=>{r.setAttribute("tabindex","-1")}),document.body.append(e),ct=e,e},V=()=>{w=null,at?.classList.remove("is-dragging-source"),at=null,zt(),Ot(!1),_=!1,st=!1,document.querySelectorAll("[data-task-column].is-drop-target").forEach(t=>{t.classList.remove("is-drop-target")}),document.querySelectorAll("[data-board-item].is-task-board-drop-target").forEach(t=>{t.classList.remove("is-task-board-drop-target")}),document.querySelector("[data-trash-zone]")?.classList.remove("is-over")},_t=({showIndicator:t=!1}={})=>{const e=document.querySelector("[data-board]");e&&(e.style.setProperty("--zoom",v.toString()),ye(),t&&ve())},dt=(t,{showIndicator:e=!0}={})=>{v=bt(t,Nt,xt),ke(),_t({showIndicator:e})},Se=()=>{const t=O();if(!t)return;const e=t.nextTaskNumber;t.nextTaskNumber+=1,b.push(Qt(e)),S(),u()},Lt=(t,e,r)=>{const n=b.find(i=>i.id===t);n&&(n[e]=r,S({showSaved:!0}))},It=(t,e,{persist:r=!1}={})=>{const n=b.find(i=>i.id===t);n&&(n.width=Y(e),r&&S())},Le=t=>{const e=b.findIndex(i=>i.id===t);if(e===-1)return;const[r]=b.splice(e,1),n=O();n&&r&&(n.trashedTasks=n.trashedTasks??[],n.trashedTasks.push({...r,deletedAt:Date.now()})),S(),clearTimeout(C),M={task:r,boardId:y},C=window.setTimeout(()=>{M=null,C=null,u()},5e3),u()},Ie=t=>{const e=b.find(r=>r.id===t);e&&(e.completed=!e.completed,S({showSaved:!0}),u())},At=(t,e)=>{const r=b.find(d=>d.id===t),n=e.trim();if(!r||!n)return;const i=Date.now()*1e3+r.notes.length;r.notes.push({id:i,text:n,createdAt:Date.now()}),S({showSaved:!0}),u()},Ae=(t,e)=>{const r=b.find(i=>i.id===t);if(!r||!Array.isArray(r.notes))return;const n=r.notes.findIndex(i=>Number(i.id)===e);n!==-1&&(r.notes.splice(n,1),S({showSaved:!0}),u())},$e=(t,e)=>{const r=b.findIndex(i=>i.id===t);if(r===-1||e<0||e>=b.length||r===e)return;const[n]=b.splice(r,1);b.splice(e,0,n),S(),u()},Ne=(t,e)=>{const r=O(),n=f.find(g=>g.id===e);if(!r||!n||r.id===n.id)return;const i=b.findIndex(g=>g.id===t);if(i===-1)return;const[d]=b.splice(i,1);r.tasks=W(b);const p=Number(n.nextTaskNumber)||Mt(n.tasks,n.trashedTasks);n.nextTaskNumber=p+1,n.tasks=W([...Array.isArray(n.tasks)?n.tasks:[],{...d,id:p}]),B({showSaved:!0}),u()},xe=()=>{if(!M)return;const{task:t,boardId:e}=M;clearTimeout(C),C=null,M=null;const r=f.find(n=>n.id===e);if(r){const n=r.trashedTasks.findIndex(i=>i.id===t.id);n!==-1&&r.trashedTasks.splice(n,1),r.tasks.push({...t}),e===y&&K(),S()}u()},De=()=>{clearTimeout(C),C=null,M=null,u()},qe=()=>{N=!N,J(),u()},Pe=(t,e)=>{const r=f.findIndex(i=>i.id===t);if(r===-1||e<0||e>=f.length||r===e)return;const[n]=f.splice(r,1);f.splice(e,0,n),B(),u()},Fe=t=>{const e=ee(t.id,t.notes,t.completed);return`
  <section class="task-column" data-task-column data-task-id="${t.id}" style="--task-width: ${Y(t.width)}px;">
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
          value="${h(t.title)}"
          aria-label="Task title ${t.id}"
          data-task-input="title"
          data-task-id="${t.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${Dt}"
        aria-label="Task details ${t.id}"
        data-task-input="details"
        data-task-id="${t.id}"
      >${h(t.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${t.id}">
        ${Bt(t.details)}
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
`},$t=t=>`
  <li class="menu-task-item">${h(t.title)}</li>
`,Be=t=>{const e=t.tasks.filter(r=>!r.completed).length;return`
  <li class="board-menu-item ${t.id===y?"is-active":""}" data-board-item data-board-id="${t.id}">
    <button class="board-drag-handle" type="button" draggable="true" data-drag-board data-board-id="${t.id}" aria-label="Drag to reorder board">⋮⋮</button>
    ${H===t.id?`<input class="board-menu-edit-input" type="text" value="${h(t.name)}" aria-label="Edit board name" data-edit-board-name data-board-id="${t.id}" />`:`<button class="board-menu-switch" type="button" data-switch-board data-board-id="${t.id}">${h(t.name)}${e>0?`<span class="board-task-count">${e}</span>`:""}</button>`}
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${t.id}" ${f.length<=1?"disabled":""}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
  `},Me=()=>{const t=document.activeElement;if(!(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)||!rt.contains(t))return null;let e=null;return t.hasAttribute("data-search")&&(e="[data-search]"),!e&&t.hasAttribute("data-task-input")&&t.dataset.taskId&&(e=`[data-task-input="${t.dataset.taskInput}"][data-task-id="${t.dataset.taskId}"]`),!e&&t.hasAttribute("data-note-draft")&&t.dataset.taskId&&(e=`[data-note-draft][data-task-id="${t.dataset.taskId}"]`),!e&&t.hasAttribute("data-edit-board-name")&&t.dataset.boardId&&(e=`[data-edit-board-name][data-board-id="${t.dataset.boardId}"]`),e?{selector:e,value:t.value,selectionStart:t.selectionStart,selectionEnd:t.selectionEnd,isDetailsInput:t.dataset.taskInput==="details",isNoteDraft:t.hasAttribute("data-note-draft")}:null},Ce=t=>{if(!t)return;const e=document.querySelector(t.selector);(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement)&&(t.isDetailsInput&&e.closest("[data-task-card]")?.classList.add("is-editing-details"),t.isNoteDraft&&e.closest("[data-task-column]")?.classList.add("is-adding-note"),e.value=t.value,e.focus(),typeof t.selectionStart=="number"&&typeof t.selectionEnd=="number"&&e.setSelectionRange(t.selectionStart,t.selectionEnd))},He=()=>{wt||(document.addEventListener("click",t=>{if(!(t.target instanceof Element))return;const e=t.target.closest("[data-toggle-sidebar]");if(e&&rt.contains(e)){t.preventDefault(),be();return}t.target.closest("[data-note-composer], [data-open-note-composer]")||document.querySelectorAll(".task-column.is-adding-note").forEach(r=>{r.classList.remove("is-adding-note");const n=r.querySelector("[data-note-draft]");n instanceof HTMLInputElement&&(n.value="")})}),wt=!0)},u=()=>{const t=it?null:Me();it=!1;const e=oe();if(E&&nt){const a=j.length?j.map(o=>{const l=o.path===P;return`
              <li class="desktop-file-picker-item">
                <button class="desktop-file-picker-open" type="button" data-open-desktop-file data-file-path="${h(o.path)}">
                  <span class="desktop-file-picker-name">${h(o.fileName??"Untitled")}</span>
                  <span class="desktop-file-picker-meta">${l?"Recent · ":""}${h(ae(o))}</span>
                </button>
              </li>
            `}).join(""):'<li class="desktop-file-picker-empty">No files yet. Create your first TaskTrack file.</li>';rt.innerHTML=`
      <main class="desktop-file-picker-shell">
        <header class="desktop-file-picker-header">
          <h1 class="desktop-file-picker-title">Choose a TaskTrack file</h1>
          <p class="desktop-file-picker-subtitle">Open a recent file or create a new one.</p>
        </header>

        <section class="desktop-file-picker-actions">
          <input
            class="desktop-file-picker-name-input"
            type="text"
            placeholder="File name"
            value="${h(et)}"
            aria-label="New file name"
            data-desktop-file-name
          />
          <button class="desktop-file-picker-create" type="button" data-create-desktop-file>Create file</button>
        </section>

        <ul class="desktop-file-picker-list">
          ${a}
        </ul>
      </main>
    `;const s=document.querySelector("[data-desktop-file-name]");s instanceof HTMLInputElement&&(s.addEventListener("input",o=>{et=o.currentTarget.value}),s.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),Et(s.value))})),document.querySelector("[data-create-desktop-file]")?.addEventListener("click",()=>{const o=s instanceof HTMLInputElement?s.value:et;Et(o)}),document.querySelectorAll("[data-open-desktop-file]").forEach(o=>{o.addEventListener("click",l=>{const c=l.currentTarget.dataset.filePath;c&&Ht(c)})});return}const r=O(),n=b.filter(a=>a.completed),i=r?.trashedTasks??[],d=Q.toLowerCase().trim(),p=b.filter(a=>N&&a.completed?!1:d?a.title.toLowerCase().includes(d)||a.details.toLowerCase().includes(d):!0);rt.innerHTML=`
    <main class="shell ${$?"is-sidebar-collapsed":""}">
      <aside class="left-menu ${$?"is-collapsed":""}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${$?"Expand sidebar":"Minimize sidebar"}" data-toggle-sidebar>
            <i class="bi ${$?"bi-chevron-right":"bi-chevron-left"}" aria-hidden="true"></i>
          </button>
          ${E?`<div class="left-menu-file-badge" title="${h(D?.path??"Desktop data file")}">${h(D?.fileName??"Desktop app")}</div>
            <div class="left-menu-privacy-badge ${e.className}" title="${h(e.title)}">${h(e.label)}</div>
            <button class="left-menu-file-button" type="button" data-connect-file>Files</button>`:`<button class="left-menu-file-button" type="button" data-connect-file>${x?"File connected":"Open data file"}</button>`}
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${f.map(Be).join("")}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!q}">
            <h3 class="menu-section-title">Completed (${n.length})</h3>
            <i class="bi ${q?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${q?"is-collapsed":""}">
            ${n.length?n.map($t).join(""):'<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!A}">
              <h3 class="menu-section-title">Trash (${i.length})</h3>
              <i class="bi ${A?"bi-chevron-right":"bi-chevron-down"}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${A?"is-collapsed":""}">
            ${i.length?i.map($t).join(""):'<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${A?"is-collapsed":""}" type="button" data-empty-trash ${i.length?"":"disabled"}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
        <input class="search-input" type="search" placeholder="Search tasks…" value="${h(Q)}" data-search />
        <button class="toolbar-btn${N?" is-active":""}" type="button" data-toggle-board-completed title="${N?"Show completed tasks":"Hide completed tasks"}">
          <i class="bi bi-eye${N?"-slash":""}" aria-hidden="true"></i>
        </button>
      </div>

      ${ut?`<div class="save-indicator is-visible" data-save-indicator aria-live="polite" aria-atomic="true">
        <i class="bi bi-check2" aria-hidden="true"></i> Saved
      </div>`:""}

      ${M?`
      <div class="undo-toast" data-undo-toast>
        <span class="undo-toast-text"><i class="bi bi-trash3" aria-hidden="true"></i> Task moved to trash</span>
        <button class="undo-toast-btn" type="button" data-undo-trash>Undo</button>
        <button class="undo-toast-dismiss" type="button" data-dismiss-undo aria-label="Dismiss"><i class="bi bi-x" aria-hidden="true"></i></button>
      </div>
      `:""}

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${p.map(Fe).join("")}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(v*100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `,document.querySelector("[data-connect-file]")?.addEventListener("click",()=>{re()}),document.querySelector("[data-add-board]")?.addEventListener("click",ie),document.querySelectorAll("[data-switch-board]").forEach(a=>{a.addEventListener("click",s=>{const o=Number(s.currentTarget.dataset.boardId);de(o)}),a.addEventListener("dblclick",s=>{s.preventDefault();const o=Number(s.currentTarget.dataset.boardId);ce(o)})}),document.querySelectorAll("[data-edit-board-name]").forEach(a=>{Number(a.dataset.boardId)===H&&(a.focus(),a.select()),a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{const o=Number(s.currentTarget.dataset.boardId);s.key==="Enter"&&(s.preventDefault(),St(o,s.currentTarget.value)),s.key==="Escape"&&(s.preventDefault(),le())}),a.addEventListener("blur",s=>{const o=Number(s.currentTarget.dataset.boardId);St(o,s.currentTarget.value)})}),document.querySelectorAll("[data-delete-board]").forEach(a=>{a.addEventListener("click",s=>{const o=Number(s.currentTarget.dataset.boardId);ue(o)})}),document.querySelector("[data-empty-trash]")?.addEventListener("click",fe),document.querySelectorAll("[data-toggle-menu-section]").forEach(a=>{a.addEventListener("click",s=>{const o=s.currentTarget.dataset.toggleMenuSection;he(o)})}),document.querySelectorAll("[data-toggle-complete]").forEach(a=>{a.addEventListener("click",s=>{const o=Number(s.currentTarget.dataset.taskId);Ie(o)})}),document.querySelector("[data-add-task]")?.addEventListener("click",Se),document.querySelector("[data-search]")?.addEventListener("input",a=>{Q=a.currentTarget.value;const s=Q.toLowerCase().trim();document.querySelectorAll("[data-task-column]").forEach(o=>{const l=Number(o.dataset.taskId),c=b.find(k=>k.id===l);if(!c)return;const m=!s||c.title.toLowerCase().includes(s)||c.details.toLowerCase().includes(s);o.style.display=m?"":"none"})}),document.querySelector("[data-toggle-board-completed]")?.addEventListener("click",qe),document.querySelector("[data-undo-trash]")?.addEventListener("click",xe),document.querySelector("[data-dismiss-undo]")?.addEventListener("click",De);let g=!1;document.querySelectorAll("[data-drag-board]").forEach(a=>{a.addEventListener("dragstart",s=>{const o=Number(a.dataset.boardId);T=o,g=!1,s.dataTransfer?.setData("text/plain",String(o)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move"),a.closest("[data-board-item]")?.classList.add("is-dragging-board")}),a.addEventListener("dragend",()=>{document.querySelectorAll("[data-board-item].is-dragging-board").forEach(s=>s.classList.remove("is-dragging-board")),document.querySelectorAll("[data-board-item].is-board-drop-target").forEach(s=>s.classList.remove("is-board-drop-target")),g||u(),T=null})}),document.querySelectorAll("[data-board-item]").forEach(a=>{a.addEventListener("dragover",s=>{if(w&&!T){s.preventDefault(),document.querySelectorAll("[data-board-item].is-task-board-drop-target").forEach(z=>{z!==a&&z.classList.remove("is-task-board-drop-target")}),a.classList.add("is-task-board-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move");return}if(!T||(s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="move"),Number(a.dataset.boardId)===T))return;const l=a.closest(".board-menu-list");if(!l)return;const c=Array.from(l.querySelectorAll("[data-board-item]")),m=c.find(z=>Number(z.dataset.boardId)===T);if(!m||m===a)return;const k=c.indexOf(m),U=c.indexOf(a);k<U?l.insertBefore(m,a.nextSibling):l.insertBefore(m,a),a.classList.add("is-board-drop-target")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-board-drop-target"),a.classList.remove("is-task-board-drop-target")}),a.addEventListener("drop",s=>{if(w&&!T){s.preventDefault(),a.classList.remove("is-task-board-drop-target");const k=w,U=Number(a.dataset.boardId);_=!0,V(),Ne(k,U);return}if(s.preventDefault(),a.classList.remove("is-board-drop-target"),!T)return;const o=T,l=a.closest(".board-menu-list"),m=(l?Array.from(l.querySelectorAll("[data-board-item]")):[]).findIndex(k=>Number(k.dataset.boardId)===o);g=!0,T=null,Pe(o,m)})}),document.querySelectorAll("[data-drag-task]").forEach(a=>{a.addEventListener("dragstart",s=>{const o=s.currentTarget,l=Number(o.dataset.taskId),c=o.closest("[data-task-card]");if(_=!1,st=!1,w=l,at=c,at?.classList.add("is-dragging-source"),s.dataTransfer?.setData("text/plain",String(l)),s.dataTransfer&&(s.dataTransfer.effectAllowed="move",c)){const m=Ee(c);s.dataTransfer.setDragImage(m,c.getBoundingClientRect().width/2,28)}Ot(!0)}),a.addEventListener("dragend",()=>{if(!_&&st){V(),u();return}V()})}),document.querySelectorAll("[data-task-column]").forEach(a=>{a.addEventListener("dragover",s=>{if(!w)return;s.preventDefault();const o=Number(a.dataset.taskId);we(w,o),document.querySelectorAll("[data-task-column].is-drop-target").forEach(l=>{l!==a&&l.classList.remove("is-drop-target")}),a.classList.add("is-drop-target"),s.dataTransfer&&(s.dataTransfer.dropEffect="move")}),a.addEventListener("dragleave",()=>{a.classList.remove("is-drop-target")}),a.addEventListener("drop",s=>{if(s.preventDefault(),a.classList.remove("is-drop-target"),!w)return;const o=w,l=Te(o);_=!0,V(),l>=0&&$e(o,l)})});const L=document.querySelector("[data-trash-zone]");L?.addEventListener("dragover",a=>{w&&(a.preventDefault(),L.classList.add("is-over"),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))}),L?.addEventListener("dragleave",()=>{L.classList.remove("is-over")}),L?.addEventListener("drop",a=>{a.preventDefault();const s=w??Number(a.dataTransfer?.getData("text/plain"));_=!0,V(),s&&Le(s)}),document.querySelectorAll("[data-resize-task]").forEach(a=>{a.addEventListener("pointerdown",s=>{s.preventDefault(),s.stopPropagation();const o=s.currentTarget,l=Number(o.dataset.taskId),c=o.closest("[data-task-column]"),m=b.find(R=>R.id===l);if(!l||!c||!m)return;const k=s.pointerId,U=s.clientX,z=Y(m.width||c.getBoundingClientRect().width);o.setPointerCapture?.(k);const ht=R=>{if(R.pointerId!==k)return;const jt=(R.clientX-U)/v,kt=Y(z+jt);It(l,kt),c.style.setProperty("--task-width",`${kt}px`)},G=R=>{R.pointerId===k&&(window.removeEventListener("pointermove",ht),window.removeEventListener("pointerup",G),window.removeEventListener("pointercancel",G),o.releasePointerCapture?.(k),It(l,m.width,{persist:!0}))};window.addEventListener("pointermove",ht),window.addEventListener("pointerup",G),window.addEventListener("pointercancel",G)})}),document.querySelectorAll('[data-task-input="title"]').forEach(a=>{a.addEventListener("input",s=>{const o=s.currentTarget,l=Number(o.dataset.taskId),c=o.dataset.taskInput;Lt(l,c,o.value)})}),document.querySelectorAll("[data-task-links-preview]").forEach(a=>{a.addEventListener("click",s=>{if(s.target instanceof Element&&s.target.closest("a"))return;const o=a.closest("[data-task-card]"),l=o?.querySelector('[data-task-input="details"]');l instanceof HTMLTextAreaElement&&(o?.classList.add("is-editing-details"),l.focus(),l.setSelectionRange(l.value.length,l.value.length))})}),document.querySelectorAll('[data-task-input="details"]').forEach(a=>{a.addEventListener("input",s=>{const o=s.currentTarget,l=Number(o.dataset.taskId);Lt(l,"details",o.value);const c=o.closest("[data-task-card]")?.querySelector("[data-task-links-preview]");c&&(c.innerHTML=Bt(o.value))}),a.addEventListener("blur",s=>{s.currentTarget.closest("[data-task-card]")?.classList.remove("is-editing-details")})}),document.querySelectorAll("[data-open-note-composer]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const o=s.currentTarget;document.querySelectorAll(".task-column.is-adding-note").forEach(m=>{if(m!==o.closest("[data-task-column]")){m.classList.remove("is-adding-note");const k=m.querySelector("[data-note-draft]");k instanceof HTMLInputElement&&(k.value="")}});const l=o.closest("[data-task-column]"),c=l?.querySelector("[data-note-draft]");c instanceof HTMLInputElement&&(l?.classList.add("is-adding-note"),c.focus())})}),document.querySelectorAll("[data-note-done]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const o=s.currentTarget,l=Number(o.dataset.taskId),c=o.closest("[data-task-column]"),m=c?.querySelector("[data-note-draft]");if(!(m instanceof HTMLInputElement))return;const k=m.value;if(k.trim()){At(l,k);return}c?.classList.remove("is-adding-note"),m.value=""})}),document.querySelectorAll("[data-note-draft]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation()}),a.addEventListener("keydown",s=>{if(s.key==="Escape"){s.preventDefault();const m=s.currentTarget;m.closest("[data-task-column]")?.classList.remove("is-adding-note"),m.value="";return}if(s.key!=="Enter")return;s.preventDefault();const o=s.currentTarget,l=Number(o.dataset.taskId),c=o.value;c.trim()&&(it=!0,At(l,c))})}),document.querySelectorAll("[data-delete-note]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation();const o=s.currentTarget,l=Number(o.dataset.taskId),c=Number(o.dataset.noteId);!l||!c||Ae(l,c)})}),document.querySelector("[data-viewport]")?.addEventListener("wheel",a=>{!a.ctrlKey&&!a.metaKey||(a.preventDefault(),dt(v+ge(a.deltaY)))},{passive:!1}),window.onkeydown=a=>{!a.metaKey&&!a.ctrlKey||((a.key==="+"||a.key==="=")&&(a.preventDefault(),dt(v+gt)),a.key==="-"&&(a.preventDefault(),dt(v-gt)))},_t({showIndicator:!1}),Ce(t)},Oe=async()=>{if(He(),ne(),E){await Ct(),nt=!0,u();return}await se(),u()};Oe();
