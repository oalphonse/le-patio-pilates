/* Squelette de chargement des widgets bsport (voir commun/bsport-squelette.css).
   <div class="squelette" data-squelette-pour="<id du widget>" data-squelette-pret="<sélecteur>"> … </div>
   - au départ, le widget est rendu en coulisse (attribut data-squelette-attente : hauteur 0) et le squelette est montré ;
   - dès qu'un élément « prêt » apparaît dans le widget (pour le calendrier : un créneau, ou le bouton
     « Prochaine séance » quand la journée est vide), le squelette disparaît et le widget prend sa place ;
   - au bout de 15 s sans réponse, le message [data-squelette-lent] du squelette s'affiche (lien direct vers bsport) ;
     le squelette reste remplacé dès que bsport finit par répondre. */
(function(){
  function installer(sq){
    var widget = document.getElementById(sq.dataset.squelettePour);
    var pret = sq.dataset.squelettePret;
    if(!widget || !pret) return;
    var lent = sq.querySelector('[data-squelette-lent]');
    var fini = false;
    widget.setAttribute('data-squelette-attente', '');
    /* prêt = contenu là ET plus aucun indicateur de chargement de bsport (il en relance parfois un juste
       après avoir affiché les cartes) ; au plus 1,5 s d'attente une fois le contenu là, pour ne jamais rester bloqué */
    var vuPret = 0;
    function verifier(){
      if(fini || !widget.querySelector(pret)) return;
      if(!vuPret){ vuPret = Date.now(); setTimeout(verifier, 1500); }
      if(widget.querySelector('[role="progressbar"]') && Date.now() - vuPret < 1500) return;
      fini = true;
      obs.disconnect(); clearTimeout(minuteur);
      widget.removeAttribute('data-squelette-attente');
      sq.hidden = true;
    }
    var obs = new MutationObserver(verifier);
    obs.observe(widget, {childList:true, subtree:true});
    var minuteur = setTimeout(function(){ if(!fini && lent) lent.hidden = false; }, 15000);
    verifier();
  }
  /* À inclure JUSTE APRÈS le widget dans la page (pas en fin de page) : le widget est mis en attente avant que
     bsport ne le monte. Sans JavaScript, rien n'est masqué (le squelette porte « hidden » dans le HTML). */
  document.querySelectorAll('[data-squelette-pour]').forEach(function(sq){ sq.hidden = false; installer(sq); });
})();
