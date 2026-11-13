/* Arrivée sur une offre « centrée » : tarifs/#offre-premiere-seance (lien de la carte de l'accueil) amène
   l'élément [data-ancre-centree="offre-premiere-seance"] au CENTRE de l'écran, en un seul mouvement.
   - La section ne porte PAS d'id égal au # : sinon le navigateur saute déjà tout seul (et en animé, la page
     ayant scroll-behavior:smooth), puis on recentre : double défilement.
   - Positionnement instantané (behavior:'instant'), une fois la mise en page stable (la hauteur du widget
     bsport est réservée en CSS). Ensuite, on ne corrige que si l'offre a bougé de plus de 4 px pendant le
     chargement, et jamais après que le visiteur a fait défiler lui-même. */
(function(){
  var nom = decodeURIComponent((location.hash || '').slice(1));
  if(!nom) return;
  var cible = document.querySelector('[data-ancre-centree="' + nom.replace(/"/g, '') + '"]');
  if(!cible) return;
  if('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var arrete = false;
  ['wheel','touchstart','keydown','mousedown'].forEach(function(t){
    window.addEventListener(t, function(){ arrete = true; }, {passive:true, once:true});
  });

  function position(){
    var r = cible.getBoundingClientRect();
    var entete = document.querySelector('.site-header');
    var haut = entete && getComputedStyle(entete).position === 'sticky' ? entete.getBoundingClientRect().height : 0;
    return Math.max(0, Math.round(window.scrollY + r.top + r.height / 2 - (haut + (window.innerHeight - haut) / 2)));
  }
  function placer(){
    if(arrete) return;
    var y = position();
    if(Math.abs(y - window.scrollY) > 4) window.scrollTo({top: y, behavior: 'instant'});
  }
  placer();                                              // dès que le script s'exécute (fin de page)
  window.addEventListener('load', placer);               // polices et images chargées
  setTimeout(placer, 1500); setTimeout(placer, 3500);    // filet de sécurité pendant le chargement des widgets
})();
