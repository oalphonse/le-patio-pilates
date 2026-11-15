/* Tarifs, liste des forfaits (widget bsport #bsport-widget-formules-cartes) : prix d'une séance avant la validité,
   sur la même ligne : « 33 € la séance · Valide 3 mois ». Calculé à partir du prix et du nombre de crédits affichés
   par bsport (prix ÷ crédits), donc toujours à jour si le studio change ses prix. Seulement pour les packs de plus
   d'une séance. Le texte est posé dans data-prix-seance et affiché en ::before (commun/bsport-formules.css) :
   bsport peut recréer ses cartes, un observateur le remet. Sans ce script, rien ne change. */
(function(){
  var widget = document.getElementById('bsport-widget-formules-cartes'); if(!widget) return;
  var EN = (document.documentElement.lang || 'fr').indexOf('en') === 0;
  function nombre(t){ var m = (t || '').replace(/\s| /g, '').match(/(\d+(?:[.,]\d+)?)/); return m ? parseFloat(m[1].replace(',', '.')) : NaN; }
  function euros(v){
    var arrondi = Math.round(v * 100) / 100, entier = arrondi % 1 === 0;
    var txt = entier ? String(arrondi) : arrondi.toFixed(2).replace('.', EN ? '.' : ',');
    return EN ? '€' + txt : txt + ' €';
  }
  function poser(){
    widget.querySelectorAll('.bs-paymentpack-card__grid').forEach(function(carte){
      var val = carte.querySelector('.bs-paymentpack-card__validity__content');
      var sous = carte.querySelector('.bs-paymentpack-card__subtitle');
      var titre = carte.querySelector('.bs-paymentpack-card__title');
      var prix = carte.querySelector('.bs-price__container > span');
      if(!val || !prix) return;
      var credits = nombre(sous && sous.textContent); if(!(credits > 0)) credits = nombre(titre && titre.textContent);
      var p = nombre(prix.textContent);
      if(!(credits > 1) || !(p > 0)){ if(val.hasAttribute('data-prix-seance')) val.removeAttribute('data-prix-seance'); return; }
      var t = euros(p / credits) + (EN ? ' per class' : ' la séance');
      if(val.getAttribute('data-prix-seance') !== t) val.setAttribute('data-prix-seance', t);
    });
  }
  new MutationObserver(poser).observe(widget, {childList:true, subtree:true, characterData:true});
  poser();
})();
