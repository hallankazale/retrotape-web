const audio=document.querySelector('#audio'),root=document.querySelector('.app');
const $=s=>document.querySelector(s);
const tapes=[
{name:'Demo Vintage',desc:'Áudio de teste · Web Audio',A:[{title:'Retro Oscillator',demo:220,duration:30},{title:'Night Signal',demo:164.81,duration:30}],B:[{title:'Old Radio Tone',demo:130.81,duration:30},{title:'Tape Memories',demo:196,duration:30}]},
{name:'Brasil Vintage',desc:'Estrutura pronta para faixas licenciadas',A:[{title:'Fim de Tarde',demo:261.63,duration:30},{title:'Velho Rádio',demo:293.66,duration:30}],B:[{title:'Amanhecer',demo:329.63,duration:30}]}
];
let tape=null,side='A',index=0,playing=false,ctx=null,osc=null,gain=null,startAt=0,elapsed=0,raf=0;
const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(Math.floor(n%60)).padStart(2,'0');
function current(){return tape?tape[side][index]:null}
function render(){const t=current();$('#side').textContent='SIDE '+side+' · NORMAL POSITION';$('#track').textContent=t?t.title.toUpperCase():'-- ESCOLHA UMA FITA --';$('#time').textContent=t?fmt(elapsed)+' / '+fmt(t.duration):'00:00 / 00:00';$('#playlist').innerHTML='';if(!tape){$('#playlist').innerHTML='<li>Nenhuma fita inserida</li>';return}tape[side].forEach((x,i)=>{let li=document.createElement('li');li.textContent=(i===index?'▶ ':'')+x.title+' · '+fmt(x.duration);if(i===index)li.className='active';$('#playlist').append(li)})}
function insert(t){stop();tape=t;side='A';index=0;elapsed=0;$('#empty').classList.add('hidden');$('#cassette').classList.remove('hidden');$('#label').textContent=t.name;$('#status').textContent='FITA INSERIDA';render()}
function ensureAudio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();gain=ctx.createGain();gain.gain.value=+$('#volume').value;gain.connect(ctx.destination)}}
function play(){if(!current()){ $('#status').textContent='ESCOLHA UMA FITA';return}ensureAudio();ctx.resume();if(osc)osc.stop();osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=current().demo;osc.connect(gain);osc.start();startAt=ctx.currentTime-elapsed;playing=true;root.classList.add('playing');$('#status').textContent='PLAY';loop()}
function loop(){cancelAnimationFrame(raf);if(!playing)return;elapsed=ctx.currentTime-startAt;if(elapsed>=current().duration){next();play();return}$('#vuL').value=35+Math.random()*60;$('#vuR').value=35+Math.random()*60;render();raf=requestAnimationFrame(loop)}
function pause(){if(osc){try{osc.stop()}catch{}osc=null}playing=false;root.classList.remove('playing');cancelAnimationFrame(raf);$('#vuL').value=$('#vuR').value=4;if(tape)$('#status').textContent='PAUSE'}
function stop(){pause();elapsed=0;if(tape)$('#status').textContent='STOP';render()}
function next(){pause();elapsed=0;if(!tape)return;if(index<tape[side].length-1)index++;else{side=side==='A'?'B':'A';index=0}render()}
function prev(){pause();if(!tape)return;if(elapsed>4)elapsed=0;else if(index>0){index--;elapsed=0}render()}
function eject(){stop();tape=null;$('#cassette').classList.add('hidden');$('#empty').classList.remove('hidden');$('#status').textContent='SEM FITA';render()}
tapes.forEach(t=>{let b=document.createElement('button');b.className='tape';b.type='button';b.innerHTML='<b></b><span></span>';b.querySelector('b').textContent='▰ '+t.name;b.querySelector('span').textContent=t.desc;b.onclick=()=>insert(t);$('#library').append(b)});
document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>({play,pause,stop,next,prev,eject,rew:()=>{if(tape){pause();elapsed=Math.max(0,elapsed-10);render()}}}[b.dataset.a]()));
$('#flip').onclick=()=>{if(!tape)return;pause();side=side==='A'?'B':'A';index=0;elapsed=0;render()};
$('#volume').oninput=e=>{if(gain)gain.gain.value=+e.target.value};render();