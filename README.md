# How to: Setup Lit with Tailwind v4

## 1. Create a vite project

To create a vite project, run the following command:

```bash
bun create vite@latest
```

Make sure to select the `lit` framework when prompted, and use TypeScript.

Once setup, navigate to the project directory and install the required
dependencies:

```bash
cd my-vite-project
bun install
```

## 2. Structure the project

currently, the project structure should have a `public` and `src` directory.
Vite provides you with and example my-element.ts file in the `src` directory and
an `index.html` file in the root directory.

First move the index.html file to the `src` directory.

```diff
 .
 ├── 📁 public
 ├── 📂 src
 │   ├── 📁 assets
 │   ├── index.css
+│   ├── index.html
 │   ├── my-element.ts
 │   └── vite-env.d.ts
 ├── .gitignore
-├── index.html
 ├── package.json
 └── tsconfig.json
```

Now create a `lib` directory and move the `assets`. Now create a components
folder inside lib and move the `my-element.ts` file to the `lib` directory.
Finally create a `main.ts` file in the `lib` directory and export the
`my-element.ts` file.

```diff
 .
+├── 📂 lib
+│   ├── 📁 assets
+│   ├── 📂 components
+│   │   └── my-element.ts
+│   └── main.ts
 ├── 📁 public
 ├── 📂 src
-│   ├── 📁 assets
 │   ├── index.css
 │   ├── index.html
-│   ├── my-element.ts
 │   └── vite-env.d.ts
 ├── .gitignore
 ├── package.json
 └── tsconfig.json
```

And modify the `index.html` file to point to the `lib/my-element.ts` file.

```diff
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Lit + TS</title>
     <link rel="stylesheet" href="/src/index.css" />
+    <script type="module" src="/lib/main.ts"></script>
  </head>
```

Finally, modify the `tsconfig.json` file to point to the `lib` directory.

```diff
 {
   "compilerOptions": {
     "target": "ES2020",
     "experimentalDecorators": true,
     "useDefineForClassFields": false,
     "module": "ESNext",
     "lib": ["ES2020", "DOM", "DOM.Iterable"],
     "skipLibCheck": true,

     /* Bundler mode */
     "moduleResolution": "bundler",
     "allowImportingTsExtensions": true,
     "isolatedModules": true,
     "moduleDetection": "force",
     "noEmit": true,

     /* Linting */
     "strict": true,
     "noUnusedLocals": true,
     "noUnusedParameters": true,
     "noFallthroughCasesInSwitch": true
   },
+  "include": ["src", "lib"]
 }
```

## 3. Create a vite.config.ts file

First lets install the required dependencies:

```bash
bun add -D vite-plugin-dts vite-tsconfig-paths
```

At the root of the project, create a `vite.config.ts` file and add the
following:

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "MyElement",
      fileName: "my-element",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
  server: {
    open: "/src/index.html",
  },
});
```

You can now test building the project by running the following command:

```bash
bun run build
```

And you should see the output in the `dist` directory. (make sure to add the
dist directory to the `.gitignore` file)

```diff
 .
+├── 📂 dist
+│   ├── my-element.d.ts
+│   ├── my-element.js
+│   └── my-element.umd.cjs
 ├── 📁 lib
 ├── 📁 public
 ├── 📁 src
 ├── .gitignore
 ├── package.json
 └── tsconfig.json
```

Finally, update the `package.json` file to point to the `dist/` files.

```diff
{
  "name": "my-lit-element",
- "private": true,
+ "version": "0.0.1",
  "type": "module",
+  "files": [
+   "dist"
+ ],
+ "main": "./dist/my-element.umd.cjs",
+ "module": "./dist/my-element.js",
+ "exports": {
+   ".": {
+     "import": "./dist/my-element.js",
+     "require": "./dist/my-element.umd.cjs"
+   }
+ },
  "scripts": {
    "dev": "vite ",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "vite-plugin-dts": "^4.1.0",
    "vite-tsconfig-paths": "^5.0.1"
  }
}
```

## 4. Add Tailwind CSS

First install the required dependencies:

```bash
bun add -D tailwindcss @tailwindcss/vite
```

Add the tailwind plugin to the `vite.config.ts` file:

```diff
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
+import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
+  plugins: [tsconfigPaths(), dts({ rollupTypes: true }), tailwindcss()],
  // ...rest of config
});
```

In the `lib` directory, create a `shared` folder and add two files:
`tailwindMixin.ts` and `tailwindMixin.d.ts`. and create a `styles` folder and
add a new file `tailwind.global.css`.

```diff
 .
 ├── 📂 lib
 │   ├── 📁 assets
 │   ├── 📂 components
 │   │   └── my-element.ts
+│   ├── 📂 shared
+│   │   ├── tailwindMixin.d.ts
+│   │   └── tailwindMixin.ts
+│   ├── 📂 styles
+│   │   └── tailwind.global.css
 │   └── main.ts
 ├── 📁 public
 ├── 📁 src
 ├── .gitignore
 ├── package.json
 └── tsconfig.json
```

### tailwindMixin.ts

```typescript
import { adoptStyles, type LitElement, unsafeCSS } from "lit";
import tailwindCss from "../styles/tailwind.global.css?inline";

declare global {
  // biome-ignore lint/suspicious/noExplicitAny: Required for mixin pattern compatibility
  export type LitMixin<T = unknown> = new (...args: any[]) => T & LitElement;
}

export const tailwind = unsafeCSS(tailwindCss);

// https://github.com/tailwindlabs/tailwindcss/issues/15005
// Set all @property values from tailwind on the document
// And only do this once (check if there is already a stylesheet with the same content)
if (
  tailwind.styleSheet &&
  document?.adoptedStyleSheets &&
  !document.adoptedStyleSheets.some(
    (sheet) =>
      sheet.cssRules[0]?.cssText === tailwind.styleSheet?.cssRules[0].cssText
  )
) {
  const propertiesSheet = new CSSStyleSheet();
  let code = tailwind.cssText;
  code = code
    .replaceAll("inherits: false", "inherits: true")
    .substring(code.indexOf("@property"));
  propertiesSheet.replaceSync(code);
  document.adoptedStyleSheets.push(propertiesSheet);
}

export const TW = <T extends LitMixin>(superClass: T): T =>
  class extends superClass {
    connectedCallback() {
      super.connectedCallback();
      if (this.shadowRoot) adoptStyles(this.shadowRoot, [tailwind]);
    }
  };
```

### tailwindMixin.d.ts

```typescript
import { type LitElement } from "lit";
declare global {
  export type LitMixin<T = unknown> = new (...args: any[]) => T & LitElement;
}
export declare const TW: <T extends LitMixin>(superClass: T) => T;
```

### tailwind.global.css

```css
@import "tailwindcss";
```

## 5. Using Tailwind CSS in your components

With the mixins in place, you can now import the `TW` mixin in the
`my-element.ts` file and use it in the class definition and replace the
`static styles` property with the tailwind classes.

```diff
 import { LitElement, css, html } from "lit";
 import { customElement, property } from "lit/decorators.js";

+import { TW } from "../shared/tailwindMixin";

+const TwLitElement = TW(LitElement);


 @customElement("my-element")
+export class MyElement extends TwLitElement {
  @property() docsHint = "Click on the Vite and Lit logos to learn more";
  @property({ type: Number }) count = 0;

  render() {
    return html`
+     <div class="flex flex-col justify-center items-center gap-2 w-screen">
+       <div class="flex gap-8">
          <a href="https://vitejs.dev" target="_blank">
+           <img src=${viteLogo} class="size-14" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
+           <img src=${litLogo} class="size-14" alt="Lit logo" />
          </a>
        </div>
        <slot></slot>
+        <div class="px-8">
          <button
+          class="rounded-lg w-full border border-purple-800 px-5 py-3 font-bold cursor-pointer"
            @click=${this._onClick}
            part="button"
          >
            count is ${this.count}
          </button>
        </div>
+       <p class="text-gray-400">${this.docsHint}</p>
+      </div>
    `;
  }

- static styles = css`

  private _onClick() {
    this.count++;
  }
 }
```

Now you can run the project and see the tailwind styles applied to the
component.

```bash
bun run dev
```

## BONUS: make tailwind more useful

Up to this point, you have successfully integrated Tailwind CSS with your Lit
and Vite project. However, you can make it more useful by adding some utilities
and extending the theme similar to how its done using shadcn/ui.

First, install the required dependencies:

```bash
bun add class-variance-authority tailwind-merge clsx tw-animate-css
```

Then lets create a `utils.ts` file in the `lib/shared` directory and add the
following:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Next we want to update out vscode settings to use Tailwind CSS IntelliSense and
add the classRegex to the settings.

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

Now we can update the `tailwind.global.css` file to use the
[pseudo-private properties](https://lea.verou.me/blog/2021/10/custom-properties-with-defaults/)
that can be overridden by user defined css variables:

```diff
@import "tailwindcss";
+@import "tw-animate-css";
+
+@custom-variant dark (&:is(.dark *));
+@theme inline {
+  --color-border: var(--_border);
+  --color-input: var(--_input);
+  --color-ring: var(--_ring);
+  --color-background: var(--_background);
+  --color-foreground: var(--_foreground);
+
+  --color-card: var(--_card);
+  --color-card-foreground: var(--_card-foreground);
+
+  --color-popover: var(--_popover);
+  --color-popover-foreground: var(--_popover-foreground);
+
+  --color-primary: var(--_primary);
+  --color-primary-foreground: var(--_primary-foreground);
+
+  --color-secondary: var(--_secondary);
+  --color-secondary-foreground: var(--_secondary-foreground);
+
+  --color-muted: var(--_muted);
+  --color-muted-foreground: var(--_muted-foreground);
+
+  --color-accent: var(--_accent);
+  --color-accent-foreground: var(--_accent-foreground);
+
+  --color-destructive: var(--_destructive);
+  --color-destructive-foreground: var(--_destructive-foreground);
+}
+@layer base {
+  :root,
+  :host {
+    --_background: var(--background, oklch(1 0 0));
+    --_foreground: var(--foreground, oklch(0.147 0.004 49.25));
+
+    --_card: var(--card, oklch(1 0 0));
+    --_card-foreground: var(--card-foreground, oklch(0.147 0.004 49.25));
+
+    --_popover: var(--popover, oklch(1 0 0));
+    --_popover-foreground: var(--popover-foreground, oklch(0.147 0.004 49.25));
+
+    --_primary: var(--primary, oklch(0.216 0.006 56.043));
+    --_primary-foreground: var(
+      --primary-foreground,
+      oklch(0.985 0.001 106.423)
+    );
+
+    --_secondary: var(--secondary, oklch(0.97 0.001 106.424));
+    --_secondary-foreground: var(
+      --secondary-foreground,
+      oklch(0.216 0.006 56.043)
+    );
+
+    --_muted: var(--muted, oklch(0.97 0.001 106.424));
+    --_muted-foreground: var(--muted-foreground, oklch(0.553 0.013 58.071));
+
+    --_accent: var(--accent, oklch(0.97 0.001 106.424));
+    --_accent-foreground: var(--accent-foreground, oklch(0.216 0.006 56.043));
+
+    --_destructive: var(--destructive, oklch(0.577 0.245 27.325));
+    --_destructive-foreground: var(
+      --destructive-foreground,
+      oklch(0.985 0.001 106.423)
+    );
+
+    --_border: var(--border, oklch(0.923 0.003 48.717));
+    --_input: var(--input, oklch(0.923 0.003 48.717));
+    --_ring: var(--ring, oklch(0.709 0.01 56.259));
+
+    --_radius: var(--radius, 0.5rem);
+  }
+
+  .dark,
+  :host(.dark),
+  :host-context(.dark) {
+    --_background: var(--background, oklch(0.147 0.004 49.25));
+    --_foreground: var(--foreground, oklch(0.985 0.001 106.423));
+
+    --_card: var(--card, oklch(0.216 0.006 56.043));
+    --_card-foreground: var(--card-foreground, oklch(0.985 0.001 106.423));
+
+    --_popover: var(--popover, oklch(0.216 0.006 56.043));
+    --_popover-foreground: var(
+      --popover-foreground,
+      oklch(0.985 0.001 106.423)
+    );
+
+    --_primary: var(--primary, oklch(0.923 0.003 48.717));
+    --_primary-foreground: var(--primary-foreground, oklch(0.216 0.006 56.043));
+
+    --_secondary: var(--secondary, oklch(0.268 0.007 34.298));
+    --_secondary-foreground: var(
+      --secondary-foreground,
+      oklch(0.985 0.001 106.423)
+    );
+
+    --_muted: var(--muted, oklch(0.268 0.007 34.298));
+    --_muted-foreground: var(--muted-foreground, oklch(0.709 0.01 56.259));
+
+    --_accent: var(--accent, oklch(0.268 0.007 34.298));
+    --_accent-foreground: var(--accent-foreground, oklch(0.985 0.001 106.423));
+
+    --_destructive: var(--destructive, oklch(0.704 0.191 22.216));
+    --_destructive-foreground: var(
+      --destructive-foreground,
+      oklch(0.985 0.001 106.423)
+    );
+
+    --_border: var(--border, oklch(1 0 0 / 10%));
+    --_input: var(--input, oklch(1 0 0 / 15%));
+    --_ring: var(--ring, oklch(0.553 0.013 58.071));
+  }
+}
```

This setup allows you to use the `cva` function to apply variants that combine
tailwind classes into more meaningful classes and then control the theme using
css variables.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/lib/main.ts"></script>
  </head>
  <body>
    <style>
      :root {
        --destructive: oklch(0.65 0.22 28);
        --destructive-foreground: oklch(0.985 0.001 106.423);
      }

      .dark {
        --destructive: oklch(0.72 0.19 28);
        --destructive-foreground: oklch(0.985 0.001 106.423);
      }
    </style>
    <my-element variant="destructive" size="lg">
      <h1>Vite + Lit</h1>
    </my-element>
  </body>
</html>
```
