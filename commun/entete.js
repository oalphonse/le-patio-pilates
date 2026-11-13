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
  function blocFlottant(){
    const b=[...document.querySelectorAll('body > div button[title]')].find(x=>ENTREES.test(x.title.trim()) && !x.closest('.site-header'));
    if(!b) return null;
    let r=b; while(r.parentElement && r.parentElement!==document.body) r=r.parentElement;
    return r.querySelector(':scope > button:not([title])') ? r : null;
  }
  function installer(){
    if(!window.BsportWidget&&!document.getElementById('bsport-widget-cdn')){
      const s=document.createElement('script'); s.id='bsport-widget-cdn'; s.src=CDN; document.head.appendChild(s);
    }
    const boite=document.createElement('div');
    boite.id='bsport-widget-espace'; boite.className='compte-widget'; boite.setAttribute('aria-hidden','true');
    document.body.appendChild(boite);
    /* Le bloc est repéré dès que bsport l'insère dans <body> (MutationObserver : avant le premier affichage),
       pour qu'il n'apparaisse jamais en bas à gauche avec l'icône de bsport. */
    const guet=new MutationObserver(()=>{ const b=blocFlottant(); if(b) habiller(b); });
    guet.observe(document.body,{childList:true,subtree:true});
    attendre(()=>window.BsportWidget,100).then(bw=>{
      if(!bw){ guet.disconnect(); return; }
      bw.mount({parentElement:boite.id,companyId:STUDIO,franchiseId:null,dialogMode:1,widgetType:'consumerSpace',
                showFab:true,fullScreenPopup:false,styles:undefined,config:{consumerSpace:{}}});
      attendre(blocFlottant,150).then(b=>{ if(b) habiller(b); });
    });
    let fait=false;
    function habiller(bloc){
      if(fait) return; fait=true; guet.disconnect();
      bloc.classList.add('fab-bsport');
      const principal=bloc.querySelector(':scope > button:not([title])');
      principal.setAttribute('aria-label','Mon espace');
      principal.title='Mon espace';
      let prevu=false;
      function suivre(){
        prevu=false;
        const r=place.getBoundingClientRect();
        bloc.style.setProperty('--fab-x', Math.round(r.left)+'px');
        bloc.style.setProperty('--fab-y', Math.round(r.top)+'px');
        bloc.style.setProperty('--fab-l', Math.round(r.width)+'px');
      }
      function demander(){ if(!prevu){ prevu=true; requestAnimationFrame(suivre); } }
      suivre();
      window.addEventListener('scroll',demander,{passive:true});
      window.addEventListener('resize',demander);
      if(window.ResizeObserver) new ResizeObserver(demander).observe(document.querySelector('.site-header')||document.body);
      place.classList.add('fab-ok');
    }
  }
  if(document.readyState==='complete') installer(); else window.addEventListener('load',installer);
})();
