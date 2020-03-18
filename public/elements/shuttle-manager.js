import { loadXhr } from '../utils/action.js';

class ShuttleManager extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
    this.dataTable;
    this.bigPeriod;
    this.middlePeriod;
    this.smallPeriod;
  }   

  get html() {
    return `
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" rel="stylesheet">
    <link href="https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css" rel="stylesheet" type="text/css">
    ${this.style}
    <div class="wrap">
      <h1><i class="fa fa-bus-alt"></i> 셔틀버스 시간 관리</h1>
      <header>
        <div class="big-period">
          <input type="radio" name="big-checkbox" id="big-checkbox-1" value="학기중" checked><label for="big-checkbox-1">학기</label>
          <input type="radio" name="big-checkbox" id="big-checkbox-2" value="방학"><label for="big-checkbox-2">방학</label>
          <input type="radio" name="big-checkbox" id="big-checkbox-3" value="계절"><label for="big-checkbox-3">계절학기</label>
        </div>
        <div class="middle-period">
        <input type="radio" name="middle-checkbox" id="middle-checkbox-1" value="월금" checked><label for="middle-checkbox-1">평일</label>
        <input type="radio" name="middle-checkbox" id="middle-checkbox-2" value="휴일"><label for="middle-checkbox-2">주말</label>
        </div>
        <div class="small-period">
          <input type="radio" name="small-checkbox" id="small-checkbox-1" value="한대앞" checked><label for="small-checkbox-1">한대앞</label>
          <input type="radio" name="small-checkbox" id="small-checkbox-2" value="예술인"><label for="small-checkbox-2">예술인</label>
          <input type="radio" name="small-checkbox" id="small-checkbox-3" value="순환노선"><label for="small-checkbox-3">순환노선</label>
        </div>
      </header>
      <main>
        <table></table>
      </main>
    </div>
    `;
  }

  async connectedCallback() {
    await this.loadBusData();
    this.dataTable.on(`editable.save.cell`, () => {
      this.changeMain();
    });

    this.shadowRoot.querySelectorAll(`[type='radio']`).forEach(each => {
      each.addEventListener(`click`, this.clickRadio.bind(this));
    });
  }

  async changeMain() {
    let data = this.dataTable.activeRows.map(tr => {
      let array = [...tr.querySelectorAll(`td`)].map((td, i) => {
        if (i === 2) {
          return Number(td.textContent);
        }
        return td.textContent
      });
      return array;
    });

    let formData = new FormData();
    formData.append(`data`, JSON.stringify(data));
    formData.append(`season`, this.bigPeriod);
    formData.append(`bus`, this.smallPeriod);
    formData.append(`weekend`, this.middlePeriod);

    let postBusData = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/shuttle/edit`,
      method: `post`,
      body: formData,
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
    console.info(`send:`, JSON.stringify(data));
    console.info(`success: `, postBusData);
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
        this.bigPeriod = each.value;
      }
    });

    this.shadowRoot.querySelectorAll(`.middle-period [type='radio']`).forEach(each => {
      if (each.checked === true) {
        bus = each.value;
        this.middlePeriod = each.value;
      }
    });

    this.shadowRoot.querySelectorAll(`.small-period [type='radio']`).forEach(each => {
      if (each.checked === true) {
        weekend = each.value;
        this.smallPeriod = each.value;
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
        data: busData.data,
      },
      perPage: 5,   
      perPageSelect: [5, 10, 20, 50, 100],
      fixedHeight: false,
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
    h1 {
      padding-left: 2rem;
    }
    
    .wrap {
      display: grid;
      grid-template-rows: 10vh 15vh auto;
      height: 100%;
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
      display: grid;
      justify-content: space-evenly;
      border-radius: 10px;
      background-color: rgb(152, 147, 147);
      color: rgb(255, 255, 255);
      grid-template-columns: repeat(3, 1fr);
      text-align: center;
      transition: all 200ms ease;
    }

    .big-period input, .middle-period input, .small-period input {
      display: none;
    }

    .big-period label, .middle-period label, .small-period label {
      margin-right: 10px;
      border-radius: 10px;
      margin: 0;
    }

    .big-period label:hover, 
    .middle-period label:hover, 
    .small-period label:hover {
      background-color: #3d454f;
    }

    input:checked + label {
      background-color: #3d454f;
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
    
    .dataTable-input,
    .dataTable-selector {
      border-radius: 5px;
      border: none;
    }
    </style>
    `;
  }
}

customElements.define(`shuttle-manager`, ShuttleManager);