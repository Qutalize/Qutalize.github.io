const http=require('http'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.pdf':'application/pdf'};http.createServer((req,res)=>{try{if(new URL(req.url,'http://localhost').pathname==='/site-v2/content.js')require('./build-content.cjs').build();}catch(error){res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'}).end('document.querySelector("#app").textContent='+JSON.stringify('データを確認してください: '+error.message)+'; throw new Error("Content build failed");');return;}let file;try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}
const relative = path.relative(root,file);
const parts = relative.split(path.sep);
const inSite = relative === '' || relative === 'index.html' || parts[0] === 'site-v2';
if (!inSite || parts.some(part => part.startsWith('.')) || path.isAbsolute(relative)) {
  res.writeHead(403).end();
  return;
}
if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
  const url = new URL(req.url,'http://localhost');
  if (!url.pathname.endsWith('/')) {
    res.writeHead(308, {Location:url.pathname+'/'+url.search}).end();
    return;
  }
  file = path.join(file,'index.html');
}
fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}const h={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'};const range=req.headers.range;if(range){const m=/bytes=(\d+)-(\d*)/.exec(range);if(!m){res.writeHead(416).end();return;}const a=+m[1],b=m[2]?Math.min(+m[2],stat.size-1):stat.size-1;if(a>b||a>=stat.size){res.writeHead(416).end();return;}res.writeHead(206,{...h,'Content-Range':`bytes ${a}-${b}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':b-a+1});fs.createReadStream(file,{start:a,end:b}).pipe(res);}else{res.writeHead(200,{...h,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}});}).listen(4321,'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:4321/site-v2/'));
