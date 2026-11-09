// Publish this generated directory only, never the repository root.
const fs = require('fs');
const path = require('path');
const {build} = require('./build-content.cjs');
const {audit} = require('./check-links.cjs');
const root = path.resolve(__dirname, '..');

function redirect(target, hashMode) {
  const routes = {about:'home', works:'collection/works', research:'collection/research', books:'collection/books', gallery:'collection/hobby', hobby:'collection/hobby', links:'collection/links'};
  const destination = hashMode === 'legacy'
    ? `target.split('#')[0]+'#'+(Object.hasOwn(routes,key)?routes[key]:'home')`
    : hashMode === 'preserve' ? 'target+location.search+location.hash' : 'target';
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Quta's portfolio</title><meta name="robots" content="noindex">
<script>const target=${JSON.stringify(target)};${hashMode === 'legacy' ? `const routes=${JSON.stringify(routes)};const key=location.hash.slice(1);` : ''}location.replace(${destination});</script>
<noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript>
</head><body><a href="${target}">Quta's portfolio を開く</a></body></html>\n`;
}

function publish() {
  build();
  const result = audit(root);
  const out = path.join(root, '.publish', new Date().toISOString().replace(/[:.]/g,'-'));
  fs.mkdirSync(out, {recursive:true});
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(out,file)), {recursive:true});
    fs.writeFileSync(path.join(out,file), text);
  };
  for (const file of result.files) {
    const dest = path.join(out,file);
    fs.mkdirSync(path.dirname(dest), {recursive:true});
    fs.copyFileSync(path.join(root,file),dest);
  }
  fs.copyFileSync(path.join(root,'index.html'),path.join(out,'index.html'));
  const routes = {'index.html':'home','works.html':'collection/works','hobby.html':'collection/hobby','readinglog.html':'collection/books','link.html':'collection/links'};
  for (const [file, route] of Object.entries(routes)) {
    if (file!=='index.html') write(file,redirect('./site-v2/index.html#'+route));
    write('old_site/'+file,redirect('../site-v2/index.html#'+route,file==='index.html' ? 'legacy' : undefined));
  }
  for (const file of ['index.html', 'background-source.html']) {
    write('mock-v1/'+file,redirect('../site-v2/'+file,'preserve'));
  }
  for (const file of ['202601.html','202602ai.html']) {
    write('folder/'+file,redirect('../site-v2/articles/'+file,'preserve'));
    write('mock-v1/articles/'+file,redirect('../../site-v2/articles/'+file,'preserve'));
  }
  // Keep direct PDF bookmarks usable; this is a document, not a legacy page.
  for (const dir of ['folder', 'mock-v1/articles']) {
    fs.copyFileSync(path.join(out,'site-v2/articles/cloud_jikken.pdf'),path.join(out,dir,'cloud_jikken.pdf'));
  }
  write('404.html',`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ページが見つかりません | Quta's portfolio</title></head><body><main><h1>ページが見つかりません</h1><p>リンク先が変更された可能性があります。</p><a href="/site-v2/index.html#home">ホームへ</a> · <a href="/site-v2/index.html#collection/works">Worksへ</a></main></body></html>\n`);
  write('.nojekyll','');
  const exported = audit(out);
  console.log(`Publication prepared: ${out}\nChecked ${exported.files.length} reachable files. Legacy page URLs redirect to site-v2.\nExternal URL availability is not tested (${result.external.length} URLs). No deployment performed.`);
  return out;
}
module.exports={publish};
if (require.main===module) publish();
