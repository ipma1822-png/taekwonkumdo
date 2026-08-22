(function(){
  const langs=[
    ['ko','KR','🇰🇷','한국어'],['en','US','🇺🇸','English'],['zh-CN','CN','🇨🇳','中文'],['ja','JP','🇯🇵','日本語'],
    ['es','ES','🇪🇸','Español'],['fr','FR','🇫🇷','Français'],['de','DE','🇩🇪','Deutsch'],['pt','BR','🇧🇷','Português'],
    ['it','IT','🇮🇹','Italiano'],['ru','RU','🇷🇺','Русский'],['mn','MN','🇲🇳','Монгол'],['vi','VN','🇻🇳','Tiếng Việt'],
    ['th','TH','🇹🇭','ไทย'],['id','ID','🇮🇩','Bahasa Indonesia'],['ms','MY','🇲🇾','Bahasa Melayu'],['tl','PH','🇵🇭','Filipino'],
    ['hi','IN','🇮🇳','हिन्दी'],['ar','SA','🇸🇦','العربية'],['tr','TR','🇹🇷','Türkçe'],['ne','NP','🇳🇵','नेपाली']
  ];
  const style=document.createElement('style');
  style.textContent=`
  .wtkf-lang-btn{position:fixed;right:18px;bottom:18px;z-index:99990;border:1px solid rgba(212,175,55,.7);background:#0b1b31;color:#fff;border-radius:999px;padding:11px 15px;font-weight:800;box-shadow:0 8px 30px rgba(0,0,0,.28);cursor:pointer}
  .wtkf-lang-btn span{color:#e3bd59}.wtkf-lang-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;padding:20px}.wtkf-lang-overlay.open{display:flex}
  .wtkf-lang-panel{width:min(900px,96vw);max-height:88vh;overflow:auto;background:#101722;border:1px solid rgba(212,175,55,.55);border-radius:22px;padding:26px;color:#fff;box-shadow:0 25px 80px rgba(0,0,0,.5)}
  .wtkf-lang-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:20px}.wtkf-lang-head small{color:#e3bd59;font-weight:900;letter-spacing:.12em}.wtkf-lang-head h2{margin:5px 0 4px;font-size:28px}.wtkf-lang-head p{margin:0;color:#b7c0ce}.wtkf-lang-close{background:none;border:0;color:#fff;font-size:30px;cursor:pointer}
  .wtkf-lang-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.wtkf-lang-item{display:flex;align-items:center;gap:11px;text-align:left;background:#171f2b;border:1px solid #303a48;border-radius:13px;padding:12px;color:#fff;cursor:pointer}.wtkf-lang-item:hover{border-color:#d4af37;background:#202a38}.wtkf-flag{font-size:27px;line-height:1}.wtkf-lang-item b{display:block;font-size:14px}.wtkf-lang-item em{display:block;font-style:normal;font-size:10px;color:#8994a5;margin-top:2px}
  @media(max-width:700px){.wtkf-lang-grid{grid-template-columns:repeat(2,1fr)}.wtkf-lang-panel{padding:18px}.wtkf-lang-btn{right:12px;bottom:12px}.wtkf-lang-head h2{font-size:23px}}
  `;
  document.head.appendChild(style);
  const btn=document.createElement('button'); btn.className='wtkf-lang-btn'; btn.innerHTML='🌐 <span>20</span> Languages'; btn.setAttribute('aria-label','언어 선택');
  const ov=document.createElement('div'); ov.className='wtkf-lang-overlay';
  ov.innerHTML=`<div class="wtkf-lang-panel" role="dialog" aria-modal="true"><div class="wtkf-lang-head"><div><small>WTKF · GLOBAL LANGUAGE</small><h2>언어를 선택하세요</h2><p>태권검도 홈페이지를 원하는 언어로 볼 수 있습니다.</p></div><button class="wtkf-lang-close" aria-label="닫기">×</button></div><div class="wtkf-lang-grid"></div></div>`;
  const grid=ov.querySelector('.wtkf-lang-grid');
  langs.forEach(([code,country,flag,name])=>{const x=document.createElement('button');x.className='wtkf-lang-item';x.innerHTML=`<span class="wtkf-flag">${flag}</span><span><b>${name}</b><em>${country}</em></span>`;x.onclick=()=>go(code);grid.appendChild(x)});
  function go(code){
    localStorage.setItem('wtkf_lang',code);
    if(code==='ko'){ location.href=location.origin+location.pathname+location.search.replace(/([?&])lang=[^&]*&?/,'$1').replace(/[?&]$/,'')+location.hash; return; }
    const clean=location.href.replace(/[?&]lang=[^&#]*/g,'');
    location.href='https://translate.google.com/translate?sl=ko&tl='+encodeURIComponent(code)+'&u='+encodeURIComponent(clean);
  }
  btn.onclick=()=>ov.classList.add('open'); ov.querySelector('.wtkf-lang-close').onclick=()=>ov.classList.remove('open'); ov.onclick=e=>{if(e.target===ov)ov.classList.remove('open')};
  document.body.append(btn,ov);
  // IPMA 대문에서 ?lang=xx 로 들어온 경우 첫 방문에 해당 언어 번역으로 연결
  const p=new URLSearchParams(location.search); const incoming=p.get('lang');
  if(incoming && incoming!=='ko' && !sessionStorage.getItem('wtkf_lang_jump_'+incoming)){
    sessionStorage.setItem('wtkf_lang_jump_'+incoming,'1');
    const map={zh:'zh-CN',cn:'zh-CN',jp:'ja',br:'pt',vn:'vi',th:'th',id:'id',my:'ms',ph:'tl',in:'hi',sa:'ar',np:'ne'};
    go(map[incoming]||incoming);
  }
})();
