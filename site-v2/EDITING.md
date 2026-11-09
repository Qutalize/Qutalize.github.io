# 画像と文章をセットで編集する

## 最初に読む
今後の編集元は records/ です。content.js は生成物なので直接編集しません。

## フォルダ構成
```
site-v2/
  records/
    books/
      book-0/             コンビニ人間
        entry.json        タイトル・感想・著者・タグなど
        cover.jpg         表紙画像（出典はentry.json）
      book-1/             ソフトウェア開発のワークスタイル2030
      book-2/             図解TCP/IP
      book-3/             リーダブルコード
      book-4/             コンピュータの構成と設計 第6版 上
      book-5/             プログラミングコンテストチャレンジブック 第2版
      book-6/             図解AWS
      book-7/             三体
    works/
      routes/             経路探索
        entry.json
        icon.png          引き継いだ仮ピクトグラム
      cloud/              AWS飲食店マップ
      eeg/                AIコンペ
      hockey/             アイスホッケー学習比較
      chat/               チャットシステム
    pages.json            自己紹介・趣味・外部リンク
  build-content.cjs       recordsからcontent.jsを作る
  content.js              自動生成（直接編集しない）
```

## 本の表紙を入れる
1. 対象の本のフォルダに cover.jpg を保存。
2. entry.json の image が cover.jpg、imageType が cover であることを確認。
3. ページを再読み込み。
PNGなどの場合はファイル名を cover.png にし、imageも合わせます。表紙が未登録の間はタイトル入りの仮表紙を表示します。既存・追加の書影と出典を登録済みです。版の仮選定と画像の例外は CATALOG.md を参照してください。
表紙は object-fit: contain で全体を見せ、グラフ・説明パネル・詳細ページで使います。

## Worksの写真・ピクトグラム
写真なら同じフォルダに photo.jpg を入れ、imageを photo.jpg、imageTypeを photo にします。写真はグラフ内では円形に切り抜きます。
自作ピクトグラムなら icon.png / icon.svg を入れ、imageTypeを pictogram にします。ピクトグラムは切り抜かず全体を表示します。SVGは自分で作成した信頼できるファイルを使用してください。

## entry.jsonの例
```json
{
  "id": "my-project",
  "collection": "works",
  "title": "新しい制作物",
  "description": "何を作ったか。工夫したところ。",
  "tags": ["AI", "ゲーム"],
  "image": "photo.jpg",
  "imageType": "photo",
  "date": "2026-09",
  "meta": "2026.09 制作",
  "links": ["hockey"]
}
```
- imageは同じフォルダのファイル名のみ。URLや../は書きません。
- urlは詳細資料へのリンク用で、site-v2/index.html基準。例: ./articles/202601.html。
- idは全項目で一意。フォルダ名は英数字・ハイフン推奨。フォルダ名とidを揃えると管理しやすいです。
- 共通タグで関連線が生成されます。linksは関連先のid。
- JSONでは最後の項目に余分なカンマを付けず、文字列は二重引用符で囲みます。本文中の改行は \n で表現します。

## 追加と反映
books/またはworks/の既存フォルダを複製し、entry.jsonのid・内容・画像を変更するだけで一覧に加わります。新しいトピックそのものの追加はcore.js/revision.jsの変更が必要です。

サーバー利用:
```
node site-v2/serve.cjs
```
http://127.0.0.1:4321/site-v2/ を開く。更新版サーバーはcontent.jsの取得時にデータを再生成するので、編集後は再読み込み。古いサーバーを動かしている場合は、起動したターミナルでCtrl+Cして起動し直してください。

HTMLファイルを直接開く場合:
```
node site-v2/build-content.cjs
```
を実行してからブラウザーを再読み込み。どちらもGit操作・公開はしません。

検証:
```
node site-v2/build-content.cjs
node site-v2/check.cjs
```
作品・書籍と各ページの編集データは公開時に content.js へ組み込まれます。会話ログ・プロンプト・加工指示などはリポジトリルートの .local/work/ に置いてください。

## GitHub・書籍の追加分

作品と本の一覧・編集項目・出典・仮選定した版は [CATALOG.md](CATALOG.md) にまとめました。

## ホームとナビゲーション
最初に開くのは About です。プロフィールと資格の詳細は #journal/about にあります。上部のナビをクリック、タップ、または Enter で選択すると各ページへ移動します。フッターの「背景のコード」から background-source.html を開けます。

## 文章を編集する場所（現在の表示）
- records/pages.json → aboutDetails：プロフィール詳細の項目。titleが項目名、paragraphsが本文の段落配列。
- records/pages.json → research：研究ページ。title、summary、sections内のtitle/text。
- records/pages.json → hobbies：Hobbyの項目。titleとdescription。hrefは任意の関連リンク。
- records/pages.json → links：外部リンクのtitle、description、url。
- records/pages.json → aboutHtml：旧プロフィールURL（#profile/about）向けの本文。
- records/works/<id>/entry.json：作品のtitle、description、achievements、period/date、tags、techStack、article.sectionsなど。
- records/books/<id>/entry.json：本のtitle、description、author、readDate、returnDateなど。表紙は同じフォルダのcover.jpg。
- index.html：ヘッダーのサイト名 Quta's portfolio。
- layout.css → #textile：現在はopacity:1、filter:noneで、背景本来の色と明るさを表示します。カードは不透明な面と影で背景から区別しています。

content.jsは生成物です。手で編集せず、node site-v2/build-content.cjsで反映します。serve.cjs起動中はブラウザーを再読み込みすると再生成されます。
JSONはキー・文字列をダブルクォートで囲み、改行は文字列の中では\nと書きます。末尾の項目にはカンマを付けません。


## Research のカードと背景の割り当て
- Research の紹介は records/pages.json の research.sections で編集します。
- カード配置・左寄せ・Works / Booksの文字サイズは `layout.css` 末尾で調整します。
- 背景は `textile.js` の `styles` で割り当てます。About: waves（葉）、Works: stars（菱形）、Research: lattice、Books: plaid、Hobby: arcs（円弧）、Links: hexagons（六角形）。
- 6柄のGLSL実装は `shaders/patterns.glsl`。背景の明るさは補正なし（`filter:none`）です。

## 文字・フォントの編集
- `typography.css`：全ページ共通の本文フォント、見出しの太さ、タイトル画像のサイズ。
- サイトロゴ：添付の **Y1YomiyasuSansSerif / YutaONE**。`images/typography/brand.png` を使い、サイト名は代替テキストに保持します。
- 小見出し・本文・ボタン・入力欄：Yu Gothic → Hiragino Kaku Gothic ProN → Meiryo → sans-serif。見出しは700、本文は500。端末にある日本語フォントを使用します。
- 個別作品・書籍のタイトルは編集可能なテキストとして同じゴシックで表示します。コードは等幅です。
- LinkedIn・Xなど外部リンク：`records/pages.json` の `links`。

### 添付フォントの利用条件
ゆうたONEの書体は、ロゴやナビなどの固定ラベルを描いた PNG 画像に使います。本文には閲覧端末のシステムフォントを使います。

元のフォントファイルは `.local/` に保管してください。ラベルを追加するときも、表示する文言全体を一枚の PNG に描きます。公開前に、制作者が作者指定の SNS アカウントを少なくとも1つフォローしていることを確認してください。
規約：https://docs.google.com/document/d/1jzKjcBY7Kni8GaGqFhJaeS2VThokrYWUysKsHnFCxhQ/edit

### 書体の使い分け（追加）
- **Y1YomiyasuSansSerif**：サイトロゴ。
- **Y1Vectura**：上部ナビ、Linksのサービス名、Works/BooksカードのREAD MORE、一覧の英字ラベル。
- 日本語の本文・作品名・タグ・入力欄は共通のゴシック体を維持。
- 画像は `images/typography/`、適用は `typography.js`、表示サイズは `typography.css`。検索によるカード再描画にも適用します。

## タイトル横の説明とAboutカード
- `records/pages.json` → `pageDescriptions`：6ページのタイトル横に表示する短い説明文。
- About の本文は records/pages.json の aboutDetails[].paragraphs、画面構成は editorial.js と editorial.css で編集します。

## 写真・アルバムの編集
- Hobbyの `hobbies[].photos[]` に `group` を指定すると、旅行先・イベントの選択肢になります。同じ `group` の写真だけが表示されます。
- 写真の `src`、説明の `caption`、分類の `group` を同じ項目に保持します。
- Aboutの富岳写真とアイコンは editorial.js の .bio-photo と .bio-avatar で編集します。
- 顔を含む掲載写真には加工済みの `-mosaic.png` を指定してください。拡大して背景や反射も確認し、加工前の写真はリポジトリルートの .local/originals/ に保管してください。

## About / Hobby の編集
画面の描画は `editorial.js`、配置は `editorial.css` で調整します。

- 6ページの見出し：`typography.js`。英語のページ名＋日本語の短い説明で統一。見出しの本文は画像ではなく共通ゴシックです。サイトロゴ・ナビゲーションには既存の書体画像を継続使用します。
- Aboutの経歴：`records/pages.json` の `careerTimeline`（古い順）。`period` / `title` / `description` を編集します。
- Aboutの実績：`editorial.js` の `awardMarkup`。作品の `date` で古い順に表示。日付のない実績は末尾に「時期未登録」として表示し、GitHubの更新日を受賞日として扱いません。
- Aboutの本文・資格：`records/pages.json` の `aboutDetails[].paragraphs`。`#journal/about` の独立ページに表示します。
- Hobby：トップは5つのアルバム入口。`#journal/games` / `travel` / `hackathons` / `events` / `museums` に移動します。美術館巡りの写真も `hobbies[].photos[]` で管理します。
- 写真は `hobbies[].photos[]` の `src` / `caption` / `group` で管理。旅行先やイベントごとにまとめ、`date`（YYYY-MM-DDまたはYYYY-MM）で新しい順に表示します。グループ共通の日付は `albumDates` に指定できます。未登録のグループは末尾に表示します。
- ゲームの写真ページでは日付を表示しません。ハッカソンの写真ページは `hackathonAlbums` の `title`（大会名）・`date`（参加日）・`recordId`（Worksの作品ID）で管理し、作品名と大会名を分けています。
- Worksに作品を登録しない参加記録は、`recordId` を省略して `photos: [{src: "./images/hobby/events/写真.jpg", caption: "説明"}]` を指定できます。参加日順の一覧に表示され、作品詳細リンクは付きません。
- 日付範囲や開催時間を表示する場合は、`hackathonAlbums` またはグループ先頭の写真に `dateLabel`（例：`2026.08.08–09`）を追加します。並び順は `date` / `albumDates` の日付で決まります。
- 新イベントは新しい `group` 名と写真を追加するだけで記録ページに追加されます。枚数に上限はありません。
- ハッカソン写真はWorksの各 `entry.json` の `photos` を共有します。
- Linksの画像：`records/pages.json` の `links[]` に `image` と `imageAlt` を指定します。現在の画像は `images/links/` に保存。画像なしのリンクはコンパクトなカードになります。スクリーンショットは撮影時点の表示で、成績などは自動更新されません。
- 原寸比率を維持して表示。写真のリンクは画像を別タブで開きます。加工済みの画像参照を維持してください。
- データ編集後はリポジトリのルートで `node site-v2/build-content.cjs` を実行し、ブラウザーを再読み込みしてください。

## Booksの詳細とWorksのカードサイズ
- Booksは感想・まとめがある本だけ詳細リンクを表示します。「まとめ作成中」「読書中」「準備中」「追記予定」などの仮文だけの場合は、一覧カードのみ表示し、詳細URLへの直接アクセスもBooks一覧へ戻します。判定は `revision.js` の `hasRecordDetail` です。
- 感想・まとめは各本の `entry.json` の `review` / `summary` / `outline` / `article.sections[].paragraphs`（`description` は書籍紹介用で、これだけでは詳細ページを作成しません） に記入できます。
- WorksのPC用カードは `editorial.css` 末尾の `.record-cards[data-collection="works"]` で高さ・余白を調整しています。一覧の「分野」行を省き、写真枠は150pxにしています。分野の検索・詳細情報は保持しています。

## 詳細ページの動画
- Suikaの動画は `records/works/suika/entry.json` の `videos` で管理します。各項目の `title` が見出し、`src` が動画、`poster` が再生前の画像です。ファイル名は同じフォルダ内の名前を指定します。
- 動画は自動再生せず、閲覧者が再生・停止できます。スマートフォンでは1列に並びます。
- 差し替え後は `node site-v2/build-content.cjs` で反映します。元の録画は変更せず、サイトには軽量化したMP4を配置しています。
