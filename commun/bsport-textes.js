/* Textes bsport réécrits, dans la langue de la page (<html lang>).
   Calendrier sans séance cette semaine : bsport affiche « La séance la plus récente est le 01/02/2027 : 08:30 »
   (en anglais « Most recent session: 01/02/2027 at 08:30 »). On veut « Prochaine séance : lundi 01/02 à 08:30 »
   (« Next class: Monday 01/02 at 8:30 »).
   On ne touche pas au texte de bsport (React le redessine) : on pose le nouveau texte dans l'attribut data-texte
   de .bs-calendar--no-offer--yes-next__text, et commun/bsport.css masque l'original et affiche data-texte (::after).
   Date lue au format jour/mois/année : commun/bsport-langue.js donne fr ou en-GB aux widgets. Sans ce script, rien ne change. */
(function(){
  var EN = (document.documentElement.lang || 'fr').indexOf('en') === 0;
  var JOURS = EN
    ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    : ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  function deux(n){ return (n < 10 ? '0' : '') + n; }

  function prochaine(txt){
    var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})\D+?(\d{1,2})[:hH.](\d{2})\s*([AaPp][Mm])?/.exec(txt || '');
    if(!m) return null;
    var d = new Date(+m[3], +m[2] - 1, +m[1]), h = +m[4], ap = (m[6] || '').toLowerCase();
    if(ap === 'pm' && h < 12) h += 12;
    if(ap === 'am' && h === 12) h = 0;
    var jour = JOURS[d.getDay()] + ' ' + deux(d.getDate()) + '/' + deux(d.getMonth() + 1);
    return EN ? 'Next class: ' + jour + ' at ' + h + ':' + m[5]
              : 'Prochaine séance : ' + jour + ' à ' + deux(h) + ':' + m[5];
  }

  function mettreAJour(racine){
    racine.querySelectorAll('.bs-calendar--no-offer--yes-next__text').forEach(function(el){
      var v = prochaine(el.textContent);
      if(v === null){ el.removeAttribute('data-texte'); return; }
      if(!el.hasAttribute('data-texte')) el.style.setProperty('--bs-prochaine-taille', getComputedStyle(el).fontSize);  // taille d'origine, avant masquage
      if(el.getAttribute('data-texte') !== v){ el.setAttribute('data-texte', v); el.setAttribute('aria-label', v); }
    });
  }
  function suivre(racine){
    var prevu = false;
    new MutationObserver(function(){
      if(prevu) return; prevu = true;
      requestAnimationFrame(function(){ prevu = false; mettreAJour(racine); });
    }).observe(racine, {childList:true, subtree:true, characterData:true});
    mettreAJour(racine);
  }
  function demarrer(){ document.querySelectorAll('.bsport-widget').forEach(suivre); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
