(() => {
 const dialog=document.createElement('dialog');dialog.className='image-viewer';dialog.setAttribute('aria-label','교본 이미지 확대');
 dialog.innerHTML='<div class="viewer-toolbar"><button type="button" data-fit>화면에 맞추기</button><a target="_blank" rel="noopener">이미지 열기</a><button type="button" data-close>닫기 ✕</button></div><div class="viewer-scroll"><img alt=""></div>';
 document.body.append(dialog);const scroll=dialog.querySelector('.viewer-scroll');let trigger;
 document.querySelectorAll('.zoom-image').forEach(a=>a.addEventListener('click',e=>{if(!dialog.showModal)return;e.preventDefault();trigger=a;const img=dialog.querySelector('img');img.src=a.href;img.alt=a.querySelector('img').alt;dialog.querySelector('a').href=a.href;scroll.classList.remove('fit');dialog.showModal();scroll.scrollTo(0,0);document.body.style.overflow='hidden';}));
 dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-fit]').onclick=()=>scroll.classList.toggle('fit');dialog.addEventListener('close',()=>{document.body.style.overflow='';trigger?.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
})();
