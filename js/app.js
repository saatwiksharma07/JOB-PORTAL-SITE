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
  const extraJobs = [["Product Designer","Figma","Remote","Full-time","Design","Design intuitive workflows and polished product experiences.","$110k – $150k","3–5 yrs","Figma, UX Research, Prototyping"],["Data Scientist","Netflix","Los Gatos, CA","Hybrid","Analytics","Build models and translate complex datasets into useful insights.","$130k – $180k","3–6 yrs","Python, SQL, Machine Learning"],["DevOps Engineer","Atlassian","Bengaluru, India","Remote","Cloud Computing","Improve CI/CD pipelines, reliability, and developer tooling.","₹18L – ₹32L","3–5 yrs","Docker, Kubernetes, CI/CD"],["Security Engineer","Cisco","Austin, TX","Full-time","Cybersecurity","Strengthen systems through security reviews and threat analysis.","$120k – $165k","3–6 yrs","SIEM, Risk, Networking"],["Mobile App Developer","Uber","Hyderabad, India","Hybrid","Technology","Build smooth mobile experiences for customers and partners.","₹16L – ₹28L","2–5 yrs","Android, Kotlin, APIs"],["Business Analyst","Deloitte","New York, NY","Full-time","Analytics","Work with stakeholders to define requirements and measure outcomes.","$85k – $120k","2–4 yrs","SQL, Reporting, Excel"],["Machine Learning Engineer","NVIDIA","Santa Clara, CA","Full-time","Artificial Intelligence","Deploy scalable ML systems and optimize model performance.","$150k – $220k","4–7 yrs","Python, ML, PyTorch"],["Cloud Architect","Oracle","Remote","Remote","Cloud Computing","Design secure cloud architecture for enterprise workloads.","$145k – $195k","5–8 yrs","AWS, Azure, Architecture"],["Graphic Designer","Canva","Sydney, Australia","Hybrid","Design","Create clear visual assets for campaigns and product launches.","A$80k – A$115k","2–4 yrs","Illustrator, Branding, Layout"],["QA Automation Engineer","TCS","Pune, India","Full-time","Technology","Build automated tests and improve release confidence.","₹9L – ₹17L","2–5 yrs","Selenium, Java, Testing"],["Frontend Engineer","Shopify","Remote","Remote","Technology","Create accessible, responsive storefront experiences.","$115k – $160k","3–5 yrs","React, TypeScript, CSS"],["Database Administrator","IBM","Raleigh, NC","Full-time","Cloud Computing","Maintain database performance, backups, and availability.","$95k – $135k","3–6 yrs","SQL, PostgreSQL, Backup"],["Digital Marketing Specialist","HubSpot","Boston, MA","Hybrid","Marketing","Plan campaigns and optimize acquisition across digital channels.","$70k – $100k","2–4 yrs","SEO, Analytics, Campaigns"],["HR Coordinator","Adobe","San Jose, CA","Full-time","Human Resources","Support recruitment coordination and employee programs.","$60k – $82k","1–3 yrs","Recruiting, HRIS, Communication"],["Technical Writer","GitLab","Remote","Remote","Technology","Document developer workflows and technical product features.","$90k – $125k","2–5 yrs","Documentation, APIs, Markdown"],["Financial Analyst","JPMorgan Chase","Mumbai, India","Hybrid","Finance","Prepare forecasts, evaluate performance, and explain variances.","₹12L – ₹22L","2–5 yrs","Excel, Modeling, Reporting"],["Research Scientist","OpenAI","San Francisco, CA","Full-time","Artificial Intelligence","Explore model capabilities and evaluate new research directions.","$180k – $280k","PhD / equivalent","Research, Python, ML"],["Network Engineer","Juniper Networks","Denver, CO","Full-time","Technology","Operate and troubleshoot enterprise network infrastructure.","$100k – $145k","3–6 yrs","TCP/IP, Routing, Security"],["Content Strategist","Notion","Remote","Remote","Marketing","Shape product storytelling and create useful content programs.","$95k – $130k","3–5 yrs","Writing, SEO, Strategy"],["UX Researcher","Airbnb","Seattle, WA","Hybrid","Design","Run user studies and turn findings into product recommendations.","$120k – $165k","3–6 yrs","Interviews, Research, UX"],["Full Stack Developer","Walmart Global Tech","Bengaluru, India","Hybrid","Technology","Deliver frontend and backend features for high-traffic services.","₹18L – ₹30L","3–6 yrs","JavaScript, APIs, SQL"],["Operations Analyst","Flipkart","Bengaluru, India","Full-time","Analytics","Use operational data to identify bottlenecks and improvements.","₹8L – ₹15L","1–4 yrs","Excel, SQL, Dashboards"],["IT Support Specialist","Dell","Chennai, India","Full-time","Technology","Troubleshoot hardware, software, and user access issues.","₹5L – ₹9L","1–3 yrs","Windows, Networking, Support"],["Product Manager","Spotify","Stockholm, Sweden","Hybrid","Technology","Set product priorities and align engineering and design teams.","€90k – €130k","4–7 yrs","Roadmaps, Metrics, Agile"],["AI Research Intern","Amazon","Seattle, WA","Internship","Artificial Intelligence","Assist with experiments and prototypes for applied AI projects.","$35 – $55/hr","Currently studying","Python, ML, Research"],["Recruiter","LinkedIn","Gurugram, India","Full-time","Human Resources","Partner with hiring teams and guide candidates through hiring.","₹10L – ₹18L","2–5 yrs","Sourcing, Interviews, ATS"],["Video Editor","YouTube","Remote","Contract","Design","Edit engaging short- and long-form video content.","$35 – $60/hr","2–4 yrs","Premiere Pro, Storytelling, Motion"],["Sales Development Representative","Salesforce","Chicago, IL","Full-time","Sales","Build pipeline through outreach and thoughtful customer discovery.","$65k – $95k","1–3 yrs","CRM, Outreach, Communication"],["Research Data Analyst","WHO","Geneva, Switzerland","Contract","Analytics","Clean and analyze research datasets for evidence-based reports.","CHF 70k – CHF 95k","2–5 yrs","Statistics, R, SQL"],["Technical Program Manager","Microsoft","Redmond, WA","Full-time","Technology","Coordinate cross-functional engineering programs and delivery risks.","$135k – $185k","5–8 yrs","Planning, Agile, Cloud"]];
  function addExtraJobs(list){
    if(!list||list.querySelector("[data-extra-jobs]"))return;
    const wrap=document.createElement("div");wrap.setAttribute("data-extra-jobs","true");
    extraJobs.forEach(j=>{
      const [title,company,location,type,industry,description,salary,experience,tags]=j;
      const card=document.createElement("article");card.className="wide-job";card.dataset.industry=industry;card.dataset.jobType=type;
      card.innerHTML='<div><div class="logo-box">'+esc(company.slice(0,1))+'</div></div><div><h3>'+esc(title)+'</h3><p><strong>'+esc(company)+'</strong> · '+esc(location)+'</p><div class="meta"><span><i class="fa-solid fa-money-bill-wave"></i>'+esc(salary)+'</span><span><i class="fa-solid fa-briefcase"></i>'+esc(experience)+'</span><span><i class="fa-solid fa-house"></i>'+esc(type)+'</span></div><p class="description">'+esc(description)+'</p><div class="tags">'+tags.split(", ").map(tag=>'<span class="tag">'+esc(tag)+'</span>').join("")+'</div></div><div class="card-footer"><button class="icon-btn save-btn" type="button"><i class="fa-regular fa-bookmark"></i></button><a class="btn btn-primary" href="login.html">Apply</a></div>';
      wrap.appendChild(card);
    });
    list.appendChild(wrap);
  }
  function initFilters(){
    const panel=$(".filter-panel"),list=$(".jobs-list");
    if(!panel||!list)return;
    addExtraJobs(list);
    const cards=$(".wide-job",list);
    if(!cards.length)return;
    const fields=$$("input,select",panel),[search,loc,type,industry]=fields;
    const button=$("button",panel),sort=$(".toolbar select"),count=$(".toolbar span");
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
      const jobType=card.dataset.jobType||(meta.length?meta[meta.length-1]:"");
      const text=norm([title,company,paragraphs,...meta,...tags].join(" "));
      const categoryText=norm([title,paragraphs,...tags,card.dataset.industry||""].join(" "));
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
        const matchesIndustry=!selectedIndustry||norm(card.dataset.industry)===selectedIndustry||d.categories.some(c=>c===selectedIndustry)||d.categoryText.includes(selectedIndustry);
        const show=matchesSearch&&matchesLocation&&matchesType&&matchesIndustry;
        card.hidden=!show;
        card.style.display=show?"":"none";
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
    fields.forEach(field=>field.addEventListener("keydown",e=>{
      if(e.key==="Enter"){e.preventDefault();filter()}
    }));
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