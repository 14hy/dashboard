import '../elements/shuttle-manager.js';

class PageHome extends HTMLElement {
	constructor() {
		super();
    this.innerHTML = this.html;
  }
  
  connectedCallback() {
	}

  get html() {
    return `
    ${this.style}
    <div class="page page-home-wrap">
      <shuttle-manager></shuttle-manager>
    </div>
    `;
  }

  get style() {
    return `
    <style>
    
    </style>
    `;
  }
}

customElements.define(`page-home`, PageHome);