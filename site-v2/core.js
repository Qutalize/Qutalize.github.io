
const topics=[
['works','Works',"制作・開発","2026年通年の自作ゲームエンジン開発。11月の内容更新に加え、ことばリンクのCodeX開発祭り入賞や、Samether.ioのハッカソン最優秀賞などを紹介しています。",'Marble / Navy & gold'],
['research','Research',"TEEとハードウェアの研究","機密データを守る実行環境を、ソフトウェアとハードウェアの両面から効率化する研究。 現在は処理段階ごとの負荷分析と、HW支援の必要性を検討しています。",'Geometry / Tile study'],
['books','Books',"読書記録","最新の記録はDirectX 12、GPU、Go、SRE、データ指向設計。読書月・返却日を手がかりに、技術書から文学まで56冊をたどれます。",'Paper / Warm grain'],
['about','About',"自己紹介","情報工学を学び、コンピュータアーキテクチャを研究しています。セキュリティ、インフラ、AI、ゲーム制作を横断して、仕組みから体験までつくることが好きです。",'Weave / Indigo study'],
['hobby','Hobby',"趣味・活動","フランスや台湾での海外経験、好きなゲーム、ハッカソンへの参加。研究や制作の外側にある好奇心もまとめています。",'Landscape / Water'],
['links','Links',"外部リンク","GitHubの制作物やAtCoderの参加記録へ。公開している活動の場所をまとめています。",'Geometry / Stone study']];
const app=document.querySelector('#app'),scape=document.querySelector('#scape');let selected=0,busy=false;
const tile='repeating-conic-gradient(from 45deg,#b9ceca 0% 25%,#f2ede1 0% 50%) 0 / 85px 85px';
const backgrounds=[ 'repeating-radial-gradient(ellipse at 8% 120%,#e9eef0 0 25px,#99bfce 29px 49px,#18394e 53px 76px,#b79b59 80px 83px,#f5f4ed 86px 105px)',tile,'repeating-linear-gradient(12deg,#eee3cc 0 2px,#e8ddc5 2px 4px)','repeating-linear-gradient(45deg,#25495888 0 2px,transparent 2px 12px),repeating-linear-gradient(-45deg,#d6e2df 0 3px,#7797a5 3px 12px)','linear-gradient(#18334822,#18334822),url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=85)',tile];
function scene(i){selected=i;scape.style.background=backgrounds[i];if(i===2||i===5){scape.style.backgroundSize='cover';scape.style.backgroundPosition='center'}document.querySelector('#credit').textContent=topics[i][4]+((i===2||i===5)?' · Unsplash / 仮画像':' · CSS / 仮パターン');}
function select(i){scene((i+topics.length)%topics.length);document.querySelectorAll('.topic').forEach((e,j)=>e.setAttribute('aria-pressed',j===selected));const t=topics[selected];const highlight=window.PORTFOLIO_PAGES.homeHighlights?.[t[0]];document.querySelector('#title').textContent=t[1];document.querySelector('#summary').textContent=highlight?.title||t[2];document.querySelector('#description').textContent=highlight?.description||t[3];document.querySelector('#open').href='#collection/'+t[0];document.querySelector('#open').textContent=t[1]+' を探索する ↗';}
function home(){app.innerHTML='<div class="eyebrow">01 / EXPLORE YOUR CURIOSITY</div><h1 id="title"></h1><p class="lead">つくったもの、考えたこと、出会った風景。<br>アイコンをたどって、私の世界へ。</p><nav class="rail" aria-label="テーマを選択">'+topics.map((t,i)=>'<button class="topic" aria-pressed="false" data-topic="'+i+'"><img src="./images/topics/'+t[0]+'.png" alt=""><span>'+t[1]+'</span></button>').join('')+'</nav><p class="sub">左右キー・スワイプで選択 / アイコンをクリックして詳細へ</p><section class="overview"><div><small>SELECTED COLLECTION</small><h2 id="summary"></h2><p id="description"></p><a class="cta" id="open"></a></div><div class="paper"><small>INSIDE THIS COLLECTION</small><p>概要 → 関係性の地図 → 個別の記録</p><p class="sub">次のページでは、丸いアイコンとつながりの線から内容を探せます。</p></div></section>';select(selected);document.querySelectorAll('.topic').forEach((b,i)=>{b.onpointerenter=()=>select(i);b.onfocus=()=>select(i);b.onclick=()=>go('#collection/'+topics[i][0]);});let x=0;const rail=document.querySelector('.rail');rail.addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});rail.addEventListener('touchend',e=>{let d=e.changedTouches[0].clientX-x;if(Math.abs(d)>40)select(selected+(d<0?1:-1))},{passive:true});}


function render(){
 const [type,id]=(location.hash.slice(1)||'home').split('/');
 const isAbout=type==='home'||(type==='collection'&&id==='about');
 document.body.classList.toggle('home-mode',isAbout);
 document.body.classList.toggle('compact-mode',type==='collection'&&['research','hobby','links'].includes(id));
 if(type==='journal')renderJournal(id);else if(isAbout)home();else if(type==='collection')collection(id);else if(type==='detail')detail(id);else if(type==='profile'){renderJournal('about');}else home();
 updateSiteNav();applyTypography();window.scrollTo(0,0);
}
async function go(hash){
 if(busy||location.hash===hash)return;busy=true;
 const overlay=document.querySelector('#transition');
 const animated=!document.body.classList.contains('still')&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{
  if(animated){document.body.classList.add('navigating');overlay.innerHTML='';overlay.classList.add('on');await overlay.animate([{opacity:0},{opacity:1}],{duration:160,easing:'ease-out',fill:'forwards'}).finished;}
  location.hash=hash;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(animated)await overlay.animate([{opacity:1},{opacity:0}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}).finished;
 }finally{overlay.getAnimations().forEach(a=>a.cancel());overlay.classList.remove('on');document.body.classList.remove('navigating');busy=false;}
}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a){if(a.getAttribute('href')==='#app'){e.preventDefault();document.querySelector('#app').focus();return;}e.preventDefault();go(a.getAttribute('href'))}});document.addEventListener('keydown',e=>{if(!e.target.matches('input,textarea,select')&&document.querySelector('.rail')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();select(selected+(e.key==='ArrowRight'?1:-1));document.querySelectorAll('.topic')[selected].scrollIntoView({block:'nearest',inline:'center'});}});window.addEventListener('hashchange',render);

function updateSiteNav(){
 const nav=document.querySelector('#site-nav');
 const [type,id]=(location.hash.slice(1)||'home').split('/');
 const active=type==='home'?'about':type==='journal'?(id==='about'?'about':'hobby'):type==='profile'?'about':type==='detail'?entries.find(e=>e.id===id)?.collection:id;
 nav.innerHTML=topics.map(t=>'<a class="nav-topic" href="#collection/'+t[0]+'"'+(active===t[0]?' aria-current="page"':'')+'><img src="./images/topics/'+t[0]+'.png" alt=""><span>'+t[1]+'</span></a>').join('');
}
