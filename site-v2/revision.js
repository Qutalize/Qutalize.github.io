
function meaningfulRecordText(value){return typeof value==='string'&&value.trim()&&!/^(まとめ作成中|読書中|準備中|追記予定|感想・学んだことは後から追記します。)$/.test(value.trim());}
function hasRecordDetail(e){return e.collection!=='books'||[e.summary,e.review,...Object.values(e.outline||{}).flat(),...(e.article?.sections||[]).flatMap(s=>s.paragraphs||[])].some(meaningfulRecordText);}
function recordLink(e){return hasRecordDetail(e)?'<a href="#detail/'+e.id+'">'+esc(e.title)+'</a>':'<span class="record-no-detail">'+esc(e.title)+'</span>';}
/* Advanced direction mock — read-only content browser. */
const aboutIndex=topics.findIndex(t=>t[0]==='about');topics.unshift(topics.splice(aboutIndex,1)[0]);backgrounds.unshift(backgrounds.splice(aboutIndex,1)[0]);
const entries=(window.PORTFOLIO_CONTENT||[]).filter(e=>e.hidden!==true);
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeUrl(v){return typeof v==='string'&&/^(https?:\/\/|\.\.?\/)/i.test(v)&&!/[<>"'\\\s]/.test(v)?v:'';}
function edgesFor(items){const edges=[];items.forEach((a,i)=>items.slice(i+1).forEach(b=>{const tags=[...new Set(a.tags)].filter(t=>b.tags.includes(t));const explicit=(a.links||[]).includes(b.id)||(b.links||[]).includes(a.id);if(tags.length||explicit)edges.push({from:a.id,to:b.id,tags,explicit});}));return edges;}
function validateContent(data){const ids=new Set();if(!Array.isArray(data))throw Error('配列が必要です');for(const e of data){if(!e||!/^[-\w]+$/.test(e.id)||ids.has(e.id)||!['works','books','gallery'].includes(e.collection)||typeof e.title!=='string'||typeof e.description!=='string'||!Array.isArray(e.tags)||e.tags.some(t=>typeof t!=='string')||(e.links&&!Array.isArray(e.links)))throw Error('content.js の項目形式・idを確認してください');ids.add(e.id);}for(const e of data)for(const id of e.links||[])if(!ids.has(id))throw Error('linksの参照先がありません: '+id);return data;}
let graphState=null;
scene=function(i){selected=i;scape.style.background=backgrounds[i];const photo=['gallery','hobby'].includes(topics[i][0]);if(photo){scape.style.backgroundSize='cover';scape.style.backgroundPosition='center'}document.querySelector('#credit').textContent=topics[i][4]+(photo?' · Unsplash / 仮画像':' · Pattern study');};
function pagePicks(id){
 if(id==='works'||id==='books')return entries.filter(e=>e.collection===id).sort(compareRecordDates).slice(0,3).map(e=>({title:e.title,description:(e.achievements?.length?e.achievements.join(' / ')+'。':'')+e.description,href:hasRecordDetail(e)?'#detail/'+e.id:'',image:e.image,imageType:e.imageType}));
 return window.PORTFOLIO_PAGES.pagePicks[id]||[];
}
function picksMarkup(id,limit=3){
 return '<div class="pick-list">'+pagePicks(id).slice(0,limit).map(p=>{
 const linked=entries.find(e=>p.href==='#detail/'+e.id);
 const image=safeUrl(p.image||linked?.image||'./images/topics/'+id+'.png');
 const type=p.imageType||linked?.imageType||'pictogram';
 const media='<img class="pick-image pick-image-'+esc(type)+'" src="'+esc(image)+'" alt="" loading="lazy">';
 return '<article class="pick pick-with-image">'+media+'<div class="pick-copy"><h3>'+(p.href?'<a href="'+esc(p.href)+'">'+esc(p.title)+'</a>':esc(p.title))+'</h3><p>'+esc(p.description)+'</p></div></article>';
 }).join('')+'</div>';
}

home=function(){
 graphState=null;document.body.classList.remove('graph-mode');scene(topics.findIndex(t=>t[0]==='about'));document.title="Quta's portfolio / About";
 const sections=window.PORTFOLIO_PAGES.aboutDetails;
 app.innerHTML='<section class="about-dashboard" aria-label="Aboutの詳細"><header class="about-header"><h1>About</h1><img class="about-avatar" src="./images/profile/avatar.jpeg" alt="Qutaのアイコン"></header><div class="about-body"><figure class="about-fugaku"><a href="./images/about/fugaku-visit-mosaic.png" target="_blank" rel="noopener noreferrer"><img src="./images/about/fugaku-visit-mosaic.png" alt="研究室での富岳見学・顔はモザイク加工済み"></a><figcaption>研究室でスーパーコンピュータ「富岳」を見学</figcaption></figure><div class="about-card-grid">'+sections.map((section,i)=>'<article class="about-info-card"><div class="about-card-heading">'+'<h2>'+esc(section.title)+'</h2></div><ul>'+section.highlights.map(line=>'<li>'+esc(line)+'</li>').join('')+'</ul><button class="about-read" data-about-read="'+i+'">詳しく読む ↗</button></article>').join('')+'</div></div></section><dialog class="quarter-dialog about-dialog"><form method="dialog"><button aria-label="閉じる">閉じる ×</button></form><h2></h2><div></div></dialog>';
 const dialog=app.querySelector('dialog');app.querySelectorAll('[data-about-read]').forEach((button,i)=>button.onclick=()=>{dialog.querySelector('h2').textContent=sections[i].title;dialog.querySelector('div').innerHTML=(sections[i].photo?'<figure class="about-activity-photo"><a href="'+esc(safeUrl(sections[i].photo.src))+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(safeUrl(sections[i].photo.src))+'" alt="'+esc(sections[i].photo.caption)+'"></a><figcaption>'+esc(sections[i].photo.caption)+'</figcaption></figure>':'')+sections[i].paragraphs.map(t=>'<p>'+esc(t)+'</p>').join('')+(sections[i].links||[]).map(l=>'<p><a href="'+esc(l.href)+'">'+esc(l.title)+' ↗</a></p>').join('');dialog.querySelectorAll('a[href^="#"]').forEach(a=>a.onclick=()=>dialog.close());dialog.showModal();});
};
collection=function(id){const i=topics.findIndex(t=>t[0]===id);if(i<0){home();return}scene(i);document.title="Quta's portfolio / "+topics[i][1];document.body.classList.toggle('graph-mode',['works','books','gallery'].includes(id));if(!['works','books','gallery'].includes(id)){graphState=null;renderPage(id);return;}
 if(id==='gallery'&&!entries.some(e=>e.collection==='gallery')){graphState=null;renderPage('gallery');return;}
 graphState={category:id,view:'cards',query:'',tag:'',sort:'date',all:false,scale:1,panX:0,panY:0,pos:{},items:[],edges:[]};
 app.innerHTML='<div class="graphbar"><div><small>KNOWLEDGE CONSTELLATION</small><h1>'+topics[i][1]+'</h1></div><div class="status"><i></i> LOCAL ARCHIVE</div></div><div class="toolbar"><input id="search" type="search" placeholder="タイトル・著者・ISBN・タグを検索" aria-label="記録を検索"><select id="tags" aria-label="タグで絞る"><option value="">すべてのタグ</option>'+[...new Set(entries.flatMap(e=>e.tags))].map(t=>'<option>'+esc(t)+'</option>').join('')+'</select><select id="sort" aria-label="記録の並び順"><option value="date">'+(id==='books'?'読書・返却日の新しい順':'新しい記録順')+'</option><option value="title">タイトル順</option></select><label><input id="all" type="checkbox"> 全分野</label></div><div class="view-switch" role="group" aria-label="表示形式"><button type="button" data-view="cards" aria-pressed="true">カード表示</button><button type="button" data-view="graph" aria-pressed="false">グラフ表示</button><span id="card-count" role="status"></span></div><div id="cards" class="record-cards" aria-label="記録のカード一覧"></div><nav id="cluster-nav" aria-label="分類を拡大表示"></nav><div class="workspace"><section class="graph" aria-label="関連グラフ"><div class="orbit o1"></div><div class="orbit o2"></div><div class="orbit o3"></div><div id="viewport"><div id="clusters" aria-hidden="true"></div><svg id="connections" aria-hidden="true"></svg><div id="nodes"></div></div><div class="graph-top"><span>Q / ATLAS</span><span id="count" role="status"></span></div><div class="graph-bottom"><span>ドラッグで移動 · ホイールで拡縮</span><div><button id="minus" aria-label="縮小">−</button><span id="zoom">100%</span><button id="plus" aria-label="拡大">＋</button><button id="reset">全体表示</button></div></div></section></div><div id="results" class="result-list" aria-label="記録一覧"></div>';
 document.querySelector('#search').oninput=e=>{graphState.query=e.target.value;buildGraph()};document.querySelector('#tags').onchange=e=>{graphState.tag=e.target.value;buildGraph()};document.querySelector('#sort').onchange=e=>{graphState.sort=e.target.value;buildGraph()};document.querySelector('#all').onchange=e=>{graphState.all=e.target.checked;buildGraph()};document.querySelector('#plus').onclick=()=>zoomBy(1.2);document.querySelector('#minus').onclick=()=>zoomBy(1/1.2);document.querySelector('#reset').onclick=()=>{graphState.panX=graphState.panY=0;fit()};
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setCollectionView(b.dataset.view));
 const graph=document.querySelector('.graph');let drag=null;
 graph.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,.star')||e.button!==0)return;drag={x:e.clientX,y:e.clientY,px:graphState.panX,py:graphState.panY};graph.setPointerCapture(e.pointerId)});
 graph.addEventListener('pointermove',e=>{if(drag){graphState.panX=drag.px+e.clientX-drag.x;graphState.panY=drag.py+e.clientY-drag.y;transformGraph()}});graph.addEventListener('pointerup',()=>drag=null);graph.addEventListener('pointercancel',()=>drag=null);graph.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY<0?1.08:1/1.08)},{passive:false});buildGraph();setCollectionView('cards');
};
function buildGraph(){const s=graphState;if(!s)return;
 s.items=entries.filter(e=>(s.all||e.collection===s.category)&&(!s.tag||e.tags.includes(s.tag))&&(!s.query||(e.title+' '+(e.author||'')+' '+(e.isbn||'')+' '+e.description+' '+e.tags.join(' ')).toLowerCase().includes(s.query.toLowerCase())));s.items.sort((a,b)=>s.sort==='title'?a.title.localeCompare(b.title,'ja'):compareRecordDates(a,b));s.edges=edgesFor(s.items);s.pos={};const n=s.items.length;
 renderCards(s.items);
 const layout=clusterLayout(s.items);s.groups=layout.groups;s.pos=layout.pos;s.canvasW=layout.width;s.canvasH=layout.height;
 document.querySelector('#cluster-nav').innerHTML='<span>分類を拡大</span>'+layout.groups.map((g,i)=>'<button data-group="'+i+'" style="--cluster-color:'+g.color+'">'+esc(g.name)+' <small>'+g.items.length+'</small></button>').join('');
 document.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>focusCluster(Number(b.dataset.group)));
 document.querySelector('#clusters').innerHTML=layout.groups.map(g=>'<div class="graph-cluster" style="left:'+g.x+'px;top:'+g.y+'px;width:'+g.width+'px;height:'+g.height+'px;--cluster-color:'+g.color+'"><span>'+esc(g.name)+' <small>'+g.items.length+'</small></span></div>').join('');
 document.querySelector('#viewport').style.width=s.canvasW+'px';document.querySelector('#viewport').style.height=s.canvasH+'px';document.querySelector('#connections').style.width=s.canvasW+'px';document.querySelector('#connections').style.height=s.canvasH+'px';

 document.querySelector('#connections').setAttribute('viewBox','0 0 '+s.canvasW+' '+s.canvasH);document.querySelector('#connections').innerHTML=s.edges.map(e=>{let a=s.pos[e.from],b=s.pos[e.to];return '<line data-from="'+e.from+'" data-to="'+e.to+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" class="'+(e.explicit?'explicit':'')+'"><title>'+esc(e.explicit?'明示した関連':e.tags.join(' / '))+'</title></line>'}).join('');
 document.querySelector('#nodes').innerHTML=s.items.map((e,i)=>'<'+(hasRecordDetail(e)?'a':'span')+' class="star" '+(hasRecordDetail(e)?'href="#detail/'+e.id+'"':'tabindex="0"')+' data-id="'+e.id+'" style="left:'+s.pos[e.id].x+'px;top:'+s.pos[e.id].y+'px;--accent:'+layout.colors[e.id]+'" aria-label="'+esc(e.title)+(hasRecordDetail(e)?'の解説ページへ':'')+'"><span class="star-ring"></span>'+recordMedia(e,'node')+'<span class="star-title">'+esc(e.title)+'</span></'+(hasRecordDetail(e)?'a':'span')+'>').join('');document.querySelector('#count').textContent=n+' RECORDS / '+s.edges.length+' LINKS';document.querySelector('#results').innerHTML=n?s.items.map(recordLink).join(''):'該当する記録がありません。検索やタグを変更してください。';s.panX=s.panY=0;fit();document.querySelectorAll('.star').forEach(a=>{a.onpointerenter=a.onfocus=()=>highlightConnections(a.dataset.id);a.onpointerleave=a.onblur=()=>highlightConnections(null)});}
function highlightConnections(id){document.querySelectorAll('#connections line').forEach(l=>l.classList.toggle('active',l.dataset.from===id||l.dataset.to===id));}
function transformGraph(){if(!graphState)return;const s=graphState;document.querySelector('#viewport').style.transform='translate(calc(-50% + '+s.panX+'px),calc(-50% + '+s.panY+'px)) scale('+s.scale+')';document.querySelector('#zoom').textContent=Math.round(s.scale*100)+'%';}
function zoomBy(f){if(!graphState)return;graphState.scale=Math.max(.1,Math.min(2.5,graphState.scale*f));transformGraph();}
function fit(){if(!graphState||graphState.view==='cards')return;const g=document.querySelector('.graph');graphState.scale=Math.max(.1,Math.min((g.clientWidth-40)/(graphState.canvasW||800),(g.clientHeight-64)/(graphState.canvasH||560),1));transformGraph();}
window.addEventListener('resize',fit);
detail=function(id){const e=entries.find(e=>e.id===id);if(!e){home();return}if(!hasRecordDetail(e)){history.replaceState(null,'','#collection/books');collection('books');return}graphState=null;document.body.classList.remove('graph-mode');scene(topics.findIndex(t=>t[0]===e.collection));document.title="Quta's portfolio / "+e.title;app.innerHTML='<a class="back" href="#collection/'+e.collection+'">← '+e.collection.toUpperCase()+'</a><h1>'+esc(e.title)+'</h1>'+publicSiteAction(e)+'<section class="paper record-detail" style="--genre-color:'+genreColor(e)+'">'+recordMedia(e,'detail')+'<p class="record-meta">'+esc([e.meta,e.author].filter(Boolean).join(' / '))+'</p><p>'+esc(e.description)+'</p><div>'+e.tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join('')+'</div>'+recordExtra(e)+(safeUrl(e.url)&&!e.publicUrl?'<a class="cta" target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(e.url))+'">'+esc(e.urlLabel||(e.collection==='books'?'書誌情報を読む':'資料・リポジトリを読む'))+' ↗</a>':'')+(safeUrl(e.repositoryUrl)&&e.repositoryUrl!==e.url?'<p><a target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(e.repositoryUrl))+'">GitHubのコードを見る ↗</a></p>':'')+'</section>'+relatedRecords(e);};
// Reuse the existing short transition; enhance its artwork in CSS.
// Initial rendering is performed by editorial.js after all page renderers are ready.

function renderPage(id){document.body.classList.remove('graph-mode');const p=window.PORTFOLIO_PAGES;let body='';
 if(id==='links'){
  app.innerHTML='<section class="compact-page links-page"><div class="compact-heading paper"><h1>Links</h1></div><div class="quarter-grid links-grid">'+p.links.map(l=>'<a class="quarter-card paper external'+(l.image?' link-with-preview':' link-text-only')+'" href="'+esc(safeUrl(l.url))+'" target="_blank" rel="noopener noreferrer"><div class="link-card-heading"><h2>'+esc(l.title)+'</h2><span class="link-arrow" aria-hidden="true">↗</span></div>'+(l.image?'<div class="link-preview"><img src="'+esc(safeUrl(l.image))+'" alt="'+esc(l.imageAlt||l.title+'のプロフィール')+'" decoding="async"></div>':'')+'<div class="link-card-copy"><p>'+esc(l.description)+'</p><span class="external-action">プロフィールを見る ↗</span></div></a>').join('')+'</div></section>';return;
 }
 if(['research','hobby'].includes(id)){
  const items=id==='research'?p.research.sections:p.hobbies;
  app.innerHTML='<section class="compact-page"><div class="compact-heading paper"><h1>'+ (id==='research'?'Research':'Hobby')+'</h1>'+(id==='research'?'<span>'+esc(p.research.title)+' · '+esc(p.research.updatedAt)+'</span>':'')+'</div><div class="quarter-grid">'+items.map((item,i)=>'<article class="quarter-card paper'+(item.photos?.length?' quarter-with-photo':'')+'"><h2>'+esc(item.title)+'</h2>'+(item.image?'<img class="hobby-cover" src="'+esc(safeUrl(item.image))+'" alt="'+esc(item.title)+'の写真">':'')+'<p class="quarter-full">'+esc(item.text||item.description)+'</p><p class="quarter-summary">'+esc(item.cardSummary||item.text||item.description)+'</p><div class="quarter-actions"><button type="button" class="quarter-read" data-read="'+i+'">'+(item.photos?.length?'写真を見る（'+item.photos.length+'枚）':'全文を読む')+' ↗</button>'+(item.href?'<a href="'+esc(item.href)+'">Works ↗</a>':'')+'</div></article>').join('')+'</div></section><dialog class="quarter-dialog"><form method="dialog"><button aria-label="閉じる">閉じる ×</button></form><h2></h2><p></p><label class="photo-group-control" hidden>旅行先・イベント <select aria-label="旅行先・イベントを選択"></select></label><div class="hobby-photo-gallery"></div></dialog>';
  const dialog=app.querySelector('dialog');app.querySelectorAll('[data-read]').forEach((button,i)=>button.onclick=()=>{
   const item=items[i],photos=item.photos||[],control=dialog.querySelector('.photo-group-control'),select=control.querySelector('select');
   dialog.querySelector('h2').textContent=item.title;dialog.querySelector('p').textContent=item.text||item.description;
   const groups=[...new Set(photos.map(photo=>photo.group||item.title))];control.hidden=!photos.length;
   const groupLabel=item.title==='ゲーム'?'ゲームタイトル':'旅行先・イベント';control.firstChild.textContent=groupLabel+' ';select.setAttribute('aria-label',groupLabel+'を選択');
   select.innerHTML=groups.map(group=>'<option>'+esc(group)+'</option>').join('');
   const showPhotos=()=>{dialog.querySelector('.hobby-photo-gallery').innerHTML=photos.filter(photo=>(photo.group||item.title)===select.value&&safeUrl(photo.src)).map(photo=>'<figure><a href="'+esc(safeUrl(photo.src))+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(safeUrl(photo.src))+'" alt="'+esc(photo.caption)+'" loading="lazy"></a><figcaption>'+esc(photo.caption)+'</figcaption></figure>').join('');};
   select.onchange=showPhotos;showPhotos();dialog.showModal();});return;
 }

 if(id==='about')body='<div class="profile-grid"><article class="paper">'+p.aboutHtml+'<p class="record-meta">プロフィール・資格は元サイト掲載時点の記録です。</p></article><aside class="profile-art"><img src="./images/profile/avatar.jpeg" alt="Qutaのプロフィール画像"><small>QUTA / PERSONAL ARCHIVE</small></aside></div>';
 if(id==='hobby')body='<div class="story-grid">'+p.hobbies.map((h,i)=>'<article class="paper"><small>INTEREST / 0'+(i+1)+'</small><h2>'+esc(h.title)+'</h2><p>'+esc(h.description)+'</p>'+(h.href?'<a class="cta" href="'+esc(h.href)+'">作品を見る ↗</a>':'')+'</article>').join('')+'</div>';
 if(id==='research')body='<article class="paper research-story"><small>RESEARCH IN PROGRESS · '+esc(p.research.updatedAt)+'</small><h2>'+esc(p.research.title)+'</h2><p>'+esc(p.research.summary)+'</p>'+p.research.sections.map(s=>'<section><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p></section>').join('')+'</article>';
 if(id==='gallery')body='<article class="paper empty-gallery"><div class="empty-orbit" aria-hidden="true">◎</div><small>PICTURE ARCHIVE</small><h2>風景の記録は、これから。</h2><p>掲載する写真は準備中です。フランス留学と台湾旅行の記録はHobbyで紹介しています。</p><a class="cta" href="#collection/hobby">旅の記録を読む ↗</a></article>';
 app.innerHTML='<div class="eyebrow">PERSONAL ARCHIVE</div><h1>'+topics.find(t=>t[0]===id)[1]+'</h1>'+body;
}


function recordMedia(e,size){
 const type=e.imageType||'pictogram';
 const url=safeUrl(e.image);
 const title=esc(e.title);
 const cls='record-media media-'+type+' media-'+size+(e.imageFit==='contain'?' media-contain':'');
 if(e.video&&size==='card'&&/^[-\w]+\.mp4$/.test(e.video)){
  const video='./records/'+e.collection+'/'+e.id+'/'+e.video;
  return '<span class="'+cls+'"><video class="loop-preview" muted loop playsinline preload="none" poster="'+esc(url)+'" src="'+esc(video)+'" aria-label="'+title+'の動画プレビュー"></video></span>';
 }
 if(!url)return '<span class="'+cls+' media-placeholder"><span class="media-title">'+title+'</span></span>';
 const alt=size==='node'?'':title+(type==='cover'?'の表紙':'の画像');
 return '<span class="'+cls+'" data-media-title="'+title+'"><img src="'+esc(url)+'" alt="'+alt+'"></span>';
}
document.addEventListener('error',function(event){
 const img=event.target,box=img.parentElement;
 if(img.tagName!=='IMG'||!box?.classList.contains('record-media'))return;
 const title=document.createElement('span');
 title.className='media-title';
 title.textContent=box.dataset.mediaTitle;
 box.classList.add('media-placeholder');
 img.replaceWith(title);
},true);

function recordExtra(e){let html=(e.collection==="works"?achievementMarkup(e)+recordDateLabel(e)+classificationMarkup(e):"")+recordVideos(e)+recordPhotos(e)+renderArticle(e);if(e.collection==="books"){const rows=[["読書月",e.readDate],["返却日",e.returnDate],["出版社",e.publisher],["刊行",e.publicationDate],["版・巻号",e.issue||e.edition],["ISBN",e.isbn]].filter(r=>r[1]);html+='<dl class="bibliography">'+rows.map(([k,v])=>"<dt>"+esc(k)+"</dt><dd>"+esc(v)+"</dd>").join("")+"</dl>";if(e.editionNote)html+='<p class="record-meta">'+esc(e.editionNote)+"</p>";if(safeUrl(e.coverSource))html+='<p class="record-meta">'+esc(e.coverNote||"書影")+' · <a target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(e.coverSource))+'">出典を見る ↗</a></p>';}const o=e.outline||{};for(const [key,label]of [["purpose","背景・目的"],["role","担当したこと"],["highlights","工夫したこと"],["results","結果・学び"],["nextSteps","今後の展開"]]){const raw=o[key];const v=e.collection==="books"?(Array.isArray(raw)?raw.filter(meaningfulRecordText):meaningfulRecordText(raw)?raw:""):raw;if(Array.isArray(v)&&v.length)html+="<h2>"+label+"</h2><ul>"+v.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";else if(typeof v==="string"&&v.trim())html+="<h2>"+label+"</h2><p>"+esc(v)+"</p>";}return html;}

function relatedRecords(e){const links=edgesFor(entries).filter(l=>l.from===e.id||l.to===e.id);if(!links.length)return "";return '<section class="paper detail-related"><h2>関連する記録</h2><div class="result-list">'+links.map(l=>{const target=entries.find(x=>x.id===(l.from===e.id?l.to:l.from));return recordLink(target)}).join("")+"</div></section>";}

function focusCluster(index){const s=graphState,g=s?.groups[index];if(!g)return;const box=document.querySelector(".graph");s.scale=Math.max(.1,Math.min((box.clientWidth-40)/g.width,(box.clientHeight-64)/g.height,1.4));s.panX=(s.canvasW/2-g.x-g.width/2)*s.scale;s.panY=(s.canvasH/2-g.y-g.height/2)*s.scale;transformGraph();}

// Both views share filters and detail routes; each collection opens as cards.
function renderCards(items){
 document.querySelector('#card-count').textContent=items.length+' 件';
 const cards=document.querySelector('#cards');
 cards.dataset.collection=items[0]?.collection||'';
 cards.innerHTML=items.length?items.map(e=>{
 const linked=hasRecordDetail(e),tag=linked?'a':'article';
 return '<'+tag+' class="record-card" style="--genre-color:'+genreColor(e)+'"'+(linked?' href="#detail/'+e.id+'"':'')+'>'+recordMedia(e,'card')+'<div class="card-copy"><h2>'+esc(e.title)+'</h2>'+achievementMarkup(e)+recordDateLabel(e)+(e.author?'<p>'+esc(e.author)+'</p>':'')+(meaningfulRecordText(e.description)?'<p class="card-description">'+esc(e.description)+'</p>':'')+classificationMarkup(e,false)+(linked?'<span class="card-open">詳しく見る ↗</span>':'')+'</div></'+tag+'>';
 }).join(''):'<p class="paper">該当する記録がありません。検索やタグを変更してください。</p>';
 observePreviews();applyCardTypography();
}
function achievementMarkup(e){return (e.achievements||[]).length?'<ul class="card-achievements">'+e.achievements.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul>':'';}
function classificationMarkup(e,showFields=true){if(e.collection!=='works')return '<div class="card-tags">'+e.tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join('')+'</div>';return '<dl class="card-facts">'+(showFields?'<dt>分野</dt><dd>'+esc((e.fields||[]).join(' / ')||'追記予定')+'</dd>':'')+'<dt>技術</dt><dd>'+esc((e.techStack||[]).join(' / ')||'追記予定')+'</dd></dl>';}

function setCollectionView(view){
 if(!graphState)return;
 graphState.view=view;
 const cards=view==='cards';
 document.querySelector('#cards').hidden=!cards;
 for(const selector of ['#cluster-nav','.workspace','#results'])document.querySelector(selector).hidden=cards;
 document.querySelector('#card-count').hidden=!cards;
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 if(!cards)fit();syncPreviews();
}

// Article text is plain text, escaped before rendering; empty sections remain drafts.
function recordAssetUrl(e,value){
 if(typeof value==='string'&&/^[-\w]+\.(mp4|webm|jpg|jpeg|png|webp)$/i.test(value)&&/^[-\w]+$/.test(e.collection)&&/^[-\w]+$/.test(e.id))return './records/'+e.collection+'/'+e.id+'/'+value;
 return safeUrl(value);
}
function recordVideos(e){
 const videos=(Array.isArray(e.videos)?e.videos:[]).map(v=>({...v,src:recordAssetUrl(e,v.src),poster:recordAssetUrl(e,v.poster)})).filter(v=>v.src&&v.poster);
 if(!videos.length)return '';
 return '<section class="record-video-section"><h2>'+esc(e.videoHeading||'プレイ動画')+'</h2><div class="record-video-grid">'+videos.map(v=>'<figure><video controls playsinline preload="none" poster="'+esc(v.poster)+'"><source src="'+esc(v.src)+'" type="'+(v.src.endsWith('.webm')?'video/webm':'video/mp4')+'"><a href="'+esc(v.src)+'">動画を開く</a></video><figcaption>'+esc(v.title)+'</figcaption></figure>').join('')+'</div></section>';
}
function recordPhotos(e){
 const photos=(Array.isArray(e.photos)?e.photos:[]).filter(p=>/^[-\w]+\.(jpg|jpeg|png|webp)$/i.test(p.file));
 if(!photos.length)return '';
 return '<section class="record-photo-section"><h2>写真</h2><div class="record-photo-grid">'+photos.map(p=>{
  const url='./records/'+e.collection+'/'+e.id+'/'+p.file;
  return '<figure><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(p.caption)+'を大きく表示"><img src="'+esc(url)+'" alt="'+esc(p.caption)+'" loading="lazy" decoding="async"></a><figcaption>'+esc(p.caption)+'</figcaption></figure>';
 }).join('')+'</div></section>';
}
function renderArticle(e){
 if(!e.article||!Array.isArray(e.article.sections))return '';
 return '<div class="record-article">'+e.article.sections.filter(section=>e.collection!=='books'||(section.paragraphs||[]).some(meaningfulRecordText)).map(section=>'<section><h2>'+esc(section.heading)+'</h2>'+(Array.isArray(section.paragraphs)&&section.paragraphs.length?section.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join(''):'<p class="article-pending">この節は準備中です。</p>')+'</section>').join('')+'</div>';
}

function recordSortDate(e){return e.collection==='books'?(e.readDate||e.returnDate||''):(e.updatedAt||e.date||e.repositoryUpdatedAt||'');}
function compareRecordDates(a,b){const x=recordSortDate(a),y=recordSortDate(b);return y.slice(0,7).localeCompare(x.slice(0,7))||Number(!!b.latestInMonth)-Number(!!a.latestInMonth)||y.localeCompare(x)||a.title.localeCompare(b.title,'ja');}
function recordDateLabel(e){if(e.collection==='books')return '<span class="card-date">'+esc(e.readDate?'読書 '+e.readDate:e.returnDate?'返却日 '+e.returnDate:'時期未設定')+'</span>';const d=recordSortDate(e);return '<span class="card-date">'+esc(e.period||(d?d+(e.updatedAt?' · 内容更新':e.date?'':' · GitHub更新'):'日付未設定'))+'</span>';}

var previewObserver;
function observePreviews(){
 if(previewObserver)previewObserver.disconnect();
 previewObserver=new IntersectionObserver(entries=>{for(const entry of entries){entry.target.dataset.inView=String(entry.isIntersecting);}syncPreviews();},{threshold:.15});
 document.querySelectorAll('.loop-preview').forEach(v=>{v.muted=true;previewObserver.observe(v);});
}
function syncPreviews(){const stop=document.hidden||document.body.classList.contains('still')||document.body.classList.contains('navigating')||matchMedia('(prefers-reduced-motion: reduce)').matches;document.querySelectorAll('.loop-preview').forEach(v=>{if(!stop&&graphState?.view==='cards'&&v.dataset.inView==='true')v.play().catch(()=>{});else v.pause();});}
new MutationObserver(syncPreviews).observe(document.body,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',syncPreviews);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',syncPreviews);

function genreColor(e){const colors={'ゲーム・映像':'#9b65df','AI・認知・人間':'#e06b91','インフラ・ネットワーク':'#259fc0','プログラミング・設計':'#299e7c','数学':'#d69b32','英語':'#5484d6','フランス語':'#ad67bf','文学・美術':'#d77a42','科学・電子工作':'#8d9e37','資格・学習':'#3b9c94','半導体・回路設計':'#e48336','セキュリティ・開発記録':'#cf617c'};return colors[graphGroup(e)]||'#6a9ea2';}
function publicSiteAction(e){return safeUrl(e.publicUrl)?'<div class="public-site-action"><a class="cta" href="'+esc(safeUrl(e.publicUrl))+'" target="_blank" rel="noopener noreferrer">公開サイトを開く ↗</a><small>別タブで作品を体験できます</small></div>':'';}

