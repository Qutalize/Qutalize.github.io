# GLSL背景の編集
現在の背景は模様・波・照明をGLSLで描画しています。background-source.htmlには実行に使うファイルの中身を表示します。

| ファイル | 担当 |
| --- | --- |
| shaders/patterns.glsl | 座標から模様の色を計算。fractで反復、距離関数とsmoothstepで線を生成 |
| shaders/cloth.vert.glsl | 6方向の正弦波で頂点を変形。heightAtの差分から法線を算出 |
| shaders/cloth.frag.glsl | 模様の色、拡散光、光沢、繊維の細かな明暗を合成 |
| textile.js | WebGL初期化・格子メッシュ・時間とuniformの更新 |

patterns.glslはcloth.frag.glslの // @patterns に挿入してからコンパイルします。uPatternは0=leaves、1=diamonds、2=plaid、3=lattice、4=arcs、5=hexagons。ページとの対応はtextile.jsのstylesで変更します。

waveDataは各波の方向、周波数、振幅、速度です。初期値だけランダム化し、その後は連続関数でゆっくり変化します。波を低くするには振幅、遅くするには速度を小さくしてください。これは見た目のための面の変形で、張力や衝突を解く布の物理シミュレーションではありません。

JavaScriptのpattern()はWebGL非対応・シェーダー読込失敗時の静止画フォールバックです。通常の模様はGLSLのpatternColor()が生成し、Canvasの画像を貼り付けていません。

OSの動きを減らす設定や非表示タブではアニメーションを停止します。解像度は幅1800px、デバイス倍率1.5を上限にしています。GLSLを編集したら `node site-v2/build-content.cjs` で `shaders/sources.js` を再生成します。このスクリプトを使って、HTMLを直接開いた場合もシェーダーを読み込みます。

Homeは左70%にセージグレーの一定濃度の幕、右30%は模様をそのまま表示します。境界はぼかしません。layout.cssがナビ・本文・概要カードの唯一の追加レイアウト定義です。
