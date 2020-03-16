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

  async connectedCallback() {
    this.loadBusData();
    // this.shadowRoot.querySelector(`main`).addEventListener(`click`, this.eventClickMain);
  }

  eventClickMain(event) {
    const target = event.target;
    
    if (target.localName === `td`) {
      console.log(target);
    }
  }

  async loadBusData() {
    const myTable = this.shadowRoot.querySelector("table");
    let busData = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/shuttle/edit?season=%ED%95%99%EA%B8%B0%EC%A4%91&bus=%ED%95%9C%EB%8C%80%EC%95%9E&weekend=%EC%9B%94%EA%B8%88`,
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
    }),

    this.dataTable = new DataTable(myTable, {
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
    });    
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

    main {
      overflow-y: scroll;
    }

    main table td input {
      width: 100%;
    }

    main::-webkit-scrollbar {
      display: none;
    }

    main > .dataTable-wrapper  {
      height: 100%;
    }
    </style>
    `;
  }
}

customElements.define(`shuttle-manager`, ShuttleManager);