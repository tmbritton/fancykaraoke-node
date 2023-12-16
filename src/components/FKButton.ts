import { LitElement, html, css } from 'lit';
import {customElement, property} from 'lit/decorators.js';

type ButtonType = "button" | "submit" | "reset" | "menu";

@customElement('fk-button')
export default class FKButton extends LitElement {
  @property()
  type: ButtonType = 'button';

  static styles = css`
    :host {
      display: inline-block;
      border: 1px solid #ccc;
      padding: 16px;
    }

    button {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      color: var(--blue);
    }
  `;
  protected render() {
    return html`<button type="${this.type}"><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fk-button': FKButton;
  }
}
