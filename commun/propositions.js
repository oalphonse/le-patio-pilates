/* Sélecteur de propositions (outil de travail, à retirer à la mise en ligne).
   Une zone = un élément [data-prop="nom-unique"] qui contient :
   - une barre .prop-barre avec des boutons [data-choix="a"], [data-choix="b"]…, [data-choix="site"] ;
   - des éléments [data-prop-pour="a b c"] : visibles seulement pour les choix listés ;
   - des éléments [data-habillage] : reçoivent le choix courant (data-habillage="a"…),
     pour que le CSS habille un widget selon la proposition.
   Le choix est mémorisé par zone (localStorage « prop:<nom> »). Choix par défaut : data-defaut, sinon le 1er bouton.
   À chaque changement, l'événement « prop:change » (detail.choix) est envoyé sur la zone. */
(function(){
  document.querySelectorAll('[data-prop]').forEach(function(zone){
    var nom=zone.dataset.prop, cle='prop:'+nom;
    var boutons=[].slice.call(zone.querySelectorAll('.prop-barre [data-choix]'));
    if(!boutons.length) return;
    function choisir(v){
      zone.querySelectorAll('[data-prop-pour]').forEach(function(el){
        el.hidden=el.dataset.propPour.split(/\s+/).indexOf(v)<0;
      });
      zone.querySelectorAll('[data-habillage]').forEach(function(el){ el.dataset.habillage=v; });
      boutons.forEach(function(b){ b.setAttribute('aria-pressed',String(b.dataset.choix===v)); });
      try{ localStorage.setItem(cle,v); }catch(e){}
      zone.dispatchEvent(new CustomEvent('prop:change',{detail:{choix:v}}));
    }
    boutons.forEach(function(b){ b.addEventListener('click',function(){ choisir(b.dataset.choix); }); });
    var v=null; try{ v=localStorage.getItem(cle); }catch(e){}
    if(!boutons.some(function(b){ return b.dataset.choix===v; })) v=zone.dataset.defaut||boutons[0].dataset.choix;
    choisir(v);
  });
})();
