import { loadXhr } from '../utils/action.js';

class UserQA extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: `open` });
    this.shadowRoot.innerHTML = this.html;
    this.data;
    this.parseData;
	}

  get html() {
    return `
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" rel="stylesheet">
    <link href="https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css" rel="stylesheet" type="text/css">
    ${this.css}

    <div class="wrap">
      <h1>QA 추가</h1>
      <div class="input-wrap">
        <div class="form-icons">
          <form class="input-form">
            <div class="input-group">
              <span class="input-group-label">
                <i class="fa fa-question-circle"></i>
              </span>
              <input class="input-group-field" type="text" placeholder="질문">
            </div>
        
            <div class="input-group">
              <span class="input-group-label">
                <i class="fa fa-comment-dots"></i>
              </span>
              <input class="input-group-field" type="text" placeholder="답변">
            </div>        
            <button type="button" class="button expanded">추가하기</button>
          </div>                
        </form>
      </div>
      <div class="table-wrap">
        <table></table>
      </div>
    </div>
    `;
  }

  async connectedCallback() {  
    this.loadUserQA();
	}

  render() {
    this.shadowRoot.innerHTML = this.html;    
  }

  async loadUserQA() {
    const myTable = this.shadowRoot.querySelector("table");
    let options;    

    this.data = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/qa/`,
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
      console.error(`QA 데이터 받아오기 실패`, err);
    });

    this.data = JSON.parse(this.data); 

    this.parseData = this.data.data.map(each => {
      let { question, answer } = each;
      return [question, answer];
    });

    options = {
      data: {
        headings: [
          `질문`,
          `답변`,
        ],
        data: this.parseData,
      },
      perPage: 10,
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
  
  get css() {
    return `
    <style>
      .wrap {
        display: grid;
        grid-template-rows: 10vh 20vh 70vh;
      }
      
      .form-icons {
        text-align: center;
      }

      .form-icons .input-group-label {
        padding: 0 1rem;
        border: 1px solid #cacaca;
        background: #e6e6e6;
        color: #0a0a0a;
        text-align: center;
        white-space: nowrap;
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        background-color: #1779ba;
        border-color: #1779ba;
        height: 2rem;
      }

      .input-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .input-group {
        display: flex;
        width: 100%;
        margin-bottom: 1rem;
        align-items: stretch;
        border-radius: 5px;
        overflow: hidden;
      }

      .form-icons .input-group-field {
        border-color: #1779ba;
        width: 100%;
        padding-left: 1rem;
      }

      .form-icons .fa {
        color: white;
        width: 1rem;
      }

      form {
        margin: 0 2rem;
      }

      form button {
        display: block;
        width: 100%;
        margin-right: 0;
        margin-left: 0;
        vertical-align: middle;
        margin: 0 0 1rem 0;
        padding: 0.85em 1em;
        -webkit-appearance: none;
        border: 1px solid transparent;
        border-radius: 0;
        transition: background-color 0.25s ease-out, color 0.25s ease-out;
        font-size: 0.9rem;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        background-color: #1779ba;
        color: #fefefe;
        border-radius: 3px;
      }

      form button:hover {
        background-color: #14679e;
        color: #fefefe;
      }

      .table-wrap {
        display: flex;
        overflow-y: scroll;
      }

      .dataTable-wrapper {
        margin: 0 2rem;
        width: 100%;
      }
    </style>
    `;
  }
}

customElements.define(`user-qa`, UserQA);