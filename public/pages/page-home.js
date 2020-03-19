import '../elements/shuttle-manager.js';
import '../elements/user-qa.js';
import '../elements/user-talk.js';

class PageHome extends HTMLElement {
	constructor() {
		super();
    this.innerHTML = this.html;
  }  

  get html() {
    return `
    ${this.style}
    <div class="page page-home-wrap">
      <button type="button" class="btn-logout">로그아웃</button>
      <button type="button" class="btn-aside"><i class="fas fa-bars"></i></button>
      <aside>
        <h2><i class="fa fa-cat"></i> 메뉴다냥~</h2>
        <ul class="side-menu">
          <li class="menu-shuttle"><i class="fa fa-bus-alt"></i>  셔틀버스 시간 관리</li>
          <li class="menu-qa"><i class="fa fa-question-circle"></i>  사용자 질문사전 관리</li>
          <li class="menu-talk"><i class="fa fa-comments"></i>  사용자 대화내용 확인</li>
        </ul>
      </aside>
      <main>
        <shuttle-manager class="show"></shuttle-manager>
        <user-qa></user-qa>
        <user-talk></user-talk>
      </main>
    </div>
    <video autoplay loop poster="wind.jpg">
      <source src="img/wind.webm" type="video/webm">
      <source src="img/wind.mp4" type="video/mp4">
    </video>    
    `;
  }

  connectedCallback() {
    this.querySelector(`.side-menu`).addEventListener(`click`, this.clickUl.bind(this));
    this.querySelector(`.btn-logout`).addEventListener(`click`, () => {
      localStorage.removeItem(`token`);
      location.reload();
    });
  }
  
  clickUl(event) {
    const { target } = event;
    if (target.localName === `li`) {
      if (target.classList.contains(`menu-shuttle`)) {        
        document.querySelector(`shuttle-manager`).classList.add(`show`);
        document.querySelector(`user-qa`).classList.remove(`show`);
        document.querySelector(`user-talk`).classList.remove(`show`);
      } else if (target.classList.contains(`menu-qa`)) {
        document.querySelector(`shuttle-manager`).classList.remove(`show`);
        document.querySelector(`user-qa`).classList.add(`show`);
        document.querySelector(`user-talk`).classList.remove(`show`);
      } else if (target.classList.contains(`menu-talk`)) {
        document.querySelector(`shuttle-manager`).classList.remove(`show`);
        document.querySelector(`user-qa`).classList.remove(`show`);
        document.querySelector(`user-talk`).classList.add(`show`);
      }
    }
  }

  get style() {
    return `
    <style>
    .btn-logout {
      display: block;
      position: fixed;
      top: 3vh;
      right: 12vw;
      border: none;
      background-color: transparent;
      color: rgb(255, 255, 255);
      font-size: 1rem;
      cursor: pointer;
      z-index: 10000;
    }

    .show {
      display: block;  
    }

    * {
      user-select: none;  
      font-family: 'Noto Sans KR', sans-serif;
    }

    *::-webkit-scrollbar {
      display: none;
    }

    main {
      display: grid;
      grid-template-columns: minmax(50vw, 800px);
      grid-template-rows: minmax(80vh, 600px);
      justify-content: center;
      align-self: center;
      overflow-y: scroll;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(128, 128, 128, 0.1) inset;
      border-color: #dedede;
      margin: 0 10vw;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 3px;
    }    

    .page-home-wrap {
      display: grid;
      grid-template-columns: 15rem auto;
    }
    
    .btn-aside {
      display: none;
    }

    aside {
      font-family: 'Noto Sans KR', sans-serif;
      display: flex;
      flex-direction: column;
      border-color: #dedede;

      background-color: #3d454f;
      border-radius: 2px;
      color: rgb(255, 255, 255);
      z-index: 1000;
    }

    aside h2 {
      padding-left: 2rem;
    }

    aside ul {
      line-height: 2rem;
      text-align: left;
      padding-left: 2rem;
    }

    aside ul li {
      list-style: none;
      color: rgb(255, 255, 255);
      animation: show 200ms ease;
    }

    aside ul li:hover {
      opacity: 0.7;
      cursor: pointer;
      transform: rotate(-5deg);
      transition: all 200ms ease;
    }

    aside li i {
      margin-right: 0.5rem;
    }

    shuttle-manager,
    user-qa,
    user-talk {
      display: none;
      animation: opac 200ms ease;
    }

    video {
      user-select: auto;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: -1000;
      filter: brightness(0.5);
    }

    @media (max-width: 900px) {
      .page {
        display: grid;
        grid-template-columns: 1fr;
      }

      .page aside {
        left: -15rem;
        position: fixed;
        height: 100vh;
        width: 15rem;
      }

      .btn-aside {
        display: block;
        position: fixed;
        top: 1vh;
        left: 3vw;
        border: none;
        background-color: transparent;
        color: rgb(255, 255, 255);
        font-size: 2rem;
        cursor: pointer;
      }

      .btn-aside:focus + aside {
        left: 0rem;
      }

      .page aside:hover {
        left: 0rem;
      }
    }

    @keyframes opac {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes show {
      0% {
        opacity: 0;
        transform: rotate(-5deg);
      }

      100% {
        opacity: 1;
        transform: rotate(0deg);
      }
    }
    </style>
    `;
  }
}

customElements.define(`page-home`, PageHome);