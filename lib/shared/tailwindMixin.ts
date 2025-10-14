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
      sheet.cssRules[0]?.cssText === tailwind.styleSheet?.cssRules[0].cssText,
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
