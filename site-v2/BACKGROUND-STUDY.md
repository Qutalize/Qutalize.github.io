# 自習: 自分で背景アニメーションを作る

## 目標を二つに分ける
A: 自分の美意識で作り込んだ映像を背景でループ再生する。
B: マウス・スクロール・クリックに応じて模様自体が変形する。
Aから始め、必要ならBへ進むのを提案します。After EffectsはA、Canvas/WebGLはBを担当できます。これは本サイトの目的に合わせた学習順の提案です。

## 選び方
| 技術 | 練習する題材 | サイトでの使い方 |
|---|---|---|
| After Effects → 動画 | 墨流し、光の流れ、奥行きのある質感 | videoで再生。写真のような質感を事前に作り込める |
| CSS | フェード、拡大、回転、光の線 | 軽いUIや背景の切り替え。映像の圧縮は不要 |
| Canvas 2D | 粒子、線、波 | JavaScriptで毎フレーム描画 |
| WebGL / GLSL | ノイズ、流体風の歪み、光 | GPUで模様を計算。インタラクションの自由度は高いが学習項目も増える |

After EffectsのコンポジションをそのままHTMLで再生するわけではありません。まず映像として書き出し、サイトに配置します。複雑なノイズや歪みを含む背景は動画から始めると制作結果を保ちやすいです。

## After Effectsの練習順
### 1. 動かさず、1枚の背景を作る
キーフレームの前に、紺・白・黒・灰・金・水色の配分を決める。文字を置く場所と模様を見せる場所を分ける。白黒で見ても明暗差があるか確認する。

### 2. 形と歪みを作る
Fractal Noiseで有機的な濃淡の素材を作り、Turbulent Displaceで形を歪ませる。Adobeの説明では前者は有機的な背景・テクスチャ、後者はノイズによる変形に使える。
参照: [Noise & Grain](https://helpx.adobe.com/after-effects/desktop/apply-effects-and-animation-presets/list-of-effects/noise-grain-effects.html)、[Distort effects](https://helpx.adobe.com/after-effects/using/distort-effects.html)。

墨流しを目指す練習案: 雲状のぼかしだけで止めず、帯状の形を用意して歪ませる。太い白紺の層と、細い金の線を別レイヤーにすると色と太さを調整しやすい。これは物理シミュレーションではなく、見た目を作る練習です。

### 3. 最初の作品を8〜12秒に絞る
練習用の開始条件として1920×1080、30fpsを提案。まずEvolutionなど一つのパラメーターだけをゆっくり動かす。多くの項目を同時に動かすと、どの設定が形を変えたか分かりにくい。

### 4. ループの継ぎ目を確認する
Fractal NoiseやTurbulent DisplaceのEvolutionの循環設定を学ぶ。Turbulent Noiseは別エフェクトなので、同じ設定があると仮定しない。全レイヤーの位置・色・明るさも開始と終了でつながる必要がある。AdobeにはCycle Evolutionとループ境界のフレームについて説明がある。
単にloopOutでキーフレームを繰り返しても、異なる最初と最後の画像が滑らかにつながるとは限りません。

### 5. Web向けに書き出して比較する
まず無音のMP4（H.264）を試す。元の制作ファイルは別に保管。秒数・解像度・圧縮の組み合わせを変えて、読み込み時間と模様の崩れを比較する。最初から4Kや高フレームレートにする必要はありません。金の細線・暗部の階調が圧縮でどう変わるかを見る。

## サイトに載せるときの練習コード
以下は教材用の例で、現在のサイトにはまだ組み込んでいません。今の背景はcore.jsのbackgroundsとrevision.jsのsceneで切り替えています。動画を使う場合はvideo要素と、その再生・停止を切り替える処理を追加します。

```html
<video id="background-video" muted loop playsinline
       preload="none" poster="backgrounds/marble/poster.jpg"
       aria-hidden="true" tabindex="-1">
  <source src="backgrounds/marble/loop.mp4" type="video/mp4">
</video>
```

```css
#background-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: -2;
}
```

```js
const video = document.querySelector('#background-video');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
function syncVideo() {
  if (userPaused || reduceMotion.matches || document.hidden) {
    video.pause();
  } else {
    video.play().catch(() => { /* 再生できなくても静止画を残す */ });
  }
}
reduceMotion.addEventListener('change', syncVideo);
document.addEventListener('visibilitychange', syncVideo);
syncVideo();
// 停止ボタンでuserPausedを切り替えてsyncVideoを呼ぶ。
```

無音・muted・playsinlineは自動再生を扱う上で大切ですが、再生成功を保証しません。posterなど静止画を用意し、停止ボタンと動きを減らす設定に対応させます。既存の全体停止ボタンも動画停止に接続する必要があります。
参照: [MDN 自動再生](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)、[video](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)、[prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)。

## 次の課題
1. 静止画の色違い3案を作る。
2. 選んだ1案を8秒程度のループにする。
3. 背景に本文を重ね、読みやすさと動きの量を調整。
4. スマートフォンの縦画面、ループ境界、停止時、低速回線で確認。
5. マウスに反応させたくなったらCanvasの座標・requestAnimationFrame、その後GLSLの座標・ノイズ・色の補間を学ぶ。

素材保管案: backgrounds/marble/ に loop.mp4、poster.jpg、README.md。編集元.aepは大きくなりやすいため、Web配信する素材とは別に保管すると管理しやすいです。
