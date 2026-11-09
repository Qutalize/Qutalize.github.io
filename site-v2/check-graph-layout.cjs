const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { clusterLayout, graphGroup } = require('./graph-layout.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(`${__dirname}/content.js`, 'utf8'), context);
for (const category of ['books', 'works']) {
  const items = context.window.PORTFOLIO_CONTENT.filter(e => e.collection === category);
  assert(items.length > 0);
  const layout = clusterLayout(items);
  assert.deepEqual(layout.pos, clusterLayout([...items].reverse()).pos);
  for (const [i, group] of layout.groups.entries()) {
    for (const other of layout.groups.slice(i + 1)) {
      assert(group.x + group.width <= other.x || other.x + other.width <= group.x ||
        group.y + group.height <= other.y || other.y + other.height <= group.y);
    }
    for (const item of group.items) {
      const p = layout.pos[item.id];
      assert(Number.isFinite(p.x) && Number.isFinite(p.y));
      assert(p.x > group.x && p.x < group.x + group.width);
      assert(p.y > group.y && p.y < group.y + group.height);
    }
  }
  const positions = Object.values(layout.pos);
  for (const [i, p] of positions.entries()) {
    for (const q of positions.slice(i + 1)) assert(Math.hypot(p.x-q.x, p.y-q.y) >= 150);
  }
}
assert.equal(graphGroup({tags:['数学'], graphGroup:' 自分の分類 '}), '自分の分類');
assert.equal(clusterLayout([]).groups.length, 0);
assert.equal(clusterLayout([{id:'one',tags:[]}]).groups[0].name, 'その他');
console.log('PASS: stable grouping, bounds, non-overlapping groups and icons, custom and empty groups');
