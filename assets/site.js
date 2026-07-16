
(() => {
  const clamp = (v,min=0,max=1)=>Math.min(max,Math.max(min,v));
  const lerp = (a,b,t)=>a+(b-a)*t;

  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const syncHeader = () => header?.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', syncHeader, {passive:true}); syncHeader();
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('open', !open);
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ nav.classList.remove('open'); navToggle?.setAttribute('aria-expanded','false'); }));
  const currentFile=(location.pathname.split('/').pop()||'index.html'); nav?.querySelectorAll('a').forEach(a=>{ if((a.getAttribute('href')||'').split('#')[0]===currentFile) a.setAttribute('aria-current','page'); });

  // Ambient canvas: slowly flowing colour veils instead of obvious circles.
  document.querySelectorAll('[data-ambient]').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,raf;
    const colours=['#ef3f3f','#f4862b','#f5cf55','#4d993f','#2483bd','#315e9f','#7a3ea2'];
    const resize=()=>{ dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight; canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const draw=(time)=>{
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation='multiply';
      colours.forEach((c,i)=>{
        const t=time*.00008+i*.9;
        const x=w*(.12+(i%4)*.26)+Math.sin(t*1.7)*w*.07;
        const y=h*(.18+Math.floor(i/4)*.48)+Math.cos(t*1.3)*h*.09;
        const rx=Math.max(w,h)*(.16+(i%3)*.025);
        const g=ctx.createRadialGradient(x,y,0,x,y,rx);
        g.addColorStop(0,c+'1d'); g.addColorStop(.55,c+'0d'); g.addColorStop(1,c+'00');
        ctx.fillStyle=g;
        ctx.beginPath();
        for(let s=0;s<=80;s++){
          const a=s/80*Math.PI*2;
          const wobble=1+Math.sin(a*3+t*4+i)*.12+Math.sin(a*5-t*2)*.06;
          const px=x+Math.cos(a)*rx*wobble;
          const py=y+Math.sin(a)*rx*.64*wobble;
          s?ctx.lineTo(px,py):ctx.moveTo(px,py);
        }
        ctx.closePath(); ctx.fill();
      });
      ctx.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(draw);
    };
    new ResizeObserver(resize).observe(canvas); resize(); raf=requestAnimationFrame(draw);
  });

  // Parallax hero mark.
  document.querySelectorAll('[data-parallax-mark]').forEach(mark=>{
    mark.closest('.hero-art')?.addEventListener('pointermove', e=>{
      const r=e.currentTarget.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      mark.style.transform=`rotateY(${x*9}deg) rotateX(${-y*9}deg) translate3d(${x*8}px,${y*8}px,0)`;
    });
    mark.closest('.hero-art')?.addEventListener('pointerleave',()=>mark.style.transform='');
  });

  const heartPath = `M 0 -16 C -22 -42 -64 -18 -64 22 C -64 57 -20 78 0 98 C 20 78 64 57 64 22 C 64 -18 22 -42 0 -16 Z`;
  const ringData = [
    ['top','#315e9f',440,200,180,0,-170],
    ['left','#ef3f3f',255,352,182,-185,-18],
    ['right','#2483bd',625,352,182,185,-18],
    ['lowerLeft','#f4862b',255,565,182,-185,178],
    ['lowerRight','#4d993f',625,565,182,185,178],
    ['center','#7a3ea2',440,442,168,0,55],
    ['bottom','#f5cf55',440,673,172,0,255]
  ];
  const heartData = [
    [440,295,'#315e9f'],[248,397,'#ef3f3f'],[632,397,'#2483bd'],[440,466,'#7a3ea2'],[270,592,'#f4862b'],[610,592,'#4d993f'],[440,688,'#f5cf55']
  ];
  function emblemMarkup(active='all'){
    const rings=ringData.map(([name,color,cx,cy,r,sx,sy],i)=>`<g class="ring-group ${active==='all'||String(active)===String(i)||active===name?'active':''}" data-ring="${i}" style="--ring:${color};--sx:${sx};--sy:${sy}"><circle class="ring-halo" cx="${cx}" cy="${cy}" r="${r}"/><circle class="ring-shadow" cx="${cx}" cy="${cy}" r="${r}"/><circle class="ring-main" cx="${cx}" cy="${cy}" r="${r}"/><circle class="ring-highlight" cx="${cx}" cy="${cy}" r="${r}"/></g>`).join('');
    const hearts=heartData.map(([x,y,color],i)=>`<g class="heart-group" data-heart="${i}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y}) scale(.088)" style="--heartStroke:${color}"><path class="heart-fill" d="${heartPath}"/><path class="heart-ribbon" d="M -38 1 C -10 18 8 50 32 73 M 36 2 C 12 20 -8 48 -34 74"/></g>`).join('');
    return `<svg viewBox="0 0 880 860" role="img" aria-label="Animated Love is Foundation seven-circle emblem">
      <defs>
        <filter id="softBlur"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="roughen" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".012 .025" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="3"/><feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#172033" flood-opacity=".12"/></filter>
        <filter id="heartShadow"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#172033" flood-opacity=".16"/></filter>
        <linearGradient id="heartRibbon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef3f3f"/><stop offset=".22" stop-color="#f5cf55"/><stop offset=".48" stop-color="#2483bd"/><stop offset=".74" stop-color="#7a3ea2"/><stop offset="1" stop-color="#4d993f"/></linearGradient>
        <radialGradient id="coreGlow"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".33" stop-color="#f5cf55" stop-opacity=".24"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <radialGradient id="seedGlow"><stop stop-color="#fff7d0" stop-opacity="1"/><stop offset=".4" stop-color="#f5cf55" stop-opacity=".9"/><stop offset="1" stop-color="#f5cf55" stop-opacity="0"/></radialGradient>
      </defs>
      <g class="vector-emblem">
        <circle class="seed-dot" cx="440" cy="442" r="15"/>
        <circle class="core-pulse" cx="440" cy="442" r="165"/>
        ${rings}${hearts}
      </g>
      <image class="logo-resolve" href="assets/lif-logo.png" x="118" y="64" width="644" height="720" preserveAspectRatio="xMidYMid meet"/>
    </svg>`;
  }
  document.querySelectorAll('.emblem-host').forEach(host=>{ host.innerHTML=emblemMarkup(host.dataset.active||'all'); });

  // General per-host progress utility.
  const setEmblemState = (host,p,opts={}) => {
    const rings=[...host.querySelectorAll('.ring-group')];
    const hearts=[...host.querySelectorAll('.heart-group')];
    const seed=host.querySelector('.seed-dot');
    const mode=opts.mode||host.dataset.mode||'assemble';

    if(seed){
      const seedGone = mode==='focus' ? 1 : clamp((p-.08)/.16);
      seed.style.opacity = String(1 - seedGone);
      seed.style.transform = `translateZ(0) scale(${lerp(.9, 2.8, seedGone)})`;
    }

    rings.forEach((g,i)=>{
      let local;
      if(mode==='focus') local=clamp((p-.04)/.55);
      else local=clamp((p-.14-i*.05)/.44);
      g.style.setProperty('--draw',local);
      const startX=parseFloat(g.style.getPropertyValue('--sx')||0), startY=parseFloat(g.style.getPropertyValue('--sy')||0);
      const intro = mode==='focus' ? 1 : clamp((p-.06)/.3);
      const scatter = mode==='focus' ? 0 : (1 - clamp((p-.1)/.62));
      const scale = mode==='focus' ? lerp(.72,1,p) : lerp(.02,1,clamp((p-.08)/.55));
      const rotate = mode==='focus' ? 0 : (1-p)*(i%2?9:-9);
      g.style.transform=`translate(${startX*scatter}px,${startY*scatter}px) scale(${scale}) rotate(${rotate}deg)`;
      const isActive=g.classList.contains('active');
      const fadeOut = mode==='focus' ? 1 : (1 - clamp((p-.78)/.16));
      g.style.opacity=isActive ? String(lerp(0,1,local)*lerp(.35,1,intro)*fadeOut) : String(lerp(0,.18,local)*fadeOut);
    });

    hearts.forEach((g,i)=>{
      const hp= mode==='focus' ? clamp((p-.12-i*.02)/.25) : clamp((p-.56-i*.03)/.22);
      const fadeOut = mode==='focus' ? 1 : (1 - clamp((p-.76)/.16));
      g.style.opacity=hp*fadeOut;
      const x=parseFloat(g.dataset.x||0), y=parseFloat(g.dataset.y||0);
      const s = .44*lerp(.2,1,hp);
      g.setAttribute('transform',`translate(${x} ${y}) scale(${s})`);
    });

    const vector = host.querySelector('.vector-emblem');
    if(vector) vector.style.opacity = String(mode==='focus' ? 1 : (1 - clamp((p-.8)/.14)));
    host.style.setProperty('--coreOpacity',String(mode==='focus' ? lerp(.18,.34,p) : lerp(.02,.34,clamp((p-.12)/.45))));
    host.style.setProperty('--logoOpacity', String(mode==='focus' ? clamp((p-.82)/.12) : clamp((p-.82)/.12)));
  };

  // Homepage logo story.
  const logoStory=document.querySelector('[data-logo-story]');
  if(logoStory){
    const host=logoStory.querySelector('.emblem-host');
    const steps=[...logoStory.querySelectorAll('.story-copy-step')];
    const update=()=>{
      const rect=logoStory.getBoundingClientRect();
      const max=logoStory.offsetHeight-innerHeight;
      const p=clamp(-rect.top/max);
      logoStory.style.setProperty('--scene-progress',p);
      setEmblemState(host,p);
      const idx=Math.min(steps.length-1,Math.floor(p*steps.length));
      steps.forEach((s,i)=>s.classList.toggle('active',i===idx));
    };
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
  }

  // Reusable topic/aspect stories.
  document.querySelectorAll('[data-topic-story],[data-aspect-story]').forEach(scene=>{
    const host=scene.querySelector('.emblem-host');
    const update=()=>{
      const r=scene.getBoundingClientRect();
      const p=clamp(-r.top/(scene.offsetHeight-innerHeight));
      scene.style.setProperty('--topic-progress',p);
      setEmblemState(host,p,{mode:'focus'});
      const active=host.dataset.active;
      if(active!==undefined && active!=='all'){
        host.querySelectorAll('.ring-group').forEach((g,i)=>{
          const yes=String(i)===String(active);
          g.style.opacity=yes?String(lerp(.4,1,p)):String(lerp(.12,.05,p));
          if(yes) g.style.transform += ` scale(${lerp(1,1.15,p)})`;
        });
      }
    };
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
  });

  // Discovery personalization.
  const map={
    self:{title:'Begin by making room for yourself.',copy:'You may be looking for a quieter relationship with your own thoughts, needs, and sense of direction.',aspects:['Presence–Being','Nature–Nurture','Sources–Resources'],active:[5,4,0]},
    belonging:{title:'Begin where relationship becomes possible.',copy:'You may be looking for spaces where you can be known without having to perform or simplify yourself.',aspects:['Community–Inclusion','Engagement','Presence–Being'],active:[4,2,5]},
    meaning:{title:'Begin with what gives your life direction.',copy:'You may be looking for a deeper connection between what you believe, how you live, and what you choose next.',aspects:['Realizing Divine Human Potential','Presence–Being','Sources–Resources'],active:[1,5,0]},
    contribution:{title:'Begin with what only you can bring.',copy:'You may be looking for a place where your experience, care, and abilities can become useful to others.',aspects:['Service–Offerings','Engagement','Community–Inclusion'],active:[3,2,4]},
    possibility:{title:'Begin by looking beyond what already exists.',copy:'You may be ready to imagine, experiment, and participate in creating different ways of living together.',aspects:['Realizing Divine Human Potential','Engagement','Service–Offerings'],active:[1,2,3]},
    curious:{title:'Curiosity is already a beginning.',copy:'You do not need a clear goal to explore. Notice what holds your attention and let that be enough for now.',aspects:['Sources–Resources','Nature–Nurture','Engagement'],active:[0,4,2]}
  };
  const choices=[...document.querySelectorAll('[data-choice]')], result=document.querySelector('[data-discovery-result]');
  function renderChoice(key,scroll=true){
    if(!result||!map[key])return;
    const d=map[key];
    choices.forEach(b=>b.classList.toggle('selected',b.dataset.choice===key));
    result.hidden=false;
    result.querySelector('[data-result-title]').textContent=d.title;
    result.querySelector('[data-result-copy]').textContent=d.copy;
    result.querySelector('[data-result-tags]').innerHTML=d.aspects.map(x=>`<span class="result-tag">${x}</span>`).join('');
    const host=result.querySelector('.emblem-host');
    host.dataset.active='all'; host.innerHTML=emblemMarkup('all');
    host.querySelectorAll('.ring-group').forEach((g,i)=>g.classList.toggle('active',d.active.includes(i)));
    setEmblemState(host,1,{mode:'focus'});
    localStorage.setItem('lif-starting-point',key);
    if(scroll) result.scrollIntoView({behavior:'smooth',block:'center'});
  }
  choices.forEach(b=>b.addEventListener('click',()=>renderChoice(b.dataset.choice)));
  document.querySelector('[data-reset-choice]')?.addEventListener('click',()=>{ localStorage.removeItem('lif-starting-point'); choices.forEach(x=>x.classList.remove('selected')); result.hidden=true; });
  const saved=localStorage.getItem('lif-starting-point'); if(saved&&map[saved])renderChoice(saved,false);

  // Community network canvas.
  document.querySelectorAll('[data-network]').forEach(canvas=>{
    const scene=canvas.closest('.community-story'), ctx=canvas.getContext('2d'); let w,h,dpr=1,nodes=[];
    const colours=['#ef3f3f','#f4862b','#f5cf55','#4d993f','#2483bd','#315e9f','#7a3ea2'];
    const resize=()=>{ dpr=Math.min(devicePixelRatio||1,2); w=canvas.clientWidth; h=canvas.clientHeight; canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);nodes=Array.from({length:18},(_,i)=>({a:i/18*Math.PI*2+Math.sin(i*9)*.3,rad:.26+((i*17)%7)/22,c:colours[i%7]})); };
    const draw=()=>{
      const r=scene.getBoundingClientRect(), p=clamp(-r.top/(scene.offsetHeight-innerHeight));
      scene.style.setProperty('--community-progress',p);
      ctx.clearRect(0,0,w,h); const cx=w/2,cy=h/2;
      const pts=nodes.map((n,i)=>{ const spread=lerp(.08,n.rad,p); return {x:cx+Math.cos(n.a)*Math.min(w,h)*spread,y:cy+Math.sin(n.a)*Math.min(w,h)*spread,c:n.c,r:lerp(4,12,p)}; });
      ctx.lineWidth=1.4;
      pts.forEach((a,i)=>pts.slice(i+1).forEach((b,j)=>{ const d=Math.hypot(a.x-b.x,a.y-b.y); const max=Math.min(w,h)*.33; if(d<max){ctx.strokeStyle=`rgba(49,94,159,${(1-d/max)*p*.3})`;ctx.beginPath();ctx.moveTo(a.x,a.y);const mx=(a.x+b.x)/2, my=(a.y+b.y)/2-18*Math.sin(i+j);ctx.quadraticCurveTo(mx,my,b.x,b.y);ctx.stroke();}}));
      pts.forEach((a,i)=>{ const g=ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,a.r*3);g.addColorStop(0,a.c+'cc');g.addColorStop(.32,a.c+'55');g.addColorStop(1,a.c+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(a.x,a.y,a.r*3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(a.x,a.y,a.r*.55,0,Math.PI*2);ctx.fill(); });
    };
    new ResizeObserver(resize).observe(canvas);resize();addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});addEventListener('resize',draw);draw();
  });

  // Demo form.
  document.querySelector('[data-contact-form]')?.addEventListener('submit',e=>{ e.preventDefault(); const note=e.currentTarget.querySelector('[data-form-note]'); note.textContent='Thanks. This prototype stores no information; connect the form to your final email or CRM before launch.'; e.currentTarget.reset(); });
})();
