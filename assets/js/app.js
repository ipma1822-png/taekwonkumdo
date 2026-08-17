
(() => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('[data-nav-toggle]');

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
