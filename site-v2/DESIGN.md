# ポートフォリオの実装

- `index.html` は画面枠、`core.js` はナビゲーションとハッシュによる画面遷移を担当します。
- `editorial.js` と `editorial.css` は About・Hobby とアルバム画面を担当します。About が最初に開きます。
- `revision.js` は作品・書籍の一覧、検索、詳細と Research・Links を担当します。`graph-layout.js` は関連グラフの座標を計算します。
- `typography.js` と `typography.css` は見出しと共通の書体、`textile.js` と `shaders/` は背景を担当します。

データは [編集ガイド](EDITING.md) に沿って `records/` で編集します。背景の変更は [GLSL背景の編集](TEXTILE.md) を参照してください。
