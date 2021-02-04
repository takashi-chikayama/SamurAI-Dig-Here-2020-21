# 情報処理学会国際人工知能プログラミングコンテスト
# SamurAI Coding 2020-21 のためのソフトウェア

## 文書
### ゲームルール
SamurAI Dig Here ゲームのルールは以下のファイルにあります.

* 日本語版: [documents/rules-jp.html](documents/rules-jp.html)
* 英語版: [documents/rules.html](documents/rules.html)
### ゲーム管理システム
ゲーム管理システムのマニュアルは以下のファイルにあります.

* 英語版: [documents/manager.html](documents/manager.html)
* 日本語版: [documents/manager-jp.html](documents/manager-jp.html)
### ウェブページ
ゲームログを可視化するウェブページのマニュアルは以下のファイルにあります.

* 英語版: [documents/help.html](documents/help.html)
* 日本語版: Japanese version: [documents/help-jp.html](documents/help-jp.html)
### その他の文書
戦術のヒントなどは準備中です.

## はじめに
### 必要なもの

* C++ 開発環境 (C++14 以上のコンパイラと標準ライブラリ)
	* Cygwin 上での実行には問題があることがわかっています.
Windows では WSL (Windows Subsystem for Linux) の利用をご検討ください.
* ウェブブラウザ
    文書を読むため, ゲームのリプレイを見るため,
    そしてゲームの競技場の構成を編集するのにウェブブラウザが必要です.
    動作確認済みの OS とブラウザの組は以下があります.
	* Ubuntu: Chrome (85.0.4183.121), Firefox (80.0.1), Opera (71.0.3770.171)

### インストール

トップレベルのディレクトリで以下を実行してください.

```
$ make all
```

これで以下のソフトウェアができます.

* manager/manager
   ゲーム管理システム
* players/simplePlayer
   単純な AI プレイヤの例
* players/randomPlayer
   ランダムなプレイをするプレイヤ
* players/timeoutPlayer
   ときどき停止してしまうプレイヤ

## テスト

### テストラン
トップレベルのディレクトリで以下を実行してください.

```
$ make testrun
```

これで単純なプレイヤふたつの間でゲームを行い, 結果を [samples/testout.dighere](samples/testout.dighere) に書き出します.

### 結果の可視化

ウェブページ [webpage/dighere.html](webpage/dighere.html)
をウェブブラウザで開いてください.
![Image](icons/import.png "import button") をクリックすると,
ファイル選択ダイアログが出るので,
ゲームログ [samples/testout.dighere](samples/testout.dighere)
を選んで読み込んでください.
そしてプレイボタンを押せば記録したゲームの進行を可視化することができます.

ページ右上のクエスチョンマークのアイコンのボタンを押せば, このウェブページの使い方のマニュアルを表示できます.

## 競技場設定

競技場の設定を記述する拡張子 .dighere のファイルが
[maps](maps) ディレクトリ内に多数あります．

ディレクトリ [preliminary-candidates](maps/preliminary-candidates) には
予選および決勝ラウンドで用いる競技場設定の候補が入っています．
ただし隠れた埋蔵金は設定してありません．

## 著者

* **Takashi Chikayama** - *最初の版*

## ライセンス

このソフトウェア MIT ライセンスに従って配布します.  詳しくは [LICENSE.md](LICENSE.md) をご覧ください.

プロジェクトの一部 (picojson) は Cybozu Labs, Inc. と Kazuho Oku にライセンスされています.  詳しくは [manager/picojson.h](manager/picojson.h) をご覧ください.

## 謝辞

情報処理学会プログラミングコンテスト委員会のメンバーはゲームの設計やシステムのテストに協力しました.  委員は下記の皆さんです.

* 委員:
横山 大作 (明治大学, 委員長),
平石 拓 (京都大学, 副委員長),
鷲崎 弘宜 (早稲田大学，エグゼクティブアドバイザー),
近山 隆 (東京大学名誉教授),
高田 眞吾 (慶應義塾大学),
小林 祐樹 (日立製作所),
坂本 一憲 (WillBooster合同会社),
三輪 誠 (豊田工業大学),
長 健太 (東芝デジタルソリューションズ),
松尾 豊 (東京大学),
深澤 紀子 (鉄道総合技術研究所),
河内谷 清久仁 (日本アイ・ビー・エム),
木下 泰三 (情報処理学会)
