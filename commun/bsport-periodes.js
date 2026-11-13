/* Calendrier bsport : classe chaque séance par période (matin, midi, soir) d'après son heure de début.
   Ne modifie pas la structure du widget (bsport la redessine) : on pose seulement des attributs sur chaque carte
   .bs-offer-list-item, que le CSS utilise pour regrouper et titrer :
     data-periode="matin|midi|soir", data-periode-nom="Matin" (ou « Morning »… selon la langue de la page),
     data-periode-debut="1" sur la première séance de chaque période.
   Matin : avant 11 h · Midi : de 11 h à 15 h · Soir : à partir de 15 h. */
(function(){
  var NOMS = (document.documentElement.lang || 'fr').indexOf('en') === 0
    ? {matin:'Morning', midi:'Midday', soir:'Evening'}
    : {matin:'Matin', midi:'Midi', soir:'Soir'};

  function minutes(txt){
    var m = /(\d{1,2})\s*[:hH.]\s*(\d{2})?\s*([AaPp])?/.exec(txt || '');
    if(!m) return null;
    var h = +m[1], mn = +(m[2] || 0), ap = (m[3] || '').toLowerCase();
    if(ap === 'p' && h < 12) h += 12;
    if(ap === 'a' && h === 12) h = 0;
    return h * 60 + mn;
  }
  function periode(min){ return min < 11 * 60 ? 'matin' : (min < 15 * 60 ? 'midi' : 'soir'); }
  function poser(el, nom, val){ if(val == null){ if(el.hasAttribute(nom)) el.removeAttribute(nom); } else if(el.getAttribute(nom) !== val) el.setAttribute(nom, val); }

  function classer(racine){
    racine.querySelectorAll('.bs-week__listMode__content__day__offers').forEach(function(liste){
      var avant = null;
      [].forEach.call(liste.children, function(carte){
        if(!carte.classList.contains('bs-offer-list-item')) return;
        var h = carte.querySelector('.bs-offer-list-item__content__time__offer-hours__start-time');
        var min = h ? minutes(h.textContent) : null;
        var p = min == null ? null : periode(min);
        poser(carte, 'data-periode', p);
        poser(carte, 'data-periode-nom', p ? NOMS[p] : null);
        poser(carte, 'data-periode-debut', p && p !== avant ? '1' : null);
        avant = p;
      });
    });
  }

  function suivre(racine){
    var prevu = false;
    var obs = new MutationObserver(function(){
      if(prevu) return; prevu = true;
      requestAnimationFrame(function(){ prevu = false; classer(racine); });
    });
    obs.observe(racine, {childList:true, subtree:true, characterData:true});
    classer(racine);
  }

  function demarrer(){ document.querySelectorAll('.bsport-widget').forEach(suivre); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
