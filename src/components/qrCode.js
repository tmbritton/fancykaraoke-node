import qrCodeGen from 'qrcode-generator'

/**
 * Get svg for QR code.
 * @param {string} content 
 */
const getTemplate = (content) => {

}

/**
 * Get styles for QR code.
 */
const getCss = () => {

}

class QrCode extends HTMLElement {

  constructor() {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super();

    shadowRoot = this.attachShadow({mode: 'open'});
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
}

export default QrCode
