// Audit the new site's reachable files; also supplies the publication allowlist.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const SITE = 'site-v2/';
const runtime = new Set([
  'index.html', 'background-source.html', 'content.js', 'core.js',
  'editorial.js', 'graph-layout.js', 'revision.js', 'textile.js', 'typography.js',
  'base.css', 'demo.css', 'editorial.css', 'layout.css', 'revision.css',
  'textile.css', 'typography.css'
].map(file => SITE + file));
const media = /\.(png|jpe?g|webp|svg|mp4|webm)$/i;
const embeddedWebFont = /@font-face\b|<font-face\b|\bnew\s+FontFace\s*\(|data:(?:font\/|application\/(?:x-font-|font-|vnd\.ms-fontobject))/i;

function publishable(file) {
  if (runtime.has(file)) return true;
  if (file.split('/').some(part => part.startsWith('.') ||
      /^(originals|raw-photos|prompts|conversation-logs|chat-logs)$/i.test(part))) return false;
  if (file.startsWith(SITE + 'images/') ||
      file.startsWith(SITE + 'records/')) return media.test(file);
  if (file.startsWith(SITE + 'articles/')) return media.test(file) || /\.(html|pdf)$/.test(file);
  return file.startsWith(SITE + 'shaders/') && file.endsWith('.glsl');
}

function audit(root = path.resolve(__dirname, '..')) {
  root = fs.realpathSync(root);
  const files = new Set(), external = new Set(), errors = [], queue = [], fragments = [];
  const context = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, SITE, 'content.js'), 'utf8'), context);
  const records = context.window.PORTFOLIO_CONTENT;
  const ids = new Set(records.map(e => e.id));
  const collections = new Set(['about','works','research','books','hobby','links']);
  function add(raw, from) {
    if (!raw || raw.includes('${') || raw.includes('<') || raw.includes("'+") || raw.includes('"+')) return;
    raw = raw.replaceAll('&amp;', '&');
    if (/^(data:|blob:|mailto:|tel:)/i.test(raw)) return;
    if (/^(https?:)?\/\//i.test(raw)) {
      const u = new URL(raw, 'https://qutalize.github.io');
      if (u.hostname === 'qutalize.github.io') raw = u.pathname + u.search + u.hash;
      else { external.add(raw); return; }
    }
    if (/^[a-z]+:/i.test(raw)) { errors.push(`${from}: unsupported URL ${raw}`); return; }
    const [pathname, fragment] = raw.split('#');
    let target;
    try { target = path.posix.normalize(pathname.startsWith('/') ? decodeURIComponent(pathname.split('?')[0]).slice(1) : path.posix.join(path.posix.dirname(from), decodeURIComponent(pathname.split('?')[0]) || path.posix.basename(from))); }
    catch { errors.push(`${from}: invalid URL ${raw}`); return; }
    if (target.endsWith('/') || fs.existsSync(path.join(root,target)) && fs.statSync(path.join(root,target)).isDirectory()) target = path.posix.join(target,'index.html');
    if (!publishable(target)) { errors.push(`${from}: legacy/out-of-scope URL ${raw}`); return; }
    const absolute = path.resolve(root, target);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) { errors.push(`${from}: missing ${raw} (${target})`); return; }
    if (path.relative(absolute, fs.realpathSync(absolute))) { errors.push(`${from}: linked asset ${raw}`); return; }
    if (/\.(jpe?g|png|webp)$/i.test(target)) {
      const stem = absolute.slice(0, -path.extname(absolute).length);
      if (fs.existsSync(stem + '-mosaic.png') || fs.existsSync(stem + '-masked.png')) {
        errors.push(`${from}: unredacted source photo ${raw}`);
        return;
      }
    }
    if (fragment) fragments.push({from,target,fragment});
    if (!files.has(target)) { files.add(target); queue.push(target); }
  }
  function html(s, from) {
    for (const m of s.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/g)) {
      if (from.endsWith('.js') && /^\s*\+/.test(s.slice(m.index + m[0].length))) continue;
      if (m[1].endsWith('/') && m[1].startsWith('#')) continue; // runtime route prefix
      add(m[1],from);
    }
  }
  function data(value) {
    if (typeof value === 'string') {
      if (/^\.{1,2}\//.test(value)) add(value,SITE+'index.html');
      if (value.includes('<')) html(value,SITE+'index.html');
    } else if (Array.isArray(value)) value.forEach(data);
    else if (value && typeof value === 'object') for (const [key,v] of Object.entries(value)) {
      if (['url','href','publicUrl','repositoryUrl'].includes(key) && typeof v === 'string') add(v,SITE+'index.html');
      else data(v);
    }
  }
  add('./index.html',SITE+'index.html');
  data(records); data(context.window.PORTFOLIO_PAGES);
  for (const e of records) {
    const bundle = `./records/${e.collection}/${e.id}/`;
    if (e.video) add(bundle + e.video, SITE + 'index.html');
    for (const photo of e.photos || []) if (photo.file) add(bundle + photo.file, SITE + 'index.html');
  }
  // Assets assembled dynamically by the UI (keep this manifest beside the audit).
  for (const id of [...collections,'gallery']) add(`./images/topics/${id}.png`,SITE+'index.html');
  for (const name of ['brand','knowledge','read-more', ...[...collections].map(x=>'nav-'+x), ...['github','atcoder','linkedin','x'].map(x=>'link-'+x)]) add(`./images/typography/${name}.png`,SITE+'index.html');
  for (const name of ['cloth.vert.glsl','patterns.glsl','cloth.frag.glsl']) add('./shaders/'+name,SITE+'index.html');
  while (queue.length) {
    const file = queue.shift();
    if (!/\.(html|css|js|svg)$/.test(file)) continue;
    const s = fs.readFileSync(path.join(root,file),'utf8');
    if (embeddedWebFont.test(s)) errors.push(`${file}: web fonts are disabled; use system fonts or fixed PNG lettering`);
    html(s,file);
    for (const m of s.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) if (!m[1].includes('+')) add(m[1],file);
    if (file.endsWith('.js') && !file.endsWith('/content.js')) {
      for (const m of s.matchAll(/["'`]((?:\.\.?\/)[^"'`\s<>]+\.(?:png|jpe?g|webp|svg|mp4|pdf|html|glsl)(?:[?#][^"'`\s<>]*)?)["'`]/g)) add(m[1],file);
    }
  }
  for (const {from,target,fragment} of fragments) {
    if (target === SITE+'index.html' && /^(home|collection\/|detail\/|journal\/|profile\/)/.test(fragment)) {
      const [kind,id,...extra] = fragment.split('/');
      const ok = !extra.length && (kind==='home' && !id || kind==='collection' && collections.has(id) || kind==='detail' && ids.has(id) || kind==='journal' && ['about','games','travel','hackathons','events','museums'].includes(id) || kind==='profile' && id==='about');
      if (!ok) errors.push(`${from}: unknown route #${fragment}`);
    } else if (target.endsWith('.html')) {
      const s=fs.readFileSync(path.join(root,target),'utf8');
      if (!s.includes(`id="${fragment}"`) && !s.includes(`id='${fragment}'`)) errors.push(`${from}: missing anchor ${target}#${fragment}`);
    }
  }
  if (errors.length) throw new Error([...new Set(errors)].join('\n'));
  return {files:[...files].sort(), external:[...external].sort()};
}
module.exports={audit};
if (require.main===module) {
  const result=audit(process.argv[2] && path.resolve(process.argv[2]));
  console.log(`PASS: ${result.files.length} reachable local files, local links/assets/routes checked. ${result.external.length} external URLs are not availability-tested.`);
}
