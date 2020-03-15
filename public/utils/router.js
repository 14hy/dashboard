import { globalStore } from './store.js';
import { loadXhr } from './action.js';

export function renderHtml(html) {
  const app = document.querySelector(`#root`);
	app.innerHTML = html;
};

const _pathName = location.pathname.split(`/`)[1] || `home`;

// # Route 연결
export async function connectRoute(pathName = _pathName) {
  const BREAK = true;
  const _token = localStorage.getItem(`token`);

  let _isRoute = false;
  let _isRequireLogin = false;
  let _fetchLoginData;
  let _formData = new FormData();
  _formData.append(`username`, `hyhy`);
  _formData.append(`password`, `passw0rd`);
  
  // 라우터 체크
  Object.entries(globalStore.router).some(_router => {
    if (pathName === _router[0]) {
      _isRoute = true;
      _isRequireLogin = _router[1].requireLogin;
      return BREAK;
    }
  });
  
  // 라우터 없을시
  if (!_isRoute) {
    console.info(`No exist in router`);
    renderHtml(`<div class="page-not-found">Not Found 404!</div>`);
    return;
  }

  // Auth 필요없으면
  if (!_isRequireLogin) {
    history.pushState({}, pathName, `/${pathName}`);
    renderHtml(`<page-${pathName}></page-${pathName}>`);
    return;
  }
  
  // Auth 필요시
  // 세션쿠키 있는지 체크
  // 없으면, 로그인 페이지로 이동
  
  if (!_token) {
    history.pushState({}, `login`, `/login`);
    renderHtml(`<page-login></page-login>`);
    return;
  }
  console.log(_token);
  _fetchLoginData = await loadXhr({
    url: `https://hanyang-chatbot-dot-cool-benefit-185923.appspot.com/admin/login/`,
    method: `get`,
    header: [
      {
        key: `Authorization`,
        value: `Bearer ${JSON.parse(_token)}`,
      },
    ],
    body: null,
    isBlob: false,
  }).catch(err => {    
    history.pushState({}, `login`, `/login`);
    renderHtml(`<page-login></page-login>`);
    throw new Error(err);
  }); 

  history.pushState({}, pathName, `/${pathName}`);
  renderHtml(`<page-${pathName}></page-${pathName}>`);
}