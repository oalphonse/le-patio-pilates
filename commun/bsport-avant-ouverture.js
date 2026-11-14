/* Calendrier bsport : bloc « Où en sont les travaux ? » (liens Instagram / Facebook).
   Affiché quand le jour choisi dans le widget est AVANT l'ouverture du studio (1er février 2027) et qu'aucun cours n'y est prévu.
   Il prend alors la place du bloc « Pas encore de cours le samedi / dimanche » (voir commun/bsport-jour-ferme.js).
   Le jour choisi est lu dans le widget : semaine affichée (« Lun. 09/11 - Dim. 15/11 », l'année n'apparaît que si
   ce n'est pas l'année en cours) + numéro du jour sélectionné. */
(function(){
  var OUVERTURE = new Date(2027, 1, 1);   // 1er février 2027 (les mois commencent à 0)

  function dateChoisie(widget){
    var lib = widget.querySelector('.bs-marketplace-date-picker__placeholder');
    var jourEl = widget.querySelector('.bs-week__header__date__monthDay--is-selected');
    if(!lib || !jourEl) return null;
    var m = (lib.textContent || '').match(/(\d{1,2})\/(\d{1,2})(?:\s+(\d{4}))?/);
    var j = parseInt((jourEl.textContent || '').trim(), 10);
    if(!m || !j) return null;
    var annee = m[3] ? +m[3] : new Date().getFullYear();
    var debut = new Date(annee, +m[2] - 1, +m[1]);
    // le jour choisi est dans la semaine affichée : même mois que le lundi, ou le mois suivant si son numéro est plus petit
    var d = new Date(debut.getFullYear(), debut.getMonth(), j);
    if(j < debut.getDate()) d = new Date(debut.getFullYear(), debut.getMonth() + 1, j);
    return d;
  }

  function installer(bloc){
    var section = bloc.closest('section') || document.body;
    var widget = section.querySelector('.bsport-widget');
    if(!widget) return;
    function verifier(){
      var cal = widget.querySelector('.bs-calendar');
      var charge = !!widget.querySelector('.bs-week__listMode__content__day__date, .bs-calendar--no-offer');
      var vide = widget.querySelectorAll('.bs-offer-list-item').length === 0;
      var d = dateChoisie(widget);
      var afficher = !!(cal && charge && vide && d && d < OUVERTURE);
      if(afficher){
        /* en fin de calendrier ; on laisse le bloc samedi / dimanche passer après nous (sinon les deux scripts
           se renverraient la dernière place indéfiniment) */
        var suivant = bloc.nextElementSibling;
        var enPlace = bloc.parentNode === cal && (!suivant || (suivant.hasAttribute('data-jour-ferme') && !suivant.nextElementSibling));
        if(!enPlace) cal.appendChild(bloc);
        bloc.hidden = false;
        if(!section.hasAttribute('data-avant-ouverture')) section.setAttribute('data-avant-ouverture','');
      } else {
        bloc.hidden = true;
        if(section.hasAttribute('data-avant-ouverture')) section.removeAttribute('data-avant-ouverture');
      }
    }
    var prevu = false;
    new MutationObserver(function(){
      if(prevu) return; prevu = true;
      requestAnimationFrame(function(){ prevu = false; verifier(); });
    }).observe(widget, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class']});
    verifier();
  }

  function demarrer(){ document.querySelectorAll('[data-avant-ouverture]').forEach(function(b){ if(b.classList.contains('avant-ouverture')) installer(b); }); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
