class ShuttleManager extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
  }
  
  connectedCallback() {
    const myTable = this.shadowRoot.querySelector("table");
    new DataTable(myTable);
	}

  get html() {
    return `
    <link href="https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css" rel="stylesheet" type="text/css">
    ${this.style}
    <div class="wrap">
      <h1>셔틀 관리</h1>
      <header>
        <div class="big-period">
          <label for="big-checkbox-1"><input type="radio" name="big-checkbox" id="big-checkbox-1" checked>  학기</label>
          <label for="big-checkbox-2"><input type="radio" name="big-checkbox" id="big-checkbox-2"> 방학</label>
          <label for="big-checkbox-3"><input type="radio" name="big-checkbox" id="big-checkbox-3"> 계절학기</label>
        </div>
        <div class="middle-period">
          <label for="middle-checkbox-1"><input type="radio" name="middle-checkbox" id="middle-checkbox-1" checked> 평일</label>
          <label for="middle-checkbox-2"><input type="radio" name="middle-checkbox" id="middle-checkbox-2"> 주말</label>
        </div>
        <div class="small-period">
          <label for="small-checkbox-1"><input type="radio" name="small-checkbox" id="small-checkbox-1" checked> 한대앞</label>
          <label for="small-checkbox-2"><input type="radio" name="small-checkbox" id="small-checkbox-2"> 예술인</label>
          <label for="small-checkbox-3"><input type="radio" name="small-checkbox" id="small-checkbox-3"> 순환버스</label>
        </div>
      </header>
      <main>
        <table></table>
      </main>
    </div>
    `;
  }

  fetchShuttleData() {
    fetch(``)
  }
  
  get style() {
    return `
    <style>
    .wrap {
      display: grid;
      grid-template-rows: 10vh 20vh 70vh;
      height: 100vh;
    }

    h1 {
      text-align: center;
    }

    header {
      display: grid;
      justify-content: center;
      align-items: center;
    }

    .big-period, .middle-period, .small-period {
      display: flex;
      align-items: center;
    }

    .big-period label, .middle-period label, .small-period label {
      margin-right: 10px;
    }

    main > .dataTable-wrapper  {
      height: 100%;
    }
    </style>
    `;
  }
}

customElements.define(`shuttle-manager`, ShuttleManager);