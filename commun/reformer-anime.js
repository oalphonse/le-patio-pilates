/* Reformer animé au défilement (styles : commun/reformer-anime.css).
   Avancement p de 0 à 1 sur la hauteur de la section :
   le Reformer est dessiné d'emblée (plus de tracé progressif), puis 4 étapes égales : 1. le chariot (il glisse et revient) ;
   2. les ressorts (le chariot part plus loin, les ressorts s'étirent) ;
   3. la barre (son inclinaison se règle cran par cran autour du pivot) ;
   4. les sangles (on les tire, le chariot suit).
   Animations réduites : tout est dessiné, rien ne bouge.
   Plusieurs sections .rf possibles dans une page (pièces repérées par data-rf, pas par id). */
(function(){
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  [].forEach.call(document.querySelectorAll('.rf'), installer);
  function installer(sec){
  var svg = sec.querySelector('svg'), scene = sec.querySelector('.rf-scene');
  var chariot = svg.querySelector('[data-rf=chariot]'), ressorts = [].slice.call(svg.querySelectorAll('[data-rf=ressort]'));
  var corde = svg.querySelector('[data-rf=corde]'), poignee = svg.querySelector('[data-rf=poignee]');
  var legendes = [].slice.call(sec.querySelectorAll('.rf-legende, .rf-piece'));
  var bulle = sec.querySelector('.rf-bulle'), barre = sec.querySelector('.rf-barre');
  var X0 = 230, ACCROCHE = 192, POULIE = {x:884, y:118}, CROCHET = {x:884, y:150};
  var barreP = svg.querySelector('[data-rf=barre]'), PIVOT = {x:207, y:243}, BOUT = {x:153, y:140};
  /* rythme : 4 étapes égales (~75 % d'un écran de défilement chacune), après un court temps de repos */
  var DEBUT = .02, N = 4, ETAPE = (1 - DEBUT) / N;
  var NOMS = ['', 'Le chariot', 'Les ressorts', 'La barre', 'Les sangles'];
  /* inclinaisons de la barre (degrés, sens horaire = plus droite) : on passe de cran en cran avec un temps d'arrêt */
  var CRANS = [0, 0, 24, 24, -16, -16, 0, 0];
  function inclinaison(s){ var x = s * (CRANS.length - 1), i = Math.min(CRANS.length - 2, Math.floor(x)); return CRANS[i] + (CRANS[i + 1] - CRANS[i]) * doux(x - i); }

  function borne(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function doux(v){ return v * v * (3 - 2 * v); }

  function ressort(y, x2){                          /* zigzag de ACCROCHE à x2 */
    var n = 16, a = 4, l = x2 - ACCROCHE, d = 'M' + ACCROCHE + ' ' + y + ' h6';
    for(var i = 0; i < n; i++) d += ' L' + (ACCROCHE + 6 + (l - 12) * (i + .5) / n).toFixed(1) + ' ' + (y + (i % 2 ? a : -a));
    return d + ' L' + (x2 - 6).toFixed(1) + ' ' + y + ' h6';
  }

  function dessiner(p){
    var etape = p < DEBUT ? 0 : Math.min(N, 1 + Math.floor((p - DEBUT) / ETAPE));
    var s = etape ? borne((p - DEBUT - ETAPE * (etape - 1)) / (ETAPE * .88)) : 0;    /* petite pause en fin d'étape */
    var aller = Math.sin(Math.PI * doux(s));
    var cx = X0 + [0, 170, 330, 0, 210][etape] * aller;
    var angle = etape === 3 ? inclinaison(s) : 0;
    if(barreP) barreP.setAttribute('transform', 'rotate(' + angle.toFixed(2) + ' ' + PIVOT.x + ' ' + PIVOT.y + ')');
    chariot.setAttribute('transform', 'translate(' + (cx - X0).toFixed(1) + ' 0)');
    ressorts[0].setAttribute('d', ressort(257, cx + 10));
    ressorts[1].setAttribute('d', ressort(271, cx + 10));

    /* sangle : au crochet, sauf à l'étape 4 où la main la tire vers le chariot */
    var t = etape === 4 ? aller : 0;
    var hx = CROCHET.x + (cx + 120 - CROCHET.x) * t, hy = CROCHET.y + (168 - CROCHET.y) * t;
    corde.setAttribute('d', 'M' + POULIE.x + ' ' + POULIE.y + ' L' + hx.toFixed(1) + ' ' + hy.toFixed(1));
    poignee.setAttribute('transform', 'translate(' + (hx - CROCHET.x).toFixed(1) + ' ' + (hy - CROCHET.y).toFixed(1) + ')');

    sec.dataset.etape = etape;
    legendes.forEach(function(l, i){ l.classList.toggle('on', i + 1 === etape); });
    if(barre) barre.style.setProperty('--p', borne((p - DEBUT) / (1 - DEBUT)).toFixed(3));

    /* étiquette au-dessus de la pièce */
    if(etape){
      var a = angle * Math.PI / 180, bx = PIVOT.x + (BOUT.x - PIVOT.x) * Math.cos(a) - (BOUT.y - PIVOT.y) * Math.sin(a),
          by = PIVOT.y + (BOUT.x - PIVOT.x) * Math.sin(a) + (BOUT.y - PIVOT.y) * Math.cos(a);
      var pt = [null, {x:cx + 150, y:200}, {x:(ACCROCHE + cx) / 2 + 5, y:244}, {x:bx, y:by - 18}, {x:hx - 30, y:Math.min(hy, 118) - 14}][etape];
      var m = svg.getScreenCTM(), r = scene.getBoundingClientRect();
      bulle.textContent = NOMS[etape];
      if(m){
        var demi = bulle.offsetWidth / 2 + 4;                 /* jamais coupée au bord de l'écran */
        var x = Math.min(Math.max(m.a * pt.x + m.e - r.left, demi), r.width - demi);
        bulle.style.left = x + 'px';
        bulle.style.top = (m.d * pt.y + m.f - r.top - 8) + 'px';
      }
    }
    bulle.classList.toggle('on', !!etape);
  }

  var attente = false;
  function maj(){
    attente = false;
    var h = document.querySelector('.site-header');
    sec.style.setProperty('--rf-haut', (h ? h.offsetHeight : 0) + 'px');
    if(reduit.matches){ dessiner(0); bulle.classList.remove('on'); return; }
    var r = sec.getBoundingClientRect(), course = sec.offsetHeight - window.innerHeight;
    dessiner(borne(-r.top / (course > 0 ? course : 1)));
  }
  function demander(){ if(!attente){ attente = true; requestAnimationFrame(maj); } }
  window.addEventListener('scroll', demander, {passive:true});
  window.addEventListener('resize', demander);
  maj();
  }
})();
