const weddingDate = new Date('2026-11-21T00:00:00');
const $ = (id) => document.getElementById(id);
const fields = {days:$('days'),hours:$('hours'),minutes:$('minutes'),seconds:$('seconds')};

function updateCountdown(){
  const diff = weddingDate - new Date();
  if(diff <= 0){
    Object.values(fields).forEach(el => el.textContent = '00');
    return;
  }
  fields.days.textContent = String(Math.floor(diff / 86400000)).padStart(2,'0');
  fields.hours.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2,'0');
  fields.minutes.textContent = String(Math.floor(diff / 60000) % 60).padStart(2,'0');
  fields.seconds.textContent = String(Math.floor(diff / 1000) % 60).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

const topbar = $('topbar');
addEventListener('scroll',()=>topbar.classList.toggle('scrolled',scrollY>30));

const menuBtn=$('menuBtn'), nav=$('nav');
menuBtn.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',open);
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const copyButton = $('copyMpesa');
const copyFeedback = $('copyFeedback');
copyButton?.addEventListener('click', async () => {
  const number = copyButton.dataset.number;
  try {
    await navigator.clipboard.writeText(number);
    copyFeedback.textContent = 'Número copiado!';
  } catch {
    copyFeedback.textContent = 'Número: ' + number;
  }
  setTimeout(()=>copyFeedback.textContent='',2500);
});

const lightbox = $('lightbox');
const lightboxImage = $('lightboxImage');
const lightboxClose = $('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.full;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  lightboxImage.src='';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });


// Música romântica em loop.
// Os navegadores podem bloquear autoplay com som; por isso também iniciamos
// automaticamente na primeira interação do visitante.
const romanticMusic = $('romanticMusic');
const musicButton = $('musicButton');
const musicText = $('musicText');
const musicControl = $('musicControl');

function setMusicUI(playing){
  musicControl?.classList.toggle('playing', playing);
  musicButton?.setAttribute('aria-pressed', playing ? 'true' : 'false');
  musicButton?.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
  if(musicText) musicText.textContent = playing ? 'A nossa música' : 'Ouvir a nossa música';
}

async function playRomanticMusic(){
  if(!romanticMusic) return;
  try{
    await romanticMusic.play();
    setMusicUI(true);
  }catch(e){
    setMusicUI(false);
  }
}

function pauseRomanticMusic(){
  if(!romanticMusic) return;
  romanticMusic.pause();
  setMusicUI(false);
}

musicButton?.addEventListener('click', ()=>{
  if(romanticMusic?.paused) playRomanticMusic();
  else pauseRomanticMusic();
});

// Tenta tocar automaticamente. Se o browser bloquear, a primeira interação
// do visitante inicia a música.
playRomanticMusic();
['pointerdown','touchstart','keydown'].forEach(eventName=>{
  window.addEventListener(eventName, ()=>{
    if(romanticMusic?.paused) playRomanticMusic();
  }, {once:true, passive:true});
});
