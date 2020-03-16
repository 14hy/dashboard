import { loadXhr } from '../utils/action.js';

class ShuttleManager extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
    this.dataTable;
  }   

  get html() {
    return `
    <link href="https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css" rel="stylesheet" type="text/css">
    ${this.style}
    <div class="wrap">
      <h1>셔틀 관리</h1>
      <header>
        <div class="big-period">
          <label for="big-checkbox-1"><input type="radio" name="big-checkbox" id="big-checkbox-1" value="학기중" checked>  학기</label>
          <label for="big-checkbox-2"><input type="radio" name="big-checkbox" id="big-checkbox-2" value="방학"> 방학</label>
          <label for="big-checkbox-3"><input type="radio" name="big-checkbox" id="big-checkbox-3" value="계절"> 계절학기</label>
        </div>
        <div class="middle-period">
          <label for="middle-checkbox-1"><input type="radio" name="middle-checkbox" id="middle-checkbox-1" value="월금" checked> 평일</label>
          <label for="middle-checkbox-2"><input type="radio" name="middle-checkbox" id="middle-checkbox-2" value="휴일"> 주말</label>
        </div>
        <div class="small-period">
          <label for="small-checkbox-1"><input type="radio" name="small-checkbox" id="small-checkbox-1" value="한대앞" checked> 한대앞</label>
          <label for="small-checkbox-2"><input type="radio" name="small-checkbox" id="small-checkbox-2" value="예술인"> 예술인</label>
          <label for="small-checkbox-3"><input type="radio" name="small-checkbox" id="small-checkbox-3" value="순환노선"> 순환노선</label>
        </div>
      </header>
      <main>
        <table></table>
      </main>
    </div>
    `;
  }

  connectedCallback() {
    this.loadBusData();
    this.shadowRoot.querySelectorAll(`[type='radio']`).forEach(each => {
      each.addEventListener(`click`, this.clickRadio.bind(this));
    });
  }

  clickRadio() {
    this.loadBusData();
  }

  async loadBusData() {
    const myTable = this.shadowRoot.querySelector("table");
    let season, bus, weekend;
    let options;

    this.shadowRoot.querySelectorAll(`.big-period [type='radio']`).forEach(each => {
      if (each.checked === true) {
        season = each.value;
      }
    });

    this.shadowRoot.querySelectorAll(`.middle-period [type='radio']`).forEach(each => {
      if (each.checked === true) {
        bus = each.value;
      }
    });

    this.shadowRoot.querySelectorAll(`.small-period [type='radio']`).forEach(each => {
      if (each.checked === true) {
        weekend = each.value;
      }
    });

    let busData = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/shuttle/edit?season=${season}&bus=${bus}&weekend=${weekend}`,
      method: `get`,
      body: null,
      isBlob: false,
      header: [
        {
          key: `Authorization`,
          value: `Bearer ${JSON.parse(localStorage.getItem(`token`))}`,
        },
      ],
    }).catch(err => {
      console.error(`버스 데이터 받아오기 실패`, err);
    });

    busData = JSON.parse(busData);

    busData = busData.data.map(each => {
      let result;

      result = [
        `${each[0] < 10 ? `0${each[0]}` : each[0]}:${each[1] < 10 ? `0${each[1]}` : each[1]}`, 
        `${each[2] < 10 ? `0${each[2]}` : each[2]}:${each[3] < 10 ? `0${each[3]}` : each[3]}`, 
        each[4],
      ];

      return result;
    });

    options = {
      plugins: {
        editable: {
          enabled: true,
        }
      },
      data: {
        headings: [
          `출발 시간`,
          `도착 시간`,
          `간격`,
        ],
        data: busData,
      },
      perPage: 10,   
      perPageSelect: [5, 10, 20, 50, 100],
      fixedHeight: true,
    };

    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = new DataTable(myTable, options);    
      return;
    }

    this.dataTable = new DataTable(myTable, options);    
  }
  
  get style() {
    return `
    <style>
    .wrap {
      display: grid;
      grid-template-rows: 10vh 20vh 70vh;
      height: 100vh;
    }

    header {
      display: grid;
      justify-content: center;
      align-items: center;
      padding: 0 2rem;
      width: 100%;
      box-sizing: border-box;
      grid-template-columns: 1fr;
    }

    .big-period, .middle-period, .small-period {
      display: flex;
      align-items: center;
    }

    .big-period label, .middle-period label, .small-period label {
      margin-right: 10px;
    }

    main {
      display: flex;
      overflow-y: scroll;
    }

    main table td input {
      width: 100%;
    }

    main::-webkit-scrollbar {
      display: none;
    }

    main > .dataTable-wrapper  {
      margin: 0 2rem;
      width: 100%;
    }
    </style>
    `;
  }
}

customElements.define(`shuttle-manager`, ShuttleManager);