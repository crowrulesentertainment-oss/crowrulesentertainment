/* CrowRules Entertainment — shared Dreamscapes-inspired navigation */
(function(){
  'use strict';
  if(document.getElementById('cr-shell')) return;
  var here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  var links=[
    ['Home','index.html'],['About','about.html'],['Shows','shows.html'],['Creators','creators.html'],
    ['CrowSpace','crowspace.html'],['Business','business.html'],['Brands','brands.html'],
    ['Awards','awards.html'],['Records','records.html'],['Studios','studios.html'],
    ['Yearbooks','yearbooks.html'],['Membership','membership.html'],['Partners','partners.html'],
    ['Press','press.html'],['Careers','careers.html'],['Contact','contact.html'],['Shop','shop.html']
  ];
  var main=['Home','About','Shows','Creators'];
  var explore=links.filter(function(x){return main.indexOf(x[0])===-1;});
  function make(a){
    var el=document.createElement('a'); el.href=a[1]; el.textContent=a[0];
    if(here===a[1].toLowerCase()) el.className='active';
    return el;
  }
  var shell=document.createElement('div'); shell.id='cr-shell'; shell.className='cr-shell';
  var nav=document.createElement('nav'); nav.className='cr-nav'; nav.setAttribute('aria-label','CrowRules Entertainment primary navigation');
  var brand=document.createElement('a'); brand.className='cr-brand'; brand.href='index.html'; brand.innerHTML='<span class="cr-mark">CR</span><span class="cr-brand-text">CROWRULES ENTERTAINMENT<small>One Company · One Universe</small></span>';
  nav.appendChild(brand);
  var desktop=document.createElement('div'); desktop.className='cr-links';
  links.slice(0,4).forEach(function(a){desktop.appendChild(make(a));});
  var drop=document.createElement('div'); drop.className='cr-drop';
  var btn=document.createElement('button'); btn.type='button'; btn.setAttribute('aria-haspopup','true'); btn.textContent='Explore ▾';
  var menu=document.createElement('div'); menu.className='cr-drop-menu';
  explore.forEach(function(a){menu.appendChild(make(a));}); drop.appendChild(btn); drop.appendChild(menu); desktop.appendChild(drop);
  var join=make(['Join CrowRules','membership.html']); join.className='cr-join'; desktop.appendChild(join);
  nav.appendChild(desktop);
  var toggle=document.createElement('button'); toggle.className='cr-menu'; toggle.type='button'; toggle.setAttribute('aria-label','Open navigation'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='☰'; nav.appendChild(toggle);
  shell.appendChild(nav);
  var mobile=document.createElement('div'); mobile.className='cr-mobile-panel';
  links.forEach(function(a){mobile.appendChild(make(a));});
  mobile.appendChild(make(['Join CrowRules','membership.html'])); shell.appendChild(mobile);
  document.body.insertBefore(shell,document.body.firstChild);
  toggle.addEventListener('click',function(){var open=mobile.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';});
})();
