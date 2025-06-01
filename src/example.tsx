import { render, useState, h, Fragment } from './index'; // Adjusted path assuming example.tsx is in src
// Note: If using Bun's dev server from project root, and index.html is in public,
// this path to './index' (which resolves to './index.ts') is correct.

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={increment} class="increment">Increment</button>
      <button onClick={decrement} class="decrement">Decrement</button>
      {count > 5 && <p>Count is greater than 5!</p>}
      {count < 0 && (
        <Fragment>
          <p>Count is negative!</p>
          <p>Maybe reset?</p>
        </Fragment>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Fragment>
      <h2>Counter Example</h2>
      <Counter />
      <hr />
      <p><em>This is a simple counter app to demonstrate the framework.</em></p>
    </Fragment>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  render(<App />, rootElement);
} else {
  console.error("Root element not found. Make sure you have a div with id='root' in your HTML.");
}
