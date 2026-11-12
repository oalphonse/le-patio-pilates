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
