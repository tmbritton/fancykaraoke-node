/**
 * @typedef {'button' | 'submit' | 'reset'} ButtonType
 */

/**
 * Get template to attach to shadow root.
 * @param {boolean} disabled
 * @param {ButtonType} type
 * @returns HTMLTemplateElement
 */
const getTemplate = (disabled, type) => {
  const tmpl = document.createElement('template');
  tmpl.innerHTML = `
    <button${disabled ? ' disabled' : ''} type="${type}">
      <slot></slot>
    </button>
  `;
  return tmpl
}

/**
 * Get css style element.
 * @returns HTMLStyleElement
 */
const getCss = () => {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = `
    button {
      font-family: var(--font-body);
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      border: 3px solid var(--primary);
      padding: .25rem;
      background: transparent;
      transition: color .1s ease-in-out, border-color .1s ease-in-out;
    }
    button:hover {
      cursor: pointer;
      color: var(--magenta02);
      border-color: var(--magenta02);
    }
    button:disabled {
      cursor: not-allowed;
      color: var(--grey03);
      border-color: var(--grey03);
      background-color: var(--grey01);
    }
  `
  return style;
}


let shadowRoot;

class FKButton extends HTMLElement {
  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();

    shadowRoot = this.attachShadow({mode: 'open'});
  }

  static get observedAttributes() {
    return ['disabled', 'type'];
  }

  /**
   * Get disabled status.
   * @returns boolean
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  /**
   * Get button type.
   * @returns {ButtonType}
   */
  get type() {
    const type = this.getAttribute('type');
    return ['button', 'submit', 'reset'].includes(type) ? type : 'button';
  }

  render() {
    const template = getTemplate(this.disabled, this.type);
    const style = getCss();

    // Clear the shadow root before appending new content
    this.shadowRoot.innerHTML = '';

    // Append the template content directly to the shadow root
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Append the style to the shadow root
    this.shadowRoot.appendChild(style);
  }

  attributeChangedCallback(_attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      console.log(`New Val: ${newVal}, Old Val: ${oldVal}`)
      this.render()
    }
  }

  connectedCallback() {
    this.render()
  }
}

export default () => customElements.define('fk-button', FKButton);
