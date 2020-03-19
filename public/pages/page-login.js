import '../elements/modal-message.js';
import { loadXhr } from '../utils/action.js';
import { connectRoute } from '../utils/router.js';

class PageLogin extends HTMLElement {
	constructor() {
		super();
    this.innerHTML = this.html;
  }

  get html() {
    return `
    ${this.style}
    <div class="page page-login-wrap">	
      <div class="sign-in-form">
        <h1 class="text-center">Login</h1>
        <label for="sign-in-form-username">관리자명</label>
        <input type="text" class="sign-in-form-username" id="sign-in-form-username">
        <label for="sign-in-form-password">비밀번호</label>
        <input type="password" class="sign-in-form-password" id="sign-in-form-password">
        <button class="sign-in-form-button">로그인</button>
      </div>
      <video autoplay loop poster="cat.jpg">
        <source src="img/cat.webm" type="video/webm">
        <source src="img/cat.mp4" type="video/mp4">
      </video>
    </div>
    `;
  }
  
  connectedCallback() {    
    const btn = this.querySelector(`.sign-in-form-button`);
    const pwd = this.querySelector(`#sign-in-form-password`);
    
    btn.addEventListener(`click`, this.eventClick.bind(this));
    pwd.addEventListener(`keydown`, this.eventKeydown.bind(this));
  }
  
  eventClick() {
    this.login();
  }

  eventKeydown(event) {
    if (event.key === `Enter`) {
      this.login();
    }
  }

  async login() {
    const id = this.querySelector(`#sign-in-form-username`).value;
    const pwd = this.querySelector(`#sign-in-form-password`).value;
    const modal = document.createElement(`modal-message`);

    let fetchIsLogin;
    let formData = new FormData();

    modal.text = `로그인 정보가 부정확합니다.`;

    formData.append(`username`, id);
    formData.append(`password`, pwd);
    
    fetchIsLogin = await loadXhr({
      url: `https://mhlee.engineer:5000/admin/login/`,
      method: `post`,
      body: formData,
      header: [],
      isBlob: false,
    }).catch(err => {
      document.body.appendChild(modal);
      throw new Error(err);
    });

    fetchIsLogin = JSON.parse(fetchIsLogin).jwt;

    localStorage.setItem(`token`, JSON.stringify(fetchIsLogin));
    connectRoute(`home`);
  }

  get style() {
    return `
    <style>
    .page-login-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sign-in-form {
      width: 200px;
      padding: 1rem 1.5em;
      border-radius: .5rem;
      background-color: #3d454f;
    }

    .sign-in-form h1 {
      color: white;
      margin-bottom: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 30px;
      font-size: 20px;
    }

    .sign-in-form label {
      text-transform: uppercase;
      color: #adadad;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 1rem;
      font-size: 16px;
    }

    .sign-in-form input {
      color: white;
    }

    .sign-in-form input:focus {
      opacity: .8;
    }

    .sign-in-form-username,
    .sign-in-form-password {
      border-radius: 30px;
      border: none;
      background-color: rgba(255, 255, 255, 0.3);
      transition: all ease .4s;
      margin-bottom: 10px;
      padding-left: 10px;
      font-size: 16px;
      max-width: 100%;
    }

    .sign-in-form-button {
      border-radius: 30px;
      border: 1px solid #fff;
      color: #fff;
      background-color: transparent;
      text-transform: uppercase;
      letter-spacing: 1px;
      width: 100%;
      padding: 1rem;
      transition: all ease .4s;
      margin-top: 10px;
      font-size: 16px;
      outline: none;
    }

    .sign-in-form-button:hover {
      background-color: #44c8ed;
      border-color: #44c8ed;
    }

    .page > video {
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
    </style>
    `;
  }
}

customElements.define(`page-login`, PageLogin);