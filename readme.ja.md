# BunVoyage: Bunのための軽量UIフレームワーク

BunVoyageは、[Bun](https://bun.sh/)とTypeScriptを使用した現代のフロントエンド開発の基礎を探求するためにゼロから構築された、最小限の教育用UIフレームワークです。JSX、コンポーネント、状態管理（フック）、仮想DOM差分といったコア機能がどのように実装されるかを理解するための、シンプルで透明性の高い学習ツールとして設計されています。

## ✨ 特徴

*   **JSXサポート**: 使い慣れたJSX構文でUIを記述します。
    *   `jsxImportSource`を介して設定されたカスタムJSXランタイム。
*   **関数コンポーネント**: シンプルで再利用可能な関数でUIを構築します。
*   **`useState`フック**: コンポーネントのための基本的な状態管理。
*   **仮想DOMと差分**: UIの仮想表現を比較することでDOMを効率的に更新します。
    *   要素、テキストノード、コンポーネントの基本的な調整。
    *   属性/プロパティの更新、追加、削除。
    *   シンプルな子の調整（追加、削除、インプレース更新）。
*   **TypeScriptファースト**: より良い開発体験のための強力な型付け。
*   **軽量＆教育用**: コアコンセプトの学習と理解のために設計されており、まだ本番規模向けではありません。
*   **Bunによる動力**: 高速な開発、テスト、実行のためにBunを活用します。

## 🚀はじめに

このフレームワークは、Bun環境内で使用するように設計されています。

### 前提条件

*   システムに[Bun](https://bun.sh/docs/installation)がインストールされていること。

### インストール / セットアップ

1.  **リポジトリをクローンする（またはプロジェクトをセットアップする）：**
    このテンプレートから作業しているか、ソースコードを持っている場合：
    ```bash
    # フレームワーク自体を同じプロジェクト内のソースから直接使用している場合、
    # 明示的な 'npm install' や 'bun install' は不要です。
    # BunはTypeScriptとJSXをオンザフライでトランスパイルします。
    ```
    これがパッケージとして公開されていた場合、`bun add bunvoyage`でインストールします。

2.  **`tsconfig.json`を設定する：**
    `tsconfig.json`が`jsxImportSource`でカスタムJSX用に設定されていることを確認してください：
    ```json
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext", // またはBunがJSXファイルを直接処理する場合は "Preserve"
        "moduleResolution": "bundler", // または "node"
        "jsx": "react-jsx",
        "jsxImportSource": "./src", // フレームワークのjsx-runtimeの場所を指します
        "lib": ["ESNext", "DOM"],
        "strict": true,
        "skipLibCheck": true,
        // ... その他のオプション
      },
      "include": ["src"] // ソースファイルが含まれていることを確認してください
    }
    ```
    （`jsxImportSource`の`./src`は、フレームワークの`jsx-runtime.ts`と`jsx.d.ts`がプロジェクトルートからの相対で`src`ディレクトリにあることを前提としています）。

## コアコンセプトとAPIの使用法

BunVoyageは、人気のあるUIライブラリに見られるいくつかのコアコンセプトを実装しています。

### JSX

JSXを使用してUI構造を定義できます。カスタムJSXランタイム（`src/jsx-runtime.ts`で定義され、`src/jsx.d.ts`で型付けされています）は、これらのJSX式を仮想DOMノードに変換します。

```tsx
// JSXの例
const element = <div id="greeting">Hello, world!</div>;

const MyComponent = ({ name }) => <p>Hello, {name}</p>;
const componentElement = <MyComponent name="BunVoyage" />;
```

### 関数コンポーネント

コンポーネントは、レンダリング可能な出力（VNode）を返すJavaScript関数です。最初の引数として`props`を受け取ります。

```tsx
import { h } from './src'; // またはフレームワークのメインエクスポート

const WelcomeMessage = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

// 使用法:
// <WelcomeMessage name="Developer" />
```

### 状態 (`useState`)

`useState`フックを使用して、関数コンポーネント内のローカル状態を管理します。現在の状態値とそれを更新する関数を含む配列を返します。

```tsx
import { useState, h } from './src';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### Props

Props（プロパティ）は、コンポーネントの動作と出力をカスタマイズするためにコンポーネントに渡されます。HTML要素の場合、propsはHTML属性（`id`、`className`、`style`など）とイベントハンドラ（`onClick`など）に対応します。

```tsx
const Button = (props) => {
  // props.onClick, props.children, など
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>;
}

// 使用法:
// <Button style={{ color: 'blue' }} onClick={() => alert('Clicked!')}>
//   Click Me
// </Button>
```
子は`children`プロパティを介して渡されます。

### レンダリング (`render`)

`render`関数は、アプリケーションをDOMにマウントするためのエントリポイントです。

```tsx
import { render, h } from './src';
import App from './App'; // ルートコンポーネント

const rootElement = document.getElementById('root');
if (rootElement) {
  render(<App />, rootElement);
}
```

### フラグメント (`Fragment`)

`Fragment`（または`<></>`）を使用して、DOMに追加のノードを追加せずにコンポーネントから複数の子を返します。

```tsx
import { Fragment, h } from './src'; // または './jsx-runtime' から Fragment をインポート

const UserInfo = () => {
  return (
    <Fragment>
      <p>Name: User</p>
      <p>Age: 30</p>
    </Fragment>
    // または:
    // <>
    //   <p>Name: User</p>
    //   <p>Age: 30</p>
    // </>
  );
};
```
*注意：真の短縮形フラグメント`<></>`のサポートは、ビルド設定が正しく`Fragment`にエイリアスしているかどうかに依存します。明示的に`<Fragment>`をインポートして使用するのが常に安全です。*

## 📝 コード例

シンプルなカウンターアプリケーションは、コンポーネント、状態、イベント処理の基本的な使用法を示しています。

```tsx
// src/example.tsx (簡略版)
import { render, useState, h, Fragment } from './index';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
};

const App = () => (
  <Fragment>
    <h1>Counter App</h1>
    <Counter />
  </Fragment>
);

const root = document.getElementById('root');
if (root) render(<App />, root);
```
完全な実行可能な例については、`src/example.tsx`を参照してください。

## 🏃 サンプルアプリケーションの実行方法

1.  Bunがインストールされていることを確認してください。
2.  プロジェクトディレクトリに移動します。
3.  Bunの開発サーバーを使用して`public/index.html`ファイルを提供します：
    ```bash
    bun public/index.html
    ```
    または、ホットリローディングの場合：
    ```bash
    bun --hot public/index.html
    ```
4.  ブラウザを開き、`http://localhost:3000`（またはBunが示すポート）にアクセスします。

Bunは`src/example.tsx`ファイルとその依存関係を自動的にトランスパイルします。

## 📂 プロジェクト構造の概要

コアフレームワークコードは主に`src`ディレクトリにあります：
```
.
├── public/
│   └── index.html        # アプリをホストするメインHTMLファイル
├── src/
│   ├── vdom.ts           # 仮想DOMノード定義、パッチ関数（差分）
│   ├── jsx-runtime.ts    # カスタムJSX変換関数（h, jsx, jsxs）
│   ├── jsx.d.ts          # TypeScript用のグローバルJSX型定義
│   ├── hooks.ts          # フック実装（例：useState）
│   ├── index.ts          # メインフレームワークエクスポート（render, h, useStateなど）
│   ├── example.tsx       # サンプルアプリケーションコード
│   └── ...               # 他のフレームワークモジュールやコンポーネントが追加される可能性あり
├── readme.en.md          # フレームワークの英語README
├── readme.ja.md          # このフレームワーク固有の日本語README
├── tsconfig.json         # TypeScript設定
└── README.md             # メインプロジェクトREADME（該当する場合）
```

## 貢献

このプロジェクトは主に教育目的です。私たちが共に探求し学ぶ中で、貢献、提案、フィードバックを歓迎します！

## ライセンス

MIT
```
