import { loadXhr } from '../utils/action.js';

class UserTalk extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
    this.data;
    this.parseData;
  }   

  get html() {
    return `
    <link href="https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css" rel="stylesheet" type="text/css">
    ${this.style}
    <div class="wrap">
      <h1>유저 대화내용</h1>
      <main>
        <table></table>
      </main>
    </div>
    `;
  }

  connectedCallback() {
    this.loadTalkData();
  }

  async loadTalkData() {
    const myTable = this.shadowRoot.querySelector("table");
    let options;

    this.data = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/userinput/?offset=0&limit=10000000`,
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
      console.error(`User-Talk 데이터 받아오기 실패`, err);
    });

    this.data = JSON.parse(this.data); 

    this.parseData = this.data.data.map(each => {
      let { userInput, answer, create_time } = each;
      return [userInput, answer, create_time];
    });

    options = {
      plugins: {
        editable: {
          enabled: false,
        }
      },
      data: {
        headings: [
          `질문`,
          `답변`,
          `시간`,
        ],
        data: this.parseData,
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
    .wrap {
      display: grid;
      grid-template-rows: 10vh auto;
      height: 100%;
    }

    main {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dataTable-wrapper {
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

customElements.define(`user-talk`, UserTalk);