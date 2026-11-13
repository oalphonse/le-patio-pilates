/* Langue de tout ce qui vient de bsport = langue de la page (<html lang="fr"> ou "en"),
   donc synchronisée avec le bouton FR / EN de l'en-tête (chaque page porte sa langue).
   Sans ça, bsport prend la langue du navigateur du visiteur : un navigateur en anglais affichait « Book »,
   « 8:30 AM », « Log in »… sur les pages françaises.
   1. Widgets (calendrier, cartes, abonnements…) : cookie « i18next » ET option « language » ajoutée à BsportWidget.mount (voir 1 bis).
   2. Fenêtres bsport en cadre (connexion, achat…, servies par backoffice.bsport.io) : elles ignorent le cookie
      mais acceptent le paramètre « lng » dans l'adresse ; on l'ajoute à chaque cadre dès qu'il apparaît.
   3. Liens directs vers bsport (lien de secours de « Se connecter »…) : même paramètre « lng ».
   À inclure dans le <head> de chaque page, AVANT le script https://cdn.bsport.io/scripts/widget.js. */
(function(){
  var lang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  var widgetLng = lang === 'en' ? 'en-GB' : lang;   // langue donnée aux widgets (voir 1 bis : anglais = en-GB)
  document.cookie = 'i18next=' + widgetLng + '; path=/; max-age=31536000; SameSite=Lax';

  /* 1 bis. Le cookie ne suffit pas. widget.js et ses morceaux partagent UNE instance i18next, initialisée deux fois :
     d'abord par widget.js avec la langue du NAVIGATEUR seulement (order:["navigator"]), puis par le widget avec
     cookie > localStorage > navigateur. Si les traductions demandées par la 1re initialisation ne sont pas encore
     arrivées (cache chaud, réseau lent), i18next saute la 2e détection : le widget reste dans la langue du navigateur
     (« MONDAY », « Book »…), et même un changeLanguage ultérieur est écrasé quand ces traductions arrivent.
     Parade a) : la page annonce sa langue en tête de navigator.languages / navigator.language, pour que la 1re
     détection (navigateur seul) trouve déjà la bonne langue. Anglais = en-GB pour tout le monde : dates jour/mois
     et heures sur 24 h, comme en français (commun/bsport-semaine.js et bsport-textes.js lisent ce format).
     Rien d'autre sur le site ne lit ces valeurs. */
  var tete = lang === 'en' ? 'en-GB' : lang === 'fr' ? 'fr-FR' : lang;
  try {
    var nav = window.navigator, origine = nav.languages && nav.languages.length ? [].slice.call(nav.languages) : [nav.language || ''];
    var langues = [tete].concat(origine.filter(function(l){ return l && l.slice(0, 2).toLowerCase() !== lang; }));
    Object.defineProperty(nav, 'languages', {configurable:true, get: function(){ return langues.slice(); }});
    Object.defineProperty(nav, 'language', {configurable:true, get: function(){ return tete; }});
  } catch(e){}

  /* Parade b) : l'option « language » de BsportWidget.mount, que bsport applique (changeLanguage) 100 ms après
     l'affichage du widget. On l'ajoute à chaque mount, sans toucher aux pages. */
  function avecLangueMount(w){
    if(!w || typeof w.mount !== 'function' || w.mount.__langue) return w;
    var mount = w.mount;
    w.mount = function(config){
      var c = {}, k;
      for(k in config) if(Object.prototype.hasOwnProperty.call(config, k)) c[k] = config[k];
      if(!c.language) c.language = widgetLng;
      return mount.call(this, c);
    };
    w.mount.__langue = true;
    return w;
  }
  try {
    var widget = avecLangueMount(window.BsportWidget);
    Object.defineProperty(window, 'BsportWidget', {configurable:true, enumerable:true,
      get: function(){ return widget; },
      set: function(v){ widget = avecLangueMount(v); }});
  } catch(e){}

  var HOTE = /^https:\/\/backoffice\.bsport\.io\//;
  var PONT = /widget-proxy-bridge/;           // cadre technique invisible de bsport : on n'y touche pas

  function avecLangue(url){
    if(!HOTE.test(url) || PONT.test(url)) return url;
    if(/[?&]lng=/.test(url)) return url.replace(/([?&]lng=)[^&#]*/, '$1' + lang);
    var i = url.indexOf('#'), base = i < 0 ? url : url.slice(0, i), ancre = i < 0 ? '' : url.slice(i);
    return base + (base.indexOf('?') < 0 ? '?' : '&') + 'lng=' + lang + ancre;
  }
  function traiter(el){
    if(el.tagName === 'IFRAME'){
      var src = el.getAttribute('src') || '';
      var v = avecLangue(src);
      if(v !== src) el.setAttribute('src', v);
    } else if(el.tagName === 'A'){
      var href = el.getAttribute('href') || '';
      var w = avecLangue(href);
      if(w !== href) el.setAttribute('href', w);
    }
  }
  function parcourir(racine){
    if(racine.nodeType !== 1) return;
    if(racine.tagName === 'IFRAME' || racine.tagName === 'A') traiter(racine);
    racine.querySelectorAll && racine.querySelectorAll('iframe[src], a[href^="https://backoffice.bsport.io"]').forEach(traiter);
  }

  new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      if(m.type === 'attributes') traiter(m.target);
      else m.addedNodes.forEach(parcourir);
    });
  }).observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['src','href']});

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ parcourir(document.documentElement); });
  else parcourir(document.documentElement);
})();
