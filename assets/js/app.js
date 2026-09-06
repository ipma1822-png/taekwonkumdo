
(() => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('[data-nav-toggle]');

  // WTKF v3.2.7: restore the mobile horizontal primary menu without changing
  // the existing desktop mega menu or hamburger/full-menu behavior.
  if(nav && !document.querySelector('.wtkf-mobile-primary')){
    const strip = document.createElement('nav');
    strip.className = 'wtkf-mobile-primary';
    strip.setAttribute('aria-label','태권검도 모바일 주요 메뉴');
    nav.querySelectorAll(':scope > .nav-item > a').forEach(a => {
      const clone = a.cloneNode(true);
      clone.classList.remove('pill');
      strip.appendChild(clone);
    });
    const header = document.querySelector('.topbar');
    if(header) header.insertAdjacentElement('afterend', strip);
  }

  if(toggle && nav){
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      toggle.textContent = nav.classList.contains('mobile-open') ? '✕' : '☰';
      if(!nav.classList.contains('mobile-open')){
        nav.querySelectorAll('.mobile-open-item').forEach(x=>x.classList.remove('mobile-open-item'));
      }
    });
  }

  // Mobile: click top menu to show its own submenu.
  document.querySelectorAll('.nav-item > a').forEach(a=>{
    a.addEventListener('click', e=>{
      if(innerWidth <= 1050 && nav?.classList.contains('mobile-open')){
        const item = a.parentElement;
        const dd = item?.querySelector(':scope > .nav-dropdown');
        if(dd){
          e.preventDefault();
          const was = item.classList.contains('mobile-open-item');
          nav.querySelectorAll('.mobile-open-item').forEach(x=>x.classList.remove('mobile-open-item'));
          if(!was) item.classList.add('mobile-open-item');
        }
      }
    });
  });

  // Progressive reveal
  const items = document.querySelectorAll('.card,.mini,.tk-feature,.year,.hq-panel,.doc,.banner,.wtkf-showcase');
  if('IntersectionObserver' in window){
    items.forEach(el => {
      el.style.opacity='0'; el.style.transform='translateY(15px)';
      el.style.transition='opacity .55s ease, transform .55s ease';
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; io.unobserve(e.target);
      }
    }), {threshold:.08});
    items.forEach(el => io.observe(el));
  }

  // Hero network points
  const net = document.querySelector('.tk-network');
  if(net && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const positions = [
      [8,18,14],[18,69,-18],[31,32,24],[42,82,-26],[53,15,12],[64,63,32],
      [77,26,-12],[88,74,18],[93,13,-32],[12,86,-8],[71,88,8],[38,10,-30]
    ];
    positions.forEach(([x,y,r],i)=>{
      const dot=document.createElement('i');
      dot.style.left=x+'%';dot.style.top=y+'%';
      dot.style.setProperty('--r',r+'deg');dot.style.animationDelay=(i*.23)+'s';
      net.appendChild(dot);
    });
  }
})();


// Official video thumbnail viewer
(function(){
  function ensureModal(){
    let modal=document.querySelector('.wtkf-video-modal');
    if(modal) return modal;
    modal=document.createElement('div');
    modal.className='wtkf-video-modal';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="wtkf-video-modal-box" role="dialog" aria-modal="true" aria-label="태권검도 영상"><button class="wtkf-video-modal-close" type="button" aria-label="영상 닫기">×</button><div class="wtkf-video-modal-frame"></div><div class="wtkf-video-modal-title"></div></div>';
    document.body.appendChild(modal);
    function close(){
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true');
      modal.querySelector('.wtkf-video-modal-frame').innerHTML='';
      document.body.classList.remove('video-modal-open');
    }
    modal.querySelector('.wtkf-video-modal-close').addEventListener('click',close);
    modal.addEventListener('click',function(e){ if(e.target===modal) close(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && modal.classList.contains('is-open')) close(); });
    return modal;
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.video-thumb-button'); if(!btn) return;
    const id=btn.getAttribute('data-video-id'); if(!id) return;
    const title=btn.getAttribute('data-video-title')||'태권검도 영상';
    const modal=ensureModal();
    modal.querySelector('.wtkf-video-modal-frame').innerHTML='<iframe src="https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0" title="'+title.replace(/"/g,'&quot;')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    modal.querySelector('.wtkf-video-modal-title').textContent=title;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('video-modal-open');
  });
})();

// WTKF member application link: add to the sitewide 신청·문의 dropdown.
(function(){
  const brand = document.querySelector('.brand');
  const root = brand ? (brand.getAttribute('href') || './') : './';
  document.querySelectorAll('.nav-item').forEach(item => {
    const top = item.querySelector(':scope > a');
    const dd = item.querySelector(':scope > .nav-dropdown');
    if(!top || !dd || !top.textContent.includes('신청·문의')) return;
    if(dd.querySelector('[data-wtkf-member-link]')) return;
    const link = document.createElement('a');
    link.href = root + 'member/';
    link.textContent = '회원가입';
    link.setAttribute('data-wtkf-member-link','');
    const title = dd.querySelector('.drop-title');
    if(title && title.nextSibling) dd.insertBefore(link, title.nextSibling);
    else dd.appendChild(link);
  });
})();

// WTKF WORLD HUB v3.3.1 — mobile-first LIVE showroom entry layer.
// This layer is intentionally additive: the existing HQ hero, menus, member,
// verification, resources and Supabase-connected boards remain untouched.
(function(){
  if(document.querySelector('.wtkfhub-live')) return;
  const legacyHero=document.querySelector('main > .tk-hero');
  if(!legacyHero) return;

  const style=document.createElement('style');
  style.id='wtkfhub-live-style-v331';
  style.textContent=`
    .wtkfhub-live{position:relative;isolation:isolate;overflow:hidden;background:#06111f;color:#fff;border-bottom:1px solid rgba(225,188,92,.24)}
    .wtkfhub-live:before{content:"";position:absolute;inset:-25%;z-index:-3;background:radial-gradient(circle at 50% 35%,rgba(31,111,183,.26),transparent 30%),radial-gradient(circle at 50% 45%,rgba(214,172,70,.17),transparent 43%),linear-gradient(145deg,#06111f 0%,#0a1f36 45%,#071422 100%)}
    .wtkfhub-live:after{content:"";position:absolute;inset:0;z-index:-2;opacity:.24;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:38px 38px;mask-image:linear-gradient(to bottom,#000,transparent 94%)}
    .wtkfhub-wrap{width:min(1180px,calc(100% - 32px));min-height:min(780px,calc(100svh - 70px));margin:auto;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:42px;align-items:center;padding:56px 0 46px}
    .wtkfhub-copy{position:relative;z-index:2}
    .wtkfhub-livebar{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border:1px solid rgba(239,201,105,.36);border-radius:999px;background:rgba(4,14,27,.58);font-size:11px;font-weight:900;letter-spacing:.12em;color:#f3d884}
    .wtkfhub-dot{width:7px;height:7px;border-radius:50%;background:#79f5a8;box-shadow:0 0 0 5px rgba(69,215,120,.08),0 0 18px #51dc85;animation:wtkfhubPulse 1.7s ease-in-out infinite}
    @keyframes wtkfhubPulse{50%{opacity:.45;transform:scale(.78)}}
    .wtkfhub-copy h1{margin:16px 0 12px;font-size:clamp(42px,6.4vw,82px);line-height:.93;letter-spacing:-.055em;text-wrap:balance}
    .wtkfhub-copy h1 span{display:block;background:linear-gradient(180deg,#fff 12%,#d5e6f8 70%,#8fa9c2);-webkit-background-clip:text;background-clip:text;color:transparent}
    .wtkfhub-copy h1 em{display:block;margin-top:15px;font-style:normal;font-size:clamp(17px,2.1vw,25px);line-height:1.35;letter-spacing:-.02em;color:#f1cf74}
    .wtkfhub-lead{max-width:690px;margin:0;color:#b9c7d8;font-size:clamp(14px,1.7vw,17px);line-height:1.75;word-break:keep-all}
    .wtkfhub-pills{display:flex;flex-wrap:wrap;gap:7px;margin:17px 0 0}.wtkfhub-pills span{padding:7px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);font-size:10px;font-weight:800;color:#cbd8e6}
    .wtkfhub-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:20px;max-width:620px}.wtkfhub-action{min-height:52px;border:1px solid rgba(255,255,255,.12);border-radius:15px;background:rgba(255,255,255,.045);color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;font-weight:900;font-size:13px;cursor:pointer;transition:.22s ease}.wtkfhub-action:hover{transform:translateY(-2px);background:rgba(255,255,255,.08);border-color:rgba(239,201,105,.46)}.wtkfhub-action.primary{grid-column:1/-1;background:linear-gradient(135deg,#d8ad47,#8f661b);border-color:#e1be66;box-shadow:0 12px 30px rgba(154,106,18,.24);font-size:15px}.wtkfhub-action.showroom{grid-column:1/-1;background:linear-gradient(135deg,rgba(26,71,113,.96),rgba(10,37,65,.96));border-color:rgba(105,180,238,.42);box-shadow:0 10px 26px rgba(13,55,92,.22)}.wtkfhub-action.showroom small{color:#bcd4e9}.wtkfhub-action small{display:block;font-size:9px;font-weight:700;color:#aebed0}.wtkfhub-action.primary small{color:#fff4cf}.wtkfhub-share{margin-top:11px;display:flex;align-items:center;gap:12px}.wtkfhub-share button{border:0;background:transparent;color:#9fb2c6;font-size:11px;font-weight:800;padding:4px 0;cursor:pointer}.wtkfhub-share button:hover{color:#f2cf73}.wtkfhub-version{font-size:10px;color:#70859a}
    .wtkfhub-visual{position:relative;min-height:500px;display:grid;place-items:center}.wtkfhub-radar{position:absolute;width:min(460px,90%);aspect-ratio:1;border-radius:50%;border:1px solid rgba(102,168,224,.17);box-shadow:inset 0 0 70px rgba(30,94,157,.08)}.wtkfhub-radar:before,.wtkfhub-radar:after{content:"";position:absolute;border-radius:50%;border:1px solid rgba(221,181,78,.14);inset:12%}.wtkfhub-radar:after{inset:27%;border-color:rgba(105,175,232,.13)}
    .wtkfhub-sweep{position:absolute;width:min(460px,90%);aspect-ratio:1;border-radius:50%;overflow:hidden;opacity:.46}.wtkfhub-sweep:after{content:"";position:absolute;left:50%;top:50%;width:50%;height:1px;transform-origin:left;background:linear-gradient(90deg,rgba(112,205,255,.75),transparent);animation:wtkfhubSweep 7s linear infinite}@keyframes wtkfhubSweep{to{transform:rotate(360deg)}}
    .wtkfhub-emblem{position:relative;width:255px;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,rgba(255,255,255,.1),rgba(10,30,52,.12) 52%,transparent 70%);filter:drop-shadow(0 20px 28px rgba(0,0,0,.34));animation:wtkfhubFloat 4.4s ease-in-out infinite}.wtkfhub-emblem:before{content:"";position:absolute;inset:-21px;border-radius:50%;border:1px solid rgba(235,196,91,.25);box-shadow:0 0 38px rgba(221,175,68,.13),inset 0 0 30px rgba(66,150,222,.08);animation:wtkfhubRing 3.8s ease-in-out infinite}.wtkfhub-emblem img{width:88%;height:88%;object-fit:contain;position:relative;z-index:2}.wtkfhub-emblem b{position:absolute;bottom:-42px;left:50%;transform:translateX(-50%);white-space:nowrap;color:#f3d477;font-size:11px;letter-spacing:.17em}@keyframes wtkfhubFloat{50%{transform:translateY(-8px)}}@keyframes wtkfhubRing{50%{transform:scale(1.035);box-shadow:0 0 52px rgba(221,175,68,.22),inset 0 0 36px rgba(66,150,222,.12)}}
    .wtkfhub-node{position:absolute;padding:9px 11px;border:1px solid rgba(255,255,255,.11);border-radius:12px;background:rgba(5,18,33,.82);backdrop-filter:blur(9px);font-size:10px;color:#9fb5ca;box-shadow:0 8px 24px rgba(0,0,0,.18)}.wtkfhub-node b{display:block;color:#f2d57e;font-size:10px;margin-bottom:2px}.wtkfhub-n1{left:3%;top:16%}.wtkfhub-n2{right:1%;top:23%}.wtkfhub-n3{left:8%;bottom:12%}.wtkfhub-n4{right:4%;bottom:17%}
    .wtkfhub-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(2,8,15,.86);backdrop-filter:blur(12px)}.wtkfhub-modal.open{display:flex}.wtkfhub-modalbox{width:min(640px,100%);max-height:88vh;overflow:auto;border:1px solid rgba(239,201,105,.3);border-radius:24px;background:linear-gradient(160deg,#0c2036,#07131f);box-shadow:0 24px 80px rgba(0,0,0,.55);padding:22px;color:#fff}.wtkfhub-modalhead{display:flex;justify-content:space-between;gap:12px;align-items:start}.wtkfhub-modalhead small{color:#e5bd5d;font-size:10px;font-weight:900;letter-spacing:.13em}.wtkfhub-modalhead h2{margin:5px 0 0;font-size:25px}.wtkfhub-close{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.04);color:#fff;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}.wtkfhub-steps{display:grid;gap:9px;margin-top:18px}.wtkfhub-step{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:center;padding:13px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(255,255,255,.035);opacity:.45;transform:translateY(5px);transition:.35s}.wtkfhub-step.active{opacity:1;transform:none;border-color:rgba(232,195,96,.35);background:rgba(224,181,71,.07)}.wtkfhub-step span{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#102d4d;color:#f2cf73;font-weight:950}.wtkfhub-step strong{display:block;font-size:14px}.wtkfhub-step p{margin:3px 0 0;color:#aebed0;font-size:12px;line-height:1.55}.wtkfhub-progress{height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:17px}.wtkfhub-progress i{display:block;width:0;height:100%;background:linear-gradient(90deg,#d7aa3e,#f3d981);transition:width .4s ease}.wtkfhub-modalactions{display:flex;gap:8px;flex-wrap:wrap;margin-top:15px}.wtkfhub-modalactions a{display:inline-flex;padding:10px 12px;border-radius:11px;text-decoration:none;font-size:11px;font-weight:900;background:#173657;color:#fff;border:1px solid rgba(255,255,255,.1)}
    @media(max-width:860px){.wtkfhub-wrap{min-height:auto;grid-template-columns:1fr;padding:36px 0 28px;gap:15px}.wtkfhub-visual{min-height:330px;order:-1}.wtkfhub-emblem{width:190px}.wtkfhub-radar,.wtkfhub-sweep{width:320px}.wtkfhub-copy{text-align:center}.wtkfhub-lead{margin-inline:auto}.wtkfhub-pills,.wtkfhub-share{justify-content:center}.wtkfhub-actions{margin-inline:auto}.wtkfhub-node{font-size:9px}.wtkfhub-n1{left:0;top:9%}.wtkfhub-n2{right:0;top:14%}.wtkfhub-n3{left:2%;bottom:4%}.wtkfhub-n4{right:2%;bottom:8%}}
    @media(max-width:520px){.wtkfhub-wrap{width:min(100% - 24px,1180px);padding-top:25px}.wtkfhub-visual{min-height:270px}.wtkfhub-emblem{width:150px}.wtkfhub-radar,.wtkfhub-sweep{width:245px}.wtkfhub-node{padding:7px 8px}.wtkfhub-copy h1{font-size:42px}.wtkfhub-copy h1 em{font-size:16px}.wtkfhub-actions{grid-template-columns:1fr}.wtkfhub-action.primary,.wtkfhub-action.showroom{grid-column:auto}.wtkfhub-node b{font-size:9px}}
    @media(prefers-reduced-motion:reduce){.wtkfhub-dot,.wtkfhub-emblem,.wtkfhub-emblem:before,.wtkfhub-sweep:after{animation:none!important}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='wtkfhub-live';
  section.setAttribute('aria-label','태권검도 WORLD HUB LIVE 소개');
  section.innerHTML=`<div class="wtkfhub-wrap">
    <div class="wtkfhub-copy">
      <div class="wtkfhub-livebar"><i class="wtkfhub-dot"></i> TAEKWON-GEOMDO WORLD HUB · LIVE</div>
      <h1><span>TAEKWON</span><span>GEOMDO</span><em>태권도의 역동성 × 검도의 절제, 하나의 새로운 무도</em></h1>
      <p class="wtkfhub-lead">2009년 시작된 태권검도는 발차기와 검법을 단순히 섞는 것이 아니라, 거리·각도·타이밍·중심을 하나의 구조와 교차원리로 연결한 교육형 무도입니다. 처음 오셨다면 30초만 체험해 보세요.</p>
      <div class="wtkfhub-pills"><span>EST. 2009</span><span>교차원리</span><span>DISCIPLINE</span><span>RESPECT</span><span>HARMONY</span><span>GLOBAL EDUCATION</span></div>
      <div class="wtkfhub-actions">
        <button class="wtkfhub-action primary" type="button" data-wtkfhub-tour><span>▶ 30초 태권검도 체험<small>처음 방문한 분은 여기부터</small></span><b>START</b></button>
        <a class="wtkfhub-action showroom" href="./showroom/"><span>✦ SHOWROOM 통합관<small>TK01~TK10 · 상대에게 맞는 30~40초 체험 선택</small></span><b>OPEN</b></a>
        <a class="wtkfhub-action" href="#wtkfhub-tech"><span>⚔ 기술 보기<small>공식 영상교육관으로</small></span><b>→</b></a>
        <a class="wtkfhub-action" href="./about/#history"><span>◎ 창시 이야기<small>2009년부터 이어진 역사</small></span><b>→</b></a>
        <a class="wtkfhub-action" href="#wtkfhub-network"><span>◉ 세계 네트워크<small>지부 · 도장 · 지도자</small></span><b>→</b></a>
        <a class="wtkfhub-action" href="./contact/"><span>＋ 지도자 · 지부 참여<small>교육 · 세미나 · 파트너십</small></span><b>→</b></a>
      </div>
      <div class="wtkfhub-share"><button type="button" data-wtkfhub-share>↗ 이 페이지 공유</button><span class="wtkfhub-version">WORLD HUB v3.3.1 · SHOWROOM TK01~TK10 연결</span></div>
    </div>
    <div class="wtkfhub-visual" aria-hidden="true">
      <div class="wtkfhub-radar"></div><div class="wtkfhub-sweep"></div>
      <div class="wtkfhub-emblem"><img src="./assets/img/wtkf-logo-main.png" alt=""><b>LIVE EMBLEM SYSTEM</b></div>
      <div class="wtkfhub-node wtkfhub-n1"><b>PHILOSOPHY</b>창시철학 · 교차원리</div>
      <div class="wtkfhub-node wtkfhub-n2"><b>TRAINING</b>품새 · 기본기술 · 지도자</div>
      <div class="wtkfhub-node wtkfhub-n3"><b>GLOBAL</b>지부 · 국제 네트워크</div>
      <div class="wtkfhub-node wtkfhub-n4"><b>VERIFY</b>단증 · 자격 · 공식조회</div>
    </div>
  </div>`;
  legacyHero.insertAdjacentElement('beforebegin',section);

  const videoHall=document.querySelector('.wtkf-home-video');
  if(videoHall) videoHall.id='wtkfhub-tech';
  const liveBoard=document.querySelector('.wtkf-live-board');
  if(liveBoard) liveBoard.id='wtkfhub-network';

  const modal=document.createElement('div');
  modal.className='wtkfhub-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<div class="wtkfhub-modalbox" role="dialog" aria-modal="true" aria-label="30초 태권검도 체험">
    <div class="wtkfhub-modalhead"><div><small>30-SECOND TAEKWON-GEOMDO EXPERIENCE</small><h2>30초면 태권검도가 보입니다</h2></div><button class="wtkfhub-close" type="button" aria-label="닫기">×</button></div>
    <div class="wtkfhub-steps">
      <div class="wtkfhub-step"><span>1</span><div><strong>태권도의 역동성</strong><p>발차기·스텝·몸의 움직임을 통해 거리와 타이밍을 만듭니다.</p></div></div>
      <div class="wtkfhub-step"><span>2</span><div><strong>검도의 절제된 검법</strong><p>베기·막기·검의 선을 통해 정확한 각도와 중심을 익힙니다.</p></div></div>
      <div class="wtkfhub-step"><span>3</span><div><strong>구조와 교차원리</strong><p>손과 발, 검과 몸, 공격과 방어를 하나의 원리로 연결합니다.</p></div></div>
      <div class="wtkfhub-step"><span>4</span><div><strong>세계 어디서나 같은 교육</strong><p>품새·기본기술·지도자교육·공식조회까지 표준 시스템으로 이어집니다.</p></div></div>
    </div>
    <div class="wtkfhub-progress"><i></i></div>
    <div class="wtkfhub-modalactions"><a href="./showroom/">SHOWROOM TK01~TK10 →</a><a href="#wtkfhub-tech">공식 기술영상 보기 →</a><a href="./program/">교육과정 보기 →</a><a href="./contact/">지도자 참여 →</a></div>
  </div>`;
  document.body.appendChild(modal);
  let tourTimers=[];
  function stopTour(){tourTimers.forEach(clearTimeout);tourTimers=[];}
  function closeTour(){stopTour();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  function startTour(){
    stopTour();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
    const steps=[...modal.querySelectorAll('.wtkfhub-step')],bar=modal.querySelector('.wtkfhub-progress i');
    steps.forEach(s=>s.classList.remove('active'));bar.style.width='0%';
    steps.forEach((s,i)=>tourTimers.push(setTimeout(()=>{s.classList.add('active');bar.style.width=((i+1)*25)+'%';},i*1800+180)));
  }
  section.querySelector('[data-wtkfhub-tour]').addEventListener('click',startTour);
  modal.querySelector('.wtkfhub-close').addEventListener('click',closeTour);
  modal.addEventListener('click',e=>{if(e.target===modal) closeTour();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeTour();});
  modal.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeTour));

  section.querySelector('[data-wtkfhub-share]').addEventListener('click',async function(){
    const data={title:'태권검도 WORLD HUB',text:'태권도의 역동성과 검도의 절제를 하나의 구조와 교차원리로 연결한 태권검도를 만나보세요.',url:location.href.split('#')[0]};
    try{
      if(navigator.share) await navigator.share(data);
      else {await navigator.clipboard.writeText(data.url);const old=this.textContent;this.textContent='✓ 주소가 복사되었습니다';setTimeout(()=>this.textContent=old,1800);}
    }catch(e){}
  });
})();