class UserQA extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
	}

	connectedCallback() {  
    this.render();
	}

  render() {
    this.shadowRoot.innerHTML = this.html;    
  }

  get html() {
    return `
    ${this.css}

    <div class="wrap">
      <h1>QA 추가</h1>
      <div class="input-wrap">
        <input class="user-q" type="text" placeholder="사용자 질문 추가하기" value="" />
        <input class="user-a" type="text" placeholder="하냥이가 할 답변" value="" />
      </div>
      <div class="table-wrap">
      
      </div>
    </div>
    `;
  }
  
  get css() {
    return `
    <style>
     :host {
        
      }      

      .wrap {
        display: grid;
        grid-template-rows: 10vh 20vh 70vh;
      }
    </style>
    `;
  }
}

customElements.define(`user-qa`, UserQA);