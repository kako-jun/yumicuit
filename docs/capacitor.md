# Capacitorとは

## 概要

**Capacitor**はIonicが開発したオープンソースのネイティブランタイム。
Webアプリを**iOS/Android/Electronのネイティブアプリに変換**できる。

```
Web App (HTML/CSS/JS)
        ↓
    Capacitor
        ↓
┌───────┬───────┬─────────┐
│  iOS  │Android│ Electron│
└───────┴───────┴─────────┘
```

## SvelteKitとの組み合わせ

### なぜSvelteKit + Capacitorか

- **SvelteKit**：静的サイト（SPA）を生成できる
- **Capacitor**：その静的サイトをネイティブアプリにラップ

流れ：
```
SvelteKit (adapter-static)
        ↓
    静的HTML/JS/CSS
        ↓
    Capacitor
        ↓
    iOS/Android アプリ
```

### Svelteだけの特権ではない

**Capacitorはフレームワーク非依存。**

| フレームワーク | 使える？ | 備考 |
|----------------|----------|------|
| Svelte/SvelteKit | ✓ | 推奨 |
| React/Next.js | ✓ | SSR切ればOK |
| Vue/Nuxt | ✓ | 同上 |
| Angular | ✓ | Ionicと相性◎ |
| バニラJS | ✓ | 何でもOK |

**条件**：静的なHTML/JS/CSSを出力できること。
（SSRが必要なアプリは不向き）

### Reactで使うなら

```bash
# Reactプロジェクトにインストール
npm install @capacitor/core @capacitor/cli

# 初期化
npx cap init

# プラットフォーム追加
npx cap add ios
npx cap add android

# ビルド → 同期
npm run build
npx cap sync
```

Next.jsの場合は `output: 'export'` で静的エクスポートに設定。

---

## iOSビルドの現実

### 残念なお知らせ

**iOSアプリのビルドにはMacが必要。**

これはAppleの制限であり、Capacitorの問題ではない。

```
iOS ビルド
    ↓
  Xcode 必須
    ↓
  macOS 必須
```

### 選択肢

#### 1. Macを持っている場合

```bash
# ビルド
npm run build

# Capacitor同期
npx cap sync ios

# Xcodeで開く
npx cap open ios

# Xcode上でビルド → シミュレータ or 実機テスト
# App Store Connect にアップロード
```

#### 2. Macを持っていない場合

**A. クラウドビルドサービス**

| サービス | 特徴 | 料金 |
|----------|------|------|
| [Appflow](https://ionic.io/appflow) | Ionic公式、Capacitor統合 | 有料（$499/月〜） |
| [Codemagic](https://codemagic.io/) | CI/CD、Flutter/React Native/Capacitor | 無料枠あり |
| [Bitrise](https://bitrise.io/) | CI/CD汎用 | 無料枠あり |
| [GitHub Actions + macOS](https://github.com/features/actions) | macOSランナー | 有料（従量課金） |

**B. レンタルMac**

- [MacStadium](https://www.macstadium.com/) - Mac miniをクラウドで
- [MacinCloud](https://www.macincloud.com/) - 時間課金

**C. 中古Macを買う**

- Mac miniなら5-10万円程度
- Xcodeが動けばOK

### 現実的な戦略

```
[Phase 1] PWAで公開
    ↓
  Macなくても動く
  ストア審査なし
    ↓
[Phase 2] ユーザーが増えたらネイティブ化を検討
    ↓
  クラウドビルド or Mac購入
```

---

## Androidビルド

### こちらはLinux/Windowsで可能

```bash
# ビルド
npm run build

# Capacitor同期
npx cap sync android

# Android Studioで開く
npx cap open android

# ビルド → APK/AAB生成
```

必要なもの：
- Android Studio
- JDK
- Android SDK

**Macなしでも可能。**

---

## PWA vs ネイティブ

### yumicuitの場合

| 機能 | PWA | ネイティブ |
|------|-----|-----------|
| オフライン動作 | ✓ | ✓ |
| ホーム画面アイコン | ✓ | ✓ |
| 通知 | △（制限あり） | ✓ |
| 触覚フィードバック | ✓（Vibration API） | ✓ |
| AdMob | ✗ | ✓ |
| Adsense | ✓ | ✗ |
| IndexedDB | ✓ | ✓ |
| WebGPU/WASM | ✓ | ✓（WebView経由） |

**結論**：
- 通知は使わない設計 → PWAで十分
- 広告は昼モードのみ → Adsenseで開始、後でAdMob検討

---

## プロジェクト構成

### SvelteKit + Capacitor

```
yumicuit/
├── src/                    # SvelteKitソース
├── static/                 # 静的ファイル
├── build/                  # ビルド出力
├── ios/                    # iOSプロジェクト（npx cap add ios）
├── android/                # Androidプロジェクト（npx cap add android）
├── capacitor.config.ts     # Capacitor設定
├── svelte.config.js
└── package.json
```

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.yumicuit',
  appName: 'yumicuit',
  webDir: 'build',           // SvelteKitのビルド出力
  server: {
    androidScheme: 'https'   // Android WebView設定
  }
};

export default config;
```

---

## まとめ

- **Capacitor**はWebアプリをネイティブ化するツール
- **Svelteだけでなく、React/Vue/Angularでも使える**
- **iOSビルドにはMacが必要**（Apple制限）
- **Androidビルドはどの環境でも可能**
- **yumicuitはPWAで開始、需要があればネイティブ化**

### 推奨戦略

1. まずPWAで公開（Macなし、審査なし）
2. ユーザーが増えたらAndroidネイティブ化（Macなしで可能）
3. さらに需要があればiOS対応（Mac購入 or クラウドビルド）
