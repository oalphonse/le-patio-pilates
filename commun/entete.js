/* En-tête commun : ouverture du menu.
   Ordinateur : le menu s'ouvre au survol (CSS) ; un clic le garde ouvert.
   Mobile / tactile : un toucher sur « Menu » l'ouvre ou le ferme.
   Fermeture : Échap, clic en dehors, ou clic sur un lien du menu. */
(function(){
  const entete=document.querySelector('.site-header');
  const bouton=document.getElementById('menu-btn');
  const panneau=document.getElementById('menu');
  if(!entete||!bouton||!panneau) return;
  const ouvrir=o=>{ entete.classList.toggle('open',o); bouton.setAttribute('aria-expanded',String(o)); };
  bouton.addEventListener('click',()=>ouvrir(!entete.classList.contains('open')));
  panneau.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>ouvrir(false)));
  document.addEventListener('click',e=>{ if(!e.target.closest('.menu-zone')) ouvrir(false); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&entete.classList.contains('open')){ ouvrir(false); bouton.focus(); } });
  // Survol (ordinateur) : garder aria-expanded juste pour les lecteurs d'écran
  const zone=bouton.closest('.menu-zone');
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    zone.addEventListener('mouseenter',()=>bouton.setAttribute('aria-expanded','true'));
    zone.addEventListener('mouseleave',()=>{ if(!entete.classList.contains('open')) bouton.setAttribute('aria-expanded','false'); });
  }
})();

/* Bouton « espace client » bsport, dans l'en-tête à côté de « Réserver » (icône bonhomme).
   C'est le bouton flottant de bsport (widget consumerSpace, option showFab), normalement fixé en bas à gauche :
   - déconnecté, un clic ouvre la fenêtre de connexion bsport ;
   - connecté, un clic déplie son menu : Mes réservations, Mon panier, Mon profil, Mes souscriptions, Déconnexion.
   On monte le widget hors de l'écran ; bsport pose le bloc du bouton flottant dans <body>. On le LAISSE dans
   <body> (le déplacer fait planter bsport, qui insère son fond de menu juste avant ce bloc) et on le SUPERPOSE
   à .fab-place de l'en-tête : sa position (--fab-x, --fab-y) suit l'emplacement à chaque défilement ou
   redimensionnement. entete.css le met à la taille de l'en-tête, remplace son icône par le bonhomme et fait
   déplier le menu vers le bas. En attendant (ou sans JavaScript / si bsport ne répond pas), .fab-place contient
   un simple lien bonhomme vers la page de connexion bsport. */
(function(){
  const place=document.querySelector('.fab-place'); if(!place) return;
  const STUDIO=7023, CDN='https://cdn.bsport.io/scripts/widget.js';
  /* entrées du menu bsport (fr / en) : sert à reconnaître le bloc du bouton flottant */
  const ENTREES=/^(mon panier|my basket|mes réservations|my bookings|mon profil|my profile)$/i;
  function attendre(test,essais){
    return new Promise(res=>{ let n=0; (function boucle(){ const v=test(); if(v||n++>=essais) return res(v||null); setTimeout(boucle,100); })(); });
  }
  /* Bloc du bouton flottant pas encore habillé (enfant direct de <body>, contenant les entrées du menu
     et le bouton principal sans titre), ou null. */
  function blocFlottant(){
    for(const x of document.querySelectorAll('body > div button[title]')){
      if(!ENTREES.test(x.title.trim()) || x.closest('.site-header')) continue;
      let r=x; while(r.parentElement && r.parentElement!==document.body) r=r.parentElement;
      if(!r.classList.contains('fab-bsport') && r.querySelector(':scope > button:last-child:not([title])')) return r;
    }
    return null;
  }
  /* Position de .fab-place, recopiée sur le bloc habillé du moment (--fab-x, --fab-y, --fab-l). */
  /* Deux modes, pour que le bouton ne « traîne » jamais derrière l'en-tête pendant un défilement rapide :
     - en-tête collé en haut (sticky) : bloc fixé à l'écran (position:fixed) ;
     - en-tête pas encore collé (haut de l'accueil, sous le bandeau d'annonce) : bloc ancré dans la PAGE
       (.fab-page, position:absolute), il défile donc exactement avec l'en-tête, sans attendre le JavaScript.
     Au moment du passage d'un mode à l'autre, les deux positions coïncident. */
  const entete=document.querySelector('.site-header');
  let bloc=null, prevu=false;
  function suivre(){
    prevu=false;
    if(!bloc||!bloc.isConnected) return;
    const r=place.getBoundingClientRect();
    const colle=!entete || entete.getBoundingClientRect().top<=0.5;
    bloc.classList.toggle('fab-page',!colle);
    bloc.style.setProperty('--fab-x', Math.round(r.left+(colle?0:window.scrollX))+'px');
    bloc.style.setProperty('--fab-y', Math.round(r.top+(colle?0:window.scrollY))+'px');
    bloc.style.setProperty('--fab-l', Math.round(r.width)+'px');
  }
  function demander(){ if(!prevu){ prevu=true; requestAnimationFrame(suivre); } }
  /* bsport RECRÉE son bloc (nouvel élément, sans nos réglages) à chaque ouverture / fermeture de sa fenêtre
     de connexion, et sans doute à la connexion : on surveille <body> en permanence et on habille chaque
     nouveau bloc. Tant qu'aucun bloc habillé n'est affiché, le lien bonhomme de secours reprend sa place. */
  function habiller(b){
    if(!b.classList.contains('fab-bsport')) b.classList.add('fab-bsport');
    const principal=b.querySelector(':scope > button:last-child');
    if(principal){ principal.setAttribute('aria-label','Mon espace'); principal.title='Mon espace'; }
    if(b!==bloc){ bloc=b; suivre(); }
  }
  function verifier(){
    const b=blocFlottant();
    if(b) habiller(b);
    else if(bloc&&!bloc.isConnected) bloc=null;
    place.classList.toggle('fab-ok', !!(bloc&&bloc.isConnected));
  }
  function installer(){
    if(!window.BsportWidget&&!document.getElementById('bsport-widget-cdn')){
      const s=document.createElement('script'); s.id='bsport-widget-cdn'; s.src=CDN; document.head.appendChild(s);
    }
    const boite=document.createElement('div');
    boite.id='bsport-widget-espace'; boite.className='compte-widget'; boite.setAttribute('aria-hidden','true');
    document.body.appendChild(boite);
    /* MutationObserver : le bloc est habillé avant son premier affichage (jamais visible en bas à gauche). */
    new MutationObserver(verifier).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('scroll',suivre,{passive:true});
    window.addEventListener('resize',demander);
    if(window.ResizeObserver) new ResizeObserver(demander).observe(document.querySelector('.site-header')||document.body);
    attendre(()=>window.BsportWidget,100).then(bw=>{
      if(!bw) return;
      bw.mount({parentElement:boite.id,companyId:STUDIO,franchiseId:null,dialogMode:1,widgetType:'consumerSpace',
                showFab:true,fullScreenPopup:false,styles:undefined,config:{consumerSpace:{}}});
    });
  }
  /* bsport bloque le défilement pendant sa fenêtre (body style="overflow:hidden"), puis à la fermeture pose
     overflow:auto au lieu de rendre la main : le <body> devient une zone de défilement interne et l'en-tête
     (sticky) ne suit plus. On retire ce overflow:auto dès qu'il apparaît (le overflow-x:clip des pages revient). */
  new MutationObserver(()=>{ if(document.body.style.overflow==='auto') document.body.style.removeProperty('overflow'); })
    .observe(document.body,{attributes:true,attributeFilter:['style']});
  if(document.readyState==='complete') installer(); else window.addEventListener('load',installer);
})();
