# BunVoyage: A Lightweight UI Framework for Bun

BunVoyage is a minimal, educational UI framework built from scratch to explore the fundamentals of modern frontend development using [Bun](https://bun.sh/) and TypeScript. It's designed to be simple, transparent, and a learning tool for understanding how core features like JSX, components, state management (hooks), and virtual DOM diffing can be implemented.

## ✨ Features

*   **JSX Support**: Write UI using familiar JSX syntax.
    *   Custom JSX runtime configured via `jsxImportSource`.
*   **Functional Components**: Build your UI with simple, reusable functions.
*   **`useState` Hook**: Basic state management for your components.
*   **Virtual DOM & Diffing**: Efficiently updates the DOM by comparing a virtual representation of the UI.
    *   Basic reconciliation for elements, text nodes, and components.
    *   Attribute/prop updates, additions, and removals.
    *   Simple children reconciliation (add, remove, update in place).
*   **TypeScript First**: Strongly typed for a better development experience.
*   **Lightweight & Educational**: Designed for learning and understanding core concepts, not for production scale (yet!).
*   **Bun Powered**: Leverages Bun for fast development, testing, and running.

## 🚀 Getting Started

This framework is designed to be used within a Bun environment.

### Prerequisites

*   [Bun](https://bun.sh/docs/installation) installed on your system.

### Installation / Setup

1.  **Clone the repository (or set up your project):**
    If you're working from this template or have the source code:
    ```bash
    # No explicit 'npm install' or 'bun install' needed for the framework itself
    # if you are using it directly from source within the same project.
    # Bun will transpile TypeScript and JSX on the fly.
    ```
    If this were published as a package, you'd install it via `bun add bunvoyage`.

2.  **Configure `tsconfig.json`:**
    Ensure your `tsconfig.json` is set up for custom JSX with `jsxImportSource`:
    ```json
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext", // Or "Preserve" if Bun handles JSX files directly
        "moduleResolution": "bundler", // Or "node"
        "jsx": "react-jsx",
        "jsxImportSource": "./src", // Points to where your framework's jsx-runtime is
        "lib": ["ESNext", "DOM"],
        "strict": true,
        "skipLibCheck": true,
        // ... other options
      },
      "include": ["src"] // Ensure your source files are included
    }
    ```
    (The `./src` for `jsxImportSource` assumes your framework's `jsx-runtime.ts` and `jsx.d.ts` are in the `src` directory relative to your project root).

## Core Concepts & API Usage

BunVoyage implements several core concepts found in popular UI libraries.

### JSX

You can use JSX to define your UI structures. Our custom JSX runtime (defined in `src/jsx-runtime.ts` and typed in `src/jsx.d.ts`) translates these JSX expressions into Virtual DOM nodes.

```tsx
// Example of JSX
const element = <div id="greeting">Hello, world!</div>;

const MyComponent = ({ name }) => <p>Hello, {name}</p>;
const componentElement = <MyComponent name="BunVoyage" />;
```

### Functional Components

Components are JavaScript functions that return renderable output (VNodes). They receive `props` as their first argument.

```tsx
import { h } from './src'; // Or your framework's main export

const WelcomeMessage = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

// Usage:
// <WelcomeMessage name="Developer" />
```

### State (`useState`)

Manage local state within your functional components using the `useState` hook. It returns an array with the current state value and a function to update it.

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

Props (properties) are passed to components to customize their behavior and output. For HTML elements, props correspond to HTML attributes (like `id`, `className`, `style`) and event handlers (`onClick`, etc.).

```tsx
const Button = (props) => {
  // props.onClick, props.children, etc.
  return <button style={props.style} onClick={props.onClick}>{props.children}</button>;
}

// Usage:
// <Button style={{ color: 'blue' }} onClick={() => alert('Clicked!')}>
//   Click Me
// </Button>
```
Children are passed via the `children` prop.

### Rendering (`render`)

The `render` function is the entry point to mount your application into the DOM.

```tsx
import { render, h } from './src';
import App from './App'; // Your root component

const rootElement = document.getElementById('root');
if (rootElement) {
  render(<App />, rootElement);
}
```

### Fragments (`Fragment`)

Use `Fragment` (or `<></>`) to return multiple children from a component without adding an extra node to the DOM.

```tsx
import { Fragment, h } from './src'; // Or import { Fragment } from './jsx-runtime'

const UserInfo = () => {
  return (
    <Fragment>
      <p>Name: User</p>
      <p>Age: 30</p>
    </Fragment>
    // Or:
    // <>
    //   <p>Name: User</p>
    //   <p>Age: 30</p>
    // </>
  );
};
```
*Note: True shorthand fragment `<></>` support depends on your build setup correctly aliasing it to `Fragment`. Explicitly importing and using `<Fragment>` is always safe.*

## 📝 Example Snippet

A simple counter application demonstrates the basic usage of components, state, and event handling.

```tsx
// src/example.tsx (Simplified)
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
For the full, runnable example, please see `src/example.tsx`.

## 🏃 How to Run the Example Application

1.  Ensure you have Bun installed.
2.  Navigate to the project directory.
3.  Use Bun's development server to serve the `public/index.html` file:
    ```bash
    bun public/index.html
    ```
    Or, for hot reloading:
    ```bash
    bun --hot public/index.html
    ```
4.  Open your browser and go to `http://localhost:3000` (or the port Bun indicates).

Bun will automatically transpile the `src/example.tsx` file and its dependencies.

## 📂 Project Structure Overview

The core framework code resides primarily in the `src` directory:
```
.
├── public/
│   └── index.html        # Main HTML file to host the app
├── src/
│   ├── vdom.ts           # Virtual DOM node definitions, patch function (diffing)
│   ├── jsx-runtime.ts    # Custom JSX transform functions (h, jsx, jsxs)
│   ├── jsx.d.ts          # Global JSX type definitions for TypeScript
│   ├── hooks.ts          # Hook implementations (e.g., useState)
│   ├── index.ts          # Main framework exports (render, h, useState, etc.)
│   ├── example.tsx       # Example application code
│   └── ...               # Other framework modules or components might be added
├── BUNVOYAGE_README.md   # This framework-specific README
├── tsconfig.json         # TypeScript configuration
└── README.md             # Main project README (if applicable)
```

## Contributing

This project is primarily for educational purposes. Contributions, suggestions, and feedback are welcome as we explore and learn together!

## License

MIT
```
