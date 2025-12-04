# yumicuit デザイントークン

## カラー

### 背景

```css
--color-bg: #000000;           /* 完全な黒 */
--color-bg-elevated: #111111;  /* 少し浮いた要素（カード等） */
```

### テキスト

```css
--color-text-primary: #AAAAAA;   /* メイン文字（抑えめ白） */
--color-text-secondary: #777777; /* 補助文字 */
--color-text-muted: #555555;     /* さらに控えめ */
```

**#FFFFFFは使わない**。純粋な白は眩しいため。

### アクセント（昼モードのみ）

```css
--color-accent: #6B7280;         /* 控えめなグレー系 */
--color-accent-hover: #9CA3AF;   /* ホバー時 */
```

派手な色は使わない。昼モードでも統一感を保つ。

### 状態

```css
--color-success: #4B5563;        /* 成功（控えめ） */
--color-error: #6B4444;          /* エラー（控えめな赤） */
```

---

## タイポグラフィ

### フォント

```css
--font-family: 'Noto Sans JP', 'Noto Sans', system-ui, sans-serif;
```

- 刺激のない、落ち着いたフォント
- 日本語・英語両対応
- システムフォントをフォールバック

### サイズ

```css
--font-size-input: 1.25rem;      /* 入力文字（やや大きめ） */
--font-size-body: 1rem;          /* 本文 */
--font-size-small: 0.875rem;     /* 小さい文字 */
--font-size-seeds: 1.125rem;     /* 夢の種キーワード */
--font-size-core: 1rem;          /* 夢の種・核の一文 */
```

### 行間

```css
--line-height-relaxed: 1.8;      /* 入力時（広め） */
--line-height-normal: 1.5;       /* 通常 */
```

---

## スペーシング

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
```

---

## アニメーション

```css
--duration-fast: 120ms;
--duration-normal: 180ms;
--easing-default: ease-out;
```

- 派手なアニメーションは禁止
- フェードのみ、短い duration

---

## ボーダー

```css
--border-radius: 4px;            /* 角丸（控えめ） */
--border-color: #333333;         /* ボーダー色（暗め） */
```

---

## 入力エリア

```css
/* まどろみ記録モードの入力 */
.dream-input {
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-size: var(--font-size-input);
  line-height: var(--line-height-relaxed);
  border: none;
  outline: none;
  caret-color: var(--color-text-primary);
}

.dream-input::placeholder {
  color: transparent;  /* プレースホルダーなし */
}
```

---

## 全モード共通

| 要素 | 朝 | 昼 | 就寝前 |
|------|----|----|--------|
| 背景 | #000000 | #000000 | #000000 |
| 文字 | #AAAAAA | #AAAAAA | #AAAAAA（さらに薄くてもOK） |
| アクセント | なし | #6B7280 | なし |

昼モードも黒背景で統一。覚醒してもいいが、刺激は最小限。

---

## CSS変数まとめ

```css
:root {
  /* Colors */
  --color-bg: #000000;
  --color-bg-elevated: #111111;
  --color-text-primary: #AAAAAA;
  --color-text-secondary: #777777;
  --color-text-muted: #555555;
  --color-accent: #6B7280;
  --color-accent-hover: #9CA3AF;
  --color-success: #4B5563;
  --color-error: #6B4444;
  --color-border: #333333;

  /* Typography */
  --font-family: 'Noto Sans JP', 'Noto Sans', system-ui, sans-serif;
  --font-size-input: 1.25rem;
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-seeds: 1.125rem;
  --font-size-core: 1rem;
  --line-height-relaxed: 1.8;
  --line-height-normal: 1.5;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Animation */
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --easing-default: ease-out;

  /* Border */
  --border-radius: 4px;
}
```
