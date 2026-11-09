/* Semantic clusters: edit tags below, or set graphGroup in an entry.json. */
const GRAPH_GROUPS = [
  {name:'ゲーム・映像', color:'#c6a0ff', tags:['ゲーム','Unity','3D','映像','音楽']},
  {name:'AI・認知・人間', color:'#ffaecc', tags:['AI','研究','脳波解析','心理学','人間工学']},
  {name:'インフラ・ネットワーク', color:'#74ddff', tags:['AWS','インフラ','ネットワーク','Terraform','セキュリティ','アーキテクチャ']},
  {name:'プログラミング・設計', color:'#73efbf', tags:['C','C++','C#','Go','Python','Java','SQL','TypeScript','HTML','Web','設計','制作','アルゴリズム','技術書']},
  {name:'数学', color:'#ffd48d', tags:['数学']},
  {name:'英語', color:'#a6c8ff', tags:['英語']},
  {name:'フランス語', color:'#e0b2ff', tags:['フランス語']},
  {name:'文学・美術', color:'#ffc18c', tags:['小説','美術','デザイン']},
  {name:'科学・電子工作', color:'#d8e99a', tags:['科学','化学','量子技術','電子工作']},
  {name:'資格・学習', color:'#9bcfc9', tags:['資格','ビジネス']}
];
function graphGroup(entry){
  if(typeof entry.graphGroup==='string'&&entry.graphGroup.trim())return entry.graphGroup.trim();
  return (GRAPH_GROUPS.find(g=>entry.tags.some(t=>g.tags.includes(t)))||{name:'その他'}).name;
}
function clusterLayout(items){
  const groups=[];
  for(const e of items){const name=graphGroup(e);let group=groups.find(g=>g.name===name);if(!group){group={name,color:GRAPH_GROUPS.find(g=>g.name===name)?.color||'#bdcadb',items:[]};groups.push(group)}group.items.push(e)}
  groups.sort((a,b)=>{const rank=n=>{let i=GRAPH_GROUPS.findIndex(g=>g.name===n);return i<0?999:i};return rank(a.name)-rank(b.name)||a.name.localeCompare(b.name,'ja')});
  for(const g of groups){
    // Nearby tags share a local section within each category. Stable IDs break ties.
    g.items.sort((a,b)=>a.tags.slice().sort().join('/').localeCompare(b.tags.slice().sort().join('/'),'ja')||a.id.localeCompare(b.id));
    const cols=Math.max(1,Math.ceil(Math.sqrt(g.items.length))),rows=Math.ceil(g.items.length/cols);
    g.width=Math.max(280,cols*175+95);g.height=rows*180+130;
    g.local={};g.items.forEach((e,i)=>{const row=Math.floor(i/cols),count=Math.min(cols,g.items.length-row*cols);g.local[e.id]={x:g.width/2+(i%cols-(count-1)/2)*175+(row%2?14:-14),y:95+row*180}});
  }
  // Pack complete groups, leaving visible space between different categories.
  const columns=Math.max(1,Math.ceil(Math.sqrt(groups.length*1.5))),pos={},colors={};let y=30,width=560;
  for(let start=0;start<groups.length;start+=columns){let x=30,height=0;for(const g of groups.slice(start,start+columns)){g.x=x;g.y=y;for(const e of g.items){pos[e.id]={x:x+g.local[e.id].x,y:y+g.local[e.id].y};colors[e.id]=g.color}x+=g.width+45;height=Math.max(height,g.height)}width=Math.max(width,x);y+=height+45}
  return {groups,pos,colors,width,height:Math.max(400,y)};
}
if(typeof module!=='undefined')module.exports={graphGroup,clusterLayout};
