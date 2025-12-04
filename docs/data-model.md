# yumicuit データモデル

## 概要

yumicuitのデータはすべてローカル（IndexedDB）に保存される。
サーバーへの送信は行わない。

## メインスキーマ：DreamRecord

```typescript
interface DreamRecord {
  // === 記録時に作成 ===
  id: string;                    // ISO-8601 datetime (例: "2025-12-04T06:32:11.111Z")
  mood: 'joy';                   // 現状は「楽しい」のみ（将来拡張可能）
  tokens: string[];              // 断片の配列
  createdAt: number;             // Unix timestamp (ms)

  // === ふりかえり生成後に追加 ===
  storyVersions?: StoryVersion[];
  confirmedStory?: ConfirmedStory;
  seeds?: DreamSeeds;

  // === メタデータ（任意） ===
  tags?: string[];               // ユーザーが付けるタグ
  updatedAt?: number;            // 最終更新
}
```

## 断片（tokens）

起床直後に入力する単語の断片。

```typescript
tokens: string[]
```

### 例

```json
["港", "緑の鳥", "雷", "笑った", "追いかけっこ"]
```

### 特徴

- 改行で区切られた単語・フレーズ
- 文章である必要はない
- 順序は入力順（時系列的な意味を持つ可能性）
- 1つでも、10個でもOK

---

## AI生成バージョン（StoryVersion）

AIが断片から生成した短編のバージョン管理。

```typescript
interface StoryVersion {
  id: string;                    // 一意ID（例: "a1", "a2", "a3"）
  text: string;                  // 生成された短編（150-300字）
  params: GenerationParams;
  generatedAt: number;           // Unix timestamp
}

interface GenerationParams {
  force: number;                 // 強引さ 0.0-1.0
  focus: FocusType;              // 連想方向
  modelId?: string;              // 使用したモデル（デバッグ用）
}

type FocusType =
  | 'place'      // 場所を中心に
  | 'person'     // 人物を中心に
  | 'emotion'    // 感情を中心に
  | 'color'      // 色彩を中心に
  | 'sound';     // 音を中心に
```

### 例

```json
{
  "storyVersions": [
    {
      "id": "a1",
      "text": "港に立っていた。空は灰色で、遠くで雷が光っている。突然、緑色の小さな鳥が飛んできて、私の肩に止まった。鳥を追いかけて走り出すと、なぜか笑いが止まらなくなった。追いかけっこをしているうちに、雷鳴が近づいてきて...",
      "params": {
        "force": 0.6,
        "focus": "place"
      },
      "generatedAt": 1733312000000
    },
    {
      "id": "a2",
      "text": "笑い声が響いていた。誰かと追いかけっこをしている。緑の鳥が頭上を旋回している。港の匂いがする。遠くで雷が鳴り、その音がなぜかとても心地よい...",
      "params": {
        "force": 0.4,
        "focus": "emotion"
      },
      "generatedAt": 1733312100000
    },
    {
      "id": "a3",
      "text": "雷鳴の海。緑の翼。港で出会った鳥と追いかけっこ。笑いが止まらない。嵐が来ても怖くない。むしろ楽しい...",
      "params": {
        "force": 0.8,
        "focus": "sound"
      },
      "generatedAt": 1733312200000
    }
  ]
}
```

---

## 確定ストーリー（ConfirmedStory）

ユーザーが「こんな夢だった」と確定したバージョン。

```typescript
interface ConfirmedStory {
  id: string;                    // 選択したstoryVersionのid
  text: string;                  // 確定時点のテキスト（編集されている可能性）
  confirmedAt: number;           // Unix timestamp
  editedFromOriginal?: boolean;  // 手動編集したか
}
```

### 例

```json
{
  "confirmedStory": {
    "id": "a2",
    "text": "笑い声が響いていた。誰かと追いかけっこをしている。緑の鳥が頭上を旋回している。港の匂いがする。遠くで雷が鳴り、その音がなぜかとても心地よかった。",
    "confirmedAt": 1733315000000,
    "editedFromOriginal": true
  }
}
```

---

## 夢の種（DreamSeeds）

就寝前プライミングモードで表示するデータ。

```typescript
interface DreamSeeds {
  keywords: string[];            // 5-7個のキーワード
  core: string;                  // 核の一文
}
```

### 例

```json
{
  "seeds": {
    "keywords": ["港", "緑の鳥", "雷", "笑った", "追いかけっこ"],
    "core": "雷鳴の海で、緑の鳥を追いかけて笑った。"
  }
}
```

### 生成ルール

- `keywords`：元のtokensから5-7個選択（重要度順）
- `core`：confirmedStoryから1文に要約（詩的・短く）

---

## 完全なレコード例

```json
{
  "id": "2025-12-04T06:32:11.111Z",
  "mood": "joy",
  "tokens": ["港", "緑の鳥", "雷", "笑った", "追いかけっこ"],
  "createdAt": 1733300000000,

  "storyVersions": [
    {
      "id": "a1",
      "text": "港に立っていた。空は灰色で...",
      "params": {"force": 0.6, "focus": "place"},
      "generatedAt": 1733312000000
    },
    {
      "id": "a2",
      "text": "笑い声が響いていた...",
      "params": {"force": 0.4, "focus": "emotion"},
      "generatedAt": 1733312100000
    },
    {
      "id": "a3",
      "text": "雷鳴の海。緑の翼...",
      "params": {"force": 0.8, "focus": "sound"},
      "generatedAt": 1733312200000
    }
  ],

  "confirmedStory": {
    "id": "a2",
    "text": "笑い声が響いていた。誰かと追いかけっこをしている。緑の鳥が頭上を旋回している。港の匂いがする。遠くで雷が鳴り、その音がなぜかとても心地よかった。",
    "confirmedAt": 1733315000000,
    "editedFromOriginal": true
  },

  "seeds": {
    "keywords": ["港", "緑の鳥", "雷", "笑った", "追いかけっこ"],
    "core": "雷鳴の海で、緑の鳥を追いかけて笑った。"
  },

  "tags": ["海", "動物", "楽しい"],
  "updatedAt": 1733315000000
}
```

---

## IndexedDB構造

### Database: `yumicuit-db`

### Object Stores

| Store名 | キー | 用途 |
|---------|------|------|
| `dreams` | `id` | DreamRecordを保存 |
| `settings` | `key` | ユーザー設定 |
| `modelCache` | `modelId` | LLMモデルのメタデータ |

### インデックス

```javascript
// dreams store
createIndex('createdAt', 'createdAt');    // 日付でソート
createIndex('mood', 'mood');               // 気分でフィルタ
createIndex('hasConfirmed', 'confirmedStory'); // 確定済みフィルタ
```

---

## 設定データ

```typescript
interface Settings {
  // AI生成デフォルト
  defaultForce: number;          // 0.0-1.0, default: 0.5
  defaultFocus: FocusType;       // default: 'emotion'
  preferredModelId?: string;     // ユーザー選択モデル

  // UI設定
  hapticFeedback: boolean;       // 触覚フィードバック, default: true
  autoSaveDelay: number;         // 自動保存までの秒数, default: 3

  // その他
  onboardingCompleted: boolean;
  lastOpenedAt?: number;
}
```

---

## データ量の目安

| 項目 | サイズ目安 |
|------|------------|
| 1レコード（断片のみ） | 0.5-1 KB |
| 1レコード（生成済み） | 3-5 KB |
| 1年分（365日×50%記録率） | 500 KB - 1 MB |
| LLMモデル（3B Q4） | 1.5-2 GB |

- 夢データは軽い
- モデルが重い（分割ダウンロード・削除UIが必要）

---

## エクスポート（将来）

```typescript
interface ExportData {
  version: string;               // エクスポート形式バージョン
  exportedAt: number;
  dreams: DreamRecord[];
  settings: Settings;
}
```

- JSON形式
- 本人用バックアップのみ（共有機能はなし）
