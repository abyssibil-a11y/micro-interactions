# Micro Interactions

A small, framework-agnostic library of UI micro-interactions built with
vanilla JavaScript, modern ES modules, and DOM APIs.

This project is both:
- a learning playground for building interactive UI components
- a growing library of reusable patterns (async state, loading, feedback)

This library is intentionally simple and unopinionated.
Accessibility, keyboard support, and framework bindings may be added later.

---

## ✨ Components

### Tabs
Basic tab navigation with animated indicator and active state handling.

### Switch
A toggle switch component with internal state and DOM-driven rendering.

### Async Switch
An extension of `Switch` that:
- performs async updates
- uses pessimistic UI updates
- handles loading and error states
- integrates with toast feedback

### Loading Button
A button component that:
- runs an async action on click
- disables itself while loading
- shows a spinner + loading text
- delegates success/error messaging to a toast

---

## 🧠 Design Principles

- **No frameworks** – built with plain JavaScript and the DOM
- **State first** – internal state drives rendering
- **Async-safe** – prevents double clicks and race conditions
- **Composable** – shared utilities via ES modules
- **Progressive complexity** – features added when needed

---

## 📁 Project Structure

components/ → reusable UI components
utils/ → shared helpers (toast, async helpers)
demos/ → standalone HTML demos for each component


Each component exposes a single public API via its own `index.js`.

---

## 🚀 Running the demos

This project uses native ES modules.  
You’ll need a local server to view the demos.

For example, using VS Code Live Server:
1. Open the repo in VS Code
2. Open any file in `demos/`
3. Click **“Open with Live Server”**

---

## 🧩 Example usage

```js
import { LoadingButton } from '../components/index.js';

LoadingButton('.loading-button', {
  action: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
  }
});

