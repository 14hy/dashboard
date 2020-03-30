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
      <h1><i class="fa fa-question-circle"></i> QA 추가</h1>
      <div class="input-wrap">
        <div class="form-icons">
          <form class="input-form">
            <div class="input-group input-q">
              <span class="input-group-label">
                <i class="fa fa-question-circle"></i>
              </span>
              <input class="input-group-field" type="text" placeholder="질문">
            </div>
        
            <div class="input-group input-a">
              <span class="input-group-label">
                <i class="fa fa-comment-dots"></i>
              </span>
              <input class="input-group-field" type="text" placeholder="답변">
            </div>        
            <button type="button" class="button expanded input-b">추가하기</button>
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
    await this.loadUserQA();
    
    this.shadowRoot.querySelector(`.input-b`).addEventListener(`click`, this.clickBtn.bind(this));
    this.shadowRoot.querySelector(`.input-a input`).addEventListener(`keydown`, this.eventKeydown.bind(this));
    this.shadowRoot.querySelector(`.table-wrap`).addEventListener(`click`, this.clickBtnTrash.bind(this));    
	}

  render() {
    this.shadowRoot.innerHTML = this.html;    
  }

  async clickBtnTrash(event) {
    let id;
    let deleteData;
    let formData = new FormData();
    let pageNum = this.dataTable.currentPage;
    const tr = event.target.closest(`tr`);
    if (!event.target.classList.contains(`btn-trash`)) {
      return;
    }

    id = tr.querySelector(`td`).textContent;
    formData.append(`doc_id`, id);
    
    deleteData = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/qa/`,
      method: `delete`,
      body: formData,
      isBlob: false,
      header: [
        {
          key: `Authorization`,
          value: `Bearer ${JSON.parse(localStorage.getItem(`token`))}`,
        },
      ],
    }).catch(err => {
      throw new Error(`질문 데이터 삭제 실패`, err);
    });

    await this.loadUserQA();
    this.dataTable.page(pageNum);

    console.info(`send:`, JSON.stringify(deleteData));
    console.info(`success: `, deleteData);
  }

  eventKeydown(event) {
    if (event.key === `Enter`) {
      this.clickBtn();
    }
  }

  async clickBtn() {
    const question = this.shadowRoot.querySelector(`.input-q input`);
    const answer = this.shadowRoot.querySelector(`.input-a input`);

    let formData = new FormData();
    formData.append(`question`, question.value);
    formData.append(`answer`, answer.value);

    let postQaData = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/qa/`,
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
      throw new Error(`질문 데이터 생성 실패`, err);
    });    

    question.value = ``;
    answer.value = ``;

    this.loadUserQA();

    console.info(`send:`, JSON.stringify(postQaData));
    console.info(`success: `, postQaData);
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
      let { id, question, answer } = each;
      return [id, question, answer];
    });

    options = {
      plugins: {
        editable: {
          enabled: false,          
        },
      },
      data: {
        headings: [
          `ID`,
          `질문`,
          `답변`,
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
      this.createBtn();
      this.dataTable.on('datatable.sort', () => {
        this.createTrashTd();
      });
      return;
    }

    this.dataTable = new DataTable(myTable, options);
    this.createBtn();
    this.dataTable.on('datatable.sort', () => {
      this.createTrashTd();
    });
  }

  createBtn() {
    this.dataTable.columns().add({
      heading: `삭제`,
      data: Array(this.dataTable.data.length),
      sortable: false,
    });    
    this.createTrashTd();
  }

  createTrashTd() {
    this.dataTable.activeRows.forEach(tr => {
      const td = document.createElement(`td`);
      td.innerHTML = `
      <button class="btn-trash" type="button"><i class="far fa-trash-alt"></i></button>
      `;
      tr.appendChild(td);
    })
  }
  
  get css() {
    return `
    <style>
      h1 {
        padding-left: 2rem;
        font-size: 1.5rem;
      }

      .btn-trash {
        display: block;
        margin: 0;
        vertical-align: middle;
        padding: 0.85em 1em;
        transition: background-color 0.25s ease-out, color 0.25s ease-out;
        font-size: 0.7rem;
        text-align: center;
        cursor: pointer;
        background-color: #3d454f;
        color: #fefefe;
        border-radius: 3px;
        border: none;
      }

      .btn-trash:hover {
        filter: brightness(0.9);
      }

      table tr td {
        text-align: center;
      }

      table tr > th:nth-child(1) {
        display: none;
      }

      table tr > td:nth-child(1) {
        display: none;
      }
    
      table tr > th:nth-child(4) {
        width: 50px;
      }

      .wrap {
        display: grid;
        grid-template-rows: 10vh 15vh auto;
        height: 100%;
      }
      
      .form-icons {
        text-align: center;
      }

      .input-form {
        display: grid;
        grid-template-areas: 
          'a b' 
          'c b';
        grid-template-columns: 10fr 2fr;        
      }

      .input-q {
        grid-area: a;
      }

      .input-a {
        grid-area: c;
      }

      .input-b {
        grid-area: b;
        margin-bottom: 0;
      }

      .form-icons .input-group-label {
        padding: 0 1rem;
        border: none;
        color: #0a0a0a;
        text-align: center;
        white-space: nowrap;
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        background-color: #3d454f;
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
        align-items: stretch;
        border-radius: 5px;
        overflow: hidden;
      }

      .form-icons .input-group-field {
        border: none;
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
        transition: background-color 0.25s ease-out, color 0.25s ease-out;
        font-size: 0.9rem;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        background-color: #3d454f;
        color: #fefefe;
        border-radius: 3px;
        border: none;
      }

      form button:hover {
        filter: brightness(0.9);
      }

      .table-wrap {
        display: flex;
        overflow-y: scroll;
      }

      .dataTable-wrapper {
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

customElements.define(`user-qa`, UserQA);