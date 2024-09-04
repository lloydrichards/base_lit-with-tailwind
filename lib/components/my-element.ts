import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import litLogo from "../assets/lit.svg";
import tailwindLogo from "../assets/tailwind.svg";
import viteLogo from "/vite.svg";

import { TW } from "../shared/tailwindMixin";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../shared/utils";

const TwLitElement = TW(LitElement);

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

@customElement("my-element")
export class MyElement extends TwLitElement {
  @property() docsHint = "Click on the Vite and Lit logos to learn more";
  @property({ type: Number }) count = 0;
  @property({ type: String }) variant: VariantProps<
    typeof buttonVariants
  >["variant"] = "default";
  @property({ type: String }) size: VariantProps<
    typeof buttonVariants
  >["size"] = "default";

  render() {
    return html`
      <div class="flex flex-col justify-center items-center gap-2 w-screen">
        <div class="flex gap-8">
          <a href="https://vitejs.dev" target="_blank">
            <img src=${viteLogo} class="size-14" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${litLogo} class="size-14" alt="Lit logo" />
          </a>
          <a href="https://tailwindcss.com/" target="_blank">
            <img src=${tailwindLogo} class="size-14" alt="Tailwind logo" />
          </a>
        </div>
        <slot></slot>
        <div class="px-8">
          <button
            class="${cn(
              buttonVariants({ variant: this.variant, size: this.size })
            )}"
            @click=${this._onClick}
            part="button"
          >
            count is ${this.count}
          </button>
        </div>
        <p class="text-gray-400">${this.docsHint}</p>
      </div>
    `;
  }

  private _onClick() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
