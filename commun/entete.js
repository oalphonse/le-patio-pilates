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

/* « Mon compte » (icône à côté de Réserver) : ouvre la fenêtre de connexion bsport sans quitter le site.
   Le bouton de connexion bsport est monté hors de l'écran au premier survol / toucher,
   puis notre icône le déclenche. La fenêtre bsport s'affiche par-dessus la page.
   Sans JavaScript, ou si bsport ne répond pas, le lien mène à la page de connexion bsport. */
(function(){
  const lien=document.querySelector('.compte'); if(!lien) return;
  const STUDIO=7023, CDN='https://cdn.bsport.io/scripts/widget.js';
  let promesse=null;
  function attendre(test,essais){
    return new Promise(res=>{ let n=0; (function boucle(){ const v=test(); if(v||n++>=essais) return res(v||null); setTimeout(boucle,100); })(); });
  }
  function charger(){
    if(promesse) return promesse;
    if(!window.BsportWidget&&!document.getElementById('bsport-widget-cdn')){
      const s=document.createElement('script'); s.id='bsport-widget-cdn'; s.src=CDN; document.head.appendChild(s);
    }
    const boite=document.createElement('div');
    boite.id='bsport-widget-compte'; boite.className='compte-widget'; boite.setAttribute('aria-hidden','true');
    document.body.appendChild(boite);
    promesse=attendre(()=>window.BsportWidget,80).then(bw=>{
      if(!bw) return null;
      bw.mount({parentElement:boite.id,companyId:STUDIO,franchiseId:null,dialogMode:1,widgetType:'loginButton',
                showFab:false,fullScreenPopup:false,styles:undefined,config:{loginButton:{}}});
      return attendre(()=>boite.querySelector('button'),80);
    });
    return promesse;
  }
  ['pointerenter','focus','touchstart'].forEach(t=>lien.addEventListener(t,charger,{once:true,passive:true}));
  lien.addEventListener('click',e=>{
    e.preventDefault();
    lien.setAttribute('aria-busy','true');
    charger().then(b=>{ lien.removeAttribute('aria-busy'); if(b) b.click(); else location.href=lien.href; });
  });
})();
