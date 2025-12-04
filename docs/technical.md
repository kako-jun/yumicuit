# yumicuit 技術設計

## 技術スタック概要

```
┌─────────────────────────────────────────┐
│           フロントエンド                │
│  React + Vite + Capacitor (PWA+Native) │
├─────────────────────────────────────────┤
│           ストレージ                    │
│  IndexedDB (ローカル完結)              │
├─────────────────────────────────────────┤
│           AI推論                        │
│  WebLLM (WebGPU) / wllama (WASM)       │
├─────────────────────────────────────────┤
│           オフライン                    │
│  Service Worker + Cache API            │
└─────────────────────────────────────────┘
```

## React + Vite + Capacitor

### なぜこの組み合わせか

- **React**：エコシステムが巨大、情報が豊富、安定している
- **Vite**：高速ビルド、シンプルな設定
- **Capacitor**：PWAとネイティブアプリを同一コードベースで出せる
- 初期はPWAで公開、需要があればネイティブ化（AdMob対応）

### 構成

```
src/
├── pages/
│   ├── Record.tsx            # まどろみ記録モード
│   ├── Review.tsx            # ふりかえり生成モード
│   └── Seeds.tsx             # 就寝前プライミングモード
├── components/               # UIコンポーネント
├── hooks/                    # カスタムフック
├── lib/
│   ├── db/                   # IndexedDB操作
│   └── llm/                  # ローカルLLM
├── App.tsx
└── main.tsx
```

### ビルド設定

- Viteで静的ビルド
- vite-plugin-pwa でService Worker生成
- Capacitorでラップしてネイティブビルド可能に

---

## PWA構成

### manifest.json

```json
{
  "name": "yumicuit",
  "short_name": "yumicuit",
  "description": "半覚醒のアイデアを逃さない",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [...]
}
```

- 背景色・テーマ色は黒（#000000）
- standaloneモードでブラウザUIを隠す

### Service Worker

```javascript
// キャッシュ優先（offline-first）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

- アプリシェルを事前キャッシュ
- モデルファイルは分割して段階的にキャッシュ
- 朝の記録は通信ゼロで動作

---

## ストレージ（IndexedDB）

### なぜIndexedDBか

- ローカル完結が必須要件
- LocalStorageでは容量不足（5MB制限）
- IndexedDBなら数十MB〜数GB（端末による）

### 容量の注意点

| プラットフォーム | 容量目安 |
|------------------|----------|
| Chrome/Edge (PC) | 空き容量の数%〜数GB |
| Chrome (Android) | 同上 |
| Safari (iOS)     | 厳しめ（数十〜数百MB） |

- `navigator.storage.estimate()` で残量を監視
- モデルキャッシュは分割/削除UIを用意
- Safari/iOSでは自動削除リスクがあるため、重要データは小さく保つ

### スキーマ

```typescript
interface DreamRecord {
  id: string;                    // ISO-8601 datetime
  mood: 'joy';                   // 現状は楽しい夢のみ
  tokens: string[];              // 断片の配列
  createdAt: number;             // Unix timestamp

  // 生成後に追加
  storyVersions?: StoryVersion[];
  confirmedStory?: ConfirmedStory;
  seeds?: DreamSeeds;
}

interface StoryVersion {
  id: string;
  text: string;                  // 150-300字
  params: {
    force: number;               // 0.0-1.0
    focus: 'place' | 'person' | 'emotion' | 'color' | 'sound';
  };
}

interface ConfirmedStory {
  id: string;                    // 選択したstoryVersionのid
  text: string;
  confirmedAt: number;
}

interface DreamSeeds {
  keywords: string[];            // 5-7個
  core: string;                  // 核の一文
}
```

---

## ローカルLLM

### 従量課金しない

- クラウドAPIは使わない（従量課金したくない）
- 全部ローカルで完結がベスト
- 昼だけオンライン補助は許容（ただし既定はOFF）

### WebGPU / WebLLM

```
WebGPU対応端末
  ↓
WebLLM (MLC) でGPU推論
  ↓
高速（数十トークン/秒）
```

- 2025年末時点でChrome/Edge/Firefox/Safariに広く展開
- iOS 26のSafariでもWebGPU有効（Metalベース）
- スマホブラウザでも実用的な速度

### WASMフォールバック

```
WebGPU非対応 or メモリ少
  ↓
wllama / llama-cpp-wasm でCPU推論
  ↓
低速だが動く
```

- WebGPUがない環境でもGGUFモデルを回せる
- 速度は落ちるが朝の断片保存には影響なし（昼の生成のみ）

### 検出ロジック

```javascript
async function initLLM() {
  if (navigator.gpu) {
    // WebGPU対応 → WebLLM
    return await initWebLLM();
  } else {
    // フォールバック → wllama
    return await initWllama();
  }
}
```

### モデル選択

| モデル | サイズ | 用途 |
|--------|--------|------|
| Phi-3/3.5 mini | 3B | 軽量、スマホ向け |
| Llama 3.1 | 3B/8B軽量版 | バランス |
| Gemma 2 | 2B/7B | 選択肢 |

- Q4/Q5量子化でスマホでも現実的な速度
- 初回起動時に小さめモデルを選択
- 端末性能検出で「高速版/高品質版」を後からダウンロード提案

### モデル配布

- CDNからMLC形式（分割）をCacheStorage/IndexedDBに保存
- Progressバーはワーカーからイベント送出
- 分割ダウンロードで中断・再開可能に

### 推論アーキテクチャ

```
メインスレッド（UI）
    ↓ postMessage
Web Worker
    ↓
WebLLM / wllama 推論
    ↓ postMessage（ストリーム）
メインスレッド（UI更新）
```

- UIスレッドをブロックしない
- ストリーム出力でリアルタイム表示

---

## 起動導線

### iOS

1. PWA Install（ホーム画面に追加）
2. Siriショートカット「楽しい夢」→ URL Schemeで即入力画面

### Android

1. PWA Install
2. クイック設定タイル or ホームショートカット

### PC

- PWAなので自動対応
- 主に昼のふりかえりモードで使用

---

## パフォーマンス目標

| 指標 | 目標 |
|------|------|
| 起動→入力可能 | 1秒以内 |
| 自動保存 | 即時（非同期） |
| 画面暗転 | 保存後200ms以内 |
| AI生成（3案） | 30秒以内（スマホ） |

---

## セキュリティ・プライバシー

### ローカル完結

- データは端末内のIndexedDBのみ
- サーバーに夢の内容を送信しない
- LLM推論もローカル

### 個人名への配慮

- 夢には個人名が出てくる
- 共有機能は作らない
- エクスポートは本人用のみ（将来）

---

## ブラウザ互換性

| ブラウザ | WebGPU | IndexedDB | PWA |
|----------|--------|-----------|-----|
| Chrome 121+ | ✓ | ✓ | ✓ |
| Edge | ✓ | ✓ | ✓ |
| Firefox | ✓ (一部) | ✓ | ✓ |
| Safari 18+ | ✓ | ✓ (容量注意) | ✓ |
| iOS Safari 26+ | ✓ | ✓ (容量注意) | ✓ |

### 注意点

- Safari/iOSのIndexedDB容量は厳しめ
- Firefox/LinuxのWebGPUはフラグ有りの場合あり
- WASMフォールバックで全環境カバー
