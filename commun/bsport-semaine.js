/* Calendrier bsport : réécrit le libellé de la semaine en toutes lettres.
   bsport affiche « lun. 01/02 2027 - dim. 07/02 2027 » ; on veut « Du lundi 01/02 au dimanche 07/02 »
   (en anglais : « Monday 01/02 to Sunday 07/02 »), avec en dessous, en petit, le mois en toutes lettres (« Février 2027 »).
   On ne touche pas au texte de bsport (le widget le redessine à chaque semaine) : on pose le nouveau libellé
   dans l'attribut data-libelle du bouton .bs-marketplace-date-picker__placeholder, et commun/bsport.css
   masque le texte d'origine et affiche data-libelle à sa place (::after). Sans ce script, rien ne change. */
(function(){
  var EN = (document.documentElement.lang || 'fr').indexOf('en') === 0;
  var JOURS = EN
    ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  var LIEN = EN ? ' to ' : ' au ';
  var MOIS = EN
    ? ['January','February','March','April','May','June','July','August','September','October','November','December']
    : ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  function deux(n){ return (n < 10 ? '0' : '') + n; }

  /* Lit les deux dates du texte bsport : jour/mois (+ année éventuelle), en français comme en anglais
     (commun/bsport-langue.js donne l'anglais britannique « en-GB » aux widgets : « Mon 09/11 - Sun 15/11 »). */
  function dates(txt){
    var re = /(\d{1,2})\/(\d{1,2})(?:[\/\s](\d{4}))?/g, m, out = [];
    while((m = re.exec(txt)) && out.length < 2){
      var a = +m[1], b = +m[2];
      out.push({ j: a, m: b, an: m[3] ? +m[3] : null });
    }
    if(out.length < 2) return null;
    var an = out[0].an || out[1].an || new Date().getFullYear();
    var d1 = new Date(out[0].an || an, out[0].m - 1, out[0].j);
    var an2 = out[1].an || (out[1].m < out[0].m ? an + 1 : an);
    var d2 = new Date(an2, out[1].m - 1, out[1].j);
    return [d1, d2];
  }
  function libelle(d, minuscule){
    var j = JOURS[d.getDay()];
    return (minuscule ? j.toLowerCase() : j) + ' ' + deux(d.getDate()) + '/' + deux(d.getMonth() + 1);
  }
  /* Mois en toutes lettres sous la semaine : « Février 2027 », « Janvier – Février 2027 »,
     « Décembre 2026 – Janvier 2027 » si la semaine change d'année. */
  function mois(d1, d2){
    var m1 = MOIS[d1.getMonth()], m2 = MOIS[d2.getMonth()], a1 = d1.getFullYear(), a2 = d2.getFullYear();
    if(a1 !== a2) return m1 + ' ' + a1 + ' – ' + m2 + ' ' + a2;
    if(m1 !== m2) return m1 + ' – ' + m2 + ' ' + a2;
    return m1 + ' ' + a1;
  }

  function mettreAJour(racine){
    racine.querySelectorAll('.bs-marketplace-date-picker__placeholder').forEach(function(el){
      var d = dates(el.textContent || '');
      var v = d ? (EN ? '' : 'Du ') + libelle(d[0], !EN) + LIEN + libelle(d[1], !EN) : null;
      var m = d ? mois(d[0], d[1]) : null;
      if(v === null){ el.removeAttribute('data-libelle'); el.removeAttribute('data-mois'); return; }
      if(el.getAttribute('data-libelle') !== v){ el.setAttribute('data-libelle', v); el.setAttribute('aria-label', v + ', ' + m); }
      if(el.getAttribute('data-mois') !== m) el.setAttribute('data-mois', m);
    });
  }
  /* Mini calendrier : bsport (Popper) l'aligne sur le bord gauche du sélecteur de semaine.
     On calcule le décalage qui le centre entre les deux flèches, sans sortir de l'écran,
     et on le pose dans --bs-menu-dx (appliqué par commun/bsport.css). */
  function centrerMenu(racine){
    var menu = racine.querySelector('.bs-marketplace-date-picker__menu');
    var selecteur = racine.querySelector('.bs-marketplace-date-picker');
    var boite = menu && menu.parentElement;
    if(!boite || !selecteur) return;
    var actuel = parseFloat(boite.style.getPropertyValue('--bs-menu-dx')) || 0;
    var m = menu.getBoundingClientRect(), s = selecteur.getBoundingClientRect();
    var gaucheSans = m.left - actuel;                                  // position sans notre décalage
    var voulu = s.left + s.width / 2 - m.width / 2;                    // centré sous le sélecteur
    voulu = Math.max(8, Math.min(voulu, document.documentElement.clientWidth - m.width - 8));
    var dx = Math.round(voulu - gaucheSans) + 'px';
    if(boite.style.getPropertyValue('--bs-menu-dx') !== dx) boite.style.setProperty('--bs-menu-dx', dx);
  }
  function suivre(racine){
    var prevu = false;
    new MutationObserver(function(){
      if(prevu) return; prevu = true;
      requestAnimationFrame(function(){ prevu = false; mettreAJour(racine); centrerMenu(racine); });
    }).observe(racine, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['style']});
    mettreAJour(racine);
  }
  function demarrer(){ document.querySelectorAll('.bsport-widget').forEach(suivre); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
