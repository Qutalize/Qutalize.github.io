// Photo-first overview pages and URL-addressable journals.
const journalKinds=['games','travel','hackathons','events','museums'];
const careerRows=window.PORTFOLIO_PAGES.careerTimeline.map(r=>[r.period,r.title,r.description]);
function careerMarkup(){return '<ol class="career-list">'+careerRows.map(r=>'<li><time>'+esc(r[0])+'</time><div><strong>'+esc(r[1])+'</strong><p>'+esc(r[2])+'</p></div></li>').join('')+'</ol>';}
function awardMarkup(){return '<div class="award-list">'+['samezario','agilex','poster-paper','visual-speech','uecport'].map(id=>entries.find(e=>e.id===id)).filter(Boolean).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).map(e=>'<a href="#detail/'+e.id+'"><time>'+esc(e.date?e.date.replace('-','.'):'時期未登録')+'</time><div><strong>'+esc(({samezario:'最優秀賞',agilex:'Outstanding Design Prize','poster-paper':'ポスター発表','visual-speech':'入賞',uecport:'CRESCO賞'})[e.id]||(e.achievements||[])[0])+'</strong><span>'+esc(e.title.split(' — ')[0])+'</span><small>'+esc(e.id==='visual-speech'?'CodeX開発祭り':e.id==='uecport'?'UPoC':e.id==='samezario'?'Progate Hackathon powered by AWS':e.id==='agilex'?'AgileX Chip Design Contest':'APCCAS26 / 福岡')+'</small></div><b aria-hidden="true">↗</b></a>').join('')+'</div>';}
home=function(){
 graphState=null;document.body.classList.remove('graph-mode');scene(topics.findIndex(t=>t[0]==='about'));
 document.title="Quta's portfolio / About";
 app.innerHTML='<section class="about-editorial"><div class="section-heading"><h1>About</h1></div><div class="bio-hero"><img class="bio-avatar" src="./images/profile/avatar.jpeg" alt="Qutaのアイコン"><div class="bio-copy"><h2>Quta</h2><p>慶應義塾大学理工学部情報工学科4年生（院進予定）。<br><a class="lab-link" href="https://www.acsl.ics.keio.ac.jp/kondo" target="_blank" rel="noopener noreferrer">近藤正章研究室</a>に所属し、コンピュータアーキテクチャを研究しています。</p><p class="bio-secondary">富山出身。セキュリティ・インフラ・AI・ゲーム制作・グラフィックス表現の研究・学習に取り組んでいます。</p><a href="#journal/about">プロフィール・資格を読む ↗</a></div><img class="bio-photo" src="./images/about/fugaku-visit-mosaic.png" alt="富岳見学時の写真（顔は加工済み）"></div><div class="bio-columns"><section class="bio-panel"><div class="panel-heading"><h2>経歴</h2><a href="#journal/about">すべて読む ↗</a></div>'+careerMarkup()+'</section><section class="bio-panel"><div class="panel-heading"><h2>制作・研究の実績</h2><a href="#collection/works">Works ↗</a></div>'+awardMarkup()+'</section></div></section>';
};
const originalRenderPage=renderPage;
renderPage=function(id){
 if(id!=='hobby')return originalRenderPage(id);
 const hobbies=window.PORTFOLIO_PAGES.hobbies;
 const covers=[hobbies[0].image,hobbies[1].image,'./records/works/samezario/award-mosaic.png',hobbies[3].image];
 const summaries=['RPGとアクション。プレイの記録。','フランス留学、台湾での街歩きと食。','チームでつくった作品と、会場の記録。','ゲーム展示、技術イベント、交流の記録。'];
 app.innerHTML='<section class="hobby-editorial"><div class="section-heading"><h1>Hobby</h1></div><div class="album-grid">'+hobbies.map((h,i)=>'<a class="album-card" href="#journal/'+journalKinds[i]+'"><div class="album-image"><img src="'+esc(covers[i]||h.image)+'" alt="'+esc(h.title)+'"></div><div class="album-copy"><h2>'+esc(h.title)+'<span aria-hidden="true">↗</span></h2><p>'+esc(summaries[i]||h.cardSummary)+'</p></div></a>').join('')+'</div></section>';
};
function journalGroups(item){
 const grouped=new Map();
 (item.photos||[]).forEach(photo=>{const group=photo.group||item.title;if(!grouped.has(group))grouped.set(group,{title:group,date:photo.date||'',dateLabel:photo.dateLabel||'',photos:[]});grouped.get(group).photos.push(photo);});
 const dates=window.PORTFOLIO_PAGES.albumDates||{};
 return [...grouped.values()].map(g=>({...g,date:g.date||dates[g.title]||''})).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
}
function renderJournal(id){
 document.body.classList.remove('home-mode','compact-mode','graph-mode');graphState=null;
 const isAbout=id==='about';scene(topics.findIndex(t=>t[0]===(isAbout?'about':'hobby')));
 if(isAbout){app.innerHTML='<a class="journal-back" href="#home">← About</a><div class="section-heading"><h1>プロフィール・活動記録</h1></div><div class="biography-page"><section class="bio-panel"><h2>プロフィール</h2>'+window.PORTFOLIO_PAGES.aboutDetails[0].paragraphs.map(t=>'<p>'+esc(t)+'</p>').join('')+'</section><section class="bio-panel"><h2>経歴</h2>'+careerMarkup()+'<p>フランス語サークルの学生代表を1年間務めました。</p></section><section class="bio-panel"><h2>制作・研究の実績</h2>'+awardMarkup()+'</section><section class="bio-panel"><h2>資格・学習</h2>'+window.PORTFOLIO_PAGES.aboutDetails[3].paragraphs.map(t=>'<p>'+esc(t)+'</p>').join('')+'</section></div>';}
 else {
 const index=journalKinds.indexOf(id);if(index<0){collection('hobby');return;}
 const item=window.PORTFOLIO_PAGES.hobbies[index];let groups=journalGroups(item);
 if(id==='hackathons')groups=window.PORTFOLIO_PAGES.hackathonAlbums.map(album=>{const key=album.recordId,e=entries.find(e=>e.id===key);return {title:album.title,date:album.date||'',dateLabel:album.dateLabel||'',href:e?'#detail/'+key:'',photos:album.photos||(e?.photos||[]).map(p=>({src:'./records/works/'+key+'/'+p.file,caption:p.caption}))};}).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 app.innerHTML='<a class="journal-back" href="#collection/hobby">← Hobby</a><div class="section-heading"><h1>'+esc(item.title)+'</h1></div><p class="journal-intro">'+esc(item.cardSummary||item.description)+'</p><div class="photo-journal">'+groups.map(g=>'<section class="journal-entry"><div class="journal-heading">'+(id==='games'?'':'<time'+(g.date?' datetime="'+esc(g.date)+'"':'')+'>'+esc(g.dateLabel||(g.date?g.date.replace(/-/g,'.'):'日付未登録'))+'</time>')+'<h2>'+esc(g.title)+'</h2>'+(g.href?'<a href="'+g.href+'">作品の詳細 ↗</a>':'')+'</div><div class="journal-photos">'+g.photos.map(p=>'<figure><a href="'+esc(safeUrl(p.src))+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(safeUrl(p.src))+'" alt="'+esc(p.caption)+'" loading="lazy"></a><figcaption>'+esc(p.caption)+'</figcaption></figure>').join('')+'</div></section>').join('')+'</div>';
 }
 document.title="Quta's portfolio / "+(isAbout?'プロフィール':window.PORTFOLIO_PAGES.hobbies[journalKinds.indexOf(id)].title);
}
try{validateContent(entries);render();}catch(error){app.textContent=error.message;}
