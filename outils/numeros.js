/* Outil interne : affiche le numéro de chaque élément (attribut data-num, ex. P01, T12)
   pour pouvoir désigner précisément ce qu'on veut modifier.
   Un bouton « Numéros » en bas de l'écran les affiche ou les cache (choix mémorisé).
   À RETIRER à la mise en ligne : supprimer ce fichier et la balise <script> qui l'appelle dans chaque page.

   Lettres utilisées :
   S section · C carte · T texte (titre, paragraphe, liste…) · P photo · I icône / logo / illustration
   B bouton · L lien · F formulaire / champ
*/
(function(){
  const CLE='numeros-visibles';
  const COULEURS={S:'#6B4FA0',C:'#1E6FB8',T:'#222222',P:'#C0392B',I:'#B8860B',B:'#1F8A5B',L:'#0E8C8C',F:'#D35400'};

  const css=document.createElement('style');
  css.textContent=`
#num-layer{position:fixed;inset:0;pointer-events:none;z-index:90}
.num-badge{position:fixed;font:600 10px/1 ui-monospace,Menlo,monospace;color:#fff;padding:2px 4px;border-radius:4px;
  box-shadow:0 1px 3px rgba(0,0,0,.35);letter-spacing:.02em;white-space:nowrap;pointer-events:none;opacity:.92}
body:not(.num-on) .num-badge{display:none}
#num-barre{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:100;display:flex;gap:10px;align-items:center}
#num-barre #annot-toggle{position:static!important;transform:none!important;left:auto!important;bottom:auto!important}
#num-toggle{height:50px;padding:0 20px;border-radius:999px;border:0;background:#222;color:#fff;font:600 14.5px Inter,system-ui,sans-serif;
  box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;gap:10px;white-space:nowrap}
#num-toggle .sw{width:34px;height:20px;border-radius:999px;background:#555;position:relative;transition:background .2s}
#num-toggle .sw::after{content:"";position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .2s}
body.num-on #num-toggle .sw{background:#1F8A5B}
body.num-on #num-toggle .sw::after{left:17px}
@media (max-width:520px){#num-barre{gap:6px}#num-toggle{padding:0 14px;font-size:13px}}`;
  document.head.appendChild(css);

  function init(){
    // Barre de boutons : « Numéros » à côté du bouton « Afficher le détourage » s'il existe
    const barre=document.createElement('div'); barre.id='num-barre';
    const bouton=document.createElement('button');
    bouton.id='num-toggle'; bouton.type='button';
    bouton.innerHTML='<span class="sw" aria-hidden="true"></span><span>Numéros</span>';
    const annot=document.getElementById('annot-toggle');
    if(annot){ annot.parentNode.insertBefore(barre,annot); barre.appendChild(annot); }
    else document.body.appendChild(barre);
    barre.appendChild(bouton);

    const calque=document.createElement('div'); calque.id='num-layer'; calque.setAttribute('aria-hidden','true');
    document.body.appendChild(calque);

    let visibles=true;
    try{ visibles=localStorage.getItem(CLE)!=='0'; }catch(e){}
    const appliquer=()=>{
      document.body.classList.toggle('num-on',visibles);
      bouton.setAttribute('aria-pressed',String(visibles));
      if(visibles) placer();
    };
    bouton.addEventListener('click',()=>{
      visibles=!visibles;
      try{ localStorage.setItem(CLE,visibles?'1':'0'); }catch(e){}
      appliquer();
    });

    const badges=new Map();
    function placer(){
      if(!visibles) return;
      const occupes=[];
      document.querySelectorAll('[data-num]').forEach(el=>{
        let b=badges.get(el);
        if(!b){
          b=document.createElement('span'); b.className='num-badge';
          const n=el.dataset.num; b.textContent=n;
          b.style.background=COULEURS[n[0]]||'#444';
          badges.set(el,b);
        }
        // Un élément dans une fenêtre ouverte (<dialog>) : le badge va dans la fenêtre pour rester au-dessus
        const dlg=el.closest('dialog');
        const parent=dlg?(dlg.open?dlg:null):calque;
        const r=el.getBoundingClientRect();
        const cache=!parent||r.width===0&&r.height===0||r.bottom<0||r.top>innerHeight||getComputedStyle(el).visibility==='hidden';
        if(cache){ b.remove(); return; }
        if(b.parentNode!==parent) parent.appendChild(b);
        // Coin haut-gauche, décalé vers le bas si un autre badge occupe déjà la place
        let x=Math.max(2,r.left+2), y=Math.max(2,r.top+2);
        for(let i=0;i<6&&occupes.some(o=>Math.abs(o[0]-x)<30&&Math.abs(o[1]-y)<14);i++) y+=15;
        occupes.push([x,y]);
        b.style.left=x+'px'; b.style.top=y+'px';
      });
    }
    let attente=false;
    const planifier=()=>{ if(attente) return; attente=true; requestAnimationFrame(()=>{attente=false; placer();}); };
    addEventListener('scroll',planifier,{capture:true,passive:true});
    addEventListener('resize',planifier);
    setInterval(planifier,500); // carrousels, menu, popups, animations
    appliquer();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
