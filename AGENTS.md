# AGENTS.md

> **Note:** This file is the authoritative source for coding agent instructions.
> If in doubt, prefer AGENTS.md over README.md.

## 🚦 Quick Reference

- **Install dependencies:** `bun install`
- **Start dev server:** `bun run dev`
- **Build for production:** `bun run build`
- **Preview build:** `bun run preview`
- **Search code:** `rg "pattern"`
- **Add package:** `bun add <package-name>`

**Note**: Testing with Vitest can be added later.

---

This file provides comprehensive guidance for coding agents when working with
Lit web components and Tailwind CSS v4 in this starter template.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Choose straightforward solutions over
complex ones whenever possible. Simple solutions are easier to understand,
maintain, and debug.

### YAGNI (You Aren't Gonna Need It)

Avoid building functionality on speculation. Implement features only when they
are needed, not when you anticipate they might be useful in the future.

### HTML-first

Prioritize HTML structure and semantics in your components. Use native HTML
elements with proper ARIA attributes when needed. Shadow DOM provides
encapsulation, but your markup should still be semantic and accessible.

### Design Principles

- **Component Encapsulation**: Use Shadow DOM for style and DOM isolation
- **Reactive Properties**: Leverage Lit's reactive system for automatic updates
- **Type Safety**: Use TypeScript with decorators for compile-time correctness
- **Single Responsibility**: Each component should have one clear purpose
- **Composability**: Build complex UIs by composing simple, reusable components

## 🧱 Project Structure & Library Architecture

This is a **starter template** for building web component libraries with Lit and
Tailwind CSS v4.

### Directory Structure

```plaintext
.
├── lib/                         # Library source code
│   ├── assets/                  # Static assets (images, icons)
│   ├── components/              # Lit components (*.ts)
│   ├── shared/                  # Shared utilities and mixins
│   │   ├── tailwindMixin.ts     # TW mixin for Shadow DOM
│   │   ├── tailwindMixin.d.ts   # Type definitions
│   │   └── utils.ts             # Utility functions (cn, etc.)
│   ├── styles/                  # Global styles
│   │   └── tailwind.global.css  # Tailwind configuration
│   └── main.ts                  # Library entry point
├── src/                         # Development playground
│   ├── index.html               # Dev server entry
│   ├── index.css                # Dev styles
│   └── vite-env.d.ts            # Vite type definitions
├── public/                      # Public assets for dev server
├── dist/                        # Build output (gitignored)
├── vite.config.js               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

### Build Output

The build produces:

- `dist/my-element.js` - ES module
- `dist/my-element.umd.cjs` - UMD module
- `dist/my-element.d.ts` - TypeScript definitions

### Key Files

- **lib/main.ts**: Export all components here for library consumers
- **lib/shared/tailwindMixin.ts**: Mixin to apply Tailwind to Shadow DOM
- **lib/shared/utils.ts**: Helper functions like `cn()` for class merging
- **lib/styles/tailwind.global.css**: Tailwind v4 configuration with `@theme`

## Lit & Web Components

### Core Concepts

Lit is a lightweight library for building fast web components. It provides:

- **Reactive properties** that trigger re-renders
- **Efficient rendering** using lit-html templates
- **Shadow DOM** integration for encapsulation
- **Lifecycle hooks** for component behavior

### Component Structure

**TypeScript (Preferred):**

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TW } from "../shared/tailwindMixin";

const TwLitElement = TW(LitElement);

@customElement("my-component")
export class MyComponent extends TwLitElement {
  @property({ type: String }) name = "World";
  @property({ type: Number }) count = 0;

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div class="p-4">
        <h1>Hello, ${this.name}!</h1>
        <button
          @click=${this._increment}
          class="bg-blue-500 text-white px-4 py-2"
        >
          Count: ${this.count}
        </button>
      </div>
    `;
  }

  private _increment() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-component": MyComponent;
  }
}
```

### Reactive Properties

```typescript
@property({ type: String }) name = 'default';
@property({ type: Number }) count = 0;
@property({ type: Boolean, reflect: true }) active = false;
@property({ attribute: false }) data = {};  // No attribute binding
@state() private _internal = '';  // Internal state
```

**Key options**: `type`, `reflect`, `attribute`, `converter`. See
[Lit docs](https://lit.dev/docs/components/properties/) for details.

### Lifecycle & Querying

```typescript
// Lifecycle hooks (always call super first)
connectedCallback() { super.connectedCallback(); }
willUpdate(changedProperties) { }
updated(changedProperties) { }
firstUpdated() { }  // Use for initial DOM access

// Query decorators
@query('#myButton') private button!: HTMLButtonElement;
@queryAll('.item') private items!: NodeListOf<HTMLElement>;
```

### Events & Slots

```typescript
// Dispatch custom events with composed: true
private _handleClick() {
  this.dispatchEvent(new CustomEvent('my-event', {
    detail: { value: 'data' },
    bubbles: true,
    composed: true  // Cross shadow boundary
  }));
}

// Named slots
render() {
  return html`
    <slot name="header"></slot>
    <slot></slot>
  `;
}
```

## Tailwind CSS v4 Integration

### Shadow DOM Integration

**CRITICAL**: Tailwind v4 requires special setup for Shadow DOM. This project
uses a custom mixin approach.

**The TW Mixin (lib/shared/tailwindMixin.ts):**

```typescript
import { adoptStyles, type LitElement, unsafeCSS } from "lit";
import tailwindCss from "../styles/tailwind.global.css?inline";

export const TW = <T extends LitMixin>(superClass: T): T =>
  class extends superClass {
    connectedCallback() {
      super.connectedCallback();
      if (this.shadowRoot) adoptStyles(this.shadowRoot, [tailwind]);
    }
  };
```

**Usage in Components:**

```typescript
import { TW } from "../shared/tailwindMixin";

const TwLitElement = TW(LitElement);

@customElement("my-component")
export class MyComponent extends TwLitElement {}
```

### Tailwind v4 Configuration

**Global Styles (lib/styles/tailwind.global.css):**

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.55 0.22 264);
  --color-secondary: oklch(0.7 0.15 120);

  --radius-lg: 0.5rem;
  --radius-xl: 1rem;
}

@layer base {
  :root,
  :host {
  }
}
```

### Responsive Design

**Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl`
(1536px)

```css
/* Custom breakpoints */
@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;
}
```

```typescript
// Usage
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 md:p-6">
```

### Dark Mode

**Setup (lib/styles/tailwind.global.css):**

```css
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--_background);
  --color-foreground: var(--_foreground);
}

@layer base {
  :root,
  :host {
    --_background: var(--background, oklch(1 0 0));
    --_foreground: var(--foreground, oklch(0.147 0.004 49.25));
  }
  .dark,
  :host(.dark),
  :host-context(.dark) {
    --_background: var(--background, oklch(0.147 0.004 49.25));
    --_foreground: var(--foreground, oklch(0.985 0.001 106.423));
  }
}
```

**Usage:** Apply `dark:` prefix to utilities. Toggle:
`document.documentElement.classList.toggle('dark')`

### Utility Functions

**cn() - Merge Tailwind classes (lib/shared/utils.ts):**

```typescript
import { cn } from '../shared/utils';

render() {
  return html`
    <div class=${cn('base-class', this.active && 'active-class')}>
      Content
    </div>
  `;
}
```

**CVA - Component variants:**

```typescript
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-styles", {
  variants: {
    variant: { default: "bg-primary", destructive: "bg-destructive" },
    size: { sm: "h-9 px-3", lg: "h-11 px-8" }
  }
});

@property({ type: String }) variant: VariantProps<typeof buttonVariants>["variant"];

render() {
  return html`
    <button class=${cn(buttonVariants({ variant: this.variant }))}>
      <slot></slot>
    </button>
  `;
}
```

### Custom Utilities & Theming

**Custom utilities (tailwind.global.css):**

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

**Theming with pseudo-private properties:**

```css
@theme inline {
  --color-primary: var(--_primary);
}
@layer base {
  :root,
  :host {
    --_primary: var(--primary, oklch(0.55 0.22 264));
  }
}
```

Users override: `<style>:root { --primary: oklch(...); }</style>`

## Testing Strategy

Testing setup with Vitest can be added later. For now, test components manually
using the dev server (`bun run dev`).

## Development Environment

### Package Manager: Bun

```bash
bun install              # Install dependencies
bun add <package-name>   # Add package
bun add -D <pkg>         # Add dev dependency
```

### TypeScript Configuration

**CRITICAL settings in tsconfig.json:**

- `experimentalDecorators: true` - Required for Lit
- `useDefineForClassFields: false` - Required for Lit reactive properties

See `tsconfig.json` for full configuration.

### Vite Configuration

**Key plugins** (see `vite.config.js`):

- `vite-plugin-dts`: TypeScript definitions
- `vite-tsconfig-paths`: Path aliases
- `@tailwindcss/vite`: Tailwind v4

Commands: `bun run dev` | `bun run build` | `bun run preview`

## Style & Conventions

### File Naming

- **Components**: `kebab-case.ts` (e.g., `my-button.ts`)
- **Utilities**: `camelCase.ts` (e.g., `utils.ts`, `tailwindMixin.ts`)
- **Types**: `PascalCase.ts` or `camelCase.d.ts`

### Component Naming

**Custom element names:**

- Must contain a hyphen (-)
- Use lowercase
- Be descriptive

```typescript
@customElement('my-button')
@customElement('user-card')
@customElement('data-table')
```

**Class names:**

- Use PascalCase
- Match element name

```typescript
@customElement("my-button")
export class MyButton extends TwLitElement {}
```

### Property Conventions

**Public properties (reactive):**

```typescript
@property({ type: String })
variant = 'default';

@property({ type: Boolean })
disabled = false;
```

**Internal state:**

```typescript
@state()
private _isOpen = false;
```

**Private properties (non-reactive):**

```typescript
private _elementRef?: HTMLElement;
```

### Method Naming

**Public methods**: camelCase

```typescript
open() { }
close() { }
```

**Private methods**: \_camelCase (prefixed with underscore)

```typescript
private _handleClick() { }
private _updateState() { }
```

**Event handlers**: \_handleEventName

```typescript
private _handleClick(e: Event) { }
private _handleInput(e: InputEvent) { }
```

### Import Organization

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

import { TW } from "../shared/tailwindMixin";
import { cn } from "../shared/utils";
import { cva } from "class-variance-authority";

import type { VariantProps } from "class-variance-authority";
```

Order:

1. Lit core imports
2. Lit decorators
3. Local utilities
4. Third-party libraries
5. Type imports (last)

### Code Organization

```typescript
@customElement("my-component")
export class MyComponent extends TwLitElement {
  static styles = css`...`;

  @property() publicProp = "";

  @state() private _internalState = "";

  private _privateProperty = "";

  @query("#element") private _element!: HTMLElement;

  connectedCallback() {}

  render() {}

  private _handleEvent() {}

  private _helperMethod() {}
}

declare global {
  interface HTMLElementTagNameMap {
    "my-component": MyComponent;
  }
}
```

### Type Declarations

Always declare custom elements in `HTMLElementTagNameMap`:

```typescript
declare global {
  interface HTMLElementTagNameMap {
    "my-component": MyComponent;
  }
}
```

This enables:

- TypeScript autocomplete
- Type checking in JSX/TSX
- Better IDE support

## Common Pitfalls & Anti-patterns

### ❌ DON'T: Forget TW Mixin

```typescript
export class MyComponent extends LitElement {} // ❌ No Tailwind
const TwLitElement = TW(LitElement);
export class MyComponent extends TwLitElement {} // ✅
```

### ❌ DON'T: Forget `super.connectedCallback()`

```typescript
connectedCallback() { this.doSomething(); }  // ❌ Breaks Lit
connectedCallback() { super.connectedCallback(); this.doSomething(); }  // ✅
```

### ❌ DON'T: Mutate Properties in render()

```typescript
render() { this.count++; ... }  // ❌ Infinite loop
private _handleClick() { this.count++; }  // ✅
```

### ❌ DON'T: Use `static styles` with Tailwind

```typescript
static styles = css`.btn { @apply bg-blue-500; }`;  // ❌
render() { return html`<button class="bg-blue-500">`; }  // ✅
```

**Exception**: Use for `:host`, `::slotted()`, etc.

### ❌ DON'T: Concatenate Classes

```typescript
class=${'btn ' + (active ? 'active' : '')}  // ❌
class=${cn('btn', active && 'active')}  // ✅
```

### ❌ DON'T: Forget `composed: true` on Events

```typescript
new CustomEvent("evt", { detail }); // ❌ Won't cross shadow DOM
new CustomEvent("evt", { detail, bubbles: true, composed: true }); // ✅
```

## Documentation Standards

### Component Documentation

Use JSDoc for public APIs:

```typescript
/**
 * Button component with variant support.
 * @element my-button
 * @fires {CustomEvent} click
 * @slot - Button content
 */
@customElement("my-button")
export class MyButton extends TwLitElement {
  /** @type {'default' | 'primary'} */
  @property({ type: String }) variant = "default";
}
```

Update README.md when adding components.

## Where to Find More Information

### Official Documentation

- **Lit**: <https://lit.dev/docs/> - Comprehensive Lit documentation
- **Tailwind CSS v4**: <https://tailwindcss.com/docs> - Latest Tailwind docs
- **Web Components**:
  <https://developer.mozilla.org/en-US/docs/Web/API/Web_components>
- **TypeScript Decorators**:
  <https://www.typescriptlang.org/docs/handbook/decorators.html>

### Project Files

- **README.md**: Human-readable project overview and setup guide
- **AGENTS.md** (this file): Agent-specific build, test, and style instructions
- **package.json**: Dependencies and npm scripts
- **vite.config.js**: Build configuration
- **tsconfig.json**: TypeScript configuration

---

## 📝 How to Update AGENTS.md

**Keep this file current!** Update AGENTS.md whenever you add new scripts,
change test commands, or update code style rules. Treat it as living
documentation for all coding agents and future maintainers.

---

## ❓ FAQ for Coding Agents

**Q: What if instructions conflict with README.md?**  
A: AGENTS.md takes precedence for agent tasks.

**Q: Should I use JavaScript or TypeScript?**  
A: Always use TypeScript with decorators.

**Q: Reactive property not updating?**  
A: Check `@property()` decorator, `useDefineForClassFields: false`, and that
you're replacing (not mutating) objects/arrays.

**Q: Component not rendering?**  
A: Verify `@customElement()`, extends `TwLitElement`, tag has hyphen, returns
`html` from `render()`.

**Q: Tailwind classes not working?**  
A: Ensure component extends `TwLitElement`, classes in template (not
`static styles`).

**Q: Customize theme?**  
A: Edit `lib/styles/tailwind.global.css` with `@theme` directive.

**Q: Changes not showing?**  
A: Hard refresh (Cmd/Ctrl + Shift + R), restart dev server, check console.

---

## 📚 Useful Resources

### Essential Tools

**Core**: Lit (v3.3.1), Tailwind CSS (v4.1.14), Vite (v7.1.9), TypeScript
(v5.9.3)  
**Utilities**: class-variance-authority, clsx, tailwind-merge, tw-animate-css  
**VSCode Extensions**: Lit Plugin, Tailwind CSS IntelliSense

## ⚠️ Important Notes

- **NEVER ASSUME OR GUESS** - When in doubt, ask for clarification
- **Always extend TwLitElement** - Not plain LitElement (for Tailwind support)
- **Use TypeScript decorators** - `@customElement()`, `@property()`, etc.
- **Keep AGENTS.md updated** - Document new patterns or dependencies here
- **Test manually via dev server** - Run `bun run dev` to verify changes
- **Check TypeScript errors** - Run `bun run build` to catch type issues
- **Use `cn()` for dynamic classes** - Don't concatenate strings
- **Always call super** - In lifecycle methods (connectedCallback, etc.)
- **Set `composed: true`** - For custom events that need to bubble out
- **Declare custom elements** - In `HTMLElementTagNameMap` for TypeScript

## 🔍 Search Command Requirements

**CRITICAL**: Always use `rg` (ripgrep) for search operations:

```bash
# ✅ Use rg for pattern searches
rg "pattern"

# ✅ Use rg for file filtering
rg --files -g "*.ts"
rg --files -g "*.test.ts"
```

---

_This document is a living guide. Update it as the project evolves and new
patterns emerge._
