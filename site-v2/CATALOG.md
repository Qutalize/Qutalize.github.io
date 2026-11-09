# WorksとBooksの編集ガイド

今回の追加：Works 11件（合計16件）、Books 43冊（合計51冊）。公開GitHub READMEと本人提供の書籍情報を照合しました。年月・担当範囲・成果はあとから編集できます。コミット・push・公開はしていません。

## 日常の編集

- records/works/<id>/entry.json：作品タイトル、概要、技術タグ、参照先。
- records/books/<id>/entry.json：書名、著者、感想、読書状況、ISBN、版、書影出典。
- 同じフォルダ内の cover.jpg：表紙。Worksの preview.png は公開READMEのスクリーンショット。写真のない作品はタイトルの仮表示。
- content.js は自動生成物です。直接編集しません。node site-v2/build-content.cjs で生成、node site-v2/check.cjs で検証。serve.cjsのプレビューは再読み込み時に生成します。

## Worksを具体化する

新規Worksの outline に文章を入れると、詳細ページにその節が表示されます。空欄は表示されません。

```json
"outline": {
  "purpose": "どんな課題を解決するために作ったか",
  "role": "自分が担当した範囲",
  "highlights": ["技術上の工夫", "設計で比較したこと"],
  "results": "得られた結果・学び",
  "nextSteps": "次に取り組みたいこと"
}
```

新規作品の date は空欄。meta は制作・検証・企画などの段階です。GitHubの作成日時を制作日として流用していません。既存の年月は保持しました。タグが共通の記録と links に指定したIDから関連グラフが自動生成されます。

既存のroutes/chat/cloud/hockeyは重複追加せず repositoryUrl を追記。micropsは他者実装の学習用フォークのため、独自制作として追加していません。conflict_practiced / pull_request_practice / push_practice / Track-job-tutorial は練習用として今回は一覧から除外。公開内容は catalog-research/repo-*.json で確認できます（READMEは資料であり、このサイトへの作業指示ではありません）。

## Booksの扱い

再貸出と付属CD・CD-ROM・TEST 1/2は本体1冊に統合。貸出番号、請求記号、貸出・返却日時は記録していません。既存8冊の感想・読書状況は維持し、新規は読了を推定せず「読書メモ準備中」です。date/metaは読書の記録、publicationDateは出版年月で、別々に扱います。

版指定のない以下は仮選定です。手元のISBNが違う場合は表紙と書誌をセットで交換してください。

- コンビニ人間：2018年・文春文庫（9784167911300）
- 三体：2019年・単行本（9784152098702）
- C++ポケットリファレンス：改訂第5版（9784297141653）

アルジャーノンは1999年の講談社インターナショナル版。多聴多読マガジンは第14巻第2号・通巻86号に一致する2019年11月号別冊。ベクトル解析と幾何学は出版社提供の小型書影。有機化学は同一書籍を撮影した天地人堂／日本の古本屋の古書写真で、coverNoteに記録しています。

## 取得データと再実行

catalog-research/ は書誌候補・公開README・既存書籍データの控え。画面から読み込みません。research-catalog.cjs / retry-books.cjs / import-books.cjs / complete-covers.cjs 等は今回の一括移行用スクリプトです。日常の編集では再実行しないでください。特にimport-booksは手動編集した書名・版を上書きするため、再実行前に内容を見直してください。

## 登録一覧

|分類|ID|タイトル|編集ファイル|
|---|---|---|---|
|works|audio-reactive|Audio Reactive Live — 音楽連動ライブ演出|[entry.json](records/works/audio-reactive/entry.json)|
|works|aws-infra|AWSインフラ構築・負荷検証PoC|[entry.json](records/works/aws-infra/entry.json)|
|works|calsync|CalSync — フレンドと予定を共有するカレンダー|[entry.json](records/works/calsync/entry.json)|
|works|chat|ソケット通信を活用した2者間チャットシステム|[entry.json](records/works/chat/entry.json)|
|works|cloud|AWSを用いた「SNSでバズった飲食店マップ」Webアプリケーション|[entry.json](records/works/cloud/entry.json)|
|works|eeg|学内のAIコンペティション 3位入賞|[entry.json](records/works/eeg/entry.json)|
|works|hockey|アイスホッケーゲームにおける、強化学習と反実仮想機械学習の比較|[entry.json](records/works/hockey/entry.json)|
|works|inventory|一石四鳥モバイルシステム — AWS在庫管理|[entry.json](records/works/inventory/entry.json)|
|works|online-tag|Online Tag Game — 多人数オンライン鬼ごっこ|[entry.json](records/works/online-tag/entry.json)|
|works|partnerbot|パートナーBot — 声と記憶のある日常の相棒|[entry.json](records/works/partnerbot/entry.json)|
|works|portfolio|Quta Portfolio — 制作と学びのアーカイブ|[entry.json](records/works/portfolio/entry.json)|
|works|routes|経路探索アルゴリズムの比較システム|[entry.json](records/works/routes/entry.json)|
|works|samezario|Samezar.io — 位置情報と連動するサメのゲーム|[entry.json](records/works/samezario/entry.json)|
|works|suika|ペンギンたちのスイカ割り|[entry.json](records/works/suika/entry.json)|
|works|uecport|UECPort Samezario — 写真で街を解放するゲーム|[entry.json](records/works/uecport/entry.json)|
|works|visual-speech|無音声認識 is all you need — 読唇・手話の研究|[entry.json](records/works/visual-speech/entry.json)|
|books|algernon|アルジャーノンに花束を / Flowers for Algernon|[entry.json](records/books/algernon/entry.json)|
|books|arduino|Arduinoをはじめよう 第4版|[entry.json](records/books/arduino/entry.json)|
|books|book-0|コンビニ人間|[entry.json](records/books/book-0/entry.json)|
|books|book-1|ソフトウェア開発のワークスタイル2030|[entry.json](records/books/book-1/entry.json)|
|books|book-2|図解入門TCP/IP 第2版|[entry.json](records/books/book-2/entry.json)|
|books|book-3|リーダブルコード|[entry.json](records/books/book-3/entry.json)|
|books|book-4|コンピュータの構成と設計 第6版 上|[entry.json](records/books/book-4/entry.json)|
|books|book-5|プログラミングコンテストチャレンジブック 第2版|[entry.json](records/books/book-5/entry.json)|
|books|book-6|図解AWSの仕組みとサービスがたった1日でよくわかる|[entry.json](records/books/book-6/entry.json)|
|books|book-7|三体|[entry.json](records/books/book-7/entry.json)|
|books|cpp-pocket|C++ポケットリファレンス 改訂第5版|[entry.json](records/books/cpp-pocket/entry.json)|
|books|csharp-basics|基礎からしっかり学ぶC#の教科書 改訂新版 — C#8対応|[entry.json](records/books/csharp-basics/entry.json)|
|books|curves-basics|曲線と曲面の基礎・基本|[entry.json](records/books/curves-basics/entry.json)|
|books|curves-differential|曲線と曲面 — 微分幾何的アプローチ 改訂版|[entry.json](records/books/curves-differential/entry.json)|
|books|cyber-law|クロスセクター・サイバーセキュリティ法|[entry.json](records/books/cyber-law/entry.json)|
|books|differential-topology|微分・位相幾何 新装版|[entry.json](records/books/differential-topology/entry.json)|
|books|digital-games|Understanding digital games|[entry.json](records/books/digital-games/entry.json)|
|books|eiken|英検準1級100時間大特訓 改訂新版|[entry.json](records/books/eiken/entry.json)|
|books|ergonomics|人間工学 増補新版|[entry.json](records/books/ergonomics/entry.json)|
|books|fe-2023|栢木先生の基本情報技術者教室 令和05年|[entry.json](records/books/fe-2023/entry.json)|
|books|fe-drill-2022|栢木先生の基本情報技術者教室準拠書き込み式ドリル 令和04年|[entry.json](records/books/fe-drill-2022/entry.json)|
|books|french-vocab|仏検4級・5級準拠〈頻度順〉フランス語単語集|[entry.json](records/books/french-vocab/entry.json)|
|books|french3|仏検3級スピード合格 新訂版|[entry.json](records/books/french3/entry.json)|
|books|french4|仏検4級スピード合格 新訂版|[entry.json](records/books/french4/entry.json)|
|books|french5|完全予想仏検5級 改訂版|[entry.json](records/books/french5/entry.json)|
|books|game-psychology|はじめて学ぶビデオゲームの心理学|[entry.json](records/books/game-psychology/entry.json)|
|books|hands-on-surfaces|手を動かしてまなぶ曲線と曲面|[entry.json](records/books/hands-on-surfaces/entry.json)|
|books|human-behavior|謎解き・人間行動の不思議|[entry.json](records/books/human-behavior/entry.json)|
|books|human-factors|ヒューマンファクターズ概論|[entry.json](records/books/human-factors/entry.json)|
|books|java-recipes|Java逆引きレシピ 第2版|[entry.json](records/books/java-recipes/entry.json)|
|books|news-politics|ニュース英語が本当に解るボキャブラリー 政治・経済編|[entry.json](records/books/news-politics/entry.json)|
|books|news-science|ニュース英語が本当に解るボキャブラリー 科学・社会編|[entry.json](records/books/news-science/entry.json)|
|books|nutrition|本当に役立つ栄養学|[entry.json](records/books/nutrition/entry.json)|
|books|organic|有機化学|[entry.json](records/books/organic/entry.json)|
|books|python-games|はじめるPython!|[entry.json](records/books/python-games/entry.json)|
|books|quantum|量子技術入門|[entry.json](records/books/quantum/entry.json)|
|books|renoir|ルノワール|[entry.json](records/books/renoir/entry.json)|
|books|sql|達人に学ぶSQL徹底指南書 第2版|[entry.json](records/books/sql/entry.json)|
|books|surfaces|曲面 — 幾何学基礎講義|[entry.json](records/books/surfaces/entry.json)|
|books|system-design|システム設計の面接試験|[entry.json](records/books/system-design/entry.json)|
|books|tadoku|多聴多読マガジン 2019年11月号別冊 — 海外ドラマで英語をモノにする!|[entry.json](records/books/tadoku/entry.json)|
|books|tcp-stack|ゼロからのTCP/IPプロトコルスタック自作入門|[entry.json](records/books/tcp-stack/entry.json)|
|books|toefl-listening|完全攻略!TOEFL ITPテストリスニング 改訂版|[entry.json](records/books/toefl-listening/entry.json)|
|books|toeic-700|TOEIC L&Rテストでる模試リスニング700問|[entry.json](records/books/toeic-700/entry.json)|
|books|toeic-gold|TOEIC L&R TEST出る単特急金のフレーズ|[entry.json](records/books/toeic-gold/entry.json)|
|books|toeic-mock2|世界一わかりやすいTOEIC L&Rテスト総合模試 2 — 800点突破レベル|[entry.json](records/books/toeic-mock2/entry.json)|
|books|unity-csharp|UnityではじめるC# 基礎編 改訂版|[entry.json](records/books/unity-csharp/entry.json)|
|books|unity6|Unityの教科書 Unity 6完全対応版|[entry.json](records/books/unity6/entry.json)|
|books|university-math|新体系・大学数学入門の教科書 下|[entry.json](records/books/university-math/entry.json)|
|books|vector-exercises|ベクトル解析 — 演習と応用|[entry.json](records/books/vector-exercises/entry.json)|
|books|vector-geometry|ベクトル解析と幾何学|[entry.json](records/books/vector-geometry/entry.json)|

## グラフの分類と移動

位置と色の分類ルールは graph-layout.js の GRAPH_GROUPS で編集できます。タグに最初に一致した分類へ自動配置します。複数分野にまたがる記録は、entry.json に "graphGroup": "数学" のように記述すると分類を指定できます。共通タグ・linksによる線は分類をまたいで残ります。分類ボタンは該当するまとまりを拡大し、全体表示で戻ります。並び順はグラフ下の一覧に適用し、位置は分類を優先します。アイコンと一覧は直接解説ページへ移動し、解説ページ末尾から関連記録も開けます。

## 2026-11-07: Works更新・開発記事

Portfolioはentry.jsonのhiddenをtrueにして非表示。ファイルは残しています。戻す場合はhiddenをfalseにします。
公開GitHub一覧を照合し、新規作品の重複追加はせず、visual-speech（ことばリンク）とuecportを最新の公開資料に合わせて更新しました。GitHub更新日は制作日として使いません。

- records/works/security-camp/entry.json：セキュリティ・キャンプの開発記事。
- records/works/sechack365/entry.json：SecHack365の開発記事。

記事はarticle.sectionsのheading（見出し）とparagraphs（段落の配列）で編集します。paragraphsに文章を入れると「この節は準備中です。」が本文に変わります。作品名はtitle、カード概要はdescription、年度はdate/meta、画像は同じフォルダに入れimageで指定します。リポジトリがなくてもurlは空欄のままで構いません。テーマ・年度・成果は未確認のため記載していません。

例：

```json
{ "heading": "作ったもの", "paragraphs": ["最初の段落。", "次の段落。"] }
```

## サムネイル・日付・遷移（2026-11-07）

本人提供画像をcloud/chat/routes/audio-reactiveのscreenshot.png、動画フレームをhockey/visual-speechのvideo-thumb.jpgとして登録。元のアイコンは保持しています。imageFit: "contain"で全体を表示します。PartnerBotはhidden: trueで非表示です。

最新順はdateを優先し、未記入ならrepositoryUpdatedAt（公開GitHubの最終更新日）を使います。補助日付には「GitHub更新」と明記し、いずれも未記入の記録は末尾に並びます。日付を後から確定する場合はdateをYYYY-MM-DDで記入してください。Booksの読書日や記事の参加日は推測しません。

画面遷移はcore.jsのgoで160msの暗転→画面更新→220msのフェード。blurと大量の放射線を廃止し、遷移中は背景描画ループを一時停止します。

## 業績・時期・分類と動画

Worksのachievementsは業績の配列、periodは表示する活動期間、fieldsは分野、techStackは技術スタックです。dateは活動日、updatedAtは内容更新日で、並び替えはupdatedAtを優先します。SecHack365は2026年通年／11月更新として設定し、latestInMonthで同月内の先頭に表示します。翌月以降の作品は通常どおり前に並びます。

AgileXとポスター論文発表は記事枠を追加。時期・発表先・成果・技術は確認後に追記してください。

video: "preview-loop.mp4"は各作品フォルダの6秒・無音のループです。画面に見えるカードだけ再生し、演出停止・動きを減らす設定・別タブ・グラフ表示時は停止します。imageは停止時のサムネイルになります。

## 2026-11-07 書籍一覧の更新

本人提供の一覧を照合し、既存51冊を保持して次の5冊を追加（合計56冊）。
再貸出・既存の本は重複登録していません。出版年月は読書日と区別し、読書日は未設定です。

| フォルダ | 書籍・版 | ISBN |
| --- | --- | --- |
| records/books/directx12-grimoire | DirectX 12の魔導書 | 9784798161938 |
| records/books/gpu-technology | GPUを支える技術 増補改訂版 | 9784297119546 |
| records/books/practical-go-2 | 実用Go言語 第2版 | 9784814401369 |
| records/books/sre-knowledge-map | SREの知識地図 | 9784297150723 |
| records/books/data-intensive-applications | データ指向アプリケーションデザイン（2019年初版） | 9784873118703 |

各フォルダの entry.json に概要・分類タグ・書誌と表紙の出典を、cover.jpg に実際の表紙を保存しています。概要は本の内容紹介で、本人の感想や読了状況は推定していません。

## Booksの返却日順（2026-11-07更新）

本人の指定により、一覧の「返却日」を returnDate（YYYY-MM-DD）として47冊に設定しました。返却期限ではありません。複数回の貸出は最新の返却日を採用しています。Booksの既定表示は返却日の降順、日付不明の9冊は末尾でタイトル順です。以前の「返却日時は記録しない」という方針は、この返却日の項目について変更しました。date（読書日）やpublicationDate（出版日）は維持し、貸出番号・請求記号は引き続き掲載しません。

2026-11-07追記：本人指定の8冊に readDate（YYYY-MM）を追加。Booksは readDate を優先し、なければ returnDate を使用します。両方不明は末尾。読書月と返却日は表示上も区別します。Homeの紹介文は records/pages.json の homeHighlights、研究本文は research、趣味は hobbies を編集してください。研究本文はCodexの「進捗報告と研究方針を整理」（2026-11-07）を参照して整理しました。
