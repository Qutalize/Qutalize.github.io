# 公開用ファイルとリンクの管理

実装の正本は `site-v2/` です。移行した記事は `site-v2/articles/` で編集します。`site-v1/` は旧サイトと試作のアーカイブです。

## 公開前の手順

リポジトリのルートで実行します。

```powershell
node site-v2/build-publish.cjs
node site-v2/check.cjs
node site-v2/check-graph-layout.cjs
```

最初のコマンドはコンテンツを再生成し、リンクを検査して `.publish/<生成日時>/` を作成します。

## GitHub Pages

リポジトリの **Settings → Pages → Build and deployment → Source** に **GitHub Actions** を指定します。[`pages.yml`](../.github/workflows/pages.yml) は `main` への push で `site-v2/` をビルドし、検査が通った `.publish/<生成日時>/` の中身だけを GitHub Pages に配信します。GitHub 上では `site-v1/` と `site-v2/` を参照できます。

## 公開されるもの

- 新サイトから参照される HTML、JS、CSS、画像、動画、PDF、GLSL。
- ルートの `index.html` は新サイトへの転送ページ。
- `works.html` などの旧ページ、`old_site/`、`folder/`、`mock-v1/` の旧ページURLは `site-v2/` の対応ページへ転送。
- `folder/cloud_jikken.pdf` と `mock-v1/articles/cloud_jikken.pdf` では同じ資料を配信。
- 不明な URL 用の `404.html`。

加工前画像は `.local/originals/`、会話ログ・プロンプト・加工記録は `.local/work/` に置きます。`site-v1/` は旧版のページと素材を Git で管理し、過去のビルドと移行資料はローカルに保管します。動作確認は最新の出力フォルダをドキュメントルートにしたローカル静的サーバーで行います。

## リンク検査

```powershell
node site-v2/check-links.cjs
node site-v2/check-links.cjs .publish/<生成日時>
```

HTML のリンク・画像・動画、CSS のアセット参照、コンテンツデータ内の URL、詳細ページ ID、HTML のアンカーを検査します。旧ページや公開範囲外へのリンク、存在しないローカルファイル、未定義の詳細ページはエラーにします。

サイトのロゴや固定ラベルは PNG、本文は閲覧端末のシステムフォントを使います。Web フォントの埋め込みは検査でエラーになり、フォントファイルは公開物の対象外です。

コードで組み立てるアセットの参照を追加する場合は、`check-links.cjs` の対象も更新してください。公開前に外部リンクの到達性と、公開物の画像を拡大したときの顔や反射を確認します。

## 記事の追加・編集

1. HTML と関連資料を `site-v2/articles/` 配下に配置。
2. HTML 内のナビゲーションは `../index.html#home` や `../index.html#collection/works` にする。
3. `site-v2/records/works/<ID>/entry.json` の `url` を `./articles/<ファイル名>` にする。
4. `build-publish.cjs` を再実行。検査に失敗した出力は公開しない。

既存記事も `site-v2/articles/` で編集します。
