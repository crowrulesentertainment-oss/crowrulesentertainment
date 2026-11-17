(function(){
'use strict';
if(window.__CrowRulesCinematicV1)return;
window.__CrowRulesCinematicV1=true;
const body=document.body;if(!body)return;body.classList.add('cr-cinematic');
const root='https://crowrulesentertainment-oss.github.io/crowrulesentertainment/';
const images={
tacoma:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Tacoma_Washington_Aerial%2C_June_2025.jpg/1920px-Tacoma_Washington_Aerial%2C_June_2025.jpg',
raven:'https://images.unsplash.com/photo-1762699780964-4ca097406665?auto=format&fit=crop&w=1600&q=85',
podcast:'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=82',
production:'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=82',
community:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=82',
memorial:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82',
business:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=82',
forest:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=82',
team:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=82',
waterfront:'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=82'
};
const page=(location.pathname.split('/').pop()||'index.html').replace('.html','');
const heroMap={index:images.tacoma,home:images.tacoma,mission:images.raven,values:images.community,vision:images.tacoma,future:images.tacoma,partnerships:images.business,employees:images.team,contact:images.tacoma,membership:images.waterfront};
const hero=body.querySelector('.corporate-hero,main.hero,.hero,.vision-hero,.partner-hero');
if(hero){
 hero.classList.add('cr-cinematic-hero');
 hero.style.setProperty('--cr-hero-image','url("'+(heroMap[page]||images.tacoma)+'")');
 if(!hero.querySelector('.cr-tacoma-note')){
  const note=document.createElement('div');note.className='cr-tacoma-note';note.textContent='Independent entertainment · Tacoma, Washington';
  const first=hero.querySelector('.eyebrow,h1');if(first)hero.insertBefore(note,first);
 }
}
const intro=body.querySelector('.intro');
if(intro){
 intro.style.setProperty('--cr-hero-image','url("'+images.tacoma+'")');intro.classList.add('cr-cinematic-intro');
 const raven=document.createElement('img');raven.className='cr-intro-raven';raven.src=images.raven;raven.alt='A black raven, the signature visual symbol of CrowRules Entertainment';raven.loading='eager';intro.appendChild(raven);
}
document.querySelectorAll('.nav .logo,.navin .logo').forEach(function(logo){
 if(logo.querySelector('.cr-raven-mark'))return;
 const mark=document.createElement('img');mark.className='cr-raven-mark';mark.src=root+'assets/branding/crowrules-raven.svg';mark.alt='';mark.setAttribute('aria-hidden','true');logo.prepend(mark);
});
const cardImageMap=[
 {test:/podcast|audio|creator studio/i,src:images.podcast,alt:'Professional podcast recording studio'},
 {test:/memorial|remember|honor/i,src:images.memorial,alt:'Peaceful natural landscape'},
 {test:/tv|production|studio|film/i,src:images.production,alt:'Professional film and television production'},
 {test:/tacoma|community|hub|local/i,src:images.tacoma,alt:'Aerial view of Tacoma, Washington'},
 {test:/dreamscape|story|imagination/i,src:images.forest,alt:'Pacific Northwest forest landscape'},
 {test:/sports/i,src:images.community,alt:'Community gathering'},
 {test:/yearbook|people|team/i,src:images.team,alt:'Creative team collaborating'},
 {test:/record|music/i,src:images.podcast,alt:'Audio production environment'}
];
function chooseImage(card){
 const text=(card.innerText||card.textContent||'').slice(0,600);
 const found=cardImageMap.find(item=>item.test.test(text));if(found)return found;
 if(card.classList.contains('future-card'))return {src:images.community,alt:'Community gathering'};
 return {src:images.business,alt:'Professional creative workspace'};
}
document.querySelectorAll('article.division-card,article.future-card').forEach(function(card){
 if(card.querySelector('.cr-card-image'))return;
 const picked=chooseImage(card);const img=document.createElement('img');img.className='cr-card-image';img.src=picked.src;img.alt=picked.alt;img.loading='lazy';img.decoding='async';
 const first=card.firstElementChild;if(first)card.insertBefore(img,first);else card.appendChild(img);
});
if(page==='home'){const firstSection=document.querySelector('#latest-videos');if(firstSection)firstSection.setAttribute('data-cr-section','watch');}
if(page==='home'||page==='index'){
 const footer=document.querySelector('footer');
 if(footer&&!footer.querySelector('.cr-photo-credit')){
  const credit=document.createElement('div');credit.className='cr-photo-credit';
  credit.innerHTML='Tacoma aerial: <a href="https://commons.wikimedia.org/wiki/File:Tacoma_Washington_Aerial,_June_2025.jpg" target="_blank" rel="noopener noreferrer">Spicypepper999 / Wikimedia Commons (CC0)</a> · Raven: <a href="https://unsplash.com/photos/a-black-raven-sits-on-a-mossy-branch-TaisLivrQYg" target="_blank" rel="noopener noreferrer">Unsplash</a>';
  footer.appendChild(credit);
 }
}
})();