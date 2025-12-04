# yumicuit

**半覚醒のアイデアを逃さない**

"You are mi-cuit" — 夢を半生で保存するアプリ。

## ドキュメント

詳細は `docs/` を参照。

| ファイル | 内容 |
|----------|------|
| [docs/concept.md](docs/concept.md) | 名前の由来、コンセプト、設計思想 |
| [docs/ux-design.md](docs/ux-design.md) | 3モード詳細、UI原則、禁止事項 |
| [docs/technical.md](docs/technical.md) | 技術スタック、アーキテクチャ |
| [docs/data-model.md](docs/data-model.md) | データ構造、IndexedDBスキーマ |
| [docs/ai-generation.md](docs/ai-generation.md) | ローカルLLM、プロンプト設計 |
| [docs/monetization.md](docs/monetization.md) | 収益化戦略、広告配置ルール |
| [docs/roadmap.md](docs/roadmap.md) | 開発フェーズ、タスク一覧 |
| [docs/capacitor.md](docs/capacitor.md) | Capacitorとは、iOSビルド事情 |
| [docs/vision.md](docs/vision.md) | 最終ビジョン：夢の景色を持ち帰る |
| [docs/i18n.md](docs/i18n.md) | 多言語対応（日本語・英語） |

## クイックサマリー

### 3モード

1. **まどろみ記録**（起床直後）：黒紙 + 白文字、断片だけメモ、自動保存
2. **ふりかえり生成**（昼）：AIが断片から短編を強引に作文
3. **就寝前プライミング**：キーワード + 核の一文で再夢を狙う

### 技術

- React + Vite + Capacitor（PWA + 将来ネイティブ）
- IndexedDB（ローカル完結）
- LLM: ローカル（WebLLM/wllama）またはオンライン（ユーザーの既存アカウント）
- yumicuitの役割: プロンプト代筆 + API呼び出し代行

### 最終ビジョン：Dream Camera

夢の中で写真を撮っても、起きたら持ち帰れていない。
その落胆を解決する。参照画像の組み合わせからAIが夢の景色を合成。
「これが私の見た夢です」と他人に見せられる、人類初の体験を目指す。

### やらないこと（初期）

- テキスト（断片・ストーリー）の共有（個人名が出る）
- 通知・リマインダー
- 朝のUIに情報を詰め込む
- 朝・就寝前への広告

### 将来やること（Dream Camera後）

- 生成した「夢の景色」画像のSNS共有
- 修行 → Dream Camera → 共有 という新しい文化を作る

## 基本情報

- **ドメイン**: yumicuit.llll-ll.com
- **多言語**: 最初から英語対応（i18n辞書形式）
- **フォント**: 覚醒させない、刺激のないもの（昼も統一）

## 開発コマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# Capacitor同期（ネイティブ化時）
npx cap sync
```
