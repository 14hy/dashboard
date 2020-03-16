import '../elements/shuttle-manager.js';
import '../elements/user-qa.js';

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
      <user-qa></user-qa>
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