/* Boutons « Ajouter au panier » aux couleurs du site, branchés sur le VRAI panier bsport.
   <a class="btn btn-olive btn-panier" href="https://backoffice.bsport.io/customer/payment/pass/817521"
      data-bsport-pack="817521" data-bsport-categorie="31419">Ajouter au panier · 35 €</a>
   bsport n'offre pas d'appel JavaScript « ajouter au panier » : son seul chemin est le bouton « Ajouter au panier »
   de ses widgets (il crée le panier, puis ouvre sa fenêtre : connexion / inscription si besoin, puis paiement).
   On monte donc en coulisse (hors écran) un widget « Cartes » limité à la catégorie du pack, et notre bouton
   actionne le bouton bsport du pack. Tant que bsport n'est pas prêt, le bouton patiente (8 s au plus) ; si bsport
   ne répond pas, il garde son lien direct (href) vers la page d'achat bsport. Sans JavaScript : lien direct. */
(function(){
  var boutons = [].slice.call(document.querySelectorAll('[data-bsport-pack]'));
  if(!boutons.length) return;
  var STUDIO = 7023, CDN = 'https://cdn.bsport.io/scripts/widget.js';
  var categories = [];
  boutons.forEach(function(b){ var c = +b.dataset.bsportCategorie; if(c && categories.indexOf(c) < 0) categories.push(c); });

  var boite = document.createElement('div');
  boite.id = 'bsport-widget-panier';
  boite.className = 'compte-widget';                 /* hors écran (commun/entete.css) */
  boite.setAttribute('aria-hidden', 'true');
  document.body.appendChild(boite);

  function boutonBsport(pack){
    return boite.querySelector('#payment-pack-' + pack + ' .bs-paymentpack-card__right-button');
  }
  function monter(){
    if(!window.BsportWidget){ if(monter.n = (monter.n || 0) + 1, monter.n < 100) setTimeout(monter, 100); return; }
    window.BsportWidget.mount({parentElement:boite.id, companyId:STUDIO, franchiseId:null, dialogMode:1, widgetType:'pass',
      showFab:false, fullScreenPopup:false, styles:undefined,
      config:{pass:{paymentPackCategories:categories, privatePassCategories:[], hideFilters:true, hidePrivatePass:true, hidePaymentCombo:true}}});
  }
  if(!window.BsportWidget && !document.getElementById('bsport-widget-cdn')){
    var s = document.createElement('script'); s.id = 'bsport-widget-cdn'; s.src = CDN; document.head.appendChild(s);
  }
  monter();

  boutons.forEach(function(b){
    b.addEventListener('click', function(e){
      var pack = b.dataset.bsportPack;
      var cible = boutonBsport(pack);
      e.preventDefault();
      if(cible){ cible.click(); return; }
      if(b.getAttribute('aria-busy') === 'true') return;
      /* bsport pas encore prêt : on patiente, puis lien direct en dernier recours */
      b.setAttribute('aria-busy', 'true');
      var debut = Date.now();
      (function attendre(){
        var c = boutonBsport(pack);
        if(c){ b.removeAttribute('aria-busy'); c.click(); return; }
        if(Date.now() - debut > 8000){ b.removeAttribute('aria-busy'); window.location.href = b.href; return; }
        setTimeout(attendre, 150);
      })();
    });
  });
})();
