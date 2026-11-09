# images/ — 画像アセット置き場

新ポートフォリオ（`/index.html`）で使う画像をまとめています。
**現在入っているものはすべて仮のプレースホルダ**です。同じファイル名で
自分の手描き画像 / 写真に置き換えれば、HTML を触らずに反映されます。

```
images/
├── profile/
│   ├── avatar.jpeg   … ヘッダー右上と About のアイコン写真（正方形推奨）
│   └── slim.mp4      … About のスライム動画（旧サイトから移設）
│
├── topics/           … トピックアイコン列（7枚）。手描き or 写真。
│   ├── about.png        正方形（400〜600px）。透過 or 不透過どちらでも可。
│   ├── works.png        badge は object-fit:contain 表示（全体が収まる）。
│   ├── research.png     写真を使い「切り抜き表示」にしたい場合は
│   ├── books.png        index.html の `.topic .badge img { object-fit: cover }` に変更。
│   ├── gallery.png
│   ├── hobby.png
│   └── links.png
│
├── works/            … Works カードのカテゴリ小アイコン（6枚）
│   ├── game.png         正方形（透過PNG推奨、200px程度）。
│   ├── web.png          22px で表示される。線画向き。
│   ├── ml.png
│   ├── network.png
│   ├── algorithm.png
│   └── award.png
│
├── books/            … 書影（任意）。空。使う場合は下記参照。
└── gallery/          … 写真（任意）。空。使う場合は下記参照。
```

## 書影を入れるとき（Book History）
`index.html` の各本カードの
```html
<div class="book-cover" style="--c1:#db7093;--c2:#8a2d55;">コンビニ人間</div>
```
を
```html
<img class="book-cover" src="images/books/konbini-ningen.jpg" alt="コンビニ人間">
```
に置き換える。`img.book-cover` 用の CSS は用意済み。

## ギャラリー写真を入れるとき（Picture Gallery）
`index.html` 末尾スクリプトの `photos` 配列に `img` を足すだけ：
```js
{p:'taiwan', t:'ルーロー飯', img:'images/gallery/taiwan-01.jpg'},
```
`img` があるとプレースホルダのグラデーションではなく写真が表示される
（`.photo.has-img` の CSS 済み）。時系列ビューの各サムネは
`index.html` の `.tl-year .thumb` に直接 `style="--p1:...;--p2:..."` の代わりに
`style="background-image:url('images/gallery/2024.jpg')"` を書けば写真になる。

## 旧サイトについて
旧サイトは `/old_site/` に保管。画像パスは `../images/profile/…` に修正済みで、
`old_site/` フォルダごと USB 等へコピーすればそのまま表示できます。
