/* Calendrier bsport : bloc « Pas encore de cours le samedi / dimanche ».
   Affiché SEULEMENT quand le jour choisi dans le widget est un samedi ou un dimanche ET qu'aucun cours n'y est prévu.
   - « Ça m'intéresse » : compte la personne (1 par adresse IP et par jour, API /api/interet-<jour> de serveur.py),
     puis déplie un formulaire « Me prévenir quand les cours du <jour> ouvriront » (e-mail).
   - Le formulaire est en DÉMO : il vérifie l'adresse et affiche un message, sans rien envoyer ni enregistrer
     (à brancher sur l'inscription bsport, ou sur le VPS : voir PASSATION.md).
   Le bloc est écrit dans la page ([data-jour-ferme], caché) ; ce script le place dans le calendrier bsport,
   à la suite des jours (bsport y laisse une zone vide de 800 px de haut), et l'y remet si bsport redessine.
   Le jour courant est posé sur la section (data-jour-ferme="samedi|dimanche") pour le CSS. */
(function(){
  var API = '../api/interet-';               // en ligne : https://api.<domaine>/api/interet-
  var EN = (document.documentElement.lang || 'fr').indexOf('en') === 0;
  var NOMS = EN ? {samedi:'Saturday', dimanche:'Sunday'} : {samedi:'samedi', dimanche:'dimanche'};
  /* Un bouton propre à chaque jour : on peut se dire intéressé par le samedi ET par le dimanche. */
  function texteBouton(j, fait){
    if(EN) return fait ? 'Noted for ' + NOMS[j] + ' ✓' : 'I\'m interested in ' + NOMS[j] + 's';
    return fait ? 'C\'est noté pour le ' + NOMS[j] + ' ✓' : 'Ça m\'intéresse le ' + NOMS[j];
  }

  function jourChoisi(widget){
    var el = widget.querySelector('.bs-week__header__date__weekDay--is-selected');
    var t = el ? (el.textContent || '').trim().toLowerCase() : '';
    if(/^(sam|sat)/.test(t)) return 'samedi';
    if(/^(dim|sun)/.test(t)) return 'dimanche';
    return null;
  }

  function installer(bloc){
    var section = bloc.closest('section') || document.body;
    var widget = section.querySelector('.bsport-widget');
    if(!widget) return;
    var bouton = bloc.querySelector('[data-interet-jour]');
    var form = bloc.querySelector('[data-prevenir]');
    var champ = form && form.querySelector('input[type="email"]');
    var msg = bloc.querySelector('[data-prevenir-msg]');
    var msgInteret = bloc.querySelector('[data-interet-msg]');
    var jour = null;

    function dejaInteresse(j){ try{ return !!localStorage.getItem('interet-' + j); }catch(e){ return false; } }

    function remplir(j){
      bloc.querySelectorAll('[data-jour-nom]').forEach(function(s){ s.textContent = NOMS[j]; });
      var deja = dejaInteresse(j);
      bouton.disabled = deja;
      bouton.textContent = texteBouton(j, deja);
      bouton.dataset.jour = j;
      if(msgInteret) msgInteret.textContent = '';
      form.hidden = !deja;
      if(msg){ msg.textContent = ''; msg.removeAttribute('data-etat'); }
    }

    function verifier(){
      var j = jourChoisi(widget);
      var cal = widget.querySelector('.bs-calendar');
      var charge = !!widget.querySelector('.bs-week__listMode__content__day__date, .bs-calendar--no-offer');
      var vide = widget.querySelectorAll('.bs-offer-list-item').length === 0;
      var afficher = !!(j && cal && charge && vide);
      if(afficher){
        if(bloc.parentNode !== cal) cal.appendChild(bloc);
        if(j !== jour){ jour = j; remplir(j); }
        bloc.hidden = false;
        if(section.dataset.jourFerme !== j) section.dataset.jourFerme = j;
      } else {
        bloc.hidden = true;
        jour = null;
        if(section.dataset.jourFerme) delete section.dataset.jourFerme;
      }
    }

    bouton.addEventListener('click', function(){
      if(!jour || bouton.disabled) return;
      var j = jour;
      bouton.disabled = true;
      fetch(API + j, {method:'POST'})
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .then(function(){
          try{ localStorage.setItem('interet-' + j, '1'); }catch(e){}
          if(jour === j) bouton.textContent = texteBouton(j, true);
          if(jour === j){ form.hidden = false; if(champ) champ.focus(); }
        })
        .catch(function(){
          if(jour === j) bouton.disabled = false;
          if(msgInteret) msgInteret.textContent = EN ? 'Something went wrong, please try again.' : 'Oups, réessayez dans un instant.';
        });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var v = (champ.value || '').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
        msg.dataset.etat = 'erreur';
        msg.textContent = EN ? 'Please enter a valid email address.' : 'Vérifiez votre adresse e-mail.';
        champ.focus();
        return;
      }
      /* DÉMO : rien n'est envoyé ni enregistré. */
      msg.dataset.etat = 'ok';
      msg.textContent = EN
        ? 'Thank you! We\'ll email you as soon as ' + NOMS[jour] + ' classes open.'
        : 'Merci ! On vous écrit dès que les cours du ' + NOMS[jour] + ' ouvrent.';
      champ.value = '';
    });

    var prevu = false;
    new MutationObserver(function(){
      if(prevu) return; prevu = true;
      requestAnimationFrame(function(){ prevu = false; verifier(); });
    }).observe(widget, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class']});
    verifier();
  }

  function demarrer(){ document.querySelectorAll('[data-jour-ferme]').forEach(installer); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})();
