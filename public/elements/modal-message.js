class ModalMessage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
    this.text = ``;
	}

	connectedCallback() {  
    this.render();
    this.show();
    setTimeout(() => this.hide(), 2000);
	}

  render() {
    this.shadowRoot.innerHTML = this.html;    
  }

  get html() {
    return `
    ${this.css}

    <span>${this.text}</span>
    `;
  }

  show() {
    this.style.display = `flex`;
  }

  hide() {
    this.remove();
  }
  
  get css() {
    return `
    <style>
     :host {
        display: none;
        background-color: rgba(0, 0, 0, 0.4);
        color: white;
        height: 50px;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 80vw;
        top: -10vh;
        left: 10vw;
        font-size: 1rem;
        animation: pop 2000ms ease-in-out;
      }      

      @keyframes pop {
        0% {
          top: -10vh;
        }

        10% {
          top: 5vh;
        }
      
        50% {
          top: 5vh;
        }

        90% {
          top: -10vh;
        }

        100% {
          top: -10vh;
        }
      }
    </style>
    `;
  }
}

customElements.define(`modal-message`, ModalMessage);