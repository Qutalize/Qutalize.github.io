/* Original, code-drawn textile studies. No reference-image pixels are used. */
(function(){
'use strict';
const styles={about:{pattern:'waves'},works:{pattern:'stars'},research:{pattern:'lattice'},books:{pattern:'plaid'},hobby:{pattern:'arcs'},links:{pattern:'hexagons'}};
const host=document.createElement('div');host.id='textile';host.setAttribute('aria-hidden','true');const cv=document.createElement('canvas');host.append(cv);document.body.prepend(host);const gl=cv.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power'});const reduce=matchMedia('(prefers-reduced-motion: reduce)');let current='',clock=0,last=0,frame=0,lost=false;
// All motifs below are drawn from geometry, without loading reference images.
function pattern(kind){const c=document.createElement('canvas');c.width=512;c.height=kind==='arcs'?384:512;const x=c.getContext('2d');
x.fillStyle={waves:'#163f50',stars:'#252438',plaid:'#e0ded0',lattice:'#193e36',arcs:'#23465b',hexagons:'#44354f'}[kind];x.fillRect(0,0,c.width,c.height);
if(kind==='waves'){for(let row=-2;row<7;row++)for(let col=-2;col<7;col++){const cx=col*128+(row%2)*64,cy=row*128;x.save();x.translate(cx,cy);x.rotate(-Math.PI/4);for(let j=0;j<3;j++){const r=43-j*12;x.beginPath();x.moveTo(-r,0);x.bezierCurveTo(-r*.2,-r*1.25,r*.65,-r*.9,r,0);x.bezierCurveTo(r*.2,r*1.25,-r*.65,r*.9,-r,0);x.strokeStyle=j===1?'#b68a65':'#e7e7d5';x.lineWidth=j===1?3:2;x.stroke();}x.beginPath();x.moveTo(-31,0);x.bezierCurveTo(-12,13,11,-13,31,0);x.strokeStyle='#94bbbc';x.lineWidth=2;x.stroke();x.restore();x.fillStyle='#b68a65';x.beginPath();x.arc(cx+55,cy+46,3,0,Math.PI*2);x.fill();}}
if(kind==='stars'){for(let row=-1;row<6;row++)for(let col=-1;col<6;col++){let cx=col*128,cy=row*128;x.save();x.translate(cx,cy);x.rotate(Math.PI/4);for(let j=0;j<3;j++){const r=44-j*13;x.strokeStyle=j===1?'#73b5a7':'#c6b283';x.lineWidth=j===1?6:2;x.strokeRect(-r,-r,r*2,r*2);}x.restore();x.fillStyle='#b59760';x.beginPath();x.arc(cx,cy,4,0,6.283);x.fill();x.strokeStyle='#73b5a7';x.lineWidth=2;x.beginPath();x.moveTo(cx+51,cy+64);x.quadraticCurveTo(cx+64,cy+39,cx+77,cy+64);x.quadraticCurveTo(cx+64,cy+89,cx+51,cy+64);x.stroke();}}
if(kind==='plaid'){for(let k=-6;k<11;k++){let a=k*128;for(const [offset,width,color] of [[0,24,'#20383d'],[32,7,'#c59b57'],[47,2,'#6e9e98']]){x.strokeStyle=color;x.lineWidth=width;x.beginPath();x.moveTo(a+offset,-128);x.lineTo(a+offset+768,640);x.stroke();}for(const [offset,width,color] of [[0,16,'#4d817c'],[25,3,'#c59b57']]){x.strokeStyle=color;x.lineWidth=width;x.globalAlpha=.82;x.beginPath();x.moveTo(a+offset,-128);x.lineTo(a+offset-768,640);x.stroke();x.globalAlpha=1;}}}
if(kind==='lattice'){for(let row=-1;row<6;row++)for(let col=-1;col<6;col++){let a=col*128,b=row*128;x.save();x.translate(a,b);x.strokeStyle='#a5b8a4';x.lineWidth=2;for(let k=0;k<4;k++){x.rotate(Math.PI/2);x.beginPath();x.moveTo(0,0);x.lineTo(20,35);x.lineTo(0,58);x.lineTo(-20,35);x.closePath();x.stroke();}x.fillStyle='#c2a46b';x.fillRect(-4,-4,8,8);x.restore();}}
if(kind==='arcs'){
 x.strokeStyle='#c9dedb';
 x.lineWidth=3;
 for(let row=0;row<=4;row++)for(let col=-1;col<=4;col++){
  const cx=col*128+(row%2)*64,cy=row*96;
  for(const radius of [26,40,54]){
   x.beginPath();x.arc(cx,cy,radius,Math.PI,Math.PI*2);x.stroke();
  }
 }
}
if(kind==='hexagons'){x.strokeStyle='#c5ad85';x.lineWidth=3;for(let row=-1;row<7;row++)for(let col=-1;col<7;col++){const cx=col*96,cy=row*111+(col%2)*55.5;x.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;x.lineTo(cx+54*Math.cos(a),cy+54*Math.sin(a));}x.closePath();x.stroke();}}
return c;}
// Random parameters are chosen once; amplitudes and directions drift continuously.
const waveData=new Float32Array(24);for(let i=0;i<6;i++){waveData[i*4]=i*2.399963+(Math.random()-.5)*.8;waveData[i*4+1]=2.6+i*1.45+Math.random()*1.4;waveData[i*4+2]=(.16/(1+i*.35))*(.75+Math.random()*.5);waveData[i*4+3]=(.13+Math.random()*.22)*(i%2?-1:1);}
let program,ut,ua;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
function setup(vertex,fragment){program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Textile shader link failed');gl.useProgram(program);gl.uniform4fv(gl.getUniformLocation(program,'waves[0]'),waveData);const v=[];const nx=120,ny=90;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const a=x/nx,b=y/ny,c=(x+1)/nx,d=(y+1)/ny;v.push(a,b,c,b,a,d,a,d,c,b,c,d);}const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);ut=gl.getUniformLocation(program,'t');ua=gl.getUniformLocation(program,'aspect');program.count=v.length/2;}
function size(){const ratio=Math.min(devicePixelRatio||1,1.5),scale=Math.min(1,1800/(innerWidth*ratio));cv.width=Math.round(innerWidth*ratio*scale);cv.height=Math.round(innerHeight*ratio*scale);if(gl&&!lost){gl.viewport(0,0,cv.width,cv.height);draw();}}
function draw(){if(!gl||lost||!program||!current)return;gl.uniform1f(ut,clock);gl.uniform1f(ua,cv.width/cv.height);gl.drawArrays(gl.TRIANGLES,0,program.count);}
function tick(now){frame=0;if(!running())return;clock+=last?Math.min((now-last)/1000,.05):0;last=now;draw();frame=requestAnimationFrame(tick);}
function running(){return !!program&&!lost&&!document.hidden&&!reduce.matches&&!document.body.classList.contains('still')&&!document.body.classList.contains('navigating');}
function sync(){cancelAnimationFrame(frame);frame=0;last=0;draw();if(running())frame=requestAnimationFrame(tick);}
function choose(id){const style=styles[id]||styles.about;if(current!==style.pattern){current=style.pattern;const tile=pattern(current);host.style.backgroundImage='url('+tile.toDataURL()+')';host.style.backgroundSize='540px auto';}if(gl&&!lost&&program)gl.uniform1i(gl.getUniformLocation(program,'uPattern'),{waves:0,stars:1,plaid:2,lattice:3,arcs:4,hexagons:5}[style.pattern]);sync();}
function loadShaders(){
 if(!gl){cv.hidden=true;return;}
 try{
  const sources=window.PORTFOLIO_SHADERS;
  const fragment=sources['cloth.frag.glsl'].replace('// @patterns',sources['patterns.glsl']);
  setup(sources['cloth.vert.glsl'],fragment);lost=false;cv.hidden=false;
 }catch(error){lost=true;cv.hidden=true;console.warn('Textile: static fallback',error.message);}
}
loadShaders();
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cv.hidden=true;sync();});cv.addEventListener('webglcontextrestored',()=>{loadShaders();choose(topics[selected][0]);size();});
scene=function(i){selected=i;choose(topics[i][0]);};document.body.classList.add('textile-active');
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);addEventListener('resize',size);choose(topics[selected][0]);size();
})();

