/* CareerConnect frontend interactions. Promise-based demo; production auth/data needs a backend. */
(() => {
  "use strict";
  const K={users:"cc_users",session:"cc_session",saved:"cc_saved",apps:"cc_apps",messages:"cc_messages",employerJobs:"cc_employer_jobs"};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const read=(k,d=[])=>Promise.resolve().then(()=>{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}).catch(()=>d);
  const write=(k,v)=>Promise.resolve().then(()=>{localStorage.setItem(k,JSON.stringify(v));return v});
  const wait=(ms=250)=>new Promise(resolve=>setTimeout(resolve,ms));
  const norm=v=>String(v||"").trim().toLowerCase();
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function toast(msg,error=false){let el=$("#cc-toast");if(!el){el=document.createElement("div");el.id="cc-toast";el.setAttribute("role","status");el.setAttribute("aria-live","polite");Object.assign(el.style,{position:"fixed",right:"20px",bottom:"20px",zIndex:99999,maxWidth:"min(420px,calc(100vw - 40px))",padding:"14px 18px",borderRadius:"12px",color:"#fff",boxShadow:"0 12px 35px #0003",fontSize:"14px",transition:"opacity .2s"});document.body.appendChild(el)}el.style.background=error?"#b42318":"#166534";el.textContent=msg;el.style.opacity="1";clearTimeout(el.timer);el.timer=setTimeout(()=>el.style.opacity="0",3500)}
  function info(card){const h=$("h3",card),p=card.querySelector("p strong")||card.querySelectorAll("p")[0],title=h?h.textContent.trim():"Job",company=p?p.textContent.trim().split("·")[0].trim():"";return{key:norm(title)+"::"+norm(company),title,company,href:card.querySelector('a[href*="apply/"],a[href*="jobs/"]')?.getAttribute("href")||"jobs.html"}}
  function setSave(b,saved){const i=$("i",b);b.setAttribute("aria-pressed",String(saved));b.title=saved?"Remove saved job":"Save job";b.setAttribute("aria-label",b.title);if(i){i.classList.toggle("fa-solid",saved);i.classList.toggle("fa-regular",!saved)}}
  function initSaves(){const buttons=$$(".save-btn");read(K.saved,[]).then(saved=>buttons.forEach(b=>{const card=b.closest(".job-card,.wide-job");if(!card)return;const item=info(card);setSave(b,saved.some(x=>x.key===item.key));b.addEventListener("click",()=>read(K.saved,[]).then(list=>{const exists=list.some(x=>x.key===item.key);return write(K.saved,exists?list.filter(x=>x.key!==item.key):[...list,item]).then(()=>{setSave(b,!exists);toast(exists?"Removed saved job.":"Job saved.");renderProfile()})}).catch(()=>toast("Could not update saved jobs.",true)))}))}
  function initHome(){const f=$(".search-box");if(!f)return;f.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(f),p=new URLSearchParams();["query","location","category"].forEach(k=>{const v=String(d.get(k)||"").trim();if(v)p.set(k,v)});location.href="jobs.html"+(p.toString()?"?"+p:"")})}
  function initFilters(){
    const panel=$(".filter-panel"),cards=$$(".wide-job");
    if(!panel||!cards.length)return;
    const fields=$$("input,select",panel),[search,loc,type,industry]=fields;
    const button=$("button",panel),sort=$(".toolbar select"),count=$(".toolbar span"),list=$(".jobs-list");
    const params=new URLSearchParams(location.search);
    if(search&&params.has("query"))search.value=params.get("query");
    if(loc&&params.has("location"))loc.value=params.get("location");
    if(industry&&params.has("category")){
      const option=$$("option",industry).find(o=>norm(o.value||o.textContent)===norm(params.get("category")));
      if(option)industry.value=option.value||option.textContent;
    }
    function cardData(card){
      const title=$("h3",card)?.textContent.trim()||"";
      const company=card.querySelector("p strong")?.textContent.trim()||"";
      const paragraphs=$$("p",card).map(p=>p.textContent.trim()).join(" ");
      const meta=$$(".meta span",card).map(x=>x.textContent.trim());
      const tags=$$(".tags .tag",card).map(x=>x.textContent.trim());
      const jobType=meta.length?meta[meta.length-1]:"";
      const text=norm([title,company,paragraphs,...meta,...tags].join(" "));
      const categoryText=norm([title,paragraphs,...tags].join(" "));
      const categories=[];
      if(/analyst|analytics|sql|tableau|data/.test(categoryText))categories.push("analytics");
      if(/ai engineer|artificial intelligence|machine learning|\bml\b|python/.test(categoryText))categories.push("artificial intelligence");
      if(/cloud|aws|azure|kubernetes|terraform/.test(categoryText))categories.push("cloud computing");
      if(/cyber|security|siem|risk/.test(categoryText))categories.push("cybersecurity");
      if(/designer|design|figma|ux|ui\//.test(categoryText))categories.push("design");
      if(/developer|engineer|software|react|node\.js|typescript|api/.test(categoryText))categories.push("technology");
      return {title,company,text,categoryText,jobType:norm(jobType),categories};
    }
    function filter(){
      let visible=0;
      cards.forEach(card=>{
        const d=cardData(card),q=norm(search?.value),where=norm(loc?.value),selectedType=norm(type?.value),selectedIndustry=norm(industry?.value);
        const matchesSearch=!q||d.categoryText.includes(q)||norm(d.company).includes(q);
        const matchesLocation=!where||d.text.includes(where);
        const matchesType=!selectedType||d.jobType.includes(selectedType);
        const matchesIndustry=!selectedIndustry||d.categories.some(c=>c===selectedIndustry)||d.categoryText.includes(selectedIndustry);
        const show=matchesSearch&&matchesLocation&&matchesType&&matchesIndustry;
        card.hidden=!show;
        if(show)visible++;
      });
      if(count)count.textContent="Showing "+visible+" job"+(visible===1?"":"s");
      let empty=$("#cc-empty-jobs");
      if(!visible&&!empty&&list){
        empty=document.createElement("p");empty.id="cc-empty-jobs";empty.className="description";
        empty.textContent="No jobs match those filters. Try changing your search.";
        list.appendChild(empty);
      }
      if(empty)empty.hidden=visible>0;
    }
    button?.addEventListener("click",e=>{e.preventDefault();filter()});
    fields.forEach(field=>{
      field.addEventListener("input",filter);
      field.addEventListener("change",filter);
      field.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();filter()}});
    });
    sort?.addEventListener("change",()=>{
      if(!list)return;
      const mode=norm(sort.value),ordered=[...cards];
      if(mode.includes("title"))ordered.sort((a,b)=>info(a).title.localeCompare(info(b).title));
      else if(mode.includes("company"))ordered.sort((a,b)=>info(a).company.localeCompare(info(b).company));
      ordered.forEach(card=>list.appendChild(card));
      filter();
    });
    filter();
  }
  function validate(f){for(const x of $$("input,select,textarea",f)){if(["file","submit","button"].includes(x.type)||x.disabled)continue;if(x.type==="checkbox"){if(/terms|accept/i.test(x.closest("label")?.textContent||"")&&!x.checked)throw Error("Please accept the Terms and Privacy Policy.");continue}const v=x.value.trim(),label=x.closest("div")?.querySelector("label")?.textContent.trim()||x.placeholder||"field";if(!v)throw Error("Please complete the "+label+" field.");if(x.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))throw Error("Please enter a valid email address.")}}
  const fields=f=>$$("input,select,textarea",f).filter(x=>!["checkbox","file","submit","button"].includes(x.type));
  function hash(p){if(!window.crypto?.subtle)return Promise.resolve("demo:"+p);return crypto.subtle.digest("SHA-256",new TextEncoder().encode(p)).then(b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""))}
  function initAuth(){
    const f=$(".auth-card form"),path=location.pathname.toLowerCase();
    if(!f||(!path.endsWith("login.html")&&!path.endsWith("register.html")))return;
    const reg=path.endsWith("register.html");
    f.addEventListener("submit",e=>{
      e.preventDefault();
      Promise.resolve().then(()=>{
        validate(f);
        const a=fields(f),passwords=a.filter(x=>x.type==="password");
        if(reg){
          if((passwords[0]?.value||"").length<8)throw Error("Use a password with at least 8 characters.");
          if(passwords[0]?.value!==passwords[1]?.value)throw Error("Passwords do not match.");
          if(!$("select",f)?.value)throw Error("Please select a role.");
          return "Registration form validated. Account creation will be added in Section 3.";
        }
        return "Login form validated. Real sign-in will be added in Section 3.";
      }).then(message=>toast(message)).catch(e=>toast(e.message||"Please check your details.",true));
    });
  }
  function initApply(){
    if(!/\/apply\/[^/]+\.html$/i.test(location.pathname))return;
    const f=$("main form.form-grid");
    if(!f)return;
    f.addEventListener("submit",e=>{
      e.preventDefault();
      Promise.resolve().then(()=>{
        validate(f);
        return "Application form validated. Sending applications is part of Section 3.";
      }).then(message=>toast(message)).catch(e=>toast(e.message||"Please check your details.",true));
    });
  }
  function initContact(){
    if(!/contact\.html$/i.test(location.pathname))return;
    const f=$("main form.form-grid");
    if(!f)return;
    f.addEventListener("submit",e=>{
      e.preventDefault();
      Promise.resolve().then(()=>{
        validate(f);
        return "Contact form validated. Message delivery is part of Section 3.";
      }).then(message=>toast(message)).catch(e=>toast(e.message||"Please check your details.",true));
    });
  }
  function initHeader(){read(K.session,null).then(s=>{if(!s)return;const login=$(".nav-signin"),reg=$(".nav-register");if(login){login.textContent="My Profile";login.href=s.role==="Employer"?"employer.html":"profile.html"}if(reg){reg.textContent="Sign Out";reg.href="#";reg.addEventListener("click",e=>{e.preventDefault();write(K.session,null).then(()=>location.href="index.html")})}})}
  function renderProfile(){if(!/profile\.html$/i.test(location.pathname))return;Promise.all([read(K.session,null),read(K.saved,[]),read(K.apps,[])]).then(([s,saved,apps])=>{const name=s?.name||"Guest",h=$(".profile-content .section-head h2"),n=$(".profile-nav h3"),em=$(".profile-nav small");if(h)h.textContent="Welcome, "+name.split(/\s+/)[0];if(n)n.textContent=name;if(em&&s)em.textContent=s.email;const stats=$$(".mini-stat strong");if(stats[0])stats[0].textContent=saved.length;if(stats[1])stats[1].textContent=apps.length;const detail=$(".detail-section");if(detail)detail.innerHTML="<h3>Your applications</h3>"+(apps.length?apps.slice().reverse().slice(0,8).map(a=>'<div class="wide-job" style="margin:10px 0"><div><h3>'+esc(a.title)+'</h3><p>'+esc(new Date(a.submittedAt).toLocaleDateString())+'</p></div><span class="tag">'+esc(a.status)+'</span></div>').join(""):'<p class="description">No applications saved in this browser yet. Browse jobs to get started.</p>');$$(".profile-nav a").forEach(a=>{const t=norm(a.textContent);if(t.includes("saved jobs")||t.includes("applications")||t.includes("profile settings"))a.addEventListener("click",e=>{e.preventDefault();toast(t.includes("saved jobs")?"Saved jobs: "+saved.length:t.includes("applications")?"Applications: "+apps.length:"Profile editing requires a backend.")});if(t.includes("sign out"))a.addEventListener("click",e=>{e.preventDefault();write(K.session,null).then(()=>location.href="index.html")})})}).catch(console.error)}
  function initEmployer(){if(!/employer\.html$/i.test(location.pathname)||!$("main")||$("#cc-employer-panel"))return;const sec=document.createElement("section");sec.id="cc-employer-panel";sec.className="section";sec.innerHTML='<div class="container"><h2>Post a job</h2><p>Create a listing stored only in this browser.</p><form class="form-grid" id="cc-job-form"><div><label>Job title</label><input id="cc-title" required></div><div><label>Company</label><input id="cc-company" required></div><div><label>Location</label><input id="cc-location" required></div><div><label>Job type</label><select id="cc-type" required><option value="">Choose type</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option></select></div><div><label>Description</label><textarea id="cc-description" required></textarea></div><button class="btn btn-primary">Save job listing</button></form><div id="cc-employer-list"></div></div>'; $("main").appendChild(sec);const f=$("#cc-job-form"),list=$("#cc-employer-list");function render(){read(K.employerJobs,[]).then(a=>list.innerHTML=a.map(j=>'<article class="wide-job"><div><h3>'+esc(j.title)+'</h3><p>'+esc(j.company)+' · '+esc(j.location)+' · '+esc(j.type)+'</p><p>'+esc(j.description)+'</p></div><button data-del="'+j.id+'" class="btn btn-outline">Delete</button></article>').join("")||"<p>No listings created yet.</p>")}f.addEventListener("submit",e=>{e.preventDefault();Promise.resolve().then(()=>{validate(f);const j={id:"j"+Date.now(),title:$("#cc-title").value,company:$("#cc-company").value,location:$("#cc-location").value,type:$("#cc-type").value,description:$("#cc-description").value};return read(K.employerJobs,[]).then(a=>write(K.employerJobs,[...a,j]))}).then(()=>{f.reset();toast("Job listing saved locally.");render()}).catch(e=>toast(e.message,true))});list.addEventListener("click",e=>{const b=e.target.closest("[data-del]");if(b)read(K.employerJobs,[]).then(a=>write(K.employerJobs,a.filter(j=>j.id!==b.dataset.del))).then(render) });render()}
  function initOther(){ $$(".social-login button").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();toast("Social sign-in is not connected. Use email and password.",true)}));$$('a[href="#"]').forEach(a=>{if(a.closest(".socials")||a.closest(".profile-nav"))return;a.addEventListener("click",e=>{if(norm(a.textContent).includes("forgot password")){e.preventDefault();toast("Password reset requires a backend and email service.")}else if(a.closest("footer")){e.preventDefault();toast("This link is not connected yet.")}})});const loader=$(".loader-screen");if(loader)wait(300).then(()=>{loader.style.transition="opacity .3s";loader.style.opacity="0";setTimeout(()=>loader.remove(),320)})}
  function init(){
    initHome();
    initFilters();
    initSaves();
    initAuth();
    initApply();
    initContact();
    initOther();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();