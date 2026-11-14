/* Galerie (S12) : flèches de défilement + agrandissement des photos au clic. */
(function(){
  const track=document.getElementById('track'); if(!track) return;
  const p=document.getElementById('prev'), n=document.getElementById('next');
  if(p) p.onclick=()=>track.scrollBy({left:-320,behavior:'smooth'});
  if(n) n.onclick=()=>track.scrollBy({left:320,behavior:'smooth'});
})();
/* ===== Photos interactives : agrandissement au clic (lightbox) ===== */
(function(){
  const photos=[...document.querySelectorAll('.gal .ph > img')];
  if(!photos.length) return;
  // Une seule entrée par photo (la galerie reprend des photos déjà présentes plus haut)
  const liste=[], rang=new Map();
  photos.forEach(img=>{
    const src=img.getAttribute('src');
    if(!rang.has(src)){ rang.set(src,liste.length); liste.push({src,alt:img.alt}); }
    const p=liste[rang.get(src)]; if(img.alt.length>p.alt.length) p.alt=img.alt; // on garde la légende la plus complète
  });
  photos.forEach(img=>{
    img.classList.add('zoomable'); img.tabIndex=0;
    img.setAttribute('role','button'); img.setAttribute('aria-haspopup','dialog');
    img.setAttribute('aria-label','Agrandir la photo : '+(liste[rang.get(img.getAttribute('src'))].alt||'photo du studio'));
    img.addEventListener('click',()=>ouvrir(img));
    img.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); ouvrir(img); } });
  });

  // Fenêtre (créée une seule fois)
  const d=document.createElement('dialog');
  d.className='lb'; d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','Photo agrandie');
  d.innerHTML='<figure class="lb-fig"><img alt=""><figcaption><span class="lb-cap"></span><span class="lb-num"></span></figcaption></figure>'
    +'<button type="button" class="lb-btn lb-fermer" aria-label="Fermer">×</button>'
    +'<button type="button" class="lb-btn lb-prec" aria-label="Photo précédente">←</button>'
    +'<button type="button" class="lb-btn lb-suiv" aria-label="Photo suivante">→</button>';
  document.body.appendChild(d);
  const fig=d.querySelector('.lb-fig'), grande=fig.querySelector('img'), cap=d.querySelector('.lb-cap'), num=d.querySelector('.lb-num');
  const plusieurs=liste.length>1;
  d.querySelector('.lb-prec').hidden=!plusieurs; d.querySelector('.lb-suiv').hidden=!plusieurs; num.hidden=!plusieurs;

  let actuelle=0, source=null;
  function afficher(i){
    actuelle=(i+liste.length)%liste.length; const p=liste[actuelle];
    grande.src=p.src; grande.alt=p.alt; cap.textContent=p.alt; cap.hidden=!p.alt;
    num.textContent=(actuelle+1)+' / '+liste.length;
  }
  function ouvrir(img){
    if(d.open) return;
    source=img; afficher(rang.get(img.getAttribute('src')));
    document.documentElement.classList.add('lb-bloque'); // bloque le défilement de la page
    d.showModal(); d.querySelector('.lb-fermer').focus();
  }
  function fermer(){ if(d.open) d.close(); }
  // Échap ferme nativement le <dialog> ; on remet tout en place à chaque fermeture
  d.addEventListener('close',()=>{
    document.documentElement.classList.remove('lb-bloque');
    if(source) source.focus({preventScroll:true});
  });
  d.querySelector('.lb-fermer').addEventListener('click',fermer);
  d.querySelector('.lb-prec').addEventListener('click',()=>afficher(actuelle-1));
  d.querySelector('.lb-suiv').addEventListener('click',()=>afficher(actuelle+1));
  d.addEventListener('click',e=>{ if(e.target===d||e.target===fig) fermer(); }); // clic sur le fond
  d.addEventListener('keydown',e=>{
    if(!plusieurs) return;
    if(e.key==='ArrowLeft'){ e.preventDefault(); afficher(actuelle-1); }
    else if(e.key==='ArrowRight'){ e.preventDefault(); afficher(actuelle+1); }
  });
  // Mobile : glisser à gauche / à droite pour changer de photo
  let x0=null;
  d.addEventListener('touchstart',e=>{ x0=e.touches.length===1?e.touches[0].clientX:null; },{passive:true});
  d.addEventListener('touchend',e=>{
    if(x0===null||!plusieurs) return;
    const dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>50) afficher(actuelle+(dx<0?1:-1));
  });
})();
