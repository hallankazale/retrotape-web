const $=s=>document.querySelector(s);let tape=null,side='A',track=0,playing=false,paused=false,elapsed=0,last=0,raf;
const tapes=[['The Classics','Vol. 1'],['Românticas','Para Sempre'],['Rock Anos 80','Viva essa época'],['Sertanejo Raiz','Modão é vida'],['Gospel','Fé que toca'],['Flash Back','Anos Incríveis'],['Internacionais','Mundo da Música']];
const lib=$('#library');lib.innerHTML='';
tapes.forEach((t,i)=>{const b=document.createElement('button');b.className='tape t'+i;b.innerHTML='<b>'+t[0]+'</b><span>'+t[1]+'</span>';b.onclick=()=>insert(i,b);lib.appendChild(b)});
function insert(i,el){stop();tape=i;side='A';track=0;document.querySelectorAll('.tape').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');$('#empty').classList.add('hidden');$('#cassette').classList.remove('hidden');$('#label').textContent=tapes[i][0];$('#nowTape').textContent=tapes[i][0];$('#track').textContent='Lado A · Faixa 1';document.body.classList.add('loaded');render()}
function play(){if(tape===null)return;playing=true;paused=false;last=performance.now();document.body.classList.add('playing');loop()}
function pause(){playing=false;paused=true;document.body.classList.remove('playing');cancelAnimationFrame(raf)}
function stop(){playing=false;paused=false;elapsed=0;document.body.classList.remove('playing');cancelAnimationFrame(raf);render();resetVU()}
function next(){if(tape===null)return;track=(track+1)%6;elapsed=0;$('#track').textContent='Lado '+side+' · Faixa '+(track+1);flash('ff')}
function rewind(){elapsed=Math.max(0,elapsed-10);flash('rew');render()}
function eject(){stop();tape=null;document.body.classList.remove('loaded');$('#cassette').classList.add('hidden');$('#empty').classList.remove('hidden');$('#nowTape').textContent='Nenhuma fita';$('#track').textContent='Escolha uma fita';document.querySelectorAll('.tape').forEach(x=>x.classList.remove('selected'))}
function flip(){if(tape===null)return;side=side==='A'?'B':'A';track=0;elapsed=0;$('#flip').textContent='LADO '+side;$('#side').textContent='SIDE '+side+' · NORMAL POSITION';$('#track').textContent='Lado '+side+' · Faixa 1'}
function loop(now){if(!playing)return;elapsed+=(now-last)/1000;last=now;if(elapsed>=180){elapsed=0;next()}const beat=(Math.sin(now/120)+1)/2;const jitter=Math.random()*.35;$('#needleL').style.transform='rotate('+(-38+(beat+jitter)*58)+'deg)';$('#needleR').style.transform='rotate('+(-38+(beat*.8+Math.random()*.4)*58)+'deg)';render();raf=requestAnimationFrame(loop)}
function resetVU(){if($('#needleL'))$('#needleL').style.transform=$('#needleR').style.transform='rotate(-38deg)'}
function render(){const m=Math.floor(elapsed/60),s=Math.floor(elapsed%60);$('#time').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+' / 03:00';$('#seek').value=Math.min(180,elapsed);$('#counter').textContent=String(Math.floor(elapsed*1.7)).padStart(3,'0').slice(-3)}
function flash(a){const b=document.querySelector('[data-a="'+a+'"]');if(b){b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),180)}}
document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>({play,pause,stop,next,eject,rew:rewind}[b.dataset.a]?.()));
$('#flip').onclick=flip;$('#seek').max=180;$('#seek').oninput=e=>{elapsed=+e.target.value;render()};$('#power').onclick=()=>document.body.classList.toggle('power-on');render();